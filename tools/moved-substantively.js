/**
 * ONE definition of "did this lab's source move substantively", shared by both
 * readers that ask the question.
 *
 * It used to be two. tools/catalog-evidence.js asked it with a path-prefix
 * allowlist (SUBSTANTIVE below); the Fleet Console's scripts/extract-source.cjs
 * asked it with a file-EXTENSION allowlist plus an exclusion list. The two
 * disagreed, and on 2026-11-10 the disagreement was measured on live data:
 * crypto-lab-shamir-gate read `stale` in the console and `not-moved` in the hub,
 * because `demos/shamir-gate/index.html` had changed. One lab, two answers, and
 * no way to say which was the finding -- the exact shape this repository refuses
 * everywhere else. Two answers to "what is this lab's source" in one fleet is
 * how the second reader misses what the first one learned.
 *
 * The rule, now stated once:
 *
 *   A changed path is substantive if it matches SUBSTANTIVE,
 *   OR it is demos/<name>/index.html AND that demo has no demos/<name>/src/,
 *   because then its logic lives in the HTML and there is no source tree to
 *   carry it.
 *
 * NOT_THE_LAB and NOT_THIS_LABS_CODE apply on top of both branches.
 *
 * Why the second branch is NOT folded into the SUBSTANTIVE regex: a regex over
 * one path cannot know whether a sibling directory exists, and that is exactly
 * the fact the rule turns on. A demo WITH a src/ tree keeps the original
 * behaviour -- an index.html edit there is page furniture, and the deliberate
 * exclusion recorded in catalog-evidence.js stands: anchors into index.html are
 * already re-opened on every run by STALE-ANCHOR, so pointer rot has its own
 * check and this question is only about whether a person's reading of the
 * SOURCE still holds. tests/clone-currency.test.cjs asserts the raw regex still
 * rejects `demos/shamir-gate/index.html`, and it still does; the carve-out is a
 * layer above it, not an edit to it.
 */

/* Tests and e2e are the lab's checks on itself, not the lab. A spec that asserts
   an AES vector is evidence the suite knows about AES, not that the demo does. */
const NOT_THE_LAB = /(^|\/)(e2e|tests?|__tests__|scripts|contrast)(\/|$)|\.(spec|test)\.[tj]sx?$/;

/* Vendored bundles are somebody else's code, and minified code is one line: an
   anchor into it points at a line of 400KB and proves nothing about this lab.
   A .d.ts DECLARES an external library's shape and implements none of it —
   crypto-lab-sm2-forge's sm-crypto.d.ts is a type stub for a dependency. */
const NOT_THIS_LABS_CODE = /(^|\/)(vendor|vendored|third[-_]party|public\/lib)(\/|$)|\.min\.[tj]sx?$|\.d\.ts$/;

/* The path-prefix allowlist. These are the DEFAULTS, and they are deliberately
   not widened by guessing: every entry is a place a lab's own implementation
   conventionally lives. Five labs keep theirs somewhere else and DECLARE it in
   tools/source-roots.json; see rootsFor below for why guessing a wider pattern
   was refused. */
const SUBSTANTIVE = /^(README\.md|src\/|demos\/[^/]+\/src\/|web-demo\/|crates\/|wasm\/|native\/)/;

const DEMO_INDEX = /^demos\/([^/]+)\/index\.html$/;

/* DECLARED SOURCE ROOTS, for labs whose implementation is outside the defaults.
 *
 * Found 2026-11-10, and found the hard way: crypto-lab-ratchet-wire's source is
 * entirely under `ratchet-wire/`, which SUBSTANTIVE does not match, so a rename
 * landed in ratchet-wire/src/crypto/hybrid-session.ts and the pin did NOT go
 * stale. That is the exact failure a pin exists to prevent -- a person's
 * recorded judgement continuing to apply over source that has since changed.
 * Measured across the 253 carded labs, five are in that position, four of them
 * pinned: covert-channel-studio (js/), confirmer-signatures (prototype/ and
 * research/), ablation-wire (two Rust crates plus an inline-logic page),
 * ratchet-wire (ratchet-wire/src/) and zk-proof-lab (js/).
 *
 * The roots are DECLARED per lab rather than inferred by widening the regex,
 * because every widening considered was either too narrow or too broad. A
 * generalised `^[^/]+/src/` reaches ablation-wire and ratchet-wire and misses
 * js/, prototype/ and research/ entirely -- three of the five. Anything loose
 * enough to catch those (any top-level directory holding source) would make
 * every fuzz target, doc script and vendored sample substantive for every lab
 * in the fleet. So the rule stays narrow and the exceptions are written down,
 * each with the reason it is one, which is also how clone-holds.json and
 * anchor-dispositions.json handle their exceptions.
 *
 * What is NOT a root is as deliberate as what is. ratchet-wire's
 * vite.config.ts and playwright.config.ts sit beside its source and are left
 * out: a build-config edit is not a change to the code a person read. Anchored
 * DOCS are left out for the reason already recorded above SUBSTANTIVE -- an
 * anchor into a doc is re-opened on every run by STALE-ANCHOR, so pointer rot
 * has its own check, and this question is only about the source.
 *
 * A root is a directory prefix ending in `/`, or one exact file path. No
 * globbing and no regex: the one thing this file must never do is answer a
 * question about a path by guessing at its shape.
 */
const DECLARED = require('./source-roots.json');

function validateDeclared(table) {
  for (const [slug, entry] of Object.entries(table)) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`source-roots.json: ${slug} must be an object with roots and reason`);
    }
    const { roots, reason } = entry;
    if (!Array.isArray(roots) || !roots.length) {
      throw new Error(`source-roots.json: ${slug} declares no roots`);
    }
    for (const r of roots) {
      if (typeof r !== 'string' || !r.trim()) {
        throw new Error(`source-roots.json: ${slug} has an empty root`);
      }
      if (r.startsWith('/') || r.includes('..') || r.includes('*')) {
        throw new Error(`source-roots.json: ${slug} root ${JSON.stringify(r)} must be a repo-relative prefix or exact path, with no globbing`);
      }
    }
    /* A reason is mandatory for the same purpose it is mandatory on a
       protocol-partial ruling: this table makes a checker see MORE, and an
       entry with no reason records that someone widened the rule without
       recording what for. */
    if (typeof reason !== 'string' || !reason.trim()) {
      throw new Error(`source-roots.json: ${slug} has no written reason`);
    }
  }
  return table;
}
validateDeclared(DECLARED);

/** The declared extra roots for one lab; empty for the 248 that need none. */
function rootsFor(slug) {
  return (DECLARED[slug] && DECLARED[slug].roots) || [];
}

/** Does `file` sit under one of these declared roots? */
function underDeclaredRoot(file, roots) {
  for (const r of roots || []) {
    if (r.endsWith('/') ? file.startsWith(r) : file === r) return true;
  }
  return false;
}

/** Is this one changed path substantive?
 *
 * `demoHasSrc(name)` answers whether demos/<name>/src/ exists in the tree being
 * judged. It is INJECTED rather than read here so this function stays pure: a
 * fixture can drive both branches with no clone and no network, which is the
 * only way the carve-out can be tested at all -- no lab in the fleet currently
 * has a demos/<name>/index.html without a sibling src/, so live data exercises
 * one branch and never the other.
 */
function countsAsSubstantive(file, demoHasSrc, roots) {
  if (NOT_THE_LAB.test(file) || NOT_THIS_LABS_CODE.test(file)) return false;
  if (SUBSTANTIVE.test(file)) return true;
  /* A declared root is checked AFTER the exclusions above, so a test or a
     vendored bundle inside a declared root is still not the lab. */
  if (underDeclaredRoot(file, roots)) return true;
  const m = DEMO_INDEX.exec(file);
  if (!m) return false;
  if (typeof demoHasSrc !== 'function') {
    /* Could not look is not permission to call it substantive, and not
       permission to call it furniture either. The caller must supply the
       lookup; refusing loudly here keeps a missing argument from silently
       deciding the rule one way for every lab. */
    throw new TypeError('countsAsSubstantive needs demoHasSrc to judge a demos/<name>/index.html change');
  }
  return !demoHasSrc(m[1]);
}

/** Every substantive path among `files`, in input order. */
function substantiveChanges(files, demoHasSrc, roots) {
  return (files || []).filter((f) => f && countsAsSubstantive(f, demoHasSrc, roots));
}

/** Build demoHasSrc from a list of tracked paths (one per line, or an array). */
function demoHasSrcFrom(trackedPaths) {
  const list = Array.isArray(trackedPaths)
    ? trackedPaths
    : String(trackedPaths || '').split('\n');
  const withSrc = new Set();
  for (const p of list) {
    const m = /^demos\/([^/]+)\/src\//.exec(String(p).trim());
    if (m) withSrc.add(m[1]);
  }
  return (name) => withSrc.has(name);
}

module.exports = {
  DECLARED,
  rootsFor,
  underDeclaredRoot,
  validateDeclared,
  NOT_THE_LAB,
  NOT_THIS_LABS_CODE,
  SUBSTANTIVE,
  DEMO_INDEX,
  countsAsSubstantive,
  substantiveChanges,
  demoHasSrcFrom,
};
