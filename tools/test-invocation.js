#!/usr/bin/env node
/*
 * test-invocation.js — find test files no workflow ever runs.
 *
 * Run: node tools/test-invocation.js
 * Prevents: a lab carrying a full test suite that CI never executes, which reads as clean everywhere because nothing reports a test that was never attempted
 * Reads: .scratch/<lab>/ exports of remote default branches — workflows, every package.json, playwright.config, in-repo harness JS
 *
 * A DIFFERENT QUESTION FROM THE ZERO-TEST SWEEP. That one reads runs that
 * happened and asks whether any reported nothing. This one asks whether the run
 * happens at all. A suite with no caller produces no run, so it produces no zero
 * either: issue #4's sweep sees nothing to report, every file-comparing checker
 * stays green, and the lab looks tested because the tests are right there in the
 * repository. crypto-lab-bitcoin-script is the case that prompted it — five
 * vitest suites, four of them carrying the script engine's reject-path
 * assertions, and no workflow in the repository runs `npm test`.
 *
 * HOW IT DECIDES
 *
 * Test files are grouped by the runner that would execute them, and a group is
 * reported only when files of that kind exist AND no workflow invokes a runner
 * that could run them:
 *
 *   unit     *.test.* / *.spec.* outside e2e     vitest, jest, node --test, mocha, ava, tap
 *   browser  anything under e2e/ or a           playwright test, cypress run
 *            playwright config's testDir
 *   rust     tests/*.rs, or #[test] in src      cargo test
 *   python   test_*.py, *_test.py               pytest, unittest
 *
 * Workflow commands are read with YAML COMMENTS STRIPPED, because a comment
 * naming a runner does not run it — the same lesson tools-sync carries for the
 * cadence table and depth-audit for its deploy gate.
 *
 * `npm test` and `npm run X` are RESOLVED through package.json, transitively, so
 * a lab whose CI runs `npm run ci` and whose `ci` script chains `lint && vitest`
 * is correctly read as running its unit tests. Local reusable workflows
 * (`uses: ./.github/workflows/x.yml`) are followed for the same reason.
 *
 * WHAT IT REFUSES TO CALL
 *
 * Any lab where the chain leaves this tool's sight is UNDETERMINED, never
 * "clean" and never a finding: a script that shells out to something opaque
 * (`make`, a bash file, a composite action), a `npm run` naming a script
 * package.json does not define, a workflow that will not parse, or a repository
 * with no workflows at all. A checker that cannot see must not report either
 * verdict — the rule this fleet keeps re-learning.
 *
 * WHAT A CLEAN RESULT DOES NOT ESTABLISH
 *
 * That every test file reaches a runner. This asks whether a runner is invoked
 * at all; it does not open that runner's own configuration afterwards. A
 * Playwright project scoped by `testMatch`, or a `testIgnore`, can still exclude
 * a spec the runner was told to run, and this tool would report the lab as
 * having a caller for that kind of test — which it does. A lab absent from the
 * findings has a caller for each kind of test it carries, and nothing stronger.
 *
 * That limit is named rather than chased. Following config scoping means reading
 * each runner's resolution rules, and a half-done version of it would produce
 * confident wrong answers where this produces a stated boundary.
 *
 * AND CHECK THE LABS THAT DO NOT APPEAR. A near-empty result here is a claim
 * about every lab in the fleet. crypto-lab-padding-oracle is the reason: it
 * resolves only because this tool follows a harness one hop, and that harness
 * exists because `node --test` once exited 0 having loaded nothing — the lab
 * that had already fixed this class was the one the detector could not see.
 *
 * Usage (from the repo root):
 *   node tools/test-invocation.js            report
 *   node tools/test-invocation.js --json     machine-readable
 *   node tools/test-invocation.js --issue    markdown for an issue body
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCRATCH = path.join(ROOT, '.scratch');

const SKIP = /(^|\/)(node_modules|dist|build|\.git|target|pkg|coverage|test-results|playwright-report|\.vite)(\/|$)/;
const VENDORED = /(^|\/)(vendor|vendored|third[-_]party)(\/|$)|\.min\.[tj]sx?$/;

const RUNNERS = {
  /* `node --test` takes flags before it. Several labs run
     `node --import tsx --test` over a glob, and a pattern demanding `node`
     immediately followed by `--test` matched none of them - which reported four
     labs, two of them taught in a module, as never running suites their CI runs
     on every push. Allow anything between the two. */
  unit: /\bvitest\b|\bjest\b|\bnode\b[^\n]*\s--test\b|\bmocha\b|\bava\b|\btap\b(?!e)|\bnode:test\b/,
  browser: /playwright\s+test\b|\bcypress\s+run\b|\bwdio\b/,
  rust: /cargo\s+test\b|cargo\s+nextest\b/,
  python: /\bpytest\b|python[0-9.]*\s+-m\s+unittest\b/,
};

/* Commands whose effect this tool cannot see. Their presence makes a lab
   undetermined rather than clean. */
/* A runner this tool cannot read. `node scripts/test.mjs` is a hand-written
   harness whose contents decide what runs; guessing either way about it would be
   a verdict about a file never opened, so the lab is undetermined instead. */
const OPAQUE = /\bmake\b|\bbash\s+\S+\.sh|\bsh\s+\S+\.sh|\.\/\S+\.sh|\bjust\b\s|\btask\b\s|\bnx\b\s|\bturbo\b\s|\bnode\s+(?!--)[\w./-]+\.[cm]?js\b/;

function walk(dir, out = [], base = dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    const rel = path.relative(base, p);
    if (SKIP.test(rel)) continue;
    if (e.isDirectory()) walk(p, out, base);
    else out.push(rel);
  }
  return out;
}

const read = (lab, rel) => {
  try { return fs.readFileSync(path.join(SCRATCH, lab, rel), 'utf8'); } catch { return null; }
};

/** Executable lines of a workflow: comments stripped, block scalars kept. */
function commandsOf(text) {
  return text.split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');
}

/** Resolve `npm test` / `npm run X` through package.json, transitively. */
function resolveScripts(cmdText, scripts, seen = new Set()) {
  let out = cmdText;
  let changed = true;
  let rounds = 0;
  const unresolved = [];
  while (changed && rounds < 6) {
    changed = false;
    rounds += 1;
    const names = [...out.matchAll(/\bnpm\s+(?:run\s+([\w:.-]+)|(test)\b)|\byarn\s+([\w:.-]+)|\bpnpm\s+(?:run\s+)?([\w:.-]+)/g)]
      .map((m) => m[1] || m[2] || m[3] || m[4]).filter(Boolean);
    for (const n of names) {
      if (seen.has(n)) continue;
      seen.add(n);
      if (scripts && typeof scripts[n] === 'string') { out += `\n${scripts[n]}`; changed = true; }
      else if (n !== 'ci' && n !== 'install') unresolved.push(n);
    }
  }
  return { text: out, unresolved };
}

function classify(lab) {
  const files = walk(path.join(SCRATCH, lab)).filter((f) => !VENDORED.test(f));
  const wf = files.filter((f) => /^\.github\/workflows\/.+\.ya?ml$/.test(f));

  /* ---- what tests exist ---- */
  /* A browser test is whatever the PLAYWRIGHT CONFIG says it is, not whatever
     sits in a directory called e2e. crypto-lab-lll-break sets testDir './tests'
     and crypto-lab-shadow-vault './tests/browser'; reading those as unit suites
     reported two labs as never running tests that playwright runs on every
     push. The config is the caller, so the config decides. */
  const pwDirs = files.filter((f) => /playwright\.config\.[tj]s$/.test(f)).flatMap((f) => {
    const t = read(lab, f) || '';
    return [...t.matchAll(/testDir\s*:\s*['"`]\.?\/?([^'"`]+)['"`]/g)]
      .map((m) => path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1])).replace(/^\.\//, ''));
  });
  const isE2E = (f) => /(^|\/)e2e(\/|$)/.test(f)
    || pwDirs.some((d) => f === d || f.startsWith(`${d}/`));
  const present = {
    unit: files.filter((f) => /\.(test|spec)\.[tj]sx?$/.test(f) && !isE2E(f)),
    browser: files.filter((f) => isE2E(f) && /\.[tj]sx?$/.test(f)),
    rust: files.filter((f) => /(^|\/)tests\/.+\.rs$/.test(f))
      .concat(files.filter((f) => /\.rs$/.test(f) && /#\[test\]|#\[cfg\(test\)\]/.test(read(lab, f) || ''))),
    python: files.filter((f) => /(^|\/)test_.+\.py$|_test\.py$/.test(f)),
  };
  for (const k of Object.keys(present)) present[k] = [...new Set(present[k])];

  /* ---- what the workflows run ---- */
  /* Scripts from EVERY package.json in the lab, not just the root one. The older
     labs keep theirs under demos/<slug>/ and their workflows cd into it, so a
     root-only read resolved nothing and reported the lab as undetermined for a
     `npm run test` that is defined one directory down. */
  const scripts = {};
  for (const f of files.filter((x) => /(^|\/)package\.json$/.test(x))) {
    let pkg = null;
    try { pkg = JSON.parse(read(lab, f) || 'null'); } catch { pkg = null; }
    if (pkg && pkg.scripts) for (const [k, v] of Object.entries(pkg.scripts)) if (!(k in scripts)) scripts[k] = v;
  }

  let all = '';
  const unresolved = [];
  const seenWf = new Set();
  const queue = [...wf];
  while (queue.length) {
    const f = queue.shift();
    if (seenWf.has(f)) continue;
    seenWf.add(f);
    const text = read(lab, f);
    if (text === null) continue;
    const cmds = commandsOf(text);
    /* Follow local reusable workflows: a gate reached through one is still run. */
    for (const m of cmds.matchAll(/uses:\s*\.\/(\.github\/workflows\/[\w.-]+\.ya?ml)/g)) queue.push(m[1]);
    const r = resolveScripts(cmds, scripts);
    all += `\n${r.text}`;
    unresolved.push(...r.unresolved);
    /* Follow a hand-written harness one hop when it is IN the repository. Reading
       it is strictly better than declaring the lab unreadable:
       crypto-lab-padding-oracle's scripts/test.mjs drives node:test's own runner
       over src/**, and its header says it exists because `node --test` once
       exited 0 having loaded nothing. The lab that already fixed this class was
       the one this tool could not see. */
    for (const m of r.text.matchAll(/\bnode\s+(?!--)([\w./-]+\.[cm]?js)\b/g)) {
      const body = read(lab, m[1]);
      if (body !== null) all += `\n${body}`;
    }
  }

  const invoked = {};
  for (const [k, re] of Object.entries(RUNNERS)) invoked[k] = re.test(all);
  /* A command can invoke a suite by NAMING it, without using a runner this tool
     recognises: crypto-lab-jevil's test script is `tsx scripts/core.test.ts`.
     Matching runner names alone would report that file as never run while CI
     runs exactly it. A category counts as invoked when a command names one of
     its files, whatever the runner is called. */
  for (const [k, list] of Object.entries(present)) {
    if (invoked[k] || !list.length) continue;
    if (list.some((f) => all.includes(f) || all.includes(path.posix.basename(f)))) invoked[k] = true;
  }

  /* ---- verdict ---- */
  const uninvoked = Object.keys(present).filter((k) => present[k].length && !invoked[k]);

  /* A reason only matters when there is something for it to explain. An opaque
     command is not a problem in a lab whose every suite already has a runner -
     `node scripts/bundle-budget.mjs` is a size check, not a hidden test caller -
     and treating it as one made most of the fleet undetermined for reasons that
     had no bearing on the question. Reasons are weighed only against a gap. */
  const reasons = [];
  if (uninvoked.length) {
    if (!wf.length) reasons.push('no workflows in the repository');
    if (unresolved.length) reasons.push(`CI runs ${[...new Set(unresolved)].map((s) => `\`npm run ${s}\``).join(', ')}, which no package.json here defines`);
    const m = OPAQUE.exec(all);
    if (m) reasons.push(`CI runs \`${m[0].trim()}\`, a harness this tool cannot read, which could be running them`);
  }
  const determined = reasons.length === 0;
  return {
    lab,
    present: Object.fromEntries(Object.entries(present).map(([k, v]) => [k, v.length])),
    samples: Object.fromEntries(Object.entries(present).map(([k, v]) => [k, v.slice(0, 3)])),
    invoked,
    uninvoked,
    determined,
    reasons,
  };
}

function labs() {
  try {
    return [...require('./depth-exports.js').readExports(SCRATCH).keys()].sort();
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}

/** Labs a teach module names, so the report can lead with them. */
function moduleLabs() {
  const dir = path.join(ROOT, 'teach', '_src');
  const found = new Set();
  if (!fs.existsSync(dir)) return found;
  /* Module JSONs name an exhibit by its repo name MINUS the prefix, so a search
     for "crypto-lab-*" in those files finds almost nothing and the report loses
     the ordering it was asked for. */
  for (const f of walk(dir).filter((x) => x.startsWith('modules/') && x.endsWith('.json'))) {
    let mod = null;
    try { mod = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    for (const x of (mod.exhibits || [])) if (x && x.name) found.add(`crypto-lab-${x.name}`);
  }
  return found;
}

function main() {
  const rows = labs().map(classify);
  const mods = moduleLabs();
  const findings = rows.filter((r) => r.determined && r.uninvoked.length);
  const undetermined = rows.filter((r) => !r.determined);
  const order = (a, b) => (mods.has(b.lab) ? 1 : 0) - (mods.has(a.lab) ? 1 : 0) || a.lab.localeCompare(b.lab);
  findings.sort(order);

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ findings, undetermined, checked: rows.length }, null, 2));
    return;
  }

  const KIND = { unit: 'unit', browser: 'browser', rust: 'Rust', python: 'Python' };
  if (process.argv.includes('--issue')) {
    const L = [];
    L.push('| Lab | In a module | Test files present that nothing runs | Runners the workflows do invoke |');
    L.push('|---|---|---|---|');
    for (const r of findings) {
      const which = r.uninvoked.map((k) => `${KIND[k]} (${r.present[k]})`).join(', ');
      const inv = Object.entries(r.invoked).filter(([, v]) => v).map(([k]) => KIND[k]).join(', ') || 'none';
      L.push(`| [${r.lab.replace('crypto-lab-', '')}](https://github.com/systemslibrarian/${r.lab}) | ${mods.has(r.lab) ? 'yes' : 'no'} | ${which} | ${inv} |`);
    }
    L.push('');
    L.push('| Lab | Why this tool could not decide |');
    L.push('|---|---|');
    for (const r of undetermined.sort((a, b) => a.lab.localeCompare(b.lab))) {
      L.push(`| ${r.lab.replace('crypto-lab-', '')} | ${r.reasons.join('; ')} |`);
    }
    console.log(L.join('\n'));
    return;
  }

  console.log(`Read ${rows.length} exported default branches.\n`);
  console.log(`Labs with test files no workflow runs: ${findings.length}`);
  for (const r of findings) {
    console.log(`  ${mods.has(r.lab) ? '[module] ' : '         '}${r.lab.replace('crypto-lab-', '').padEnd(26)}`
      + r.uninvoked.map((k) => `${KIND[k]}:${r.present[k]}`).join(' ')
      + `   (runs: ${Object.entries(r.invoked).filter(([, v]) => v).map(([k]) => k).join(',') || 'nothing'})`);
    for (const k of r.uninvoked) console.log(`             e.g. ${r.samples[k][0]}`);
  }
  console.log(`\nCould not determine: ${undetermined.length}`);
  for (const r of undetermined) console.log(`  ${r.lab.replace('crypto-lab-', '').padEnd(26)} ${r.reasons.join('; ')}`);
}

main();
