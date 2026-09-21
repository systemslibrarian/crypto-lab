#!/usr/bin/env node
/*
 * port-sync.js — one Playwright port per lab, pinned, and --strictPort kept.
 *
 * Two labs sharing a port is not a style problem. Playwright's default
 * `reuseExistingServer: !process.env.CI` means a local run that finds something
 * already listening on its port will USE it rather than start its own. So when
 * two labs collide:
 *
 *   - a test can pass against a server serving a DIFFERENT LAB entirely, and
 *   - during mutation testing a test can pass against an UNMUTATED checkout
 *     still running from a previous run — a false survivor, which reads as
 *     "the mutation was not caught" and sends someone to fix a check that works.
 *
 * That second one is why this checker exists. The fleet's §4.1c discipline is
 * built on mutations that must go red, and a shared port can make a real kill
 * look like a survivor or a survivor look like a kill. The evidence is only as
 * trustworthy as the port assignment underneath it.
 *
 * `--strictPort` is the other half: without it Playwright silently increments to
 * the next free port, so a collision stops being visible at all and the config
 * stops describing what actually ran.
 *
 * The registry is tools/playwright-ports.json, pinned the way --accent values
 * are pinned centrally: a new lab takes the next free port and records it here,
 * rather than picking one and discovering the clash later.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/port-sync.js          Report; also rewrites the registry from
 *                                    what the fleet actually uses.
 *   node tools/port-sync.js check    Report; exit 1 on a collision, a port that
 *                                    disagrees with the registry, or a missing
 *                                    --strictPort.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const FLEET_ROOT = path.join(__dirname, '..', '..');
const REGISTRY = path.join(__dirname, 'playwright-ports.json');
const LAB_RE = /^crypto-(lab|compare|counsel)/;

/* The first port-shaped number in the config. Configs write it either as
 * `const port = 4667` or straight into a `localhost:4667` baseURL; both forms
 * are the same fact, so read whichever appears first rather than guessing which
 * one a given lab used. */
function portOf(text) {
  const m = text.match(/(?:\bport\s*[=:]\s*|localhost:|127\.0\.0\.1:)(\d{4})/i);
  return m ? Number(m[1]) : null;
}

function scan() {
  const labs = [];
  for (const dir of fs.readdirSync(FLEET_ROOT).filter((d) => LAB_RE.test(d))) {
    const cfg = path.join(FLEET_ROOT, dir, 'playwright.config.ts');
    if (!fs.existsSync(cfg)) continue;
    const text = fs.readFileSync(cfg, 'utf8');
    labs.push({ lab: dir, port: portOf(text), strict: /strictPort/.test(text) });
  }
  return labs.sort((a, b) => (a.port || 0) - (b.port || 0));
}

function main() {
  const check = process.argv[2] === 'check';
  const labs = scan();
  const problems = [];

  const byPort = {};
  for (const l of labs) {
    if (l.port === null) { problems.push(`${l.lab} — playwright.config.ts names no port`); continue; }
    (byPort[l.port] = byPort[l.port] || []).push(l.lab);
  }

  const collisions = Object.entries(byPort).filter(([, v]) => v.length > 1);
  const unstrict = labs.filter((l) => !l.strict);

  let registry = [];
  if (fs.existsSync(REGISTRY)) {
    try { registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); }
    catch (e) { problems.push(`${path.relative(FLEET_ROOT, REGISTRY)} does not parse: ${e.message}`); }
  }
  const pinned = new Map(registry.map((r) => [r.lab, r.port]));
  const drifted = labs.filter((l) => pinned.has(l.lab) && pinned.get(l.lab) !== l.port);
  const unpinned = labs.filter((l) => !pinned.has(l.lab));

  console.log(`Labs with a Playwright config: ${labs.length} | distinct ports: ${Object.keys(byPort).length}`);

  if (collisions.length) {
    console.log(`\nTWO LABS ON ONE PORT (${collisions.length}) — a run can hit the wrong lab's server,`);
    console.log('or an unmutated checkout still listening from a previous run:');
    for (const [p, v] of collisions) console.log(`  ${p}  ${v.join(', ')}`);
  }
  if (unstrict.length) {
    console.log(`\nNO --strictPort (${unstrict.length}) — Playwright will silently take the next free`);
    console.log('port, so a collision stops being visible and the config stops describing the run:');
    for (const l of unstrict) console.log(`  ${l.lab}`);
  }
  if (drifted.length) {
    console.log(`\nPORT DISAGREES WITH THE REGISTRY (${drifted.length}):`);
    for (const l of drifted) console.log(`  ${l.lab}  config ${l.port}, registry ${pinned.get(l.lab)}`);
  }
  if (unpinned.length && check) {
    console.log(`\nNOT IN THE REGISTRY (${unpinned.length}) — pin it with \`node tools/port-sync.js\`:`);
    for (const l of unpinned) console.log(`  ${l.lab}  ${l.port}`);
  }
  for (const p of problems) console.log(`\n${p}`);

  const failed = collisions.length + unstrict.length + drifted.length + problems.length
    + (check ? unpinned.length : 0);

  if (!check) {
    const next = labs.filter((l) => l.port !== null).map((l) => ({ port: l.port, lab: l.lab }));
    fs.writeFileSync(REGISTRY, JSON.stringify(next, null, 1) + '\n');
    const used = new Set(next.map((r) => r.port));
    let free = 4200; while (used.has(free)) free++;
    console.log(`\nRegistry rewritten: ${next.length} labs. Next free port: ${free}.`);
  } else if (!failed) {
    console.log('\nEvery lab has its own port, pinned, with --strictPort.');
  }

  if (check && failed) process.exit(1);
}

main();
