/*
 * teaching-reference-change.js — compare captured teaching records and split exact exports.
 * Not runnable. Required by the local teaching-reference generator.
 * Reads: caller-provided immutable record inventories, sections, Git path changes and text.
 *
 * No source reads, network, review writes or publication. Unchanged is a byte-comparison
 * result, never a declaration that a lab or its teaching has been reviewed. The legacy
 * corpus classifier is reported separately: its README.md/src scope does not decide
 * whether code, dependency, data, WASM or unexplained paths invalidate unchanged prose.
 */
'use strict';
const crypto = require('crypto');
const { classify } = require('./corpus-freshness');

const SHA = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
// This module never opens paths. Backslashes/newlines are literal POSIX Git names.
const validPath = p => typeof p === 'string' && !!p && !p.includes('\0') &&
  !p.startsWith('/') && !p.split('/').some(s => !s || s === '.' || s === '..');

function categoryOf(file, name) {
  const role = String(file?.role || '').toLowerCase();
  if (/\.(wasm|wat|wast)$/i.test(name) || role === 'wasm') return 'wasm';
  if (/(^|\/)(package(?:-lock)?\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.(toml|lock)|requirements[^/]*\.txt|poetry\.lock|pyproject\.toml|go\.(mod|sum)|Gemfile(?:\.lock)?|composer\.(json|lock))$/.test(name) || /dependency|manifest|lockfile/.test(role)) return 'dependency';
  if (/(^|\/)(tests?|e2e|__tests__)(\/|$)|\.(test|spec)\./.test(name) || role === 'test') return 'test';
  if (/\.(?:[cm]?[jt]sx?|rs|[ch](?:pp|xx)?|cc|py|go|java|svelte|vue|html?)$/i.test(name) || /^(implementation|source|runtime|code|wrapper)$/.test(role)) return 'source';
  if (/(^|\/)(?:[^/]*config[^/]*|Makefile|CMakeLists\.txt)$|(^|\/)(\.github|\.gitlab|scripts)\//.test(name) || /^(configuration|workflow|build)$/.test(role)) return 'configuration';
  if (/\.(json|jsonl|csv|tsv|yaml|yml|bin|dat)$/i.test(name) || /^(data|fixture|vector|vectors)$/.test(role)) return 'data';
  if (/(^|\/)(AGENTS\.md|CLAUDE\.md|\.gitignore|\.gitattributes)$/.test(name)) return 'maintenance';
  if (/\.(md|mdx|rst|txt)$/i.test(name) || /^(documentation|docs|readme|teaching|ui|quiz|localization)$/.test(role)) return 'documentation';
  if (/\.(png|jpe?g|gif|webp|svg|ico|avif|woff2?|ttf|otf|mp[34]|ogg|wav)$/i.test(name) || role === 'asset') return 'asset';
  return 'unknown';
}

function inventory(items, key, label, gaps) {
  const map = new Map();
  if (!Array.isArray(items)) { gaps.push(`${label} inventory is missing or unreadable`); return map; }
  for (const item of items) {
    const id = item?.[key];
    if (typeof id !== 'string' || !id || key === 'path' && !validPath(id)) { gaps.push(`${label} inventory contains an invalid ${key}`); continue; }
    if (map.has(id)) { gaps.push(`${label} inventory contains duplicate ${key}: ${id}`); continue; }
    map.set(id, item);
    if (!SHA.test(item.sha256 || '')) gaps.push(`${label} ${id} has no readable SHA256`);
    if (key === 'path' && (typeof item.state !== 'string' || !item.state)) gaps.push(`${label} ${id} has unreadable inventory state`);
    if (key === 'path' && item.state && !/^(readable|text|empty|opaque|unsupported|not-scanned|binary|symlink|submodule|missing|unreadable|error|unknown)$/i.test(item.state)) gaps.push(`${label} ${id} has an unrecognized inventory state: ${item.state}`);
    if (key === 'path' && /^(opaque|unsupported|not-scanned|binary|symlink|submodule)$/i.test(item.state || '')) gaps.push(`${label} ${id} is ${item.state}; its hash does not establish readable source or implementation correctness`);
    if (key === 'path' && /^(missing|unreadable|error|unknown)$/i.test(item.state || '')) gaps.push(`${label} ${id} is ${item.state}`);
    if (key === 'file' && !validPath(id)) gaps.push(`${label} ${id} is not a tracked-path spelling`);
  }
  return map;
}

/**
 * Compare complete inventories at two indexed commits. The caller supplies the actual
 * Git diff and ancestry result; null means unreadable history, not no changes. Every
 * supplied path and every changed manifest-union path is retained, including deletes
 * and both ends of renames. No reviewed SHA is inferred from successful extraction.
 */
function compareRecords(previous, current, { changedPaths, isAncestor = null } = {}) {
  const gaps = [];
  const fromSha = previous?.source?.indexedSha || null;
  const toSha = current?.source?.indexedSha || null;
  const reviewedSha = current?.review?.lastReviewedSha || null;
  const identityUnknown = !COMMIT.test(toSha || '') || previous != null && !COMMIT.test(fromSha || '') || reviewedSha !== null && !COMMIT.test(reviewedSha);
  if (!COMMIT.test(toSha || '')) gaps.push('Current indexed source SHA is missing or invalid');
  if (previous != null && !COMMIT.test(fromSha || '')) gaps.push('Previous indexed source SHA is missing or invalid');
  if (reviewedSha !== null && !COMMIT.test(reviewedSha)) gaps.push('Last-reviewed SHA is invalid; it has not been advanced');
  if (previous == null) gaps.push('No previous record: initial capture requires review, not a clean comparison');
  let sourceEvidenceUnreadable = false;
  for (const [label, captured] of [['Previous', previous], ['Current', current]]) {
    if (captured == null) continue;
    const source = captured.source;
    if (source?.state != null && (typeof source.state !== 'string' || /^(incomplete|partial|stale|missing|unreadable|error|unknown|not-scanned)$/i.test(source.state))) {
      gaps.push(`${label} source capture state is ${String(source.state)}; indexed identity and byte hashes do not establish complete current source evidence`);
      sourceEvidenceUnreadable = true;
    }
    if (source?.incomplete === true) {
      gaps.push(`${label} source capture is incomplete; indexed identity and byte hashes do not establish complete current source evidence`);
      sourceEvidenceUnreadable = true;
    }
    if (source?.error) {
      gaps.push(`${label} source capture has an error; indexed identity and byte hashes do not establish complete current source evidence`);
      sourceEvidenceUnreadable = true;
    }
  }
  const before = previous == null ? new Map() : inventory(previous.files, 'path', 'Previous file', gaps);
  const after = inventory(current?.files, 'path', 'Current file', gaps);
  const oldSections = previous == null ? new Map() : inventory(previous.sections, 'id', 'Previous section', gaps);
  const sections = inventory(current?.sections, 'id', 'Current section', gaps);
  const inventoryUnreadable = gaps.some(g => /inventory|no readable SHA256| is (missing|unreadable|error|unknown)/i.test(g));
  for (const [label, map, files] of [['Previous', oldSections, before], ['Current', sections, after]]) {
    for (const section of map.values()) {
      if (!validPath(section.file) || !files.has(section.file)) gaps.push(`${label} section ${section.id} has no captured tracked source file`);
    }
  }
  const wordingChanged = [...new Set([...oldSections.keys(), ...sections.keys()])].sort(order)
    .filter(id => oldSections.get(id)?.sha256 !== sections.get(id)?.sha256 || oldSections.get(id)?.file !== sections.get(id)?.file)
    .map(id => ({ id, beforeHash: oldSections.get(id)?.sha256 || null, afterHash: sections.get(id)?.sha256 || null,
      beforeFile: oldSections.get(id)?.file || null, afterFile: sections.get(id)?.file || null }));

  const changes = new Map();
  const add = (p, status, oldPath) => {
    if (!validPath(p)) { gaps.push('Git change list contains an invalid tracked path'); return; }
    if (oldPath !== undefined && !validPath(oldPath)) gaps.push(`Git rename for ${p} has an invalid oldPath`);
    const existing = changes.get(p);
    if (existing && (existing.status !== status || existing.oldPath !== oldPath)) gaps.push(`Conflicting Git change rows for ${p}`);
    changes.set(p, { path: p, status, ...(oldPath === undefined ? {} : { oldPath }) });
    if (/^R/.test(status) && validPath(oldPath) && oldPath !== p && !changes.has(oldPath)) changes.set(oldPath, { path: oldPath, status: 'D', renamedTo: p });
  };
  const historyUnreadable = previous != null && (!Array.isArray(changedPaths) || isAncestor === null);
  if (!Array.isArray(changedPaths)) gaps.push('Git tracked-path diff was not supplied or is unreadable');
  else for (const item of changedPaths) {
    const status = typeof item?.status === 'string' ? item.status : '?';
    if (!/^[ACDMRTUXB][0-9]*$/.test(status)) gaps.push('Git change list contains an invalid status');
    if (/^[UXB]/.test(status)) gaps.push(`Git change list contains an unresolved or unknown status for ${item.path}`);
    add(item?.path, status, item?.oldPath);
  }
  if (previous != null && isAncestor === null) gaps.push('Git ancestry is unreadable or was not supplied');
  if (isAncestor !== true && isAncestor !== false && isAncestor !== null) gaps.push('Git ancestry result is invalid');
  if (previous != null && isAncestor === false) gaps.push('Previous indexed source is not an ancestor of the current source; the review baseline requires reconciliation');
  for (const name of [...new Set([...before.keys(), ...after.keys()])].sort(order)) {
    const a = before.get(name), b = after.get(name);
    if (a?.sha256 !== b?.sha256 || a?.state !== b?.state || a?.role !== b?.role || a?.language !== b?.language) {
      if (!changes.has(name)) add(name, a ? b ? 'M' : 'D' : 'A');
    }
  }
  const trackedChanges = [...changes.values()].sort((a, b) => order(a.path, b.path)).map(change => {
    const a = before.get(change.oldPath || change.path), b = after.get(change.path);
    const category = categoryOf(b || a, change.path);
    const expectedBefore = !/^[A]/.test(change.status), expectedAfter = !/^[D]/.test(change.status);
    const absent = expectedBefore && !a || expectedAfter && !b;
    if (absent) gaps.push(`Changed tracked path ${change.path} is absent from its expected captured inventory`);
    const unreadableFile = expectedBefore && (!SHA.test(a?.sha256 || '') || !/^(readable|text|empty)$/i.test(a?.state || '')) ||
      expectedAfter && (!SHA.test(b?.sha256 || '') || !/^(readable|text|empty)$/i.test(b?.state || ''));
    const evidenceGap = absent || unreadableFile || identityUnknown || historyUnreadable || sourceEvidenceUnreadable ||
      !/^[ACDMRT][0-9]*$/.test(change.status) || change.oldPath !== undefined && !validPath(change.oldPath);
    const needsReview = category !== 'maintenance' || !!evidenceGap;
    const reason = evidenceGap ? 'Missing or unreadable captured evidence; no clean conclusion' : category === 'maintenance'
      ? 'Known repository-maintenance path; retained in the comparison, not learner-facing source'
      : category === 'unknown' ? 'Unexplained tracked path change requires review'
      : `${category} changed; prior teaching or its supporting evidence requires review`;
    return { ...change, beforeHash: a?.sha256 || null, afterHash: b?.sha256 || null, category, needsReview, reason };
  });
  const unreadable = inventoryUnreadable || historyUnreadable || sourceEvidenceUnreadable || gaps.some(g => /invalid tracked|invalid status|invalid oldPath|Conflicting|no captured tracked|absent from|ancestry result is invalid|unresolved or unknown status/.test(g));
  const state = identityUnknown ? 'unknown' : unreadable ? 'unreadable' : isAncestor === false ? 'unpublished-review'
    : previous == null || wordingChanged.length || trackedChanges.some(c => c.needsReview) ? 'needs-review' : 'unchanged';
  const unchangedWordingInvalidated = wordingChanged.length === 0 && (unreadable || identityUnknown || isAncestor === false || trackedChanges.some(c => c.needsReview));
  const pathsForNarrowScope = Array.isArray(changedPaths) ? trackedChanges.map(c => c.path) : null;
  return { fromSha, toSha, reviewedSha, state, wordingChanged, trackedChanges, unchangedWordingInvalidated,
    gaps: [...new Set(gaps)].sort(order),
    narrowScopeComparison: { scope: 'README.md and src/** only; corpus-freshness classifier, not a corpus refresh or the teaching invalidation denominator',
      result: classify(reviewedSha ? { lab_commit: reviewedSha } : null, pathsForNarrowScope, isAncestor) } };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort(order).map(k => [k, canonical(value[k])]));
  return value;
}
function manifestHash(manifest) {
  const { manifestSha256, ...body } = manifest;
  return hash(JSON.stringify(canonical(body)));
}
function checkedText(text) {
  if (typeof text !== 'string') throw new TypeError('Document text must be a string');
  const bytes = Buffer.from(text, 'utf8');
  if (bytes.toString('utf8') !== text) throw new TypeError('Document contains unpaired UTF-16 surrogates; exact UTF-8 export is unavailable');
  return bytes;
}
function checkedId(id) {
  if (typeof id !== 'string' || !id || /[\x00-\x1f\x7f]/.test(id)) throw new TypeError('Document ID must be a nonempty stable string without control characters');
}

/** Deterministic per-document packets. Bytes are solely the original text: no lossy
 * normalization, headers, clock or silently omitted oversized section. UTF-8 code points
 * are never cut; a budget smaller than one code point fails explicitly. */
function buildPackets(documents, { maxBytes } = {}) {
  if (!Array.isArray(documents)) throw new TypeError('Documents must be an array');
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new RangeError('maxBytes must be a positive safe integer');
  const manifest = { schemaVersion: 1, kind: 'teaching-reference-packets', maxBytes, documentCount: documents.length,
    packetCount: 0, totalBytes: 0, documents: [], packets: [] };
  const packets = [], ids = new Set();
  for (const doc of documents) {
    checkedId(doc?.id);
    if (ids.has(doc.id)) throw new Error(`Duplicate document ID: ${doc.id}`);
    ids.add(doc.id);
    if (!SHA.test(doc.recordSha256 || '')) throw new TypeError(`Document ${doc.id} requires its exact record SHA256`);
    const bytes = checkedText(doc.text);
    const entry = { id: doc.id, recordSha256: doc.recordSha256, bytes: bytes.length, sha256: hash(bytes), partCount: 0, parts: [] };
    let start = 0;
    do {
      let end = Math.min(start + maxBytes, bytes.length);
      while (end < bytes.length && end > start && (bytes[end] & 0xc0) === 0x80) end--;
      if (end === start && bytes.length !== 0) throw new RangeError(`maxBytes cannot contain a UTF-8 code point in ${doc.id}`);
      const body = Buffer.from(bytes.subarray(start, end));
      const path = `packet-${String(packets.length + 1).padStart(6, '0')}.md`;
      const part = { index: entry.parts.length + 1, path, startByte: start, endByte: end, bytes: body.length, sha256: hash(body) };
      entry.parts.push(part);
      manifest.packets.push({ ...part, documentId: doc.id, packetIndex: packets.length + 1 });
      packets.push({ path, bytes: body });
      start = end;
    } while (start < bytes.length);
    entry.partCount = entry.parts.length;
    manifest.documents.push(entry);
    manifest.totalBytes += bytes.length;
  }
  manifest.packetCount = packets.length;
  manifest.manifestSha256 = manifestHash(manifest);
  verifyPackets(manifest, packets);
  return { manifest, packets };
}

/** Fail closed on missing, duplicate, reordered, malformed or tampered content.
 * The trusted generated manifest owns membership; this is consistency and exact
 * reconstruction, not authentication against somebody replacing the entire manifest. */
function verifyPackets(manifest, packets) {
  const reject = message => { throw new Error(`Invalid teaching export: ${message}`); };
  if (!manifest || manifest.schemaVersion !== 1 || manifest.kind !== 'teaching-reference-packets') reject('unsupported manifest');
  if (!Number.isSafeInteger(manifest.maxBytes) || manifest.maxBytes <= 0) reject('invalid byte budget');
  if (!SHA.test(manifest.manifestSha256 || '') || manifestHash(manifest) !== manifest.manifestSha256) reject('manifest membership or metadata changed');
  if (!Array.isArray(manifest.documents) || !Array.isArray(manifest.packets) || !Array.isArray(packets)) reject('missing inventories');
  if (manifest.documentCount !== manifest.documents.length || manifest.packetCount !== manifest.packets.length || packets.length !== manifest.packetCount) reject('missing or extra documents/packets');
  const ids = new Set(), paths = new Set();
  let packetIndex = 0, totalBytes = 0;
  for (const doc of manifest.documents) {
    checkedId(doc.id);
    if (ids.has(doc.id)) reject('duplicate document membership');
    ids.add(doc.id);
    if (!SHA.test(doc.recordSha256 || '') || !SHA.test(doc.sha256 || '') || !Number.isSafeInteger(doc.bytes) || doc.bytes < 0) reject('invalid document identity');
    if (!Array.isArray(doc.parts) || !doc.parts.length || doc.partCount !== doc.parts.length) reject('missing document parts');
    const reconstructed = [];
    let position = 0;
    for (let index = 0; index < doc.parts.length; index++) {
      const part = doc.parts[index], expected = manifest.packets[packetIndex], packet = packets[packetIndex];
      if (!part || !expected || !packet || part.path !== `packet-${String(packetIndex + 1).padStart(6, '0')}.md` || paths.has(part.path)) reject('missing, duplicated or reordered packet path');
      paths.add(part.path);
      if (part.index !== index + 1 || part.startByte !== position || !Number.isSafeInteger(part.endByte) || part.endByte < position || part.endByte > doc.bytes) reject('missing or reordered byte range');
      if (!Number.isSafeInteger(part.bytes) || part.bytes !== part.endByte - part.startByte || part.bytes > manifest.maxBytes || part.bytes === 0 && (doc.bytes !== 0 || doc.parts.length !== 1)) reject('invalid or unbounded part length');
      if (!SHA.test(part.sha256 || '') || JSON.stringify(canonical(expected)) !== JSON.stringify(canonical({ ...part, documentId: doc.id, packetIndex: packetIndex + 1 }))) reject('packet membership metadata differs');
      if (packet.path !== part.path || !Buffer.isBuffer(packet.bytes) || packet.bytes.length !== part.bytes || hash(packet.bytes) !== part.sha256) reject('missing, reordered or tampered packet bytes');
      if (!Buffer.from(packet.bytes.toString('utf8'), 'utf8').equals(packet.bytes)) reject('packet cuts or corrupts UTF-8');
      reconstructed.push(packet.bytes);
      position = part.endByte;
      packetIndex++;
    }
    const joined = Buffer.concat(reconstructed);
    if (position !== doc.bytes || hash(joined) !== doc.sha256) reject('incomplete document reconstruction');
    totalBytes += doc.bytes;
  }
  if (packetIndex !== packets.length || totalBytes !== manifest.totalBytes) reject('unaccounted packet or document bytes');
  return true;
}

module.exports = { compareRecords, buildPackets, verifyPackets };
