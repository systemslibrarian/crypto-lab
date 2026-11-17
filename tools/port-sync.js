#!/usr/bin/env node
/*
 * port-sync.js — one Playwright port per lab, pinned, and --strictPort kept.
 *
 * Run: node tools/port-sync.js check
 * Prevents: two labs sharing a Playwright port, where a local run silently tests whatever is already listening
 * Reads: playwright.config.ts and vite.config.ts in each sibling clone under ../crypto-lab-<slug>, and tools/playwright-ports.json
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
 *                                    disagrees with the registry, a gated lab
 *                                    missing from the registry, a missing
 *                                    --strictPort, a webServer command whose
 *                                    port is not the one the config polls, a
 *                                    command port with no URL at all, or a
 *                                    browser suite or workflow preview aimed at
 *                                    a port that is not the lab's own.
 *
 * NOTE: running it with NO argument REWRITES the registry from what the fleet
 * currently uses. That is the intended way to pin a new lab, and it is also a
 * foot-gun: `node -e "require('./tools/port-sync.js')"` as a syntax check runs
 * main() with argv[2] undefined and rewrote 12 labs onto their colliding ports
 * on 2026-11-17. Use `node --check tools/port-sync.js` to check syntax.
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
/* Vite's OWN port declarations, which `vite preview` and `vite dev` bind when no
 * --port is passed on the command line.
 *
 * Added 2026-11-17 after five labs were found pinning ANOTHER lab's port here:
 * crypto-lab-diffie-hellman-mitm declared `preview: { port: 4700 }` while 4700 is
 * crypto-lab-pqxdh-wire's registered port, and the same shape held for
 * ec-point-arithmetic/4701, web-of-trust/4710, ecdsa-forge/4713 and
 * frost-threshold/4717. Every one of those five ALSO carried the right port in
 * its playwright.config.ts, which is the only file this checker used to open --
 * so all 245 Playwright ports were distinct, this check passed, and the squatting
 * was invisible. Reading one of the two files that can bind a port is the
 * answering-from-a-copy shape, in the checker whose whole subject is ports.
 *
 * Why it matters even though the gate overrides it: every lab's webServer command
 * passes `--port <own> --strictPort`, and the CLI flag wins, so a CI run was never
 * affected. A hand-run `npm run preview` in the squatting lab is not, and binds
 * the OWNER's port -- at which point `reuseExistingServer: !process.env.CI` lets
 * the owner's next local run attach to a server serving the wrong lab's build and
 * report a pass. That is the hazard this file's own header describes. */
function vitePortsOf(text) {
  const out = [];
  for (const m of text.matchAll(/port\s*:\s*(\d{4,5})/g)) out.push(Number(m[1]));
  return [...new Set(out)];
}

/* Ports a lab binds or polls OUTSIDE its Playwright config.
 *
 * Added 2026-11-17, after eight labs were found running a browser suite against
 * a hard-coded port that belongs to someone else. These are the suites
 * Playwright's runner never sees -- a bare node script wired to an npm script,
 * driving playwright or puppeteer itself -- plus the preview a workflow starts
 * by hand before calling one. Neither shape passes through `webServer`, so every
 * rule above was silent on them.
 *
 * What it cost, measured on crypto-lab-web-of-trust: `npm run axe` pointed at
 * 4710, which the registry gives to crypto-lab-sm2-forge, and nothing was
 * serving it on a workstation, so the suite died on ERR_CONNECTION_REFUSED
 * every time it was run and reported no accessibility at all. When it was
 * pointed at the lab's own port it immediately found a real WCAG 2.5.3 failure
 * that had been shipping. A gate aimed at the wrong port is not a weak gate; it
 * is an absent one that looks present.
 *
 * Only npm-wired scripts count. A lab's ad-hoc tooling -- capture-videos.mjs,
 * zkbuild/diag3.mjs -- names ports too, is run by hand when someone is already
 * looking, and gates nothing; including it made the finding list mostly noise.
 */
const SERVER_PORT_RE = /(?:--port[\s=]+|localhost:|127\.0\.0\.1:|http\.server\s+)(\d{4,5})/g;

/* Comments are not code, and a port named in one is usually the OPPOSITE of a
 * finding: every lab fixed on 2026-11-17 carries a comment saying which wrong
 * port it used to use. Reading those back reported all eight as still broken --
 * a checker accusing the labs that had just been fixed, on the strength of
 * their having documented the fix. Strip line and block comments, and YAML
 * comments, before matching. */
function withoutComments(text, yaml) {
  if (yaml) return text.replace(/(^|\s)#.*$/gm, '$1');
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function portsInText(text, yaml) {
  const code = withoutComments(text, yaml);
  return [...new Set([...code.matchAll(SERVER_PORT_RE)].map((m) => Number(m[1])))];
}

/** Script files a lab's package.json actually invokes. */
function npmWiredScripts(labDir) {
  const out = new Set();
  const stack = [labDir];
  let left = 400;
  while (stack.length && left-- > 0) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules' && e.name !== 'dist' && !e.name.startsWith('.')
            && full.split(path.sep).length - labDir.split(path.sep).length < 2) stack.push(full);
        continue;
      }
      if (e.name !== 'package.json') continue;
      let pkg;
      try { pkg = JSON.parse(fs.readFileSync(full, 'utf8')); } catch { continue; }
      const scripts = Object.values(pkg.scripts || {}).join(' ; ');
      /* The file names a script mentions, resolved beside that package.json. */
      for (const m of scripts.matchAll(/([\w./-]+\.(?:mjs|cjs|js))/g)) {
        const cand = path.join(path.dirname(full), m[1]);
        if (fs.existsSync(cand)) out.add(cand);
      }
      /* A preview port named inline in a script, e.g. frost-threshold's
       * `vite preview --port 4400 --strictPort & … node scripts/a11y-check.mjs`. */
      out.add(`inline:${full}:${scripts}`);
    }
  }
  return [...out];
}

function harnessPortsOf(labDir) {
  const found = [];
  for (const entry of npmWiredScripts(labDir)) {
    if (entry.startsWith('inline:')) {
      const [, file, ...rest] = entry.split(':');
      for (const p of portsInText(rest.join(':'))) found.push({ port: p, where: path.relative(labDir, file) });
      continue;
    }
    let text;
    try { text = fs.readFileSync(entry, 'utf8'); } catch { continue; }
    if (!/from ['"](?:playwright|puppeteer)|require\(['"](?:playwright|puppeteer)/.test(text)) continue;
    for (const p of portsInText(text)) found.push({ port: p, where: path.relative(labDir, entry) });
  }
  /* Workflow steps that start a preview or poll one before a suite runs. */
  const wf = path.join(labDir, '.github', 'workflows');
  let files = [];
  try { files = fs.readdirSync(wf).filter((f) => /\.ya?ml$/.test(f)); } catch { files = []; }
  for (const f of files) {
    const text = fs.readFileSync(path.join(wf, f), 'utf8');
    for (const line of text.split('\n')) {
      if (!/preview|http\.server|curl|BASE_URL|PREVIEW_URL|SMOKE_URL|AXE_URL|ZKPL_BASE_URL/.test(line)) continue;
      for (const p of portsInText(line, true)) found.push({ port: p, where: `.github/workflows/${f}` });
    }
  }
  const seen = new Set();
  return found.filter((x) => {
    const k = `${x.port}@${x.where}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Harness or workflow ports that are not the lab's own gate port.
 *
 * Cross-lab like squattingIn, so selftest can drive it with synthetic records.
 * 5173 and 4173 are Vite's and Vitest's defaults and belong to no lab; a lab
 * naming its OWN port is correct and silent. */
function foreignHarnessPortsIn(labs) {
  const ownerOf = new Map();
  for (const l of labs) if (l.port !== null && l.port !== undefined) ownerOf.set(l.port, l.lab);
  const out = [];
  for (const l of labs) {
    for (const hp of l.harnessPorts || []) {
      if (hp.port === l.port) continue;
      out.push({ lab: l.lab, port: hp.port, where: hp.where, owner: ownerOf.get(hp.port) || null });
    }
  }
  return out;
}

/** Labs whose vite.config.ts names a port another lab's gate binds.
 *
 * A separate function so selftest can exercise it with no clones on disk: the
 * rule is CROSS-lab, so a single fixture config cannot express it, and a rule
 * that only runs against the real fleet has no negative control. */
function squattingIn(labs) {
  const ownerOf = new Map();
  for (const l of labs) if (l.port !== null && l.port !== undefined) ownerOf.set(l.port, l.lab);
  const out = [];
  for (const l of labs) {
    for (const vp of l.vitePorts || []) {
      const owner = ownerOf.get(vp);
      if (owner && owner !== l.lab) out.push({ lab: l.lab, port: vp, owner });
    }
  }
  return out;
}

/* Every Playwright config in a lab, not just `<lab>/playwright.config.ts`.
 *
 * Added 2026-11-17. The old reader opened exactly that one path, and six labs
 * keep their gate somewhere else: five one level down
 * (crypto-lab-babel-hash/demos/babel-hash/, crypto-lab-quantum-vault-kpqc/web-demo/,
 * and the same shape for dead-sea-cipher, iron-serpent and sphincs-ledger) and
 * crypto-lab-zk-arena writes playwright.config.mjs rather than .ts. All six
 * were invisible to every rule in this file -- not reported as unpinned, not
 * counted in the denominator, not checked for collisions -- while four of them
 * bound a port the registry gives to another lab. A checker whose subject is
 * ports, reading one of the several files that can declare one, is this
 * repository's recurring shape again. */
const CONFIG_NAMES = /^playwright\.config\.(ts|mts|cts|js|mjs|cjs)$/;
function configPathsIn(labDir, depth = 2) {
  const out = [];
  const walk = (dir, left) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isFile() && CONFIG_NAMES.test(e.name)) out.push(path.join(dir, e.name));
      else if (e.isDirectory() && left > 0 && e.name !== 'node_modules' && e.name !== 'dist'
               && !e.name.startsWith('.')) walk(path.join(dir, e.name), left - 1);
    }
  };
  walk(labDir, depth);
  /* A lab with several configs is read at the one that declares the gate. */
  out.sort((a, b) => a.length - b.length);
  const gated = out.filter((f) => /\bwebServer\s*:/.test(fs.readFileSync(f, 'utf8')));
  return gated.length ? gated : out;
}

function scan() {
  const labs = [];
  const { labs: dirs, excluded } = siblingLabs(FLEET_ROOT);
  for (const dir of dirs) {
    const found = configPathsIn(path.join(FLEET_ROOT, dir));
    if (!found.length) continue;
    const cfg = found[0];
    const text = fs.readFileSync(cfg, 'utf8');
    labs.push({
      lab: dir,
      configPath: path.relative(path.join(FLEET_ROOT, dir), cfg),
      gated: /\bwebServer\s*:/.test(text),
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
      vitePorts: (() => {
        /* Beside the config, which for a nested gate is the demo directory. */
        const vc = path.join(path.dirname(cfg), 'vite.config.ts');
        return fs.existsSync(vc) ? vitePortsOf(fs.readFileSync(vc, 'utf8')) : [];
      })(),
      harnessPorts: harnessPortsOf(path.join(FLEET_ROOT, dir)),
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
  /* The vite-squatting rule, with both directions. It is a CROSS-lab rule, so it
     is exercised on synthetic records rather than a fixture file: one owner whose
     gate binds 4700, one squatter naming 4700 in its vite.config, one lab
     repeating its OWN port, and one naming the Vite default that is nobody's gate
     port. Taken from the five real cases found on 2026-11-17 --
     diffie-hellman-mitm pinned 4700, which is pqxdh-wire's. A rule with no
     quiet-case control would be satisfied by one that flagged everything. */
  const owner = { lab: 'crypto-lab-owner', port: 4700, vitePorts: [4700] };
  const squatter = { lab: 'crypto-lab-squatter', port: 4623, vitePorts: [4700] };
  const tidy = { lab: 'crypto-lab-tidy', port: 4631, vitePorts: [4631] };
  const devDefault = { lab: 'crypto-lab-dev', port: 4632, vitePorts: [5173] };

  const flagged = squattingIn([owner, squatter, tidy, devDefault]);
  if (flagged.length === 1 && flagged[0].lab === 'crypto-lab-squatter'
      && flagged[0].port === 4700 && flagged[0].owner === 'crypto-lab-owner') {
    pass++;
    console.log('  ok  vite squatting — a lab naming another lab\'s gate port is named against its owner');
  } else {
    fail.push(`vite squatting: expected one finding against crypto-lab-squatter, got ${JSON.stringify(flagged)}`);
  }

  /* The quiet cases, separately, so "flags everything" cannot pass the line above. */
  if (squattingIn([tidy]).length === 0 && squattingIn([devDefault]).length === 0
      && squattingIn([owner]).length === 0) {
    pass++;
    console.log('  ok  vite squatting — a lab repeating its own port, or the Vite default, is silent');
  } else {
    fail.push('vite squatting: a lab repeating its own port or naming 5173 must not be a finding');
  }

  /* MUTATION: the owner-versus-self test is what makes it a cross-lab rule. Drop
     it and the owner accuses itself, which is the shape that would have made this
     rule unusable noise rather than a finding. */
  const noSelfCheck = (ls) => {
    const o = new Map();
    for (const l of ls) if (l.port !== null && l.port !== undefined) o.set(l.port, l.lab);
    const r = [];
    for (const l of ls) for (const vp of l.vitePorts || []) if (o.has(vp)) r.push({ lab: l.lab, port: vp });
    return r;
  };
  if (noSelfCheck([owner, tidy]).length > squattingIn([owner, tidy]).length) {
    pass++;
    console.log('  ok  vite squatting — MUTATION: without the owner-is-not-self test it accuses the owner');
  } else {
    fail.push('vite squatting: the mutation must produce findings the real rule does not');
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

  /* configPathsIn: the two real shapes the old one-path reader could not see.
     Six labs were invisible to EVERY rule in this file because of it, four of
     them binding a port the registry gives to another lab. */
  {
    const nested = configPathsIn(path.join(dir, 'nested-lab'));
    const mjs = configPathsIn(path.join(dir, 'mjs-lab'));
    if (nested.length === 1 && nested[0].endsWith(path.join('demos', 'demo-app', 'playwright.config.ts'))) {
      pass++;
      console.log('  ok  configPathsIn — a gate one level down, under demos/<name>/, is found');
    } else {
      fail.push(`configPathsIn: nested gate not found, got ${JSON.stringify(nested)}`);
    }
    if (mjs.length === 1 && mjs[0].endsWith('playwright.config.mjs')) {
      pass++;
      console.log('  ok  configPathsIn — a gate written .mjs rather than .ts is found');
    } else {
      fail.push(`configPathsIn: .mjs gate not found, got ${JSON.stringify(mjs)}`);
    }
    /* MUTATION: the old reader, restored. It must find neither, which is what
       made all six labs invisible. A rule whose mutation still passes is not
       the rule that was broken. */
    const oldReader = (labDir) => {
      const one = path.join(labDir, 'playwright.config.ts');
      return fs.existsSync(one) ? [one] : [];
    };
    if (oldReader(path.join(dir, 'nested-lab')).length === 0
        && oldReader(path.join(dir, 'mjs-lab')).length === 0) {
      pass++;
      console.log('  ok  configPathsIn — MUTATION: the one-path reader finds neither, as it did not');
    } else {
      fail.push('configPathsIn: the pre-fix reader must find neither fixture');
    }
  }

  /* portsInText: a port named in a COMMENT is not a finding. Every lab fixed on
     2026-11-17 documents the wrong port it used to use, and reading those back
     accused all eight of still being broken -- the checker punishing the labs
     that had just been fixed for having explained the fix. */
  {
    const code = "const BASE = process.env.X ?? 'http://localhost:4334/lab/';";
    const commented = "/* it was 4710, which belongs to another lab */\n" + code
      + "\n// old: http://localhost:4705/lab/";
    const fromCode = portsInText(code, false);
    const fromCommented = portsInText(commented, false);
    if (fromCode.join() === '4334' && fromCommented.join() === '4334') {
      pass++;
      console.log('  ok  portsInText — ports named in line and block comments are not read');
    } else {
      fail.push(`portsInText: expected only 4334, got code=${fromCode} commented=${fromCommented}`);
    }
    const yamlLine = '          npm run preview -- --port 4654 --strictPort  # was 4675';
    if (portsInText(yamlLine, true).join() === '4654') {
      pass++;
      console.log('  ok  portsInText — a YAML trailing comment is not read');
    } else {
      fail.push(`portsInText: yaml comment leaked, got ${portsInText(yamlLine, true)}`);
    }
    /* MUTATION: stop stripping comments and the commented fixture reports the
       two historical ports as live findings. */
    const noStrip = (t) => [...new Set([...t.matchAll(SERVER_PORT_RE)].map((m) => Number(m[1])))];
    if (noStrip(commented).length > fromCommented.length) {
      pass++;
      console.log('  ok  portsInText — MUTATION: without stripping, the comments become findings');
    } else {
      fail.push('portsInText: the mutation must read ports the real rule does not');
    }
  }

  /* foreignHarnessPortsIn: cross-lab, so synthetic records, with both
     directions. Taken from the real set found on 2026-11-17 --
     crypto-lab-web-of-trust ran `npm run axe` against 4710, which is
     crypto-lab-sm2-forge's, so it could never reach a page and reported no
     accessibility at all while looking like a gate. */
  {
    const owner = { lab: 'crypto-lab-owner', port: 4710, harnessPorts: [] };
    const aimedAway = { lab: 'crypto-lab-aimed-away', port: 4334,
      harnessPorts: [{ port: 4710, where: 'scripts/axe.mjs' }] };
    const tidy = { lab: 'crypto-lab-tidy', port: 4623,
      harnessPorts: [{ port: 4623, where: 'scripts/smoke.mjs' }] };
    const nobodys = { lab: 'crypto-lab-nobodys', port: 4618,
      harnessPorts: [{ port: 5176, where: 'scripts/verify-ui.mjs' }] };

    const flagged = foreignHarnessPortsIn([owner, aimedAway, tidy, nobodys]);
    const away = flagged.filter((f) => f.lab === 'crypto-lab-aimed-away');
    if (away.length === 1 && away[0].port === 4710 && away[0].owner === 'crypto-lab-owner') {
      pass++;
      console.log('  ok  foreign harness port — a suite aimed at another lab\'s port is named against its owner');
    } else {
      fail.push(`foreign harness port: expected one finding against crypto-lab-aimed-away, got ${JSON.stringify(flagged)}`);
    }
    /* A port belonging to no lab is still a finding -- 5176 and 8000 are the
       ones that actually bit -- but it is reported with no owner to blame. */
    const orphan = flagged.filter((f) => f.lab === 'crypto-lab-nobodys');
    if (orphan.length === 1 && orphan[0].owner === null) {
      pass++;
      console.log('  ok  foreign harness port — a port owned by no lab is named, with no owner');
    } else {
      fail.push(`foreign harness port: an unowned port must still be a finding, got ${JSON.stringify(orphan)}`);
    }
    /* The quiet case, separately, so "flags everything" cannot pass the above. */
    if (foreignHarnessPortsIn([tidy]).length === 0 && foreignHarnessPortsIn([owner]).length === 0) {
      pass++;
      console.log('  ok  foreign harness port — a suite aimed at its own port is silent');
    } else {
      fail.push('foreign harness port: a lab naming its own port must not be a finding');
    }
    /* MUTATION: drop the own-port test and the tidy lab accuses itself, which
       is the shape that would make this rule unusable noise. */
    const noSelf = (ls) => {
      const o = new Map();
      for (const l of ls) o.set(l.port, l.lab);
      const r = [];
      for (const l of ls) for (const h of l.harnessPorts || []) r.push({ lab: l.lab, port: h.port, owner: o.get(h.port) || null });
      return r;
    };
    if (noSelf([tidy]).length > foreignHarnessPortsIn([tidy]).length) {
      pass++;
      console.log('  ok  foreign harness port — MUTATION: without the own-port test it accuses the tidy lab');
    } else {
      fail.push('foreign harness port: the mutation must produce findings the real rule does not');
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

  /* A lab declaring ANOTHER lab's port in its own vite.config.ts. Keyed on the
     other lab's PLAYWRIGHT port, which is the port that lab's gate binds, so a
     squatter is named against the owner it would shadow. A lab repeating its own
     port here is correct and silent, and the Vite default 5173 is nobody's gate
     port, so the ten labs that leave it explicit are not findings. */
  const squatting = squattingIn(labs);

  /* Browser suites and workflow previews aimed at a port that is not this
     lab's. See the header on harnessPortsOf: a gate pointed at someone else's
     port is an absent gate that reads as a present one. */
  const foreign = foreignHarnessPortsIn(labs);

  let registry = [];
  if (fs.existsSync(REGISTRY)) {
    try { registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); }
    catch (e) { problems.push(`${path.relative(FLEET_ROOT, REGISTRY)} does not parse: ${e.message}`); }
  }
  const pinned = new Map(registry.map((r) => [r.lab, r.port]));
  const drifted = labs.filter((l) => pinned.has(l.lab) && pinned.get(l.lab) !== l.port);
  const unpinned = labs.filter((l) => !pinned.has(l.lab));

  console.log(`Labs with a Playwright config: ${labs.length} | distinct ports: ${Object.keys(byPort).length}`);
  const nx = require('./sibling-labs.js').declaredExclusionLine(FLEET_ROOT);
  if (nx) console.log(nx);
  const excl = excludedLine(labs.excluded || []);
  if (excl) console.log(excl);

  if (squatting.length) {
    console.log(`\nVITE PORT SQUATTING (${squatting.length}) — vite.config.ts names a port`);
    console.log('another lab\'s gate binds. The CLI --port in the webServer command overrides');
    console.log('it, so CI is unaffected; a hand-run `npm run preview` is not, and');
    console.log('reuseExistingServer then lets the owner attach to the wrong build.');
    for (const sq of squatting) {
      console.log(`  ${sq.lab} — vite.config.ts pins ${sq.port}, which is ${sq.owner}'s port`);
    }
    problems.push(...squatting.map((sq) => `${sq.lab} — vite.config.ts pins ${sq.owner}'s port ${sq.port}`));
  }

  if (foreign.length) {
    console.log(`\nSUITE AIMED AT ANOTHER PORT (${foreign.length}) — a browser suite or a workflow`);
    console.log('preview naming a port that is not this lab\'s. Playwright\'s webServer never sees');
    console.log('these, so nothing above checks them; pointed at a port nothing serves, the suite');
    console.log('dies on connection-refused and reports nothing at all.');
    for (const f of foreign) {
      const whose = f.owner ? `${f.owner}'s` : "no lab's";
      const own = labs.find((l) => l.lab === f.lab)?.port;
      console.log(`  ${f.lab} — ${f.where} names ${f.port} (${whose}); this lab's is ${own}`);
    }
    problems.push(...foreign.map((f) => `${f.lab} — ${f.where} names port ${f.port}, not this lab's`));
  }

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
