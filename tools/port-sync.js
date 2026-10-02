#!/usr/bin/env node
/*
 * port-sync.js — one Playwright port per lab, pinned, and --strictPort kept.
 *
 * Run: node tools/port-sync.js check
 * Prevents: two labs sharing a Playwright port, where a local run silently tests whatever is already listening
 * Reads: playwright.config.ts in each sibling clone under ../crypto-lab-<slug>, and tools/playwright-ports.json
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
 *                                    disagrees with the registry, a missing
 *                                    --strictPort, a webServer command whose
 *                                    port is not the one the config polls, or a
 *                                    command port with no URL at all.
 *   node tools/port-sync.js selftest Offline: the two consistency rules against
 *                                    tools/fixtures/ports.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const {
  siblingLabs, siblingLabs: siblingLabsForFloor, excludedLine, fleetUnreadLine, fleetUnread, pinnedCloneCount,
} = require('./sibling-labs');

const FLEET_ROOT = path.join(__dirname, '..', '..');
const REGISTRY = path.join(__dirname, 'playwright-ports.json');

/* The first port-shaped number in the config. Configs write it either as
 * `const port = 4667` or straight into a `localhost:4667` baseURL; both forms
 * are the same fact, so read whichever appears first rather than guessing which
 * one a given lab used. */
function portOf(text) {
  const c = portConstantOf(text);
  if (c) return c.port;
  const m = text.match(/(?:\bport\s*[=:]\s*|localhost:|127\.0\.0\.1:)(\d{4})/i);
  return m ? Number(m[1]) : null;
}

/* A config names its port in two independent places and they have to agree:
 * the URL Playwright POLLS (baseURL, webServer.url) and the `--port` the
 * webServer COMMAND hands the preview server. Reading only the first
 * port-shaped number cannot see them disagree, and on 2026-09-29 three labs
 * disagreed: "Give this lab its own Playwright port" moved baseURL and
 * webServer.url to a new port and left the command starting the server on the
 * old one. Playwright launched a server on one port, polled another, waited out
 * its 180s webServer timeout and failed before a single browser test ran:
 *
 *   Error: Timed out waiting 180000ms from config.webServer.
 *
 * The deploy gate runs that suite, so the build job failed, the deploy job was
 * skipped, and three live sites served a build older than main for eight days.
 * Two of the three failed in a step called "Accessibility gate", which is the
 * reason this is a checker and not a habit: the symptom names the wrong subject.
 *
 * Both loopback spellings count. crypto-lab-ssh-handshake writes 127.0.0.1
 * rather than localhost and is perfectly consistent; a sweep that matched only
 * `localhost:` reported it as a finding on the strength of having bound its
 * host explicitly. */
/* A config may hoist its port into a named constant and interpolate it, which is
 * the BETTER pattern -- one literal, used in baseURL, the webServer command and
 * the url it polls, so those three cannot drift apart. Nine labs do it:
 *
 *   const PORT = Number(process.env.E2E_PORT ?? 4677);
 *   const PORT = process.env.PREVIEW_PORT ?? '4224';
 *   const PORT = Number(process.env.A11Y_PORT) || 4253;
 *
 * Reading only literals reported every one of them as "names no port", and that
 * is this repository's recurring shape in its purest form: the labs that solved
 * the problem most carefully were the ones the detector could not see. Worse
 * than noise -- the nine hidden ports contained three REAL collisions
 * (ibe-gate 4677 against pulse-chain and return-path, j-uniward 4607 against
 * sm2-forge, harvest-vault 4679 against point-ledger) which stayed invisible for
 * as long as the reader did, and assigning "free" ports without reading them
 * would have created more.
 *
 * So resolve the constant first and substitute it into the template positions.
 * The env override is deliberately IGNORED: it is a local escape hatch, and the
 * committed default is the thing the fleet has to keep unique. */
function portConstantOf(text) {
  const m = /\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*[^;\n]*?(\d{4})[^;\n]*/i.exec(text);
  return m ? { name: m[1], port: Number(m[2]) } : null;
}

/* Template interpolations of that constant, as the port it resolves to. */
function resolved(text) {
  const c = portConstantOf(text);
  if (!c) return text;
  return text.replace(new RegExp('\\$\\{' + c.name + '\\}', 'g'), String(c.port));
}

function urlPortsOf(text) {
  return [...resolved(text).matchAll(/(?:localhost|127\.0\.0\.1):(\d{4})/gi)].map((m) => Number(m[1]));
}

function commandPortsOf(text) {
  return [...resolved(text).matchAll(/--port[\s=]+(\d{4})/g)].map((m) => Number(m[1]));
}

/* A linked git worktree of a LAB is the case that bites here, and it is created
 * by following CLAUDE.md's own instruction inside a lab repo: the worktree holds
 * that lab's playwright.config.ts, with that lab's port, so this checker read it
 * as a second lab and reported `4357 crypto-lab-lane-porttest,
 * crypto-lab-schnorr-forge` — a lab colliding with itself. Proven both ways on
 * 2026-10-02: with the worktree the denominator was 205 and the collision count
 * 10, without it 204 and 9. sibling-labs.js excludes it and NAMES it, because a
 * denominator that drops quietly is the defect the census exists to make loud. */
function scan() {
  const labs = [];
  const { labs: dirs, excluded } = siblingLabs(FLEET_ROOT);
  for (const dir of dirs) {
    const cfg = path.join(FLEET_ROOT, dir, 'playwright.config.ts');
    if (!fs.existsSync(cfg)) continue;
    const text = fs.readFileSync(cfg, 'utf8');
    labs.push({
      lab: dir,
      port: portOf(text),
      strict: /strictPort/.test(text),
      /* `--strictPort` is a VITE flag, and it is Vite's preview server that
       * silently increments to the next free port. A server that cannot do that
       * does not need the flag and will never carry it. crypto-compare serves
       * its static export with a node http server -- `server.listen(port)`
       * raises EADDRINUSE and kills the process -- so requiring the literal
       * reported it as a finding on the strength of being unable to have the
       * bug. Same shape as reading only literal ports: the lab that solved it
       * differently is the one the detector accuses. */
      canFallBack: /\bpreview\b/.test(text),
      urlPorts: [...new Set(urlPortsOf(text))],
      cmdPorts: [...new Set(commandPortsOf(text))],
    });
  }
  labs.sort((a, b) => (a.port || 0) - (b.port || 0));
  labs.excluded = excluded;
  return labs;
}

/* Offline test of the two consistency rules, over tools/fixtures/ports. The
 * three *-prefix fixtures are the ACTUAL configs of factor-forge, sphinx-mix and
 * stream-ward at the commits where they were broken, taken from each lab's own
 * history rather than written to fit the rule; the ssh-handshake fixture is a
 * correct config that a localhost-only match would misreport; and the fixed
 * fixture proves the rules stay quiet on a config that agrees with itself. */
const PORT_FIXTURES = {
  'factor-forge-prefix': { mismatch: true, noUrl: false, why: 'real config at 2d00214: url 4200, command --port 4626' },
  'sphinx-mix-prefix': { mismatch: true, noUrl: false, why: 'real config at def321c: url 4203, command --port 4646' },
  'stream-ward-prefix': { mismatch: true, noUrl: false, why: 'real config at a5be1dd: url 4701, command --port 4671' },
  'ssh-handshake-loopback': { mismatch: false, noUrl: false, why: 'correct, and written 127.0.0.1 rather than localhost' },
  'no-url-port': { mismatch: false, noUrl: true, why: 'starts a server on 4321 and names no url to poll' },
  'factor-forge-fixed': { mismatch: false, noUrl: false, why: 'the same lab after the fix, which must stay quiet' },
};

function selftest() {
  const dir = path.join(__dirname, 'fixtures', 'ports');
  const fail = [];
  let pass = 0;
  for (const [name, expect] of Object.entries(PORT_FIXTURES)) {
    const file = path.join(dir, `${name}.config.ts`);
    if (!fs.existsSync(file)) { fail.push(`${name}: fixture file missing`); continue; }
    const text = fs.readFileSync(file, 'utf8');
    const urlPorts = [...new Set(urlPortsOf(text))];
    const cmdPorts = [...new Set(commandPortsOf(text))];
    const mismatch = Boolean(cmdPorts.length && urlPorts.length && cmdPorts.some((p) => !urlPorts.includes(p)));
    const noUrl = Boolean(cmdPorts.length && !urlPorts.length);
    if (mismatch !== expect.mismatch || noUrl !== expect.noUrl) {
      fail.push(`${name}: expected mismatch=${expect.mismatch} noUrl=${expect.noUrl}, got mismatch=${mismatch} noUrl=${noUrl}`);
    } else {
      pass++;
      console.log(`  ok  ${name} — ${expect.why}`);
    }
  }
  /* The fleet floor, asserted here because this is the tool whose absence of one
   * produced the finding: run from a directory with no clones beside it,
   * port-sync printed "Labs with a Playwright config: 0" and then "Every lab has
   * its own port, pinned, with --strictPort" and exited 0. Both directions are
   * checked -- a floor that always fired would be as useless as none. */
  {
    const pinned = pinnedCloneCount();
    if (!Number.isInteger(pinned) || pinned < 1) {
      fail.push('fleet floor: the census declares no integer lab total to floor against');
    } else {
      if (!fleetUnread(0)) fail.push('fleet floor: zero clones did not refuse');
      if (!fleetUnread(pinned - 1)) fail.push('fleet floor: one clone short of the census did not refuse');
      if (fleetUnread(pinned)) fail.push('fleet floor: the pinned count itself was refused');
      if (fleetUnread(pinned + 1)) fail.push('fleet floor: a clone MORE than the census was refused');
      if (!fail.length) {
        pass += 4;
        console.log(`  ok  fleet-floor — refuses 0 and ${pinned - 1} clones, allows ${pinned} and ${pinned + 1}`);
      }
    }
  }

  // A fixture set with no positive case would pass against a rule that never fires.
  if (!Object.values(PORT_FIXTURES).some((e) => e.mismatch)) fail.push('no fixture exercises the mismatch rule');
  if (!Object.values(PORT_FIXTURES).some((e) => e.noUrl)) fail.push('no fixture exercises the no-url rule');
  if (!Object.values(PORT_FIXTURES).some((e) => !e.mismatch && !e.noUrl)) fail.push('no clean fixture: the rules are never shown staying quiet');
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

function main() {
  const check = process.argv[2] === 'check';
  /* selftest is offline by design -- fixtures only, no clones -- so it runs
   * before the fleet floor below. */
  if (process.argv[2] === 'selftest') process.exit(selftest());
  /* A checker that cannot see the clones must not report them clean. Four of
   * these reported a clean pass over zero labs until 2026-10-02 -- see the
   * measurements in tools/sibling-labs.js. The floor is the census, so it moves
   * when a lab is added or removed and nowhere else. */
  {
    const unread = fleetUnreadLine(siblingLabsForFloor(FLEET_ROOT));
    if (unread) { console.log(unread); process.exit(1); }
  }
  const labs = scan();
  const problems = [];

  const byPort = {};
  for (const l of labs) {
    if (l.port === null) { problems.push(`${l.lab} — playwright.config.ts names no port`); continue; }
    (byPort[l.port] = byPort[l.port] || []).push(l.lab);
  }

  const collisions = Object.entries(byPort).filter(([, v]) => v.length > 1);
  const unstrict = labs.filter((l) => !l.strict && l.canFallBack);
  /* Named, never silently skipped: a denominator that drops quietly is the
   * defect this file keeps re-finding. */
  const noFallback = labs.filter((l) => !l.strict && !l.canFallBack);

  // The command starts a server on a port the config never polls.
  const mismatched = labs.filter((l) =>
    l.cmdPorts.length && l.urlPorts.length && l.cmdPorts.some((p) => !l.urlPorts.includes(p)));
  // A command port with no URL anywhere: nothing says where to reach the server.
  const noUrl = labs.filter((l) => l.cmdPorts.length && !l.urlPorts.length);

  let registry = [];
  if (fs.existsSync(REGISTRY)) {
    try { registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); }
    catch (e) { problems.push(`${path.relative(FLEET_ROOT, REGISTRY)} does not parse: ${e.message}`); }
  }
  const pinned = new Map(registry.map((r) => [r.lab, r.port]));
  const drifted = labs.filter((l) => pinned.has(l.lab) && pinned.get(l.lab) !== l.port);
  const unpinned = labs.filter((l) => !pinned.has(l.lab));

  console.log(`Labs with a Playwright config: ${labs.length} | distinct ports: ${Object.keys(byPort).length}`);
  const excl = excludedLine(labs.excluded || []);
  if (excl) console.log(excl);

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

  if (noFallback.length) {
    console.log(`\nNo --strictPort and none needed (${noFallback.length}) — the webServer`);
    console.log('command is not a Vite preview, so it cannot silently take another port:');
    for (const l of noFallback) console.log(`  ${l.lab}`);
  }
  if (mismatched.length) {
    console.log(`\nSERVER PORT != POLLED PORT (${mismatched.length}) — Playwright starts the preview`);
    console.log('on one port and waits on another, so webServer times out and NO test runs:');
    for (const l of mismatched) {
      console.log(`  ${l.lab}  command --port ${l.cmdPorts.join(', ')}, url ${l.urlPorts.join(', ')}`);
    }
  }
  if (noUrl.length) {
    console.log(`\nCOMMAND PORT WITH NO URL (${noUrl.length}) — the config starts a server and never`);
    console.log('says where to reach it, so readiness is the command\'s exit timing rather than a poll:');
    for (const l of noUrl) console.log(`  ${l.lab}  command --port ${l.cmdPorts.join(', ')}`);
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
    + mismatched.length + noUrl.length
    + (check ? unpinned.length : 0);

  if (!check) {
    const next = labs.filter((l) => l.port !== null).map((l) => ({ port: l.port, lab: l.lab }));
    fs.writeFileSync(REGISTRY, JSON.stringify(next, null, 1) + '\n');
    const used = new Set(next.map((r) => r.port));
    let free = 4200; while (used.has(free)) free++;
    console.log(`\nRegistry rewritten: ${next.length} labs. Next free port: ${free}.`);
  } else if (!failed) {
    console.log('\nEvery lab has its own port, pinned, with --strictPort, and starts its server on the port it polls.');
  }

  if (check && failed) process.exit(1);
}

main();
