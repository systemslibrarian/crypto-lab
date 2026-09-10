#!/usr/bin/env node
/*
 * gate-sync.js — assert that the gate a Dependabot bump merges against IS the
 * gate the deploy depends on.
 *
 * deploy-sync asks whether the live site matches main. This one asks the
 * question one step earlier: whether anything could have landed on main that
 * main's own deploy would refuse to ship. Those are different failures. A lab
 * can be perfectly current today and still be shaped so that the next grouped
 * bump stops it shipping, with nothing red in between — and that gap is where
 * this fleet keeps ending up.
 *
 * The shape: auto-merge lives in one workflow and the Pages deploy in another,
 * and the deploy's workflow runs a browser gate — playwright, the axe WCAG scan,
 * the rendered-claim suite — that the auto-merge's workflow does not. A bump then
 * only has to satisfy the lighter of the two to merge itself. The heavier one
 * fails afterwards, on the merge commit, where no pull request is watching. The
 * PR was green, the merge was clean, the deploy is blocked, and the site serves
 * the old build.
 *
 * crypto-lab-e91 drifted exactly that way and was found serving a stale build on
 * 2026-09-08. Its ci.yml ran npm ci, the build and the engine tests on
 * pull_request; its deploy.yml ran all of that plus the browser gate on push to
 * main; auto-merge hung off ci.yml. A grouped npm-minor-and-patch bump floated a
 * deliberately pinned @playwright/test version back up — past a gate that could
 * not see what the pin was holding down — and un-deferred a WCAG defect only the
 * browser gate could catch. Nineteen labs had the same shape. The fix is one
 * workflow with one `build` job that both `deploy` and `dependabot-auto-merge`
 * declare in `needs:`; e91's deploy.yml is the reference. See
 * audits/_MASTER-TEMPLATE.md §6.1–6.2 for the binding contract.
 *
 * ---------------------------------------------------------------------------
 * The invariant, as encoded
 *
 *   Every check the deploy path runs before it publishes the Pages site must
 *   also run on the path a Dependabot bump has to clear before it can merge
 *   itself.
 *
 * A deploy job is one that uses a publisher in PAGES_PUBLISHERS below. Until
 * 2026-09-10 that meant the single literal `actions/deploy-pages`, and the two
 * labs that publish with `peaceiris/actions-gh-pages` — dilithium-reject and
 * elgamal-plain — had no deploy job as far as this file was concerned. They were
 * not merely exempt from the dispatch rule; they were counted in the "N with no
 * Pages deploy" line and every rule here skipped them in silence, which is the
 * exact failure this tool exists to end. Both were real defects behind that skip:
 * both auto-merge with `gh pr merge --squash` and dispatch nothing at all, so the
 * GITHUB_TOKEN merge raises no push event and the deploy never runs, while both
 * carry the vestigial `actions: write   # required by the deploy dispatch`
 * comment naming a dispatch that is not there.
 *
 * Both paths are computed as a transitive `needs:` closure over jobs, WITHIN one
 * workflow file, because `needs:` cannot cross files. Two things widen that
 * honestly rather than by special case: a job that is `uses: ./.github/workflows/
 * x.yml` pulls in that called workflow's jobs, and an auto-merge workflow
 * triggered `on: workflow_run: workflows: [X]` pulls in every job of the workflow
 * named X, since waiting on X's conclusion is exactly what gates it. That is what
 * lets silent-tally — the one lab whose gate deliberately lives in a reusable
 * workflow, per §6.1 — be judged on what it actually runs rather than exempted by
 * name.
 *
 * Each closure is reduced to a set of check tokens: the commands its steps run
 * and the non-infrastructure actions they use. `npm run <script>` is resolved
 * through the lab's own package.json, recursively, so `npm run test:a11y`,
 * `npm run test:e2e` and a bare `playwright test` compare as the same check
 * rather than as three different ones. Setup and plumbing — checkout, setup-node,
 * npm ci, playwright install, the Pages upload action, every publisher in
 * PAGES_PUBLISHERS, fetch-metadata — are dropped from both sides; everything else counts, the build included, since
 * a bump that breaks the build must not be able to merge either. The failure is
 * the set difference: what the deploy path runs and the auto-merge path does not.
 *
 * Where a lab has more than one of either — two labs deploy from two files — the
 * deploy side is the union, since every one of those gates has to go green before
 * the site ships, and each auto-merge job is judged separately, since each is its
 * own route to main.
 *
 * ---------------------------------------------------------------------------
 * What fails and what only warns
 *
 * Failing means the gate is already disabled, or a deploy is already guaranteed
 * not to happen. Warning means the lab is currently shipping but is one ordinary
 * edit away from the failure — real signal, but not something to block a commit
 * over.
 *
 * FAILS
 *   DEPLOY-UNRECOGNISED
 *                    FOUR conditions, all of which must hold. The lab is (1) a
 *                    directory sitting directly under the fleet root — the parent
 *                    of this repo — whose NAME matches /^crypto-(lab|compare|
 *                    counsel)/ and which contains a .github/workflows directory
 *                    (that is the whole set siblingLabs() returns, and the whole
 *                    set every rule in this file ranges over); (2) it has an
 *                    auto-merge job; (3) its directory name is one a catalog card
 *                    links to as a live github.io page; and (4) no job in it uses
 *                    any publisher in PAGES_PUBLISHERS. Every rule below is
 *                    skipped for such a lab, so the skip itself is the finding.
 *                    It is keyed on the card rather than on "has no publisher"
 *                    because a lab really can publish nothing —
 *                    crypto-lab-blind-oracle-api is a Rust service with no page
 *                    and no card, and it is a fair skip.
 *
 *                    Condition (1) is the one that used to go unsaid, and it is
 *                    the widest. A carded lab that is not cloned on this machine
 *                    is not judged by this rule or by any other rule here — it is
 *                    not looked at at all, because the scan starts from what
 *                    readdirSync sees, not from what the catalog claims. That is
 *                    unfixable inside a local-files-only checker, so it is
 *                    counted and printed on every run instead; see the
 *                    "Carded labs this checker never opened" line in the summary.
 *                    As of 2026-09-10 this rule matches no lab, and one carded
 *                    lab (snow2) is uncloned and therefore outside it.
 *
 *                    Publisher names are compared case-insensitively, as GitHub
 *                    resolves owner/repo, so `Actions/Deploy-Pages` is recognised
 *                    as the deploy it is rather than degraded into this rule.
 *   GATE-WEAKER      the invariant itself: checks on the deploy path that the
 *                    auto-merge path does not run.
 *   PUSH-GATED       a deploy job gated `if: github.event_name == 'push'`. It
 *                    reads as equivalent to `!= 'pull_request'` and is not: it
 *                    also skips workflow_dispatch, which is the one trigger the
 *                    post-merge dispatch uses. The dispatched run builds, passes
 *                    the whole gate, skips the deploy, and goes green.
 *   FUSED-GATE-OFF   build and deploy in one job, gated off for pull requests.
 *                    That gates off the gate: the PR runs nothing and reports
 *                    nothing, so auto-merge has nothing to wait on.
 *   NO-PR-GATE       the auto-merge job's workflow has no pull_request trigger
 *                    and is not workflow_run-driven, so its gate cannot run on a
 *                    Dependabot PR at all.
 *   DISPATCH-404     `gh workflow run <file>` naming a workflow file this repo
 *                    does not have. The fleet uses deploy.yml, pages.yml and
 *                    deploy-pages.yml, so a line copied from a reference lab 404s
 *                    — only on the auto-merge path, and only after the merge has
 *                    landed.
 *   DISPATCH-INERT   the dispatch target exists but declares no
 *                    workflow_dispatch: trigger, so the call 422s.
 *   DISPATCH-MISSING an auto-merge with no dispatch of any kind. A merge made
 *                    with GITHUB_TOKEN raises no push event, so `on: push` never
 *                    fires and the bump lands without a deploy.
 *   DISPATCH-403     a dispatch whose effective permissions lack `actions:
 *                    write`. `gh workflow run` returns HTTP 403 every single
 *                    time, and the `|| echo` below keeps the job green.
 *   CONCURRENCY-PR   a `cancel-in-progress` group that is not ref-scoped on a
 *                    workflow that also triggers on pull_request. A PR run then
 *                    shares the group with main and cancels a live deploy —
 *                    and `cancelled` is one of the shapes that ships nothing
 *                    while looking like nothing went wrong.
 *   UNPARSED         a workflow this checker could not read. Reported as a
 *                    failure on purpose: a parser that shrugs and prints "clean"
 *                    is worse than no checker, because it answers the question
 *                    without measuring anything.
 *
 * WARNS
 *   CONCURRENCY-BARE the same unscoped cancel-in-progress group on a workflow
 *                    with no pull_request trigger. Harmless only until someone
 *                    adds that trigger — which is precisely what fixing
 *                    GATE-WEAKER requires, so these two want fixing together.
 *   SPLIT-GATE       the two jobs clear equal gates but live in separate files,
 *                    so they are two copies of one gate. Nothing is broken today.
 *                    Two copies drifting apart is the whole e91 story, so it is
 *                    worth seeing; it is not worth failing over.
 *   swallowed dispatch — counted, not listed. `gh workflow run … || echo
 *                    "::warning::"` cannot fail its job, which is deliberate in
 *                    §6.2 and true of the reference lab, so it is not a defect on
 *                    its own. It is what makes DISPATCH-403, -404 and -INERT
 *                    invisible, and those three fail.
 *
 * ---------------------------------------------------------------------------
 * Why a hand-written YAML reader
 *
 * No new dependencies, and grep is not adequate here: 178 workflow files carry
 * the line `actions: write   # required by the deploy dispatch; without it gh
 * workflow run 403s`, so grepping for `gh workflow run` finds a dispatch in
 * repos whose only mention of one is a comment about it. Reading the structure
 * is the only way to tell a step from a note about a step.
 *
 * So this parses a deliberately small subset — block mappings and sequences,
 * single-line flow collections, block scalars, quoted scalars, inline comments —
 * and THROWS on anything outside it: tabs, anchors, aliases, merge keys,
 * multi-document files, a flow collection spanning lines. A throw makes the lab
 * UNPARSED and fails the run. It never guesses.
 *
 * Checked rather than asserted: on 2026-09-09 its output was compared structurally
 * against js-yaml on all 248 workflow files in the fleet, and matched on every
 * one, with nothing refused. (js-yaml is already in tools/package.json, but only
 * the .mjs generators use it. The .js checkers all run straight from the repo
 * root with no install step, and this one belongs in that loop, so it carries its
 * own reader rather than a node_modules requirement.)
 *
 * Local files only, no network. This one belongs in the fast loop.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/gate-sync.js          Report; exit 0 always.
 *   node tools/gate-sync.js check    Same report; exit 1 on any failing finding.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const FLEET_ROOT = path.join(__dirname, '..', '..');

/* ------------------------------------------------------------------ *
 * 1. A small, loud YAML reader.
 * ------------------------------------------------------------------ */

class YamlError extends Error {}

function fail(line, msg) {
  throw new YamlError(`line ${line}: ${msg}`);
}

const KEY_RE = /^(?:"([^"]*)"|'([^']*)'|([^#\s"'][^:]*?))\s*:(?:[ \t]+(.*))?$/;

function scan(text) {
  return text.split('\n').map((raw, i) => {
    const n = i + 1;
    if (/^\s*$/.test(raw)) return { n, blank: true, indent: 0, content: '' };
    const lead = /^ */.exec(raw)[0].length;
    if (raw.slice(lead).startsWith('\t') || /^\t/.test(raw)) fail(n, 'tab in indentation');
    return { n, blank: false, indent: lead, content: raw.slice(lead).replace(/\s+$/, '') };
  });
}

function skipIgnorable(st) {
  while (st.i < st.lines.length) {
    const L = st.lines[st.i];
    if (L.blank || L.content.startsWith('#')) { st.i++; continue; }
    return;
  }
}

/* Strip an inline `# comment`, honouring quotes. This is the whole reason the
 * checker parses instead of grepping — see the header. */
function stripComment(s) {
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) return s.slice(0, i);
  }
  return s;
}

function flowScalar(raw, n) {
  const s = raw.trim();
  if (s === '') return null;
  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return Number(s);
  if (s[0] === '&' || s[0] === '*') fail(n, 'anchors and aliases are not supported');
  if ((s[0] === '"' && s.endsWith('"')) || (s[0] === "'" && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

/* Single-line flow collections only: { a: b, c: d } and [x, y]. */
function parseFlow(s, n) {
  let i = 0;
  const err = () => fail(n, `cannot parse flow collection ${JSON.stringify(s)}`);
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  function value() {
    ws();
    if (s[i] === '{') { i++; return mapping(); }
    if (s[i] === '[') { i++; return sequence(); }
    const start = i;
    let q = null;
    while (i < s.length) {
      const c = s[i];
      if (q) { if (c === q) q = null; i++; continue; }
      if (c === '"' || c === "'") { q = c; i++; continue; }
      if (c === ',' || c === '}' || c === ']') break;
      i++;
    }
    if (q) err();
    return flowScalar(s.slice(start, i), n);
  }
  function mapping() {
    const out = {};
    ws();
    if (s[i] === '}') { i++; return out; }
    for (;;) {
      ws();
      const start = i;
      while (i < s.length && s[i] !== ':' && s[i] !== '}' && s[i] !== ',') i++;
      if (s[i] !== ':') err();
      const key = String(flowScalar(s.slice(start, i), n));
      i++;
      out[key] = value();
      ws();
      if (s[i] === ',') { i++; continue; }
      if (s[i] === '}') { i++; return out; }
      err();
    }
  }
  function sequence() {
    const out = [];
    ws();
    if (s[i] === ']') { i++; return out; }
    for (;;) {
      out.push(value());
      ws();
      if (s[i] === ',') { i++; continue; }
      if (s[i] === ']') { i++; return out; }
      err();
    }
  }
  const v = value();
  ws();
  if (i !== s.length) err();
  return v;
}

function readScalar(raw, n) {
  const s = stripComment(raw).trim();
  if (s === '') return null;
  if (s[0] === '{' || s[0] === '[') return parseFlow(s, n);
  return flowScalar(s, n);
}

function readBlockScalar(st, parentIndent, style) {
  const buf = [];
  while (st.i < st.lines.length) {
    const L = st.lines[st.i];
    if (L.blank) { buf.push({ indent: 0, content: '' }); st.i++; continue; }
    if (L.indent <= parentIndent) break;
    buf.push({ indent: L.indent, content: L.content });
    st.i++;
  }
  while (buf.length && buf[buf.length - 1].content === '') buf.pop();
  if (!buf.length) return '';
  const base = Math.min(...buf.filter((b) => b.content !== '').map((b) => b.indent));
  const out = buf.map((b) => (b.content === '' ? '' : ' '.repeat(b.indent - base) + b.content));
  if (style === '|') return out.join('\n');
  // Folded: blank lines are paragraph breaks, everything else joins with a space.
  return out.reduce((acc, line) => {
    if (acc === '') return line;
    if (line === '') return `${acc}\n`;
    return acc.endsWith('\n') ? acc + line : `${acc} ${line}`;
  }, '');
}

function parseNode(st, indent) {
  skipIgnorable(st);
  if (st.i >= st.lines.length) return null;
  const L = st.lines[st.i];
  if (L.content === '---' || L.content === '...' || L.content.startsWith('--- ')) {
    fail(L.n, 'multi-document files are not supported');
  }
  if (L.indent < indent) return null;
  if (/^-(\s|$)/.test(L.content)) return parseSeq(st, L.indent);
  if (KEY_RE.test(L.content)) return parseMap(st, L.indent);
  st.i++;
  return readScalar(L.content, L.n);
}

function parseSeq(st, indent) {
  const out = [];
  for (;;) {
    skipIgnorable(st);
    const L = st.lines[st.i];
    if (!L || L.indent !== indent || !/^-(\s|$)/.test(L.content)) break;
    const m = /^-(\s*)/.exec(L.content);
    const rest = L.content.slice(m[0].length);
    if (rest === '') {
      st.i++;
      skipIgnorable(st);
      const N = st.lines[st.i];
      out.push(N && N.indent > indent ? parseNode(st, N.indent) : null);
    } else {
      const col = indent + m[0].length;
      st.lines[st.i] = { n: L.n, blank: false, indent: col, content: rest };
      out.push(parseNode(st, col));
    }
  }
  return out;
}

function parseMap(st, indent) {
  const out = {};
  for (;;) {
    skipIgnorable(st);
    const L = st.lines[st.i];
    if (!L) break;
    if (L.indent > indent) fail(L.n, 'unexpected indentation');
    if (L.indent < indent) break;
    if (/^-(\s|$)/.test(L.content)) break;
    const m = KEY_RE.exec(L.content);
    if (!m) fail(L.n, `cannot parse ${JSON.stringify(L.content)}`);
    const key = m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3].trim();
    if (key === '<<') fail(L.n, 'merge keys are not supported');
    const rest = m[4] === undefined ? '' : m[4];
    st.i++;
    const bs = /^([|>])([-+]?)\s*$/.exec(stripComment(rest).trim());
    if (bs) out[key] = readBlockScalar(st, indent, bs[1]);
    else if (stripComment(rest).trim() === '') {
      skipIgnorable(st);
      const N = st.lines[st.i];
      out[key] = N && N.indent > indent ? parseNode(st, N.indent) : null;
    } else out[key] = readScalar(rest, L.n);
  }
  return out;
}

function parseYaml(text) {
  const st = { lines: scan(text), i: 0 };
  const v = parseNode(st, 0);
  skipIgnorable(st);
  if (st.i < st.lines.length) fail(st.lines[st.i].n, 'trailing content');
  return v === null ? {} : v;
}

/* ------------------------------------------------------------------ *
 * 2. Reading a lab's workflows.
 * ------------------------------------------------------------------ */

function asArray(v) {
  if (v === null || v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function hasTrigger(wf, name) {
  const on = wf && wf.on;
  if (on === null || on === undefined) return false;
  if (typeof on === 'string') return on === name;
  if (Array.isArray(on)) return on.includes(name);
  if (typeof on === 'object') return Object.prototype.hasOwnProperty.call(on, name);
  return false;
}

function loadLab(dir) {
  const wfDir = path.join(dir, '.github', 'workflows');
  let files;
  try { files = fs.readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f)).sort(); } catch { return null; }
  if (!files.length) return null;
  const workflows = new Map();
  for (const f of files) {
    const text = fs.readFileSync(path.join(wfDir, f), 'utf8');
    let wf;
    try { wf = parseYaml(text); } catch (e) {
      if (e instanceof YamlError) return { unparsed: `${f} — ${e.message}` };
      throw e;
    }
    if (!wf || typeof wf !== 'object' || Array.isArray(wf)) {
      return { unparsed: `${f} — not a mapping at the top level` };
    }
    workflows.set(f, wf);
  }
  let scripts = {};
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (pkg && typeof pkg.scripts === 'object' && pkg.scripts) scripts = pkg.scripts;
  } catch { /* a lab with no package.json resolves nothing, symmetrically */ }
  return { workflows, scripts };
}

function jobsOf(wf) {
  const j = wf.jobs;
  return j && typeof j === 'object' && !Array.isArray(j) ? j : {};
}

function stepsOf(job) {
  return job && Array.isArray(job.steps) ? job.steps.filter((s) => s && typeof s === 'object') : [];
}

/* ------------------------------------------------------------------ *
 * 3. Check tokens.
 * ------------------------------------------------------------------ */

// Plumbing, not a gate. Present on both paths or on neither, and never the
// thing a bump breaks. Keys are lowercase: membership is tested through
// actionName() below, which lowercases, because GitHub resolves owner/repo
// case-insensitively.
const INFRA_USES = new Set([
  'actions/checkout', 'actions/setup-node', 'actions/setup-python', 'actions/setup-java',
  'actions/setup-go', 'actions/cache', 'actions/configure-pages',
  'actions/upload-pages-artifact', 'actions/deploy-pages', 'actions/upload-artifact',
  'actions/download-artifact', 'dependabot/fetch-metadata', 'dtolnay/rust-toolchain',
  'swatinem/rust-cache', 'jetli/wasm-pack-action', 'pnpm/action-setup',
  'denoland/setup-deno', 'oven-sh/setup-bun', 'ruby/setup-ruby',
  // Publishing plumbing, like the Pages actions above: it signs what is being
  // shipped, so it has nothing to say on a pull request and its absence from the
  // auto-merge path is not a missing check.
  'actions/attest-build-provenance',
]);

/* Every action in the fleet that publishes a GitHub Pages site, and the ones a
 * lab is most likely to reach for next. Surveyed across all 248 workflow files
 * on 2026-09-10: only two are actually in use — actions/deploy-pages in 193
 * files, peaceiris/actions-gh-pages in two (dilithium-reject, elgamal-plain).
 * The other three are here so that a lab adopting one gets judged by every rule
 * below rather than by DEPLOY-UNRECOGNISED alone.
 *
 * This set does two jobs at once, and both matter. It is what isDeployJob looks
 * for, and it is also plumbing on the check side: a publisher counted as a check
 * token would appear on the deploy path and never on the auto-merge path, which
 * would read as GATE-WEAKER in every lab that used it. */
const PAGES_PUBLISHERS = new Set([
  'actions/deploy-pages',
  'peaceiris/actions-gh-pages',
  'jamesives/github-pages-deploy-action',
  'crazy-max/ghaction-github-pages',
  'cecilapp/github-pages-deploy',
]);
for (const p of PAGES_PUBLISHERS) INFRA_USES.add(p);

/* `uses: Owner/Repo@v1` down to `owner/repo`. Lowercased because GitHub resolves
 * owner/repo case-insensitively — `Actions/Deploy-Pages` is the same action as
 * `actions/deploy-pages` and must be recognised as the publisher it is, not
 * degraded into DEPLOY-UNRECOGNISED. Every set in this file that is keyed on an
 * action name (INFRA_USES, PAGES_PUBLISHERS) holds lowercase keys for the same
 * reason, and the `uses:` check token is emitted lowercased so that two spellings
 * of one action compare equal across the deploy and auto-merge paths instead of
 * reading as a missing check. Surveyed 2026-09-10: all 21 distinct action names
 * in the fleet's 248 workflow files are already in canonical case, so this
 * changes no current verdict. */
function actionName(uses) {
  return String(uses).split('@')[0].trim().toLowerCase();
}

// Shell built-ins, control flow and the merge machinery itself.
const IGNORED_BINS = new Set([
  'echo', 'printf', 'sleep', 'exit', 'cd', 'set', 'export', 'source', '.', 'true', 'false',
  'mkdir', 'cp', 'mv', 'rm', 'ln', 'chmod', 'touch', 'cat', 'ls', 'sed', 'awk', 'grep',
  'tr', 'cut', 'head', 'tail', 'sort', 'uniq', 'wc', 'find', 'xargs', 'tee', 'jq',
  'git', 'gh', 'curl', 'wget', 'test', '[', '[[', 'if', 'then', 'else', 'elif', 'fi',
  'for', 'while', 'until', 'do', 'done', 'case', 'esac', 'break', 'continue', 'return',
  'rustup', 'apt-get', 'sudo', 'env', 'which', 'shopt', 'local', 'read', 'trap', 'eval',
]);

// Tools whose subcommand is the difference that matters: `cargo test` is not
// `cargo build`, and `playwright test` is not `playwright install`.
const SUBCOMMAND_BINS = new Set(['cargo', 'playwright', 'wasm-pack', 'vite', 'go', 'deno', 'bun']);

const PKG_MANAGERS = new Set(['npm', 'pnpm', 'yarn']);

/* `X=$(sha256sum foo | awk '{print $1}')` is one assignment, not a command
 * called `foo`. Blank the substitution out rather than tokenising its insides:
 * inventing a token from the middle of a capture is exactly the kind of quiet
 * mis-read this checker must not make. Steps built entirely out of shell like
 * that are picked up by the `exit 1` fallback in stepTokens instead. */
function blankSubstitutions(line) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '$' && line[i + 1] === '(') { depth++; i++; continue; }
    if (depth) { if (line[i] === ')') depth--; continue; }
    if (line[i] === '`') { const j = line.indexOf('`', i + 1); i = j === -1 ? line.length : j; continue; }
    out += line[i];
  }
  return out;
}

function shellCommands(text) {
  const out = [];
  for (const rawLine of String(text).split('\n')) {
    const line = blankSubstitutions(rawLine).trim();
    if (!line || line.startsWith('#')) continue;
    // Anything after `||` is a fallback, not a check. Splitting on `|` as well
    // would shred pipelines into nonsense tokens, so pipelines stay whole.
    const head = line.split('||')[0];
    for (const frag of head.split(/&&|;/)) {
      const f = frag.trim().replace(/\\$/, '').trim();
      if (f) out.push(f);
    }
  }
  return out;
}

function commandTokens(cmd, scripts, depth, seen) {
  let words = cmd.split(/\s+/).filter(Boolean);
  let assigned = false;
  while (words.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0])) { words.shift(); assigned = true; }
  // `FOO=bar` on its own is an assignment; `FOO=bar cmd` is a command with an
  // environment prefix. Only the second is a step that can fail.
  if (assigned && !words.length) return [];
  while (words.length && (words[0] === 'sudo' || words[0] === 'npx' || words[0] === '-y'
    || words[0] === '--yes' || words[0] === 'pnpm' && words[1] === 'exec')) {
    if (words[0] === 'pnpm') { words.splice(0, 2); continue; }
    words.shift();
  }
  if (!words.length) return [];
  let bin = words[0].replace(/^\.?\/?(node_modules\/\.bin\/|\.\/)/, '');
  if (bin.startsWith('-')) return [];

  if (PKG_MANAGERS.has(bin)) {
    let sub = words[1];
    if (sub === 'run' || sub === 'run-script') sub = words[2];
    else if (sub === 'test' || sub === 't') sub = 'test';
    else if (sub === 'ci' || sub === 'install' || sub === 'i' || sub === 'ls'
      || sub === 'audit' || sub === 'cache' || sub === 'exec' || sub === 'pkg') return [];
    if (!sub || sub.startsWith('-')) return [];
    const key = `npm:${sub}`;
    if (scripts[sub] && depth < 6 && !seen.has(key)) {
      seen.add(key);
      const inner = [];
      for (const c of shellCommands(scripts[sub])) inner.push(...commandTokens(c, scripts, depth + 1, seen));
      seen.delete(key);
      // An empty resolution (a script that only echoes) still counts as itself,
      // so a lab cannot lose a check by aliasing it to something unrecognised.
      return inner.length ? inner : [`npm run ${sub}`];
    }
    return [`npm run ${sub}`];
  }

  if (IGNORED_BINS.has(bin)) return [];
  if (SUBCOMMAND_BINS.has(bin)) {
    const arg = words.slice(1).find((w) => !w.startsWith('-'));
    if (bin === 'playwright' && arg === 'install') return [];
    return [arg ? `${bin} ${arg}` : bin];
  }
  if (bin === 'node' && words.includes('--test')) return ['node --test'];
  return [bin];
}

function stepTokens(step, scripts) {
  const out = [];
  if (typeof step.uses === 'string') {
    const name = actionName(step.uses);
    if (name && !name.startsWith('./') && !INFRA_USES.has(name)) out.push(`uses:${name}`);
  }
  if (typeof step.run === 'string') {
    const seen = new Set();
    for (const c of shellCommands(step.run)) out.push(...commandTokens(c, scripts, 0, seen));
    /* A hand-written shell check — kpqc compares the committed .wasm.sha256
     * against the built module — reduces to nothing but `if`, `echo` and
     * `exit 1`, all of which are ignored above, so it would vanish from both
     * sides and its absence would go unnoticed. An explicit non-zero exit is
     * what separates a step that is a gate from a step that is plumbing
     * (`touch dist/.nojekyll` has no failure path), so name it and count it. */
    if (!out.length && /\bexit\s+[1-9]/.test(step.run)) {
      const label = typeof step.name === 'string' && step.name.trim()
        ? step.name.trim() : shellCommands(step.run)[0] || 'shell';
      out.push(`step:${label}`);
    }
  }
  return out;
}

function jobTokens(job, scripts) {
  const out = new Set();
  for (const s of stepsOf(job)) for (const t of stepTokens(s, scripts)) out.add(t);
  return out;
}

/* ------------------------------------------------------------------ *
 * 4. Gate closures.
 * ------------------------------------------------------------------ */

/* Every job that must go green before `start` runs, plus `start` itself.
 * `needs:` is resolved only inside `file` — GitHub offers no way to need a job
 * in another workflow, which is the structural fact the whole incident turns on.
 * A job that is `uses: ./.github/workflows/x.yml` pulls x.yml's jobs in, because
 * that call genuinely runs them. */
function gateClosure(lab, file, startJob) {
  const tokens = new Set();
  const jobsSeen = [];
  const walk = (f, name, guard) => {
    const key = `${f}:${name}`;
    if (guard.has(key)) return;
    guard.add(key);
    const wf = lab.workflows.get(f);
    if (!wf) return;
    const job = jobsOf(wf)[name];
    if (!job) return;
    jobsSeen.push(key);
    for (const t of jobTokens(job, lab.scripts)) tokens.add(t);
    if (typeof job.uses === 'string' && job.uses.startsWith('./.github/workflows/')) {
      const called = path.basename(job.uses.split('@')[0]);
      if (lab.workflows.has(called)) {
        for (const n of Object.keys(jobsOf(lab.workflows.get(called)))) walk(called, n, guard);
      } else {
        tokens.add(`uses-workflow:${called}`);
      }
    }
    for (const n of asArray(job.needs)) if (typeof n === 'string') walk(f, n, guard);
  };
  walk(file, startJob, new Set());
  return { tokens, jobs: jobsSeen };
}

/* An auto-merge triggered `on: workflow_run: workflows: [X]` is gated by every
 * job of X, since it only starts once X concludes. Resolve X by its `name:`. */
function workflowRunGate(lab, file) {
  const wf = lab.workflows.get(file);
  const on = wf && wf.on;
  if (!on || typeof on !== 'object' || Array.isArray(on) || !on.workflow_run) return null;
  const wanted = asArray(on.workflow_run.workflows).map(String);
  const tokens = new Set();
  const sources = [];
  for (const [f, w] of lab.workflows) {
    const nm = typeof w.name === 'string' ? w.name : null;
    if (!nm || !wanted.includes(nm)) continue;
    sources.push(f);
    for (const n of Object.keys(jobsOf(w))) {
      const c = gateClosure(lab, f, n);
      for (const t of c.tokens) tokens.add(t);
    }
  }
  return { tokens, sources, wanted };
}

/* ------------------------------------------------------------------ *
 * 5. Per-lab analysis.
 * ------------------------------------------------------------------ */

const REF_SCOPED = /github\.(ref|ref_name|head_ref|sha)|github\.event\.(pull_request|number)/;

function effectivePermissions(wf, job) {
  const p = job && job.permissions !== undefined && job.permissions !== null ? job.permissions : wf.permissions;
  if (p === 'write-all') return { all: 'write' };
  if (p && typeof p === 'object' && !Array.isArray(p)) return p;
  return null;
}

function canActionsWrite(wf, job) {
  const p = effectivePermissions(wf, job);
  if (!p) return false;
  return p.all === 'write' || p.actions === 'write';
}

function findJobs(lab, predicate) {
  const out = [];
  for (const [file, wf] of lab.workflows) {
    for (const [name, job] of Object.entries(jobsOf(wf))) {
      if (job && typeof job === 'object' && predicate(job, wf, file, name)) out.push({ file, wf, name, job });
    }
  }
  return out;
}

function isDeployJob(job) {
  return stepsOf(job).some((s) => typeof s.uses === 'string'
    && PAGES_PUBLISHERS.has(actionName(s.uses)));
}

function isMergeJob(job) {
  return stepsOf(job).some((s) => (typeof s.uses === 'string'
      && actionName(s.uses) === 'dependabot/fetch-metadata')
    || (typeof s.run === 'string' && /\bgh pr merge\b/.test(s.run)));
}

const DISPATCH_RE = /\bgh\s+workflow\s+run\s+(["']?)([A-Za-z0-9_.\-/]+\.ya?ml)\1/g;

function dispatchesIn(job) {
  const out = [];
  let swallowed = false;
  for (const s of stepsOf(job)) {
    if (typeof s.run !== 'string') continue;
    const text = s.run.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
    let m;
    DISPATCH_RE.lastIndex = 0;
    while ((m = DISPATCH_RE.exec(text)) !== null) {
      out.push(path.basename(m[2]));
      const after = text.slice(m.index);
      if (/^[^\n]*(\\\s*\n[^\n]*)*\|\|/.test(after)) swallowed = true;
    }
  }
  return { targets: [...new Set(out)], swallowed };
}

function excludesPullRequests(cond) {
  if (typeof cond !== 'string') return false;
  return /event_name\s*!=\s*'pull_request'/.test(cond)
    || /event_name\s*==\s*'push'/.test(cond)
    || /github\.ref\s*==\s*'refs\/heads\/main'/.test(cond);
}

function analyse(repo, lab) {
  const findings = [];
  let softDispatch = false;
  const add = (level, code, detail) => findings.push({ level, code, detail });

  const deployJobs = findJobs(lab, isDeployJob);
  const mergeJobs = findJobs(lab, isMergeJob);
  if (!deployJobs.length && !mergeJobs.length) return { repo, skip: 'neither' };
  if (!deployJobs.length) return { repo, skip: 'no-deploy' };
  if (!mergeJobs.length) return { repo, skip: 'no-automerge' };

  /* Every deploy job's gate has to be cleared before the site ships, so a bump
   * must clear all of them: the union. Every auto-merge job is a separate route
   * a bump can take to main, so each is judged on its own. */
  const deployTokens = new Set();
  const deployWhere = [];
  for (const d of deployJobs) {
    const c = gateClosure(lab, d.file, d.name);
    for (const t of c.tokens) deployTokens.add(t);
    deployWhere.push(`${d.file}:${c.jobs.map((j) => j.split(':')[1]).join('+')}`);
  }

  for (const merge of mergeJobs) {
    /* --- the invariant ---------------------------------------------- */
    const mergeTokens = new Set(gateClosure(lab, merge.file, merge.name).tokens);
    const wrGate = workflowRunGate(lab, merge.file);
    if (wrGate) for (const t of wrGate.tokens) mergeTokens.add(t);
    const via = wrGate && wrGate.sources.length ? ` via workflow_run of ${wrGate.sources.join(', ')}` : '';

    const missing = [...deployTokens].filter((t) => !mergeTokens.has(t)).sort();
    const sameFile = deployJobs.some((d) => d.file === merge.file);

    if (missing.length) {
      add('fail', 'GATE-WEAKER', `deploy path ${deployWhere.join(' , ')} runs `
        + `${missing.map((t) => `\`${t}\``).join(', ')}; the auto-merge path `
        + `(${merge.file}:${merge.name}${via}) does not`);
    } else if (!sameFile && !wrGate) {
      add('warn', 'SPLIT-GATE', `${merge.file}:${merge.name} vs the deploy in ${deployJobs[0].file}`);
    }

    /* --- that job's own path ---------------------------------------- */
    if (!wrGate && !hasTrigger(merge.wf, 'pull_request')) {
      add('fail', 'NO-PR-GATE', `${merge.file} has no pull_request trigger and is not `
        + `workflow_run-driven, so ${merge.name} cannot run on a Dependabot PR`);
    }

    const { targets, swallowed } = dispatchesIn(merge.job);
    if (swallowed) softDispatch = true;
    if (!targets.length) {
      add('fail', 'DISPATCH-MISSING', `${merge.file}:${merge.name} merges but dispatches nothing — `
        + 'a merge made with GITHUB_TOKEN raises no push event, so the deploy never runs (§6.2)');
    } else {
      for (const t of targets) {
        if (!lab.workflows.has(t)) {
          add('fail', 'DISPATCH-404', `${merge.file}:${merge.name} dispatches \`${t}\`, which this `
            + `repo does not have (it has ${[...lab.workflows.keys()].join(', ')})`);
        } else if (!hasTrigger(lab.workflows.get(t), 'workflow_dispatch')) {
          add('fail', 'DISPATCH-INERT', `${merge.file}:${merge.name} dispatches \`${t}\`, which `
            + 'declares no workflow_dispatch: trigger — the call is rejected');
        } else if (!deployJobs.some((d) => d.file === t)) {
          add('warn', 'DISPATCH-ELSEWHERE', `dispatches \`${t}\`; the deploy is in `
            + `${deployJobs.map((d) => d.file).join(', ')}`);
        }
      }
      if (!canActionsWrite(merge.wf, merge.job)) {
        add('fail', 'DISPATCH-403', `${merge.file}:${merge.name} dispatches \`${targets.join(', ')}\` `
          + 'without `actions: write` — every call returns HTTP 403 and the job still goes green');
      }
    }
  }

  /* --- the deploy job's own gating ---------------------------------- */
  for (const d of deployJobs) {
    if (typeof d.job.if === 'string' && /event_name\s*==\s*'push'/.test(d.job.if)
      && !/workflow_dispatch/.test(d.job.if)) {
      add('fail', 'PUSH-GATED', `${d.file}:${d.name} is gated \`if: ${String(d.job.if).trim()}\` — `
        + 'that also skips workflow_dispatch, so the post-merge dispatch builds, passes the gate '
        + "and skips the deploy. Use `!= 'pull_request'`");
    }
    const own = jobTokens(d.job, lab.scripts);
    if (own.size && excludesPullRequests(d.job.if)) {
      add('fail', 'FUSED-GATE-OFF', `${d.file}:${d.name} both runs the gate `
        + `(${[...own].sort().map((t) => `\`${t}\``).join(', ')}) and deploys, and is gated `
        + `\`if: ${String(d.job.if).trim()}\` — so a pull request runs nothing at all. Split build from deploy`);
    }
    const conc = d.wf.concurrency;
    const group = conc && typeof conc === 'object' ? conc.group : null;
    const cancels = conc && typeof conc === 'object' && conc['cancel-in-progress'] === true;
    if (cancels && typeof group === 'string' && !REF_SCOPED.test(group)) {
      if (hasTrigger(d.wf, 'pull_request')) {
        add('fail', 'CONCURRENCY-PR', `${d.file} cancels in progress on the unscoped group `
          + `\`${group}\` and also triggers on pull_request — a PR run shares that group with `
          + 'main and cancels a live deploy. Key it on ${{ github.ref }}');
      } else {
        add('warn', 'CONCURRENCY-BARE', `${d.file}, group \`${group}\``);
      }
    }
  }

  return { repo, findings, swallowed: softDispatch && !findings.some((f) => f.level === 'fail') };
}

/* ------------------------------------------------------------------ *
 * 6. Report.
 * ------------------------------------------------------------------ */

/* Every repo slug a catalog card links to. Read for one purpose only: to tell a
 * lab that publishes nothing (crypto-lab-blind-oracle-api is a Rust service with
 * no page and no card) from a lab the catalog says has a live page whose
 * publisher this checker did not recognise. The first is a fair skip; the second
 * is the tool going blind, and that is a failure.
 *
 * Missing or unreadable index.html is a hard error rather than an empty set,
 * because an empty set silently switches DEPLOY-UNRECOGNISED off. */
function cardedSlugs() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const re = /https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\//g;
  const slugs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) slugs.add(m[1]);
  return slugs;
}

/* The one name filter every rule in this file inherits. It is a filter over
 * DIRECTORY NAMES under FLEET_ROOT, not over the catalog: a lab is examined only
 * if someone has cloned it here, under a directory whose name starts
 * crypto-lab / crypto-compare / crypto-counsel, containing .github/workflows.
 * unseenCarded() below is the accounting for everything that misses. */
const LAB_DIR_RE = /^crypto-(lab|compare|counsel)/;

function siblingLabs() {
  return fs.readdirSync(FLEET_ROOT).sort()
    .filter((d) => LAB_DIR_RE.test(d))
    .filter((d) => fs.existsSync(path.join(FLEET_ROOT, d, '.github', 'workflows')));
}

/* Carded labs that siblingLabs() never returned, with the reason each one missed.
 *
 * This is the fourth, unstated condition on DEPLOY-UNRECOGNISED made countable.
 * That rule reads as "a carded lab whose publisher I cannot see", and it is not:
 * it is "a carded lab whose publisher I cannot see, AMONG THE ONES CLONED HERE".
 * A carded lab with no clone is not judged clean and not judged dirty — it is
 * never opened, and nothing anywhere in this output said so.
 *
 * The reasons are distinct and worth telling apart: an uncloned lab is a machine
 * fact, a lab cloned under a name outside LAB_DIR_RE is a naming fact (snow2 and
 * crypto-compare are carded without the crypto-lab- prefix), and a clone with no
 * .github/workflows is a repo fact. All three end the same way — every rule above
 * is silent about that lab — so all three are counted here. */
function unseenCarded(carded, repos) {
  const seen = new Set(repos);
  const out = [];
  for (const slug of [...carded].sort()) {
    if (seen.has(slug)) continue;
    const dir = path.join(FLEET_ROOT, slug);
    let why;
    if (!fs.existsSync(dir)) why = `no clone at ${dir}`;
    else if (!LAB_DIR_RE.test(slug)) why = `cloned at ${dir}, but the name is outside ${LAB_DIR_RE}`;
    else why = `cloned at ${dir}, but it has no .github/workflows directory`;
    out.push({ slug, why });
  }
  return out;
}

const ORDER = ['DEPLOY-UNRECOGNISED', 'GATE-WEAKER', 'PUSH-GATED', 'FUSED-GATE-OFF', 'NO-PR-GATE', 'DISPATCH-MISSING',
  'DISPATCH-404', 'DISPATCH-INERT', 'DISPATCH-403', 'CONCURRENCY-PR',
  'SPLIT-GATE', 'CONCURRENCY-BARE', 'DISPATCH-ELSEWHERE'];

function main() {
  const check = process.argv[2] === 'check';
  const repos = siblingLabs();
  const carded = cardedSlugs();

  const rows = [];
  const unparsed = [];
  const skipped = { 'no-automerge': [], 'no-deploy': [], neither: [] };

  for (const repo of repos) {
    const lab = loadLab(path.join(FLEET_ROOT, repo));
    if (!lab) { skipped.neither.push(repo); continue; }
    if (lab.unparsed) { unparsed.push({ repo, detail: lab.unparsed }); continue; }
    const r = analyse(repo, lab);
    if (r.skip === 'no-deploy' && carded.has(repo)) {
      rows.push({ repo, findings: [{ level: 'fail', code: 'DEPLOY-UNRECOGNISED',
        detail: `the catalog cards a live page at https://systemslibrarian.github.io/${repo}/ `
          + 'and this lab auto-merges, but no job uses a publisher this checker knows '
          + `(case-insensitively: ${[...PAGES_PUBLISHERS].join(', ')}) `
          + '— so every rule above is skipped for it' }],
      swallowed: false });
      continue;
    }
    if (r.skip) { skipped[r.skip].push(repo); continue; }
    rows.push(r);
  }

  const byCode = new Map();
  for (const r of rows) {
    for (const f of r.findings) {
      if (!byCode.has(f.code)) byCode.set(f.code, []);
      byCode.get(f.code).push({ repo: r.repo, detail: f.detail, level: f.level });
    }
  }
  const swallowedCount = rows.filter((r) => r.swallowed).length;
  const failing = new Set(rows.filter((r) => r.findings.some((f) => f.level === 'fail')).map((r) => r.repo));
  const warning = new Set(rows.filter((r) => r.findings.some((f) => f.level === 'warn')
    && !failing.has(r.repo)).map((r) => r.repo));

  console.log(`Labs gated by both a Pages deploy and a Dependabot auto-merge: ${rows.length}`);
  console.log(`  ${rows.length - failing.size - warning.size} clean, ${failing.size} failing, `
    + `${warning.size} warning only`);
  console.log(`Skipped, not violations: ${skipped['no-automerge'].length} with no auto-merge job, `
    + `${skipped['no-deploy'].length} with no Pages deploy, ${skipped.neither.length} with neither`);
  /* Name them. The count on its own is where this checker hid two labs it could
   * not see: "3 with no Pages deploy" reads as a clean line either way. */
  for (const [why, list] of Object.entries(skipped)) {
    if (list.length) console.log(`  ${why}: ${list.join(', ')}`);
  }

  /* Printed on every run, zero or not, and never abbreviated away. Reported
   * rather than failed: this counts what is absent from THIS machine, so failing
   * on it would turn a catalog-only checkout — or a CI job that clones one repo —
   * into 194 red lines about nothing the commit did. A rising number is the
   * signal; that only reads as rising if the zero is printed too. */
  const unseen = unseenCarded(carded, repos);
  console.log(`Carded labs this checker never opened: ${unseen.length} of ${carded.size} `
    + `(reported, never failed — every rule below is silent about each one)`);
  for (const u of unseen) console.log(`  ${u.slug}  —  ${u.why}`);

  if (unparsed.length) console.log(`Unparsed: ${unparsed.length}`);

  const codes = [...byCode.keys()].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const headline = {
    'DEPLOY-UNRECOGNISED': 'A CARDED LAB WHOSE PAGES PUBLISHER THIS CHECKER CANNOT SEE',
    'GATE-WEAKER': 'THE GATE A BUMP MERGES AGAINST IS NOT THE GATE THE DEPLOY RUNS',
    'PUSH-GATED': 'DEPLOY GATED ON == \'push\', WHICH ALSO SKIPS workflow_dispatch',
    'FUSED-GATE-OFF': 'FUSED BUILD-AND-DEPLOY GATED OFF FOR PULL REQUESTS — THE GATE IS THE CASUALTY',
    'NO-PR-GATE': 'THE AUTO-MERGE GATE CANNOT RUN ON A DEPENDABOT PR',
    'DISPATCH-MISSING': 'AUTO-MERGE WITH NO POST-MERGE DISPATCH',
    'DISPATCH-404': 'DISPATCH NAMES A WORKFLOW FILE THAT DOES NOT EXIST HERE',
    'DISPATCH-INERT': 'DISPATCH TARGET DECLARES NO workflow_dispatch TRIGGER',
    'DISPATCH-403': 'DISPATCH WITHOUT actions: write — 403s SILENTLY',
    'CONCURRENCY-PR': 'A PR RUN CAN CANCEL A LIVE MAIN DEPLOY',
    'SPLIT-GATE': 'Two copies of one gate, equal today',
    'CONCURRENCY-BARE': 'Unscoped cancel-in-progress group, latent',
    'DISPATCH-ELSEWHERE': 'Dispatch target holds no deploy job',
  };

  /* Warnings say the same sentence about every lab they name, so say it once and
   * then list. Failures each carry their own specifics and get their own line. */
  const WARN_WHY = {
    'SPLIT-GATE': ['The two gates run the same checks today. `needs:` cannot cross files, so nothing',
      'holds them equal — two copies drifting apart is the whole e91 story. One workflow ends it.'],
    'CONCURRENCY-BARE': ['A bare group with cancel-in-progress is safe only while the workflow has no',
      'pull_request trigger. Fixing GATE-WEAKER adds exactly that trigger, so fix both together.'],
    'DISPATCH-ELSEWHERE': ['The dispatched workflow exists and accepts a dispatch, but the deploy is not in it.'],
  };

  for (const code of codes) {
    const hits = byCode.get(code);
    const warn = hits[0].level === 'warn';
    console.log(`\n${headline[code] || code} (${hits.length})${warn ? ' — warning' : ''}:`);
    if (warn) {
      for (const line of WARN_WHY[code] || []) console.log(`  ${line}`);
      for (const h of hits) console.log(`    ${h.repo}  —  ${h.detail}`);
    } else {
      for (const h of hits) console.log(`  ${h.repo}\n      ${h.detail}`);
    }
  }

  if (unparsed.length) {
    console.log(`\nCOULD NOT READ (${unparsed.length}) — reported as a failure rather than skipped,`);
    console.log('because a checker that cannot read a file cannot call it clean:');
    for (const u of unparsed) console.log(`  ${u.repo}\n      ${u.detail}`);
  }

  if (swallowedCount) {
    console.log(`\n${swallowedCount} otherwise-clean lab${swallowedCount === 1 ? '' : 's'} `
      + 'end the dispatch in `|| echo "::warning::"`, so it cannot');
    console.log('fail its job. That is deliberate in §6.2 and true of the reference lab; it is only');
    console.log('dangerous beside a 403, a 404 or an inert target, and those three fail above.');
  }

  const failed = failing.size + unparsed.length;
  if (!failed) {
    /* Qualified by the count above rather than stated flat, because "every
     * auto-merge" is exactly the sentence the fourth condition makes false. */
    console.log(`\nEvery auto-merge clears the same gate its deploy depends on — across the ${rows.length}`);
    console.log(`labs cloned under ${FLEET_ROOT}. ${unseen.length} carded lab${unseen.length === 1 ? ' was' : 's were'} `
      + 'not opened at all (above).');
  } else {
    console.log('\nFix by giving each lab ONE workflow with ONE gate job that both `deploy` and');
    console.log('`dependabot-auto-merge` name in `needs:`. crypto-lab-e91/.github/workflows/deploy.yml');
    console.log('is the reference shape; audits/_MASTER-TEMPLATE.md §6.1-6.2 is the contract.');
  }
  return check && failed ? 1 : 0;
}

process.exit(main());
