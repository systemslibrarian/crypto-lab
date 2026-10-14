#!/usr/bin/env node
/*
 * teaching-reference.js — generate a commit-pinned teaching reference from the catalog and immutable lab blobs.
 *
 * Run: node tools/teaching-reference.js check --records-only
 * Prevents: extracted teaching wording drifting from its records, missing catalog members, and unchanged prose masking changed implementation inputs
 * Reads: index.html, catalog-reviewed.json, existing teaching sources and Counsel corpus review metadata, plus complete tracked Git trees of existing lab clones; no network, installs, scripts or Fleet writes
 *
 * write [--repositories DIR] [--ref origin/HEAD]: capture available source and
 * regenerate records, manifest and TEACHING-REFERENCE.md. Missing/unreadable
 * repositories stay in the reference and exit 2; static extraction gaps remain
 * explicit. The caller fetches first; an extraction is not a source review.
 * check --records-only: validate saved membership/hashes/anchors and rendering.
 * check --sources: also require current local tracking refs and input identities.
 * compare --against DIR [--out FILE]: compare with another saved record set.
 * export --out DIR [--lab SLUG] [--max-bytes N]: bounded lossless review packets.
 * --root DIR selects the hub; repeated --repositories selects existing clone
 * directories by their actual origin URL. No repository is cloned or modified.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const { cards } = require('./catalog-sync.js');
const { readCards, parseFrontMatterChecked } = require('./teach-build.js');
const { pinnedTree, pinnedBlobs } = require('./clone-source.js');
const { judgeAnchor, verifyTerms } = require('./catalog-evidence.js');

const VERSION = '1.0.0';
const SCHEMA = 1;
const SHA = /^[a-f0-9]{40}$/;
const HASH = /^[a-f0-9]{64}$/;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, ordered(value[k])]));
  return value;
}
const json = value => JSON.stringify(ordered(value), null, 2) + '\n';
const fingerprint = value => sha256(json(value));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const escapeMd = text => String(text).replace(/[\\`*_[\]<>]/g, '\\$&').replace(/\r?\n/g, ' ');
const sourceUrl = (repository, sha, file, line, end) => `${repository}/blob/${sha}/${file.split('/').map(encodeURIComponent).join('/')}${line ? '#L' + line + (end > line ? '-L' + end : '') : ''}`;
function fence(text) {
  const width = Math.max(3, ...[...String(text).matchAll(/`+/g)].map(m => m[0].length + 1));
  const edge = '`'.repeat(width);
  return edge + 'text\n' + text + (text.endsWith('\n') ? '' : '\n') + edge;
}

function sourceBlock(text) {
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) return 'Control-character presentation: the block uses JSON escapes and is **not** literal rendered learner wording. The machine record retains the exact source text, source hash and immutable file location.\n\n' + fence(JSON.stringify(text));
  return fence(text);
}

function repositoryName(remote) {
  const match = /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(remote);
  return match ? match[1].toLowerCase() + '/' + match[2].toLowerCase() : null;
}
function git(dir, args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).trim();
}
function discoverRepositories(roots) {
  const map = new Map(); const seen = new Set(); const diagnostics = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) { diagnostics.push({ kind: 'missing-repository-directory', path: root }); continue; }
    const candidates = [root, ...fs.readdirSync(root).sort().map(name => path.join(root, name))];
    for (const candidate of candidates) {
      try {
        if (!fs.statSync(candidate).isDirectory() || !fs.existsSync(path.join(candidate, '.git'))) continue;
        const real = fs.realpathSync(candidate); if (seen.has(real)) continue; seen.add(real);
        const remote = git(candidate, ['remote', 'get-url', 'origin']); const name = repositoryName(remote);
        if (!name) continue;
        const list = map.get(name) || []; list.push({ directory: candidate, remote }); map.set(name, list);
      } catch (error) { diagnostics.push({ kind: 'repository-discovery-unreadable', path: candidate, reason: String(error.message) }); }
    }
  }
  return { repositories: map, diagnostics };
}

function generatorHash() {
  const names = ['teaching-reference.js', 'teaching-reference-extract.js', 'teaching-reference-change.js', 'clone-source.js', 'catalog-sync.js', 'catalog-evidence.js', 'catalog-vocab.js', 'corpus-freshness.js', 'teach-build.js'];
  return fingerprint(names.map(name => ({ name, sha256: sha256(fs.readFileSync(path.join(__dirname, name))) })));
}
function catalog(root) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const list = cards(html); const teachingCards = readCards(html);
  if (!list.length || list.length !== teachingCards.size || new Set(list.map(c => c.slug)).size !== list.length) throw new Error('Catalog membership is empty, duplicated or disagrees with the teaching generator');
  for (const card of list) {
    if (!/^crypto-lab-[a-z0-9-]+$/.test(card.slug)) throw new Error('Unsupported catalog repository identity: ' + card.slug);
    if (teachingCards.get(card.slug)?.title !== card.title) throw new Error('Catalog title disagreement: ' + card.slug);
  }
  return list;
}

function hubCardSources(root, ref = 'origin/HEAD') {
  const found = new Map();
  try {
    if (repositoryName(git(root, ['remote', 'get-url', 'origin'])) !== 'systemslibrarian/crypto-lab') return found;
    const remoteRef = ref.startsWith('refs/remotes/origin/') ? ref : ref.startsWith('origin/') ? 'refs/remotes/' + ref : null;
    if (!remoteRef) return found;
    git(root, ['check-ref-format', remoteRef]);
    const resolved = git(root, ['rev-parse', '--symbolic-full-name', '--verify', remoteRef]);
    if (!resolved.startsWith('refs/remotes/origin/')) return found;
    const tree = pinnedTree(root, resolved), entry = tree.entries.find(file => file.path === 'index.html');
    if (!entry) return found;
    const bytes = pinnedBlobs(root, [entry]).get(entry.objectOid), committed = bytes.toString('utf8');
    const current = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const re = /<a class="(?:project|feature)-card[^"]*" data-category="[^"]*" href="https:\/\/systemslibrarian\.github\.io\/([^/"]+)\/"[\s\S]*?<\/a>/g;
    const localBlocks = new Map([...current.matchAll(re)].map(match => [match[1], match[0]]));
    for (const match of committed.matchAll(re)) {
      if (localBlocks.get(match[1]) !== match[0]) continue;
      const line = committed.slice(0, match.index).split('\n').length, endLine = line + match[0].split('\n').length - 1;
      found.set(match[1], { repository: 'https://github.com/systemslibrarian/crypto-lab', indexedSha: tree.sha, file: 'index.html', startLine: line, endLine, cardSha256: sha256(match[0]), fileSha256: sha256(bytes), url: sourceUrl('https://github.com/systemslibrarian/crypto-lab', tree.sha, 'index.html', line, endLine), scope: 'Existing hub card only; not a new review of the lab.' });
    }
  } catch { /* Missing/unreadable tracking refs and unpublished cards must not fall back to local HEAD. */ }
  return found;
}

function reviewInputs(root, siblingRoots, list) {
  const catalogReviews = readJson(path.join(root, 'tools', 'catalog-reviewed.json'));
  const modulesDirectory = path.join(root, 'teach', '_src', 'modules');
  const modules = fs.existsSync(modulesDirectory) ? fs.readdirSync(modulesDirectory).filter(f => f.endsWith('.json')).sort().map(f => ({ file: 'teach/_src/modules/' + f, value: readJson(path.join(modulesDirectory, f)) })) : [];
  const corpusFiles = siblingRoots.flatMap(dir => [path.join(dir, 'crypto-counsel', 'corpus.json'), path.join(dir, 'crypto-counsel-1', 'corpus.json')]);
  const corpusFile = process.env.CRYPTO_COUNSEL_CORPUS || corpusFiles.find(f => fs.existsSync(f));
  let corpus = [], corpusGap = null;
  if (corpusFile) {
    try { corpus = readJson(corpusFile); if (!Array.isArray(corpus)) throw new Error('Corpus is not an array'); }
    catch (error) { corpusGap = { kind: 'unreadable-existing-corpus-review', reason: error.message }; }
  } else corpusGap = { kind: 'missing-existing-corpus-review', reason: 'No existing Counsel corpus found; review metadata was not inferred.' };
  return new Map(list.map(card => {
    const id = 'demo_' + card.slug.replace(/-/g, '_');
    const entry = corpus.find(e => e.id === id);
    const worksheets = [];
    for (const module of modules) for (const exhibit of module.value.exhibits || []) {
      if ('crypto-lab-' + exhibit.name !== card.slug) continue;
      const file = `teach/_src/worksheets/${module.value.id}/${exhibit.worksheet}.md`;
      const absolute = path.join(root, file);
      const worksheet = { module: module.value.id, file, exhibit, moduleFile: module.file };
      if (fs.existsSync(absolute)) {
        const text = fs.readFileSync(absolute, 'utf8'); const front = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
        worksheet.fileSha256 = sha256(text);
        if (front) { const parsed = parseFrontMatterChecked(front[1], file); worksheet.metadata = parsed.metadata; worksheet.gaps = parsed.errors; }
        else worksheet.gaps = ['Worksheet front matter unreadable'];
      } else worksheet.gaps = ['Worksheet source missing'];
      worksheets.push(worksheet);
    }
    return [card.slug, { catalog: catalogReviews[card.slug] || null, counsel: entry?.reviewed || null, worksheets, corpusGap, scope: 'Imported catalog, corpus and worksheet reviews retain their original limited scopes; none establishes a complete teaching-reference review.' }];
  }));
}

function reviewedAnchorFiles(directory, tree, review) {
  const result = { files: [], gap: null };
  if (!review.catalog?.add?.length || !SHA.test(review.catalog.commit || '') || review.catalog.commit === tree.sha) return result;
  try {
    const previous = pinnedTree(directory, review.catalog.commit), indexed = new Map(tree.entries.map(file => [file.path, file])), reviewed = new Map(previous.entries.map(file => [file.path, file]));
    const paths = [...new Set(review.catalog.add.map(item => /@(.+):\d+$/.exec(item)?.[1]).filter(Boolean))].sort();
    for (const file of paths) {
      const before = reviewed.get(file), after = indexed.get(file);
      if (before?.type === 'blob' && after?.type === 'blob' && before.objectOid === after.objectOid && before.mode === after.mode) result.files.push({ file, reviewedSha: review.catalog.commit, indexedSha: tree.sha, objectOid: after.objectOid, sameFileBytes: true, scope: 'Only unchanged bytes of this previously reviewed file; changed callers, dependencies and learner wording are not newly reviewed.' });
    }
  } catch { result.gap = { kind: 'historical-reviewed-file-unreadable', reason: 'The imported catalog review commit cannot be inspected locally; no unchanged-file correspondence was inferred.' }; }
  return result;
}
function anchorReviewIdentity(anchor, source, files, review) {
  if (!(review.catalog?.add || []).includes(anchor.name + '@' + anchor.at)) return null;
  if (review.catalog.commit === source.indexedSha) return 'existing-reviewed-algorithm-anchor';
  const match = /^(.*):\d+$/.exec(anchor.at || ''), file = match?.[1];
  const current = files.find(entry => entry.path === file);
  const proof = review.unchangedReviewedAnchorFiles?.find(entry => entry.file === file && entry.sameFileBytes === true && entry.reviewedSha === review.catalog.commit && entry.indexedSha === source.indexedSha && entry.objectOid === current?.objectOid);
  return proof ? 'historical-reviewed-anchor-unchanged-file' : null;
}

function anchorEvidence(card, source, files, blobs, review) {
  const terms = verifyTerms(); const byPath = new Map(files.map(f => [f.path, f]));
  return [...card.implements.map(a => ({ ...a, kind: 'implements' })), ...card.attacks.map(a => ({ ...a, kind: 'attacks' }))].map(anchor => {
    const match = /^(.*):(\d+)$/.exec(anchor.at || '');
    const file = match?.[1], line = match ? Number(match[2]) : null;
    const entry = byPath.get(file); const bytes = entry ? blobs.get(entry.objectOid) : null;
    let state = 'unreadable', reason = 'Source anchor is missing or unreadable';
    if (bytes && line && entry.state === 'readable') {
      const lines = bytes.toString('utf8').split('\n');
      if (line > lines.length) { state = 'failed'; reason = 'Line is outside the captured file'; }
      else if (anchorReviewIdentity(anchor, source, files, review)) {
        state = lines[line - 1].trim() ? 'readable' : 'failed'; reason = state === 'readable' ? 'The exact nonblank operation anchor is retained from its scoped catalog review; unchanged file bytes are established separately when the review SHA is older. This is not a new current-application or wording review.' : 'Reviewed anchor line is blank';
      } else {
        const problem = judgeAnchor({ name: anchor.name, file, lineNo: line, line: lines[line - 1], wide: lines.slice(line - 1, line + 8).join('\n'), terms });
        state = problem ? 'failed' : 'readable'; reason = problem || 'Existing catalog anchor resolves in the exact immutable source; this is an anchor check, not proof of the claim.';
      }
    }
    const explicit = anchorReviewIdentity(anchor, source, files, review);
    return { ...anchor, file: file || null, line, sourceSha: source.indexedSha, url: file && source.indexedSha ? sourceUrl(source.repository, source.indexedSha, file, line) : null, state, reason, verification: explicit || 'catalog-derived-anchor', reviewScope: explicit ? 'Only this algorithm anchor from review ' + review.catalog.commit + '; unchanged-file correspondence is not a new dependency, caller or learner-wording review.' : null };
  });
}

function capture(card, candidates, review, previous, context) {
  const extract = require('./teaching-reference-extract.js');
  const { compareRecords } = require('./teaching-reference-change.js');
  const repository = 'https://github.com/systemslibrarian/' + card.slug;
  const summarySource = context.hubCards?.get(card.slug) || null;
  const inputHash = fingerprint({ card, review, summarySource });
  const base = { schemaVersion: SCHEMA, generatorVersion: VERSION, generatorHash: context.generatorHash, id: card.slug, name: card.title, repository, demoUrl: 'https://systemslibrarian.github.io/' + card.slug + '/', inputHash, catalog: card, review: { ...review, lastReviewedSha: previous ? previous.review.lastReviewedSha : (review.catalog?.commit || review.counsel?.lab_commit || null), teachingReferenceReviewedSha: previous?.review?.teachingReferenceReviewedSha || null }, files: [], sections: [], symbols: [], citations: [], claimCodeLinks: [], gaps: [] };
  if (review.corpusGap) base.gaps.push(review.corpusGap);
  base.source = { state: 'missing', repository, indexedSha: null, treeOid: null, ref: context.ref, freshness: 'Local tracking ref only; fetch is a separate caller operation.' };
  let directory, tree, blobs;
  try {
    if (!candidates?.length) { base.gaps.push({ kind: 'source-missing', reason: 'No existing checkout with the intended repository origin was found.' }); return finish(base, previous, null, null); }
    const captures = candidates.map(c => ({ ...c, tree: pinnedTree(c.directory, context.ref) }));
    if (new Set(captures.map(c => c.tree.sha)).size > 1) throw new Error('Existing checkouts disagree on the selected remote ref; select an unambiguous --repositories directory after fetching.');
    ({ directory, tree } = captures[0]);
    base.source = { ...base.source, state: 'readable', indexedSha: tree.sha, treeOid: tree.treeOid };
    const importedAnchorFiles = reviewedAnchorFiles(directory, tree, review);
    base.review.unchangedReviewedAnchorFiles = importedAnchorFiles.files;
    if (importedAnchorFiles.gap) base.gaps.push(importedAnchorFiles.gap);
    blobs = pinnedBlobs(directory, tree.entries);
    const summaryMatches = previous?.summary?.text === card.copy && json(previous.summary.source) === json(summarySource);
    if (context.reuse !== false && previous && summaryMatches && previous.generatorHash === context.generatorHash && previous.inputHash === inputHash && previous.source?.state === 'readable' && previous.source.indexedSha === tree.sha) {
      verifyCapturedRecord(previous, tree, blobs, directory);
      const currentRef = pinnedTree(directory, context.ref).sha;
      if (currentRef !== tree.sha) {
        const stale = JSON.parse(json(previous)); stale.source.state = 'stale';
        stale.gaps.push({ kind: 'ref-changed-during-reuse', reason: `Captured ${tree.sha}; local tracking ref is now ${currentRef}. Cached bytes remain historical, not current.` });
        return finish(stale, previous, null, null);
      }
      context.reused++; return previous;
    }
    for (const entry of tree.entries) {
      const bytes = blobs.get(entry.objectOid);
      if (entry.type !== 'blob' || entry.mode === '120000') {
        const kind = entry.type === 'commit' ? 'submodule-source-not-captured' : 'symlink-not-followed';
        base.files.push({ ...entry, sha256: bytes ? sha256(bytes) : null, state: 'opaque', role: 'opaque', language: null, sectionIds: [], lineCount: null });
        base.gaps.push({ kind, file: entry.path, reason: 'Tracked identity retained; external source or symlink target was not read.' }); continue;
      }
      if (!bytes || bytes.length !== entry.bytes) throw new Error('Incomplete immutable blob capture: ' + entry.path);
      let result;
      try {
        result = extract.extractFile({ path: entry.path, bytes, sourceSha: tree.sha, repository });
        if (!result || !Array.isArray(result.sections) || !Array.isArray(result.symbols) || !Array.isArray(result.citations) || !Array.isArray(result.gaps)) throw new Error('Incomplete extraction response');
        for (const section of result.sections) {
          const lines = bytes.toString('utf8').split('\n');
          if (section.file !== entry.path || !Number.isSafeInteger(section.startLine) || !Number.isSafeInteger(section.endLine) || section.startLine < 1 || section.endLine < section.startLine || section.endLine > lines.length || !lines.slice(section.startLine - 1, section.endLine).join('\n').includes(section.sourceText) || sha256(section.sourceText) !== section.sha256) throw new Error('Extracted wording is not an exact hashed source slice');
        }
      } catch (error) {
        result = { state: 'unreadable', language: null, role: 'unknown', sections: [], symbols: [], citations: [], gaps: [{ kind: 'file-extraction-unreadable', file: entry.path, reason: String(error.message) }] };
        base.source.state = 'incomplete';
      }
      const file = { ...entry, sha256: sha256(bytes), state: result.state, language: result.language, role: result.role, sectionIds: result.sections.map(s => s.id), lineCount: result.state === 'readable' ? bytes.toString('utf8').split('\n').length : null };
      base.files.push(file); base.sections.push(...result.sections); base.gaps.push(...result.gaps);
      base.symbols.push(...result.symbols.map(s => ({ ...s, file: entry.path })));
      base.citations.push(...result.citations.map(c => ({ ...c, classification: 'source-cited; primary-source status not independently verified' })));
    }
    base.claimCodeLinks = anchorEvidence(card, base.source, base.files, blobs, base.review);
    for (const link of base.claimCodeLinks) if (link.state !== 'readable') base.gaps.push({ kind: 'catalog-anchor-' + link.state, file: link.file, reason: link.name + ': ' + link.reason });
    base.suggestedWordingLinks = base.sections.map(section => {
      const symbols = base.symbols.filter(symbol => symbol.file === section.file && symbol.line <= section.startLine).sort((a, b) => b.line - a.line).slice(0, 1);
      return { sectionId: section.id, verification: 'suggested-only', basis: 'Source-file proximity; call paths and claim meaning have not been independently verified.', symbols };
    }).filter(link => link.symbols.length);
    base.teachingModes = base.sections.flatMap(section => [
      ['simplified-model', /\btoy\b|simplif(?:ied|ication)|small numbers/i],
      ['simulated-attack', /simulat(?:ed|ion)|modeled attack|modelled attack/i],
      ['comparison', /\bcompar(?:e|ison|ing)\b/i],
      ['reference-only', /reference only|does not implement|not implemented/i],
    ].filter(([, re]) => re.test(section.sourceText)).map(([kind]) => ({ kind, sectionId: section.id, verification: 'suggested-from-source-wording; review-required' })));
    const now = pinnedTree(directory, context.ref).sha;
    if (now !== tree.sha) { base.source.state = 'stale'; base.gaps.push({ kind: 'ref-changed-during-capture', reason: `Captured ${tree.sha}; local tracking ref is now ${now}. Captured blobs remain historical, not current.` }); }
    let changes = null, ancestor = null;
    if (previous?.source?.indexedSha && SHA.test(previous.source.indexedSha)) {
      const diff = spawnSync('git', ['--no-replace-objects', '-C', directory, 'diff', '--name-status', '-z', '--no-renames', previous.source.indexedSha, tree.sha], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      if (diff.status === 0 && !diff.error) {
        const rows = diff.stdout.split('\0').filter(Boolean); changes = [];
        for (let i = 0; i < rows.length; i += 2) {
          if (!rows[i + 1]) throw new Error('Incomplete changed-path response'); changes.push({ status: rows[i], path: rows[i + 1] });
        }
      }
      const ancestry = spawnSync('git', ['--no-replace-objects', '-C', directory, 'merge-base', '--is-ancestor', previous.source.indexedSha, tree.sha], { stdio: 'ignore' });
      ancestor = ancestry.status === 0 ? true : ancestry.status === 1 ? false : null;
    }
    return finish(base, previous, changes, ancestor);
  } catch (error) {
    base.source.state = 'unreadable'; base.gaps.push({ kind: 'source-unreadable', reason: String(error.message) });
    for (const entry of tree?.entries || []) if (!base.files.some(file => file.path === entry.path)) base.files.push({ ...entry, sha256: blobs?.get(entry.objectOid) ? sha256(blobs.get(entry.objectOid)) : null, state: 'unreadable', role: 'unknown', language: null, sectionIds: [], lineCount: null });
    return finish(base, previous, null, null);
  }
  function finish(record, old, changedPaths, isAncestor) {
    if (!record.claimCodeLinks.length) record.claimCodeLinks = anchorEvidence(card, record.source, record.files, blobs || new Map(), record.review);
    record.changeReport = compareRecords(old || null, record, { changedPaths, isAncestor });
    record.summary = { source: context.hubCards?.get(card.slug) || null, text: card.copy, basis: 'Existing hub card prose, retained without rewriting the lab. See exact source wording below and the imported limited review scopes.', verification: 'catalog-summary; not a new independent claim review' };
    if (!record.summary.source) record.gaps.push({ kind: 'hub-summary-source-unpinned', reason: 'The current card has no exact match in the selected origin tracking ref, or that remote source is missing/unreadable. Local HEAD is not a publication pin; no summary source URL was invented.' });
    validateRecord(record); context.extracted++; return record;
  }
}

function validateRecord(record) {
  if (!record || record.schemaVersion !== SCHEMA || typeof record.id !== 'string' || !/^crypto-lab-[a-z0-9-]+$/.test(record.id)) throw new Error('Invalid lab record identity');
  if (record.generatorVersion !== VERSION || !HASH.test(record.generatorHash || '') || !HASH.test(record.inputHash || '')) throw new Error('Invalid generator or input identity');
  if (record.repository !== 'https://github.com/systemslibrarian/' + record.id || record.source?.repository !== record.repository || record.demoUrl !== 'https://systemslibrarian.github.io/' + record.id + '/') throw new Error('Inconsistent repository identity');
  if (record.source.indexedSha !== null && !SHA.test(record.source.indexedSha)) throw new Error('Invalid indexed source SHA');
  if (record.source.treeOid !== null && !SHA.test(record.source.treeOid)) throw new Error('Invalid source tree identity');
  if (!['readable', 'missing', 'unreadable', 'incomplete', 'stale', 'N/A'].includes(record.source.state)) throw new Error('Invalid source evidence state');
  if (record.source.state === 'readable' && (!SHA.test(record.source.indexedSha || '') || !SHA.test(record.source.treeOid || ''))) throw new Error('Readable source without immutable commit and tree');
  for (const field of ['lastReviewedSha', 'teachingReferenceReviewedSha']) if (record.review?.[field] !== null && !SHA.test(record.review?.[field] || '')) throw new Error('Invalid imported full reviewed SHA');
  for (const field of ['files', 'sections', 'symbols', 'citations', 'claimCodeLinks', 'gaps']) if (!Array.isArray(record[field])) throw new Error('Incomplete record: ' + field);
  const files = new Map(record.files.map(f => [f.path, f]));
  if (files.size !== record.files.length) throw new Error('Duplicate tracked files');
  for (const file of record.files) {
    if (typeof file.path !== 'string' || !file.path || file.path.startsWith('/') || file.path.split('/').some(p => p === '..' || p === '.' || !p) || file.path.includes('\0')) throw new Error('Invalid tracked file path');
    if (!['readable', 'unreadable', 'opaque', 'unsupported'].includes(file.state) || !Array.isArray(file.sectionIds) || new Set(file.sectionIds).size !== file.sectionIds.length) throw new Error('Invalid file coverage state or section inventory');
    if (!SHA.test(file.objectOid || '') || !['blob', 'commit'].includes(file.type) || !['100644', '100755', '120000', '160000'].includes(file.mode)) throw new Error('Invalid tracked object identity');
    if (file.bytes !== null && (!Number.isSafeInteger(file.bytes) || file.bytes < 0)) throw new Error('Invalid tracked byte count');
    if (file.sha256 !== null && !HASH.test(file.sha256)) throw new Error('Invalid captured file hash');
    if (file.state !== 'unreadable' && file.type === 'blob' && !HASH.test(file.sha256 || '')) throw new Error('Captured file without exact identity');
    if (file.state === 'readable' && (!Number.isSafeInteger(file.lineCount) || file.lineCount < 1)) throw new Error('Readable file without valid line inventory');
  }
  const ids = new Set();
  for (const section of record.sections) {
    const file = files.get(section.file);
    if (!file || file.state !== 'readable' || !/^[A-Za-z0-9._:-]+$/.test(section.id) || ids.has(section.id) || !Number.isSafeInteger(section.startLine) || !Number.isSafeInteger(section.endLine) || section.startLine < 1 || section.endLine < section.startLine || section.endLine > file.lineCount) throw new Error('Invalid or duplicate section source anchor');
    if (typeof section.sourceText !== 'string' || !HASH.test(section.sha256) || sha256(section.sourceText) !== section.sha256) throw new Error('Section wording hash mismatch');
    if (!file.sectionIds.includes(section.id)) throw new Error('Section missing from file inventory'); ids.add(section.id);
  }
  const sectionsById = new Map(record.sections.map(section => [section.id, section]));
  for (const file of record.files) if (file.sectionIds.some(id => sectionsById.get(id)?.file !== file.path)) throw new Error('File inventory has an omitted or misplaced section');
  function readableAnchor(anchor) {
    const file = files.get(anchor.file);
    if (!file || file.state !== 'readable' || !Number.isSafeInteger(anchor.line) || anchor.line < 1 || anchor.line > file.lineCount) throw new Error('Invalid symbol or citation source anchor');
  }
  for (const symbol of record.symbols) { readableAnchor(symbol); if (typeof symbol.name !== 'string' || !symbol.name || symbol.verification !== 'not-executed-or-reviewed') throw new Error('Invalid symbol candidate'); }
  for (const citation of record.citations) { readableAnchor(citation); if (typeof citation.url !== 'string' || !/^https?:\/\/[^\s]+$/.test(citation.url)) throw new Error('Invalid source citation URL'); }
  const anchors = [...record.catalog.implements.map(a => ({ ...a, kind: 'implements' })), ...record.catalog.attacks.map(a => ({ ...a, kind: 'attacks' }))];
  if (anchors.length !== record.claimCodeLinks.length) throw new Error('Catalog anchor inventory differs from claim links');
  for (let i = 0; i < anchors.length; i++) {
    const link = record.claimCodeLinks[i], anchor = anchors[i], match = /^(.*):(\d+)$/.exec(anchor.at || '');
    if (link.name !== anchor.name || link.kind !== anchor.kind || link.at !== anchor.at || link.sourceSha !== record.source.indexedSha || link.file !== (match?.[1] || null) || link.line !== (match ? Number(match[2]) : null)) throw new Error('Invalid claim-to-code source identity');
    const url = link.file && record.source.indexedSha ? sourceUrl(record.repository, record.source.indexedSha, link.file, link.line) : null;
    if (link.url !== url || !['readable', 'failed', 'unreadable'].includes(link.state)) throw new Error('Invalid claim-to-code source link');
    if (link.state === 'readable') readableAnchor(link);
    const reviewed = anchorReviewIdentity(link, record.source, record.files, record.review);
    if (link.verification !== (reviewed || 'catalog-derived-anchor')) throw new Error('Unsupported claim-to-code verification label');
  }
  for (const suggestion of record.suggestedWordingLinks || []) {
    if (!ids.has(suggestion.sectionId) || suggestion.verification !== 'suggested-only' || !Array.isArray(suggestion.symbols) || suggestion.symbols.some(s => !record.symbols.some(t => t.file === s.file && t.line === s.line && t.name === s.name))) throw new Error('Invalid automatically suggested wording link');
  }
  return true;
}

/** Validate reusable records against the complete immutable tree and actual blob
 * bytes. Saved JSON hashes establish consistency, not source correspondence. */
function verifyCapturedRecord(record, tree, blobs, directory) {
  validateRecord(record);
  if (directory && json(reviewedAnchorFiles(directory, tree, record.review).files) !== json(record.review.unchangedReviewedAnchorFiles || [])) throw new Error('Cached historical reviewed-file evidence differs from immutable Git');
  if (record.source.indexedSha !== tree.sha || record.source.treeOid !== tree.treeOid || record.files.length !== tree.entries.length) throw new Error('Cached source tree inventory differs from immutable Git');
  const files = new Map(record.files.map(f => [f.path, f])), texts = new Map();
  for (const entry of tree.entries) {
    const file = files.get(entry.path), bytes = blobs.get(entry.objectOid);
    if (!file || ['path', 'mode', 'type', 'objectOid', 'bytes'].some(field => file[field] !== entry[field])) throw new Error('Cached tracked object identity differs from Git: ' + entry.path);
    if (entry.type === 'blob' && (!bytes || file.sha256 !== sha256(bytes))) throw new Error('Cached file hash differs from captured bytes: ' + entry.path);
    if (file.state === 'readable') {
      const text = bytes.toString('utf8'), lines = text.split('\n'); texts.set(file.path, { text, lines });
      if (file.lineCount !== lines.length) throw new Error('Cached line inventory differs from source');
    }
  }
  for (const section of record.sections) if (!texts.get(section.file)?.lines.slice(section.startLine - 1, section.endLine).join('\n').includes(section.sourceText)) throw new Error('Cached wording is not an exact captured source slice');
  for (const symbol of record.symbols) if (!texts.get(symbol.file)?.lines[symbol.line - 1].includes(symbol.name)) throw new Error('Cached symbol is absent from its source line');
  for (const citation of record.citations) if (!texts.get(citation.file)?.lines[citation.line - 1].includes(citation.url)) throw new Error('Cached citation is absent from its source line');
  if (json(anchorEvidence(record.catalog, record.source, record.files, blobs, record.review)) !== json(record.claimCodeLinks)) throw new Error('Cached algorithm anchor differs from current exact source evidence');
  return true;
}

function renderRecord(record) {
  const out = [`<a id="${record.id}"></a>`, `## ${escapeMd(record.name)}`, '', `[Repository](${record.repository}) · [Demo](${record.demoUrl})`, '', `Indexed source commit: ${record.source.indexedSha ? '[' + record.source.indexedSha + '](' + record.repository + '/commit/' + record.source.indexedSha + ')' : '**unavailable**'}; Git capture state: **${record.source.state}** (file extraction and runtime verification are separate).`, '', `Last imported reviewed SHA: ${record.review.lastReviewedSha || '**none**'}; teaching-reference review SHA: ${record.review.teachingReferenceReviewedSha || '**none**'}. Extraction never advances either review. Existing catalog/corpus/worksheet reviews keep their original scope.`, '', '### Generated summary and existing teaching scope', '', escapeMd(record.summary.text), '', '*Basis:* ' + escapeMd(record.summary.basis), '', '*Verification:* ' + escapeMd(record.summary.verification), '', `Existing catalog implementation description: ${escapeMd(record.catalog.implementation)}.`, ''];
  if (record.summary.source) out.push('[Immutable hub card source](' + record.summary.source.url + ') (existing description, not independent lab review).', '');
  if (record.review.catalog?.note) out.push('Existing catalog review note (verbatim; SHA ' + record.review.catalog.commit + '):', '', fence(record.review.catalog.note), '');
  out.push('### Implementation anchors and suggested connections', '', 'Catalog evidence is reused without changing its vocabulary, review pins or stale-review guard. A resolving anchor is not a cryptographic validation or a wording review.', '');
  for (const link of record.claimCodeLinks) out.push(`- ${escapeMd(link.kind)}: **${escapeMd(link.name)}**, ${link.url ? '[' + escapeMd(link.at) + '](' + link.url + ')' : 'anchor unavailable'}; ${link.state}; ${escapeMd(link.verification)}.`);
  if (!record.claimCodeLinks.length) out.push(`- Catalog state: ${record.catalog.notScanned ? 'NOT-SCANNED' : record.catalog.noNamedPrimitive ? 'N/A (no named primitive; not an absent teaching lab)' : record.catalog.unknown ? 'UNKNOWN' : 'No implementation anchor supplied'}.`);
  out.push('', 'References-only vocabulary from the catalog: ' + (record.catalog.references.map(escapeMd).join(', ') || 'none recorded') + '.', '', 'Model, simulation and comparison labels below are wording-based suggestions, not newly verified classifications. Their exact context is in the source sections.', '');
  for (const mode of (record.teachingModes || []).filter(mode => record.files.find(file => file.path === record.sections.find(section => section.id === mode.sectionId)?.file)?.role !== 'test')) out.push(`- ${escapeMd(mode.kind)}: [${escapeMd(mode.sectionId)}](#${record.id}--${mode.sectionId}); suggested only.`);
  out.push('', '### Exact source wording', '', 'Raw source slices are reproduced verbatim, including escapes, HTML entities, original spelling and interpolated expressions. All displayed source slices are unverified rendering candidates. Static extraction does not establish which conditional text is actually shown. String candidates are labelled and can include internal text. Test and verification fixture strings are retained in the machine record, with their files listed below; they are not duplicated as learner copy here. Suggested nearby-symbol links remain unverified in the machine record. No source correction or runtime evaluation is performed.', '');
  const filesByPath = new Map(record.files.map(file => [file.path, file]));
  const displayedSections = record.sections.filter(section => filesByPath.get(section.file)?.role !== 'test');
  let lastFile = null;
  for (const section of displayedSections) {
    if (section.file !== lastFile) { out.push(`#### ${escapeMd(section.file)}`, ''); lastFile = section.file; }
    out.push(`<a id="${record.id}--${section.id}"></a>`, `**${escapeMd(section.kind)} · ${escapeMd(section.surface)}** · [source L${section.startLine}–${section.endLine}](${sourceUrl(record.repository, record.source.indexedSha, section.file, section.startLine, section.endLine)}) · SHA256 ${section.sha256}`, '', sourceBlock(section.sourceText), '');
  }
  if (!displayedSections.length) out.push('**No wording extracted. This is a coverage gap, not verified absence of teaching content.**', '');
  out.push('### Implementation files, symbols and test sources', '', 'These are tracked source candidates; listing a test or function does not mean it was run or that it supports a particular claim.', '');
  for (const file of record.files.filter(f => /implementation|code|test|wasm|opaque/.test(f.role))) {
    out.push(`- [${escapeMd(file.path)}](${sourceUrl(record.repository, record.source.indexedSha, file.path)}): ${file.state}; ${escapeMd(file.role)}; SHA256 ${file.sha256 || 'unavailable'}.`);
    const symbols = record.symbols.filter(s => s.file === file.path);
    if (symbols.length) out.push('  Symbols: ' + symbols.map(s => `[${escapeMd(s.name)}](${sourceUrl(record.repository, record.source.indexedSha, s.file, s.line)})`).join(', ') + '.');
  }
  out.push('', '### References already cited by the source', '', 'Citation URLs retain their source locations. Primary-source status and current availability are not inferred or reverified by this generator.', '');
  for (const citation of record.citations) out.push(`- [${escapeMd(citation.url)}](${citation.url}) · [citation source](${sourceUrl(record.repository, record.source.indexedSha, citation.file, citation.line)}).`);
  if (!record.citations.length) out.push('No citation extracted; unsupported or dynamic citation construction can remain a gap.');
  out.push('', '### Existing review metadata and incremental changes', '', `Automatic comparison state: **${record.changeReport.state}**. Unchanged wording invalidated by other inputs: **${Boolean(record.changeReport.unchangedWordingInvalidated)}**. Every changed tracked path is accounted for in this lab’s machine record.`, '', `Machine record: [${record.id}.json](teaching-reference/records/${record.id}.json).`);
  if (record.review.counsel) out.push('', 'Imported Counsel review metadata (original scope):', '', fence(json(record.review.counsel).trimEnd()));
  for (const worksheet of record.review.worksheets) out.push('', `Existing course source: [${escapeMd(worksheet.file)}](${worksheet.file}); recorded source commit ${worksheet.exhibit.source_commit || 'unknown'} (not silently expanded or updated).`);
  out.push('', '### Extraction and verification gaps', '', 'Cryptographic behavior, teaching accuracy, runtime branch coverage, source-to-binary correspondence and constant-time behavior are not established by static extraction. Opaque binaries and unsupported languages retain their own states.', '');
  for (const gap of record.gaps) out.push('- **' + escapeMd(gap.kind) + '**' + (gap.file ? ' (`' + escapeMd(gap.file) + '`)' : '') + ': ' + escapeMd(gap.reason || 'Explicit coverage limit.'));
  if (!record.gaps.length) out.push('- No additional file-specific extraction gaps recorded; this is not a complete behavioral review.');
  return out.join('\n') + '\n';
}

function render(records) {
  const out = ['# Crypto Lab — source-backed teaching reference', '', '<!-- Generated by tools/teaching-reference.js from teaching-reference/records; do not edit by hand. -->', '', `This document includes **${records.length} catalog labs**. It separates exact source wording from generated summaries and imported reviews. Immutable links identify the captured Git bytes; no extraction result constitutes a new human review. Missing, unreadable, unsupported, dynamic and opaque content remain explicit.`, '', 'See [generation and review commands](docs/teaching-reference.md) and the [machine manifest](teaching-reference/manifest.json). The homepage remains the lab browser.', '', '## Contents', '', ...records.map(record => `- [${escapeMd(record.name)}](#${record.id})`), '', ...records.map(renderRecord)];
  return out.join('\n') + '\n';
}

function makeManifest(records, catalogIdentity, hash) {
  return { schemaVersion: SCHEMA, generatorVersion: VERSION, generatorHash: hash, catalogIdentity, membership: 'complete', coverage: { catalogLabs: records.length, readableSources: records.filter(r => r.source.state === 'readable').length, missingSources: records.filter(r => r.source.state === 'missing').length, unreadableSources: records.filter(r => r.source.state === 'unreadable').length, incompleteSources: records.filter(r => r.source.state === 'incomplete').length, staleSources: records.filter(r => r.source.state === 'stale').length, captureReadability: 'Git commit/tree/blob readability; not complete extraction or behavioral verification', fileCoverage: Object.fromEntries(['readable', 'unreadable', 'unsupported', 'opaque'].map(state => [state, records.reduce((n, record) => n + record.files.filter(file => file.state === state).length, 0)])), trackedFiles: records.reduce((n, r) => n + r.files.length, 0), sourceSections: records.reduce((n, r) => n + r.sections.length, 0), staticExtraction: 'bounded; gaps recorded per lab', behavioralVerification: 'not performed by generator', reviewedShaAdvanced: false }, records: records.map(record => ({ id: record.id, path: 'records/' + record.id + '.json', sha256: sha256(json(record)), indexedSha: record.source.indexedSha, lastReviewedSha: record.review.lastReviewedSha, sourceState: record.source.state, fileCount: record.files.length, sectionCount: record.sections.length, gapCount: record.gaps.length })) };
}
function loadRecords(directory) {
  const manifest = readJson(path.join(directory, 'manifest.json'));
  if (manifest.schemaVersion !== SCHEMA || !Array.isArray(manifest.records) || new Set(manifest.records.map(r => r.id)).size !== manifest.records.length) throw new Error('Invalid reference manifest membership');
  const records = manifest.records.map(entry => {
    if (entry.path !== 'records/' + entry.id + '.json') throw new Error('Unsafe record path');
    const bytes = fs.readFileSync(path.join(directory, entry.path));
    if (sha256(bytes) !== entry.sha256) throw new Error('Record hash mismatch: ' + entry.id);
    const record = JSON.parse(bytes); validateRecord(record);
    if (record.generatorHash !== manifest.generatorHash || record.generatorVersion !== manifest.generatorVersion || record.source.state !== entry.sourceState || record.gaps.length !== entry.gapCount) throw new Error('Manifest generation or coverage mismatch');
    if (record.id !== entry.id || record.source.indexedSha !== entry.indexedSha || record.review.lastReviewedSha !== entry.lastReviewedSha || record.sections.length !== entry.sectionCount || record.files.length !== entry.fileCount) throw new Error('Manifest/record evidence mismatch');
    return record;
  });
  const present = fs.readdirSync(path.join(directory, 'records')).filter(f => f.endsWith('.json')).sort();
  const expected = manifest.records.map(r => r.id + '.json').sort();
  if (json(present) !== json(expected)) throw new Error('Unmanifested or omitted lab record');
  if (manifest.coverage?.catalogLabs !== records.length || manifest.membership !== 'complete' || !HASH.test(manifest.catalogIdentity || '')) throw new Error('Invalid manifest coverage claim');
  const recomputed = makeManifest(records, manifest.catalogIdentity, manifest.generatorHash);
  if (json(manifest.coverage) !== json(recomputed.coverage)) throw new Error('Manifest aggregate coverage differs from its records');
  return { manifest, records };
}
function build(root, repositoryRoots, ref, previousRecords = [], options = {}) {
  const list = catalog(root); const hash = generatorHash();
  const reviews = reviewInputs(root, repositoryRoots, list); const discovered = discoverRepositories(repositoryRoots);
  const prior = new Map(previousRecords.map(r => [r.id, r])); const context = { generatorHash: hash, ref, reused: 0, extracted: 0, reuse: options.reuse !== false, hubCards: hubCardSources(root, ref) };
  const records = list.map(card => capture(card, discovered.repositories.get('systemslibrarian/' + card.slug), reviews.get(card.slug), prior.get(card.slug), context));
  const manifest = makeManifest(records, fingerprint(list), hash);
  return { records, manifest, markdown: render(records), reused: context.reused, extracted: context.extracted, discoveryDiagnostics: discovered.diagnostics };
}
function saveGenerated(root, result) {
  const dir = path.join(root, 'teaching-reference'); const recordsDir = path.join(dir, 'records'); fs.mkdirSync(recordsDir, { recursive: true });
  const ids = new Set(result.records.map(r => r.id + '.json'));
  const unexpected = fs.readdirSync(recordsDir).filter(name => name.endsWith('.json') && !ids.has(name));
  if (unexpected.length) throw new Error('Unmanifested records would be overwritten/removed; review catalog membership first: ' + unexpected.join(', '));
  for (const record of result.records) fs.writeFileSync(path.join(recordsDir, record.id + '.json'), json(record));
  fs.writeFileSync(path.join(dir, 'manifest.json'), json(result.manifest)); fs.writeFileSync(path.join(root, 'TEACHING-REFERENCE.md'), result.markdown);
}
function parseArgs(argv) {
  const options = { mode: argv[0] && !argv[0].startsWith('--') ? argv.shift() : 'write', root: path.resolve(__dirname, '..'), repositories: [], ref: 'origin/HEAD', recordsOnly: false };
  while (argv.length) {
    const arg = argv.shift();
    if (arg === '--records-only') options.recordsOnly = true;
    else if (arg === '--sources') options.recordsOnly = false;
    else if (['--root', '--repositories', '--ref', '--against', '--out', '--lab', '--max-bytes'].includes(arg)) {
      const value = argv.shift(); if (!value || value.startsWith('--')) throw new Error('Missing option value: ' + arg);
      if (arg === '--repositories') options.repositories.push(path.resolve(value));
      else options[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    } else throw new Error('Unknown option: ' + arg);
  }
  if (!['write', 'check', 'compare', 'export'].includes(options.mode)) throw new Error('Unknown reference command');
  options.root = path.resolve(options.root); if (!options.repositories.length) options.repositories.push(path.dirname(options.root));
  return options;
}
function main(argv = process.argv.slice(2)) {
  const options = parseArgs([...argv]); const dir = path.join(options.root, 'teaching-reference');
  if (options.mode === 'export') {
    if (!options.out) throw new Error('Export requires --out');
    const { records } = loadRecords(dir); const chosen = options.lab ? records.filter(r => r.id === options.lab) : records;
    if (!chosen.length) throw new Error('Requested lab is not in the manifest');
    const documents = chosen.map(record => ({ id: record.id, text: renderRecord(record), recordSha256: sha256(json(record)) }));
    if (!options.lab) documents.unshift({ id: 'all-in-one', text: render(records), recordSha256: sha256(json(records.map(r => ({ id: r.id, sha256: sha256(json(r)) })))) });
    const { buildPackets, verifyPackets } = require('./teaching-reference-change.js');
    const packetSet = buildPackets(documents, { maxBytes: Number(options.maxBytes || 1000000) }); verifyPackets(packetSet.manifest, packetSet.packets);
    const target = path.resolve(options.out); if (fs.existsSync(target) && fs.readdirSync(target).length) throw new Error('Export destination must be new or empty'); fs.mkdirSync(target, { recursive: true });
    for (const packet of packetSet.packets) fs.writeFileSync(path.join(target, packet.path), packet.bytes);
    fs.writeFileSync(path.join(target, 'manifest.json'), json(packetSet.manifest));
    console.log(json({ mode: 'export', documents: documents.length, packets: packetSet.packets.length, destination: target, lossless: true }).trim()); return 0;
  }
  if (options.mode === 'compare' && !options.against) throw new Error('Compare requires --against saved teaching-reference directory');
  let prior = [];
  if (fs.existsSync(path.join(dir, 'manifest.json'))) prior = loadRecords(dir).records;
  if (options.mode === 'check') {
    const saved = loadRecords(dir); const list = catalog(options.root);
    if (json(saved.records.map(r => r.id)) !== json(list.map(c => c.slug)) || saved.manifest.catalogIdentity !== fingerprint(list)) throw new Error('Catalog membership or metadata has changed');
    if (saved.manifest.generatorHash !== generatorHash()) throw new Error('Generator changed; regenerate');
    if (fs.readFileSync(path.join(options.root, 'TEACHING-REFERENCE.md'), 'utf8') !== render(saved.records)) throw new Error('Generated Markdown differs from authoritative records');
    if (!options.recordsOnly) {
      const candidate = build(options.root, options.repositories, options.ref, saved.records);
      if (candidate.records.some(r => r.source.state !== 'readable' && r.source.state !== 'N/A')) throw new Error('Current source check is incomplete');
      if (json(candidate.records) !== json(saved.records) || json(candidate.manifest) !== json(saved.manifest)) throw new Error('Current source or review inputs have changed; run write/compare');
    }
    console.log(json({ mode: 'check', labs: saved.records.length, recordsAndMarkdown: 'consistent', sourceCheck: options.recordsOnly ? 'not requested; saved evidence only' : 'current local tracking refs', extraction: 'bounded; no review advancement' }).trim()); return 0;
  }
  const baseline = options.mode === 'compare' ? loadRecords(path.resolve(options.against)).records : prior;
  const result = build(options.root, options.repositories, options.ref, baseline, { reuse: options.mode !== 'compare' });
  if (options.mode === 'compare') {
    const report = { generatorVersion: VERSION, catalogMembership: result.records.map(r => r.id), comparisons: result.records.map(r => ({ id: r.id, ...r.changeReport })), removedLabs: baseline.filter(r => !result.records.some(c => c.id === r.id)).map(r => r.id), reviewPinsAdvanced: false };
    if (options.out) fs.writeFileSync(path.resolve(options.out), json(report)); else process.stdout.write(json(report));
  } else { saveGenerated(options.root, result); console.log(json({ mode: 'write', ...result.manifest.coverage, reused: result.reused, extracted: result.extracted }).trim()); }
  return result.records.some(r => r.source.state !== 'readable' && r.source.state !== 'N/A') ? 2 : 0;
}
module.exports = { VERSION, sha256, fingerprint, json, sourceUrl, sourceBlock, repositoryName, discoverRepositories, catalog, hubCardSources, reviewInputs, reviewedAnchorFiles, capture, validateRecord, verifyCapturedRecord, renderRecord, render, makeManifest, loadRecords, build, saveGenerated, parseArgs, main };
if (require.main === module) {
  try { process.exitCode = main(); }
  catch (error) { console.error('Teaching reference: ' + error.message); process.exitCode = 1; }
}
