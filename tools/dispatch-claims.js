#!/usr/bin/env node
/*
 * dispatch-claims.js — hold the CANONICAL paragraph to the facts it asserts.
 *
 * ---------------------------------------------------------------------------
 * The defect this closes
 *
 * dispatch-comment-sync.js took 36 independently drifted copies of the
 * auto-merge rationale and normalised ONE wording into ~195 repos. That trade is
 * sound for idempotence and drift, and it was proven for both. What it was not
 * proven for is TRUTH: nothing bound that wording to the facts it states, so the
 * blast radius of a wrong sentence became the whole fleet.
 *
 * Reproduced on 2026-09-10 by inverting the load-bearing clause in CANONICAL —
 * "a workflow_dispatch through the API is not suppressed" -> "is suppressed
 * too", which is false and destroys the reasoning the whole mechanism rests on:
 *
 *     node tools/dispatch-proof.js        exit 0    "37 passed, 0 failed"
 *     node tools/dispatch-sync.js check   exit 1    "Fix with: node tools/dispatch-comment-sync.js"
 *
 * The proof — whose header says it re-runs the derivation — passed clean, because
 * every check it ran compared the fleet against CANONICAL rather than CANONICAL
 * against the fleet. dispatch-sync went red only because the repos still held the
 * OLD text, and its remedy line said to run the writer. Following that
 * instruction propagates the false sentence to ~195 repos, after which every
 * gate is green and the fleet documents the opposite of how it works.
 *
 * ---------------------------------------------------------------------------
 * What this file asserts
 *
 * It READS CANONICAL, extracts each factual clause as a PROPOSITION WITH A
 * POLARITY, re-derives the same proposition from the fleet's YAML, and fails
 * when the two disagree.
 *
 * The distinction that matters: it fails on a clause that becomes FALSE, not on
 * a clause that changes WORDING. Rewrite "a workflow_dispatch through the API is
 * not suppressed" as "a dispatch sent through the API is honoured" and every
 * check here still passes — same proposition, same polarity. Write "is
 * suppressed too" and it fails, naming the clause and the evidence that
 * contradicts it. A check that pinned the literal would be the frozen-prose
 * failure again, one layer up: it would force the sentence to stay the same
 * rather than stay true.
 *
 * Polarity is read from a small lexicon (suppressed/blocked/ignored versus
 * honoured/accepted/fires, plus the negators around them). A clause whose
 * polarity cannot be read at all is a FAILURE, not a pass — a paragraph nobody
 * can parse is a paragraph nobody is checking.
 *
 * ---------------------------------------------------------------------------
 * The clauses, and how each one is bound
 *
 * 1. push-event-suppressed — "A merge made with GITHUB_TOKEN raises no push
 *    event ... so deploy would never run".
 *
 *    HALF BOUND, and the honest statement of which half:
 *
 *    NOT DERIVABLE HERE: whether GitHub suppresses the push event for a merge
 *    made with secrets.GITHUB_TOKEN. That is platform behaviour. Nothing in this
 *    fleet's YAML can witness it, and this file does not pretend to. It is
 *    GitHub's own documented behaviour ("events triggered by the GITHUB_TOKEN
 *    will not create a new workflow run") and the 2026-08-20 incident is its
 *    observed consequence: nine labs served a build older than their main.
 *
 *    DERIVED HERE: the corollary the paragraph draws from it — that if the push
 *    event does not arrive, nothing else ships the bump. Every dispatch target
 *    is re-read for a trigger that would deploy a merge anyway (`schedule`,
 *    `repository_dispatch`, `workflow_run`, `release`). A lab that grows one
 *    makes the corollary false there, and this fails.
 *
 *    The clause's POLARITY is still pinned, by coherence rather than evidence:
 *    a paragraph that says the push event DOES arrive is arguing for a dispatch
 *    it has just declared unnecessary, while the derivation says push is the
 *    only other trigger. That inversion fails here (mutation M3).
 *
 * 2. dispatch-honoured — "a workflow_dispatch through the API is not
 *    suppressed".
 *
 *    BOUND, to two independent bodies of evidence:
 *      - the fleet: every dispatch target declares `workflow_dispatch` in `on:`,
 *        and no job on its publish path carries an `if:` that is definitely
 *        false for a dispatched run. That second half is not decoration: gating
 *        a deploy job `if: github.event_name == 'push'` is one of the four bugs
 *        behind the 2026-08-20 incident, and it makes this clause false in that
 *        lab while every literal in the file stays correct.
 *      - the fault injection in tools/dispatch-proof.js A4, whose NEW construct
 *        reaches `gh workflow run` under the same failure that silences the old
 *        one. Passed in as evidence when the proof runs, so the sentence is
 *        bound to the demonstration rather than to a literal.
 *
 * 3. same-gate-then-deploy — "The dispatched run is the same gate-then-deploy
 *    pipeline, so a bad merge still ships nothing."
 *
 *    BOUND. Every dispatch target's publishing job is re-derived as gated:
 *    either it `needs:` a job that runs this project's toolchain, or it is a
 *    fused build-and-publish job whose publish step sits after those commands.
 *    The `needs:` walk FOLLOWS REUSABLE WORKFLOW CALLS — crypto-lab-pake-gate
 *    reaches its gate through `uses: ./.github/workflows/browser-gate.yml`, and
 *    a walk that stopped at the calling job would report that true sentence
 *    false and invite someone to "fix" it.
 *
 * Two clauses of the paragraph are NOT propositions about the fleet and are not
 * bound: "Ask for it explicitly" is an instruction, and "the site would keep
 * serving the previous build" is the consequence of clause 1's platform fact.
 * They are listed as UNBOUND in the report rather than counted as checked.
 *
 * Purely local — no network, no `gh`.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/dispatch-claims.js          report every clause and its evidence
 *   node tools/dispatch-claims.js check    same report; exit 1 if a clause is
 *                                          false, unreadable, or unlocatable
 *   node tools/dispatch-claims.js -v       also list the per-site derivation
 */
'use strict';
const fs = require('fs');
const path = require('path');
const comments = require('./dispatch-comment-sync.js');

const FLEET_ROOT = comments.FLEET_ROOT;
const indentOf = comments.indentOf;

/* Both publishers this fleet uses. A check that knew only actions/deploy-pages
 * skipped the peaceiris labs in silence once already (gate-sync, 2026-09). */
const PUBLISHERS = /actions\/deploy-pages|peaceiris\/actions-gh-pages/;

/* A trigger that would deploy a merge with no dispatch and no push event. */
const OTHER_AUTO_TRIGGERS = ['schedule', 'repository_dispatch', 'workflow_run', 'release'];

/* ------------------------------------------------------------ YAML-ish reads
 *
 * Deliberately not a YAML load, for the same reason dispatch-sync is not one:
 * what is judged is the shape and order of a workflow's own text, including its
 * comments, and a parsed tree throws both away. */

function readLines(file) {
  try { return fs.readFileSync(file, 'utf8').split('\n'); } catch { return null; }
}

/* Trigger names under `on:`, in all three spellings the fleet uses:
 *   on:\n  push:\n  workflow_dispatch:      on: [push, workflow_dispatch]      on: push */
function triggersOf(lines) {
  const i = lines.findIndex((l) => /^on:/.test(l));
  if (i < 0) return [];
  const inline = /^on:\s*(\S.*)$/.exec(lines[i]);
  if (inline) {
    return inline[1].replace(/[[\]]/g, '').split(',').map((s) => s.trim().replace(/:$/, '')).filter(Boolean);
  }
  const out = [];
  for (let j = i + 1; j < lines.length && !/^\S/.test(lines[j]); j++) {
    const m = /^\s{1,3}([a-z_]+):/.exec(lines[j]);
    if (m) out.push(m[1]);
  }
  return out;
}

/* Every command a job actually runs: inline `run: cmd` and `run: |` scalars. */
function runCommands(lines, from, to) {
  const out = [];
  for (let i = from; i < to; i++) {
    const inline = /^\s*(-\s+)?run:\s*(\S.*)$/.exec(lines[i]);
    if (inline && !/^[|>]/.test(inline[2])) { out.push(inline[2].trim()); continue; }
    const block = /^(\s*)(-\s+)?run:\s*[|>][-+]?\s*$/.exec(lines[i]);
    if (!block) continue;
    const keyInd = block[1].length + (block[2] ? block[2].length : 0);
    for (let j = i + 1; j < to; j++) {
      if (lines[j].trim() === '') continue;
      if (indentOf(lines[j]) <= keyInd) break;
      out.push(lines[j].trim());
    }
  }
  return out;
}

/* Is this a command that can FAIL on a bad bump — the thing that makes the
 * pipeline a gate rather than a conveyor? Two conditions, because either alone
 * is wrong: the first token must be this project's toolchain (so `echo` and
 * `git config` do not qualify), and the command must be doing something that
 * judges the tree. Broad on purpose — the fleet gates with npm, cargo, node
 * scripts, wasm-pack, pytest and its own shell checks, and a narrow lexicon
 * would report a real gate missing and invite someone to "fix" a true
 * sentence. */
const TOOL_FIRST = /^(sudo\s+)?(npm|pnpm|yarn|npx|node|deno|bun|cargo|rustup|wasm-pack|python3?|pip3?|pytest|make|go|dotnet|mvn|gradle|swift|bash|sh|\.\/|\.github\/|scripts\/|tools\/)/;
const TOOL_VERB = /(test|build|lint|check|audit|typecheck|type-check|clippy|fmt|a11y|e2e|playwright|vitest|jest|\bci\b|install|deny|validate|verif|coverage|fuzz|tsc|wasm-pack|vite)/i;
const isGateCommand = (cmd) => TOOL_FIRST.test(cmd) && TOOL_VERB.test(cmd);

/* --------------------------------------------------- three-valued `if:` eval
 *
 * The question asked of a job's `if:` is narrow: with github.event_name bound to
 * 'workflow_dispatch', is this condition DEFINITELY FALSE? Anything else — true,
 * or dependent on something not derivable here like github.ref — is not a
 * suppression, so the evaluator is three-valued and unknown operands stay
 * unknown. Kleene logic: AND is false if any operand is false, true only if all
 * are; OR is true if any is true, false only if all are.
 *
 * `if: github.event_name == 'push'` -> FALSE, and that is bug shape 3 of the
 * 2026-08-20 incident: the deploy job gated to push, so the dispatched run
 * builds, passes, and skips the deploy. */
function evalCondition(expr, env) {
  const src = String(expr).replace(/\$\{\{|\}\}/g, ' ').trim();
  const tokens = src.match(/'[^']*'|"[^"]*"|&&|\|\||==|!=|[()!]|[A-Za-z_][A-Za-z0-9_.-]*(\([^)]*\))?/g) || [];
  let pos = 0;
  const peek = () => tokens[pos];
  const take = () => tokens[pos++];

  const AND = (a, b) => (a === false || b === false ? false : (a === true && b === true ? true : null));
  const OR = (a, b) => (a === true || b === true ? true : (a === false && b === false ? false : null));

  const atomValue = (t) => {
    if (/^['"]/.test(t)) return { literal: t.slice(1, -1) };
    if (Object.prototype.hasOwnProperty.call(env, t)) return { literal: env[t] };
    if (t === 'true') return { bool: true };
    if (t === 'false') return { bool: false };
    return { unknown: true };
  };

  function primary() {
    if (peek() === '!') { take(); const v = primary(); return v === null ? null : !v; }
    if (peek() === '(') {
      take();
      const v = expression();
      if (peek() === ')') take();
      return v;
    }
    const left = atomValue(take());
    if (peek() === '==' || peek() === '!=') {
      const op = take();
      const right = atomValue(take());
      if (left.unknown || right.unknown) return null;
      const l = 'literal' in left ? left.literal : left.bool;
      const r = 'literal' in right ? right.literal : right.bool;
      return op === '==' ? l === r : l !== r;
    }
    if ('bool' in left) return left.bool;
    if ('literal' in left) return left.literal !== '' && left.literal !== 'false';
    return null;
  }
  function andExpr() {
    let v = primary();
    while (peek() === '&&') { take(); v = AND(v, primary()); }
    return v;
  }
  function expression() {
    let v = andExpr();
    while (peek() === '||') { take(); v = OR(v, andExpr()); }
    return v;
  }
  const value = expression();
  return value;
}

/* ------------------------------------------------------------- fleet reading */

/* Every place the fleet dispatches a deploy after an auto-merge, found through
 * the same job classification and the same dispatch matcher the other two tools
 * use, so the three cannot disagree about what a site is. */
function dispatchSites(root = FLEET_ROOT) {
  const out = [];
  for (const repo of comments.siblingLabs(root)) {
    for (const file of comments.workflowFiles(path.join(root, repo))) {
      const lines = readLines(file);
      if (!lines) continue;
      for (const job of comments.jobBlocks(lines)) {
        const body = lines.slice(job.start, job.end).join('\n');
        if (!comments.isAutoMergeJob(job.name, body)) continue;
        const disp = comments.findDispatchLine(lines, job.start, job.end);
        if (disp < 0) continue;
        const m = /gh workflow run\s+(\S+)/.exec(lines[disp].replace(/\s#.*$/, ''));
        if (!m) continue;
        out.push({ repo, workflow: path.basename(file), job: job.name, target: m[1] });
      }
    }
  }
  return out;
}

/* Does this job, or anything it needs, run a gate? Follows `needs:` chains and
 * `uses: ./.github/workflows/*.yml` reusable calls.
 *
 * The reusable hop is the one crypto-lab-pake-gate needs: its deploy job needs
 * `build`, and `build` is nothing but `uses: ./.github/workflows/browser-gate.yml`.
 * A walk that stopped at the calling job would find no commands there, call the
 * lab ungated, and report the CANONICAL sentence false — the exact false
 * negative that gets a true sentence "fixed". */
function gateBehind(root, repo, file, jobName, seen = new Set(), includeOwn = true) {
  const key = `${file}#${jobName}`;
  if (seen.has(key)) return null;
  seen.add(key);
  const lines = readLines(file);
  if (!lines) return null;
  const jobs = comments.jobBlocks(lines);
  const job = jobs.find((j) => j.name === jobName);
  if (!job) return null;
  const body = lines.slice(job.start, job.end);

  /* `includeOwn` is false for the PUBLISHING job itself, and that is not a
   * nicety: a job whose `npm test` runs AFTER actions/deploy-pages has already
   * shipped the bad build. Order only stops mattering once the gate is in a
   * job the publisher waits for, which is every other caller of this. */
  const cmds = includeOwn ? runCommands(lines, job.start, job.end) : [];
  const own = cmds.find(isGateCommand);
  if (own) return { via: 'runs', where: `${path.basename(file)} [${jobName}]`, detail: own };

  const uses = /^\s*uses:\s*(\.\/\S+)/m.exec(body.join('\n'));
  if (uses) {
    const called = path.join(root, repo, uses[1].replace(/^\.\//, ''));
    const cl = readLines(called);
    if (cl) {
      for (const cj of comments.jobBlocks(cl)) {
        const g = gateBehind(root, repo, called, cj.name, seen);
        if (g) {
          return { via: 'reusable-workflow', where: `${path.basename(file)} [${jobName}] -> ${uses[1]} [${cj.name}]`, detail: g.detail };
        }
      }
    }
  }

  for (const n of needsOf(body)) {
    const g = gateBehind(root, repo, file, n, seen);
    if (g) return { via: g.via === 'runs' ? 'needs' : `needs -> ${g.via}`, where: g.where, detail: g.detail };
  }
  return null;
}

function needsOf(bodyLines) {
  const out = [];
  for (let i = 0; i < bodyLines.length; i++) {
    const inline = /^\s{4}needs:\s*(\S.*)$/.exec(bodyLines[i]);
    if (inline) {
      out.push(...inline[1].replace(/[[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean));
      continue;
    }
    if (/^\s{4}needs:\s*$/.test(bodyLines[i])) {
      for (let j = i + 1; j < bodyLines.length && /^\s*-\s+\S/.test(bodyLines[j]); j++) {
        out.push(bodyLines[j].trim().replace(/^-\s*/, ''));
      }
    }
  }
  return out;
}

/* Job-level `if:` of a job (the four-space key, not a step's). */
function jobCondition(lines, job) {
  for (let i = job.start; i < job.end; i++) {
    const m = /^\s{4}if:\s*(\S.*)$/.exec(lines[i]);
    if (m) return m[1].trim();
  }
  return null;
}

/*
 * The whole derivation, per dispatch site. Everything the clauses are checked
 * against comes from here and nowhere else.
 */
function derive(root = FLEET_ROOT) {
  const sites = dispatchSites(root).map((s) => {
    const file = path.join(root, s.repo, '.github', 'workflows', s.target);
    const row = { ...s, targetExists: fs.existsSync(file) };
    if (!row.targetExists) return row;

    const lines = readLines(file);
    const trig = triggersOf(lines);
    row.triggers = trig;
    row.acceptsDispatch = trig.includes('workflow_dispatch');
    row.otherAutoTriggers = trig.filter((t) => OTHER_AUTO_TRIGGERS.includes(t));

    const jobs = comments.jobBlocks(lines);
    row.publishers = jobs.filter((j) => PUBLISHERS.test(lines.slice(j.start, j.end).join('\n')))
      .map((j) => j.name);

    row.suppressedBy = [];
    row.gates = [];
    for (const name of row.publishers) {
      const job = jobs.find((j) => j.name === name);
      const chain = [name, ...allNeeds(lines, jobs, name)];
      for (const n of chain) {
        const nj = jobs.find((j) => j.name === n);
        if (!nj) continue;
        const cond = jobCondition(lines, nj);
        if (cond && evalCondition(cond, { 'github.event_name': 'workflow_dispatch' }) === false) {
          row.suppressedBy.push(`${s.target} [${n}] if: ${cond}`);
        }
      }
      /* A fused build-and-publish job is gated by step ORDER: the publish step
       * sits after the commands that judge the tree. Read first, because for
       * this one job order is the whole argument. */
      const body = lines.slice(job.start, job.end);
      const pubAt = body.findIndex((l) => PUBLISHERS.test(l));
      const fused = runCommands(lines, job.start, job.start + pubAt).find(isGateCommand);
      if (fused) {
        row.gates.push({ job: name, via: 'fused step order', where: `${s.target} [${name}]`, detail: fused });
        continue;
      }
      const gate = gateBehind(root, s.repo, file, name, new Set(), false);
      if (gate) row.gates.push({ job: name, ...gate });
    }
    row.ungated = row.publishers.filter((p) => !row.gates.some((g) => g.job === p));
    return row;
  });

  const totals = {
    sites: sites.length,
    targetsMissing: sites.filter((s) => !s.targetExists).map((s) => `${s.repo} -> ${s.target}`),
    noPublisher: sites.filter((s) => s.targetExists && !s.publishers.length).map((s) => `${s.repo} -> ${s.target}`),
    notAcceptingDispatch: sites.filter((s) => s.targetExists && !s.acceptsDispatch).map((s) => `${s.repo} -> ${s.target}`),
    suppressed: sites.flatMap((s) => (s.suppressedBy || []).map((d) => `${s.repo} -> ${d}`)),
    ungated: sites.flatMap((s) => (s.ungated || []).map((p) => `${s.repo} -> ${s.target} [${p}]`)),
    otherAutoTriggers: sites.flatMap((s) => (s.otherAutoTriggers || []).map((t) => `${s.repo} -> ${s.target}: ${t}`)),
    gateVia: sites.flatMap((s) => s.gates || []).reduce((acc, g) => {
      acc[g.via] = (acc[g.via] || 0) + 1; return acc;
    }, {}),
  };
  return { root, sites, totals };
}

function allNeeds(lines, jobs, name, seen = new Set()) {
  const job = jobs.find((j) => j.name === name);
  if (!job || seen.has(name)) return [];
  seen.add(name);
  const direct = needsOf(lines.slice(job.start, job.end));
  return direct.flatMap((n) => [n, ...allNeeds(lines, jobs, n, seen)]);
}

/* ------------------------------------------------------- reading the clauses
 *
 * Each clause is located by its SUBJECT, never by its words, and then read for
 * polarity. Reword freely; invert and this fails. */

const NEGATORS = /\b(no|not|never|nothing|none|cannot|nor|without|fails? to|isn'?t|aren'?t|doesn'?t|won'?t|can'?t|n'?t)\b/i;
const BLOCKED = /(suppress\w*|ignor\w*|block\w*|drop(s|ped)?|discard\w*|refus\w*|reject\w*|swallow\w*|silenc\w*)/i;
const HONOURED = /(honou?r\w*|accept\w*|deliver\w*|fires?|firing|trigger\w*|runs?|start\w*|reach\w*|acted on|goes through)/i;

/* The SUBJECT of the sentence has to be masked before its predicate is read,
 * and this is not fussiness: the subject here is literally spelled
 * `workflow_dispatch`, so an unmasked HONOURED lexicon matches the "work" in
 * the subject noun, lands to the LEFT of "suppressed", and reads the polarity
 * off a word that asserts nothing. That is how the first draft of this file
 * passed the very inversion it was written to catch. */
const maskSubject = (s) => s.replace(/workflow_dispatch|workflow run|dispatched run|dispatch(es|ed|ing)?/gi, ' XDISPATCHX ');

const sentencesOf = (canonical) => canonical.join(' ')
  .replace(/\s+/g, ' ')
  .split(/(?<=\.)\s+/)
  .map((s) => s.trim())
  .filter(Boolean);

/* Does the window around `at` negate its predicate? "ships nothing" puts the
 * negator after the verb, "is not suppressed" before it, so both sides are
 * read. */
const negatedAround = (text, at, back = 45, fwd = 30) =>
  NEGATORS.test(text.slice(Math.max(0, at - back), at + fwd));

/* The consequence half of a sentence: everything after "so" / "therefore" /
 * "which means". The claim about what a bad merge ends up shipping lives there,
 * and reading the whole sentence instead finds the "deploy" inside
 * "gate-then-deploy" — the mechanism, not the outcome — and reads its polarity
 * off the wrong clause. */
const consequenceOf = (s) => {
  const m = /[,;]?\s*\b(so|therefore|which means|and so)\b\s+/i.exec(s);
  return m ? s.slice(m.index + m[0].length) : s;
};

function polarity(raw) {
  const sentence = maskSubject(raw);
  const b = BLOCKED.exec(sentence);
  const h = HONOURED.exec(sentence);
  if (!b && !h) return { readable: false, why: 'no predicate about whether the dispatch is acted on' };
  const first = (!h || (b && b.index < h.index)) ? { kind: 'blocked', at: b.index } : { kind: 'honoured', at: h.index };
  const neg = negatedAround(sentence, first.at);
  const honoured = first.kind === 'blocked' ? neg : !neg;
  return { readable: true, honoured, predicate: first.kind, negated: neg };
}

const CLAUSES = [
  {
    id: 'push-event-suppressed',
    subject: /push event/i,
    bound: 'partial',
    read(sentence) {
      const at = sentence.search(/push event/i);
      const suppressed = negatedAround(sentence, at, 60, 60) || /suppress/i.test(sentence);
      return { readable: true, asserted: { pushEventSuppressed: suppressed },
        why: suppressed ? 'asserts a GITHUB_TOKEN merge raises no push event'
          : 'asserts a GITHUB_TOKEN merge DOES raise a push event' };
    },
    derive(ev) {
      return {
        derived: { pushEventSuppressed: true },
        evidence: 'GitHub platform behaviour — NOT derivable from this fleet (see header). Pinned by '
          + `coherence with the derived trigger set: ${ev.totals.sites} dispatch targets, `
          + `${ev.totals.otherAutoTriggers.length} of them with any trigger other than push / `
          + 'pull_request / workflow_dispatch that could ship a merge anyway',
        hardFail: ev.totals.otherAutoTriggers.length
          ? `a dispatch target deploys on another trigger, so "deploy would never run" is false there: ${ev.totals.otherAutoTriggers.join(', ')}`
          : null,
      };
    },
  },
  {
    id: 'dispatch-honoured',
    subject: /workflow_dispatch/i,
    bound: 'yes',
    read(sentence) {
      const p = polarity(sentence);
      if (!p.readable) return { readable: false, why: p.why };
      return { readable: true, asserted: { dispatchHonoured: p.honoured },
        why: `${p.predicate}${p.negated ? ' + negation' : ''} -> asserts a dispatched run `
          + `${p.honoured ? 'IS' : 'is NOT'} acted on` };
    },
    derive(ev, extra) {
      const bad = [...ev.totals.notAcceptingDispatch.map((s) => `${s}: no workflow_dispatch trigger`),
        ...ev.totals.suppressed];
      const faultNote = extra && 'dispatchFiresUnderFault' in extra
        ? `; fault injection (dispatch-proof A4): the dispatch ${extra.dispatchFiresUnderFault ? 'FIRES' : 'does NOT fire'} under the failure that silences the old construct`
        : '; fault-injection half not re-run here (dispatch-proof A4 runs it)';
      const faultBad = extra && extra.dispatchFiresUnderFault === false;
      return {
        derived: { dispatchHonoured: bad.length === 0 && !faultBad },
        evidence: `${ev.totals.sites - ev.totals.notAcceptingDispatch.length}/${ev.totals.sites} dispatch targets `
          + `declare workflow_dispatch, ${ev.totals.suppressed.length} publish paths carry an \`if:\` that is `
          + `false for a dispatched run${faultNote}`,
        detail: bad,
      };
    },
  },
  {
    id: 'same-gate-then-deploy',
    subject: /gate|pipeline/i,
    bound: 'yes',
    read(sentence) {
      const bypass = /(skips?|bypass\w*|without|straight to|ungated|no gate)/i.test(sentence);
      const outcome = consequenceOf(sentence);
      const shipAt = outcome.search(/(ship|publish|deploy|go live|reach)/i);
      if (shipAt < 0) return { readable: false, why: 'no predicate about what a bad merge ends up shipping' };
      const shipsNothing = negatedAround(outcome, shipAt, 45, 35);
      return { readable: true, asserted: { gated: !bypass, shipsNothing },
        why: `asserts the dispatched run ${bypass ? 'SKIPS the gate' : 'runs the same gate'} and a bad merge `
          + `ships ${shipsNothing ? 'nothing' : 'ANYWAY'}` };
    },
    derive(ev) {
      const gated = ev.totals.ungated.length === 0 && ev.totals.noPublisher.length === 0
        && ev.totals.targetsMissing.length === 0;
      const via = Object.entries(ev.totals.gateVia).map(([k, n]) => `${n} ${k}`).join(', ');
      return {
        derived: { gated, shipsNothing: gated },
        evidence: `${ev.totals.sites - ev.totals.ungated.length}/${ev.totals.sites} dispatch targets gate before `
          + `they publish (${via})`,
        detail: [...ev.totals.targetsMissing.map((s) => `dispatch target missing: ${s}`),
          ...ev.totals.noPublisher.map((s) => `no publisher job: ${s}`),
          ...ev.totals.ungated.map((s) => `ungated publisher: ${s}`)],
      };
    },
  },
];

/* Clauses of the paragraph that are not propositions about the fleet. Listed so
 * the report never implies every sentence is checked. */
const UNBOUND_NOTES = [
  ['"Ask for it explicitly"', 'an instruction, not a claim — nothing to derive'],
  ['"the site would keep serving the previous build"',
    'the consequence of the platform fact in clause 1; witnessed by the 2026-08-20 incident, not by this fleet\'s YAML'],
  ['clause 1, first half', 'whether GitHub suppresses the push event of a GITHUB_TOKEN merge is platform '
    + 'behaviour and is NOT derivable here; only its corollary and its polarity are checked'],
];

/*
 * verify — read CANONICAL, derive the evidence, compare.
 *
 *   canonical  the paragraph to judge (defaults to the live CANONICAL, which is
 *              the point; tools/dispatch-mutations.js passes mutated variants)
 *   evidence   a derivation from derive() (computed if absent)
 *   extra      out-of-band evidence, today only { dispatchFiresUnderFault }
 */
function verify({ canonical = comments.CANONICAL, evidence, extra, root = FLEET_ROOT } = {}) {
  const ev = evidence || derive(root);
  const sentences = sentencesOf(canonical);
  const rows = [];

  /* EVIDENCE FIRST, and this row is not ceremony.
   *
   * Every clause below is "true" when the derivation finds nothing to
   * contradict it — so a walk that stopped seeing sites would report all three
   * clauses green over zero evidence, which is the exact defect this whole
   * family of fixes is about, committed by the checker written to fix it. The
   * derivation is therefore held to the pinned denominator in
   * tools/dispatch-census.json: it must have SEEN the fleet before its silence
   * counts as support. */
  if (ev.root === FLEET_ROOT) {
    let pinned = null;
    let why = null;
    try { pinned = require('./dispatch-census.js').loadCensus().totals.dispatchSites; } catch (e) { why = e.message; }
    if (pinned === null || ev.totals.sites !== pinned) {
      rows.push({ id: 'evidence-coverage', status: 'UNDERIVED', ok: false,
        why: pinned === null
          ? `the pinned denominator could not be read (${why}), so nothing establishes that this derivation saw the fleet`
          : `the derivation saw ${ev.totals.sites} dispatch sites; tools/dispatch-census.json pins `
            + `${pinned}. Every clause below is supported by ABSENCE of counter-evidence, so a derivation `
            + 'that has stopped seeing labs would report them all true over nothing' });
    }
  }

  for (const clause of CLAUSES) {
    const hits = sentences.filter((s) => clause.subject.test(s));
    if (hits.length !== 1) {
      rows.push({ id: clause.id, status: hits.length ? 'AMBIGUOUS' : 'UNLOCATED', ok: false,
        why: hits.length
          ? `${hits.length} sentences of CANONICAL are about this subject, so which one states the claim is a guess`
          : 'CANONICAL no longer says anything about this subject, so the derivation behind it is unbound' });
      continue;
    }
    const sentence = hits[0];
    const asserted = clause.read(sentence);
    if (!asserted.readable) {
      rows.push({ id: clause.id, sentence, status: 'UNREADABLE', ok: false,
        why: `${asserted.why} — a paragraph whose claim cannot be read is a paragraph nobody is checking` });
      continue;
    }
    const d = clause.derive(ev, extra);
    const mismatched = Object.keys(asserted.asserted)
      .filter((k) => k in d.derived && asserted.asserted[k] !== d.derived[k]);
    const ok = !mismatched.length && !d.hardFail;
    rows.push({
      id: clause.id,
      sentence,
      status: ok ? 'BOUND-OK' : 'FALSE',
      ok,
      bound: clause.bound,
      asserted: asserted.asserted,
      derived: d.derived,
      why: asserted.why,
      evidence: d.evidence,
      detail: [...(d.detail || []), ...(d.hardFail ? [d.hardFail] : [])],
      mismatched,
    });
  }
  return { rows, evidence: ev, failures: rows.filter((r) => !r.ok) };
}

/* ------------------------------------------------------------------- report */

function report(v, { verbose = false } = {}) {
  console.log(`CANONICAL clauses bound to re-derived evidence (${v.evidence.totals.sites} dispatch sites under ${FLEET_ROOT}):`);
  for (const r of v.rows) {
    const mark = r.ok ? 'ok   ' : 'FALSE';
    console.log(`\n  ${mark} ${r.id}${r.bound === 'partial' ? '  [partially bound — see header]' : ''}`);
    if (r.sentence) console.log(`        clause:   ${r.sentence}`);
    if (r.why) console.log(`        asserted: ${r.why}`);
    if (r.evidence) console.log(`        derived:  ${r.evidence}`);
    if (!r.ok) {
      console.log(`        VERDICT:  ${r.status}${r.mismatched && r.mismatched.length ? ` on ${r.mismatched.join(', ')}` : ''}`);
      for (const d of (r.detail || []).slice(0, 12)) console.log(`                  ${d}`);
      if (r.why && r.status !== 'FALSE') console.log(`                  ${r.why}`);
    }
  }
  console.log('\n  NOT BOUND, and not counted as checked:');
  for (const [what, why] of UNBOUND_NOTES) console.log(`        ${what} — ${why}`);

  if (verbose) {
    console.log('\n  Per-site derivation:');
    for (const s of v.evidence.sites) {
      console.log(`        ${s.repo} -> ${s.target}  dispatch=${s.acceptsDispatch} `
        + `publishers=[${(s.publishers || []).join(',')}] gates=[${(s.gates || []).map((g) => g.via).join(',')}]`);
    }
  }

  if (v.failures.length) {
    console.log(`\n${v.failures.length} clause(s) of CANONICAL are not supported by the fleet they are written into.`);
    console.log('Do NOT run tools/dispatch-comment-sync.js to make this green — that writer PROPAGATES');
    console.log('CANONICAL into ~195 repos, which is how a false sentence becomes fleet-wide.');
    console.log('Either the paragraph is wrong (fix the text) or the fleet is (fix the labs).');
  }
  return v.failures.length;
}

function main() {
  const check = process.argv.includes('check');
  const v = verify();
  const failed = report(v, { verbose: process.argv.includes('-v') });
  if (!failed) console.log('\nEvery bound clause of CANONICAL is true of the fleet it is written into.');
  return check && failed ? 1 : 0;
}

module.exports = { derive, verify, report, CLAUSES, UNBOUND_NOTES, evalCondition, polarity,
  sentencesOf, isGateCommand, dispatchSites, FLEET_ROOT };

if (require.main === module) process.exit(main());
