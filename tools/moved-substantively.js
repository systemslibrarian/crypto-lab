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

/* The path-prefix allowlist. Unchanged, and deliberately not widened: every
   entry here is a place a lab's own implementation lives. */
const SUBSTANTIVE = /^(README\.md|src\/|demos\/[^/]+\/src\/|web-demo\/|crates\/|wasm\/|native\/)/;

const DEMO_INDEX = /^demos\/([^/]+)\/index\.html$/;

/** Is this one changed path substantive?
 *
 * `demoHasSrc(name)` answers whether demos/<name>/src/ exists in the tree being
 * judged. It is INJECTED rather than read here so this function stays pure: a
 * fixture can drive both branches with no clone and no network, which is the
 * only way the carve-out can be tested at all -- no lab in the fleet currently
 * has a demos/<name>/index.html without a sibling src/, so live data exercises
 * one branch and never the other.
 */
function countsAsSubstantive(file, demoHasSrc) {
  if (NOT_THE_LAB.test(file) || NOT_THIS_LABS_CODE.test(file)) return false;
  if (SUBSTANTIVE.test(file)) return true;
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
function substantiveChanges(files, demoHasSrc) {
  return (files || []).filter((f) => f && countsAsSubstantive(f, demoHasSrc));
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
  NOT_THE_LAB,
  NOT_THIS_LABS_CODE,
  SUBSTANTIVE,
  DEMO_INDEX,
  countsAsSubstantive,
  substantiveChanges,
  demoHasSrcFrom,
};
