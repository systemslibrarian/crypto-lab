'use strict';

/*
 * The weekly run summary has ONE writer, and this is the test that keeps it
 * that way.
 *
 * It had two. The tool printed the counts and pin-advance.yml grepped four
 * literal labels back out of that stdout to build the table. Splitting the
 * single REFUSED number into STALE / REFUSED / HELD deleted the label
 * `REFUSED (a person must look)`, so the row silently disappeared from the
 * summary and `grep -c '^    REFUSED '` counted 12 where 119 labs were
 * refused -- a consumer re-parsing a producer's prose, which is the defect
 * this fleet keeps re-finding.
 *
 * So the workflow must hand the tool a destination and nothing else, and the
 * table must prove its own arithmetic: the six counts partition the manifest
 * and have to sum to the number of maps in it.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { renderSummary } = require('../tools/catalog-exhibits.js');

const WORKFLOW = path.join(__dirname, '..', '.github', 'workflows', 'pin-advance.yml');
const MANIFEST = path.join(__dirname, '..', 'tools', 'catalog-exhibits.json');

/** The `run:` script of the step that WRITES the anchor summary.
 *  Two steps mention the command -- the held-pin guard names it in a comment --
 *  so this keys on the write invocation and asserts there is exactly one. */
function summaryStep() {
  const yaml = fs.readFileSync(WORKFLOW, 'utf8');
  const steps = yaml.split('\n      - name:').slice(1)
    .filter((step) => /catalog-exhibits\.js advance[^\n]*--write/.test(step));
  assert.equal(steps.length, 1,
    `exactly one step must run the exhibit advance writer, found ${steps.length}`);
  return steps[0];
}

test('the workflow hands the tool a destination and parses nothing', () => {
  const step = summaryStep();
  /* The guard reads the EXECUTABLE lines only. The step carries a comment
     explaining this very defect, quoting the grep that broke -- a checker that
     read prose as code would fail on the explanation of why it exists, which
     is the same shape as a `*\/` inside a block comment ending it early. */
  const commands = step.split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');

  assert.match(commands, /catalog-exhibits\.js advance[^\n]*--summary "\$GITHUB_STEP_SUMMARY"/,
    'the tool must be given $GITHUB_STEP_SUMMARY to write into');

  /* MUTATION GUARD. Any attempt to rebuild the table by reading the report
     back out of stdout reintroduces exactly the coupling that broke. */
  const reportLabels = [
    'current \\(pin or recorded check already at HEAD\\)',
    'writable anchorsUnchangedAt',
    'COULD NOT LOOK',
    'REFUSED',
    'STALE',
    'HELD',
  ];
  for (const label of reportLabels) {
    const grepping = new RegExp(`(grep|sed|awk)[^\\n]*${label}`, 'i');
    assert.doesNotMatch(commands, grepping,
      `the step must not parse "${label}" out of the tool's output; the tool writes the table`);
  }
  /* And it must not write rows of its own: one writer means the shell does
     not append to the summary file at all. */
  assert.doesNotMatch(commands, />>\s*"\$GITHUB_STEP_SUMMARY"/,
    'the step must not append its own rows; the tool writes the table');
});

test('every row is present and the six counts sum to the lab total', () => {
  /* The real labels and a real partition. */
  const counts = [
    ['current (pin or recorded check already at HEAD)', 131],
    ['writable anchorsUnchangedAt', 0],
    ['STALE - anchored source changed', 106],
    ['REFUSED - unanchored panel source changed', 12],
    ['HELD - the owner asked for this clone to stay put', 1],
    ['COULD NOT LOOK', 0],
  ];
  const labs = Object.keys(JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).labs).length;
  assert.equal(counts.reduce((s, [, n]) => s + n, 0), labs,
    'the fixture partition must match the shipped manifest, or this test is measuring nothing');

  const md = renderSummary(counts, {
    anchorsMoved: [['crypto-lab-a', 'anchored source changed: src/x.ts']],
    panelMoved: [['crypto-lab-b', 'unanchored panel source changed']],
    heldBack: [['crypto-lab-lfsr-forge', 'the owner asked for this clone to stay put']],
    unreadable: [],
  });

  for (const [label, n] of counts) {
    assert.ok(md.includes(`| ${label} | **${n}** |`), `row missing from the summary: ${label}`);
  }
  assert.ok(md.includes(`| **total maps** | **${labs}** |`), 'the table must state the total it sums to');

  /* The folds name the labs, so the queue is readable without opening a run. */
  assert.match(md, /<details><summary>anchored source changed \(1\)<\/summary>/);
  assert.match(md, /<details><summary>held by the owner \(1\)<\/summary>/);
  assert.match(md, /- `crypto-lab-lfsr-forge`/);
  assert.doesNotMatch(md, /could not look/, 'an empty group gets no empty fold');
});

test('a table whose rows do not partition the manifest is visible as such', () => {
  /* MUTATION — drop a bucket, as a future collapse back to one number would.
     The total row stops matching the manifest, and that is the whole point of
     printing it: the table carries the evidence for its own completeness. */
  const labs = Object.keys(JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).labs).length;
  const short = [
    ['current (pin or recorded check already at HEAD)', 131],
    ['writable anchorsUnchangedAt', 0],
    ['STALE - anchored source changed', 106],
    ['COULD NOT LOOK', 0],
  ];
  const md = renderSummary(short, { anchorsMoved: [], panelMoved: [], heldBack: [], unreadable: [] });
  assert.ok(!md.includes(`| **total maps** | **${labs}** |`),
    'dropping REFUSED and HELD must stop the table summing to the manifest');
  assert.ok(md.includes('| **total maps** | **237** |'), 'and it reports the short total it actually has');
});
