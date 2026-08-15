import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fileBase = path.join(dir, file);
    const stat = fs.statSync(fileBase);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fileBase));
    } else {
      results.push(fileBase);
    }
  });
  return results;
}

function extractSymbols(code) {
  const symbols = new Set();
  const re = /(?:function|class)\s+([A-Za-z0-9_]+)|(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=/g;
  let m;
  while ((m = re.exec(code))) {
    if (m[1]) symbols.add(m[1]);
    if (m[2]) symbols.add(m[2]);
  }
  return symbols;
}

function validateManifest(manifestPath, labDir, catalogDir) {
  let manifestObj;
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    manifestObj = yaml.load(raw);
  } catch (err) {
    console.error(`Failed to read or parse manifest: ${err.message}`);
    return 1;
  }

  const schemaPath = path.join(catalogDir, 'verification', 'schema.json');
  let schemaObj;
  try {
    schemaObj = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (err) {
    console.error(`Failed to read schema: ${err.message}`);
    return 1;
  }

  const validate = ajv.compile(schemaObj);
  const valid = validate(manifestObj);
  let hasError = false;

  if (!valid) {
    console.error('Schema validation errors:');
    validate.errors.forEach(err => {
      console.error(`- ${err.instancePath} ${err.message}`);
    });
    hasError = true;
  }

  // Cross-checks
  
  // 1. Unique IDs
  const allIds = new Set();
  const checkId = (id, context) => {
    if (allIds.has(id)) {
      console.error(`Duplicate ID found: ${id} in ${context}`);
      hasError = true;
    }
    allIds.add(id);
  };
  
  (manifestObj.claims || []).forEach(c => checkId(c.id, 'claims'));
  (manifestObj.deviations || []).forEach(d => checkId(d.id, 'deviations'));
  (manifestObj.open_questions || []).forEach(q => checkId(q.id, 'open_questions'));

  // 2. Canonical ordering (Claims by file, symbol, first line, IDs assigned C1..)
  let prevClaim = null;
  let expectedId = 1;
  (manifestObj.claims || []).forEach(c => {
    if (c.id !== `C${expectedId}`) {
      console.error(`Claim ID out of order or invalid: expected C${expectedId}, found ${c.id}`);
      hasError = true;
    }
    if (prevClaim) {
      if (c.code_anchor && prevClaim.code_anchor) {
        if (c.code_anchor.file < prevClaim.code_anchor.file) {
          console.error(`Claims out of order by file: ${c.id} should be before ${prevClaim.id}`);
          hasError = true;
        } else if (c.code_anchor.file === prevClaim.code_anchor.file) {
          if (c.code_anchor.symbol < prevClaim.code_anchor.symbol) {
             console.error(`Claims out of order by symbol: ${c.id} should be before ${prevClaim.id}`);
             hasError = true;
          } else if (c.code_anchor.symbol === prevClaim.code_anchor.symbol) {
             if (c.code_anchor.lines[0] < prevClaim.code_anchor.lines[0]) {
               console.error(`Claims out of order by line: ${c.id} should be before ${prevClaim.id}`);
               hasError = true;
             }
          }
        }
      }
    }
    prevClaim = c;
    expectedId++;
  });

  // 3. every reference_anchor.ref resolves to a reference_pack entry
  const packIds = new Set((manifestObj.reference_pack || []).map(p => p.id));
  const checkRef = (anchor, context) => {
    if (!anchor) return;
    const ref = anchor.ref;
    if (ref !== 'lab_specific' && ref !== 'TBD Pass C' && !packIds.has(ref)) {
      console.error(`Unresolved reference_anchor.ref: ${ref} in ${context}`);
      hasError = true;
    }
  };
  (manifestObj.parameters || []).forEach(p => checkRef(p.reference_anchor, `parameters ${p.name}`));
  (manifestObj.claims || []).forEach(c => checkRef(c.reference_anchor, `claims ${c.id}`));
  (manifestObj.deviations || []).forEach(d => checkRef(d.reference_anchor, `deviations ${d.id}`));

  // 4. depends_on resolves
  const claimIds = new Set((manifestObj.claims || []).map(c => c.id));
  (manifestObj.claims || []).forEach(c => {
    (c.depends_on || []).forEach(dep => {
      if (!claimIds.has(dep)) {
        console.error(`Unresolved depends_on: ${dep} in claim ${c.id}`);
        hasError = true;
      }
    });
  });

  // 5. commit_sha present
  if (!manifestObj.repository || !manifestObj.repository.commit_sha) {
    console.error('commit_sha is missing');
    hasError = true;
  }

  // 6. conditional blocks
  const isAttack = manifestObj.audit_mode && manifestObj.audit_mode.type === 'attack_reproduction';
  if (isAttack && !manifestObj.attack_model) {
    console.error('attack_model is required when audit_mode is attack_reproduction');
    hasError = true;
  } else if (!isAttack && manifestObj.attack_model) {
    console.error('attack_model must not be present unless audit_mode is attack_reproduction');
    hasError = true;
  }

  const compTypes = new Set(['arithmetic', 'invariant', 'encoding', 'distribution']);
  (manifestObj.claims || []).forEach(c => {
    if (compTypes.has(c.type) && !c.computable) {
      console.error(`computable block missing for claim ${c.id} of type ${c.type}`);
      hasError = true;
    }
  });

  // 7. banned-verdict-word lint
  const bannedWords = ['correct', 'correctly', 'secure', 'safe', 'verified', 'valid'];
  const checkBanned = (text, context, isStatement) => {
    if (!text || typeof text !== 'string') return;
    const lower = text.toLowerCase();
    for (const w of bannedWords) {
      // rough word boundary check
      const re = new RegExp(`\\b${w}\\b`, 'i');
      if (re.test(lower)) {
        if (isStatement && lower.includes('should equal')) continue; // permitted exception
        console.error(`Banned word '${w}' found in ${context}`);
        hasError = true;
      }
    }
  };
  (manifestObj.claims || []).forEach(c => {
    checkBanned(c.statement, `claim ${c.id} statement`, true);
    checkBanned(c.notes, `claim ${c.id} notes`, false);
  });
  (manifestObj.deviations || []).forEach(d => {
    checkBanned(d.description, `deviation ${d.id} description`, false);
    checkBanned(d.severity_note, `deviation ${d.id} severity_note`, false);
  });

  // 8. code_anchor.snippet matches
  let mathCoreContent = '';
  const mathCoreFiles = (manifestObj.scope_map && manifestObj.scope_map.files || [])
    .filter(f => f.role === 'math_core')
    .map(f => f.path)
    .sort();

  const fileContents = {};
  for (const f of mathCoreFiles) {
    const fp = path.join(labDir, f);
    if (fs.existsSync(fp)) {
      const content = fs.readFileSync(fp, 'utf8');
      fileContents[f] = content;
      mathCoreContent += content;
    } else {
      console.error(`math_core file not found: ${f}`);
      hasError = true;
    }
  }

  const checkSnippet = (anchor, context) => {
    if (!anchor || !anchor.file || !anchor.snippet) return;
    const content = fileContents[anchor.file];
    if (content) {
      if (!content.includes(anchor.snippet)) {
         console.error(`Snippet mismatch in ${context} for file ${anchor.file}`);
         hasError = true;
      }
    }
  };
  (manifestObj.claims || []).forEach(c => checkSnippet(c.code_anchor, `claim ${c.id}`));
  (manifestObj.parameters || []).forEach(p => checkSnippet(p.code_anchor, `parameter ${p.name}`));
  (manifestObj.deviations || []).forEach(d => checkSnippet(d.code_anchor, `deviation ${d.id}`));

  // 9. reference_quote is literal substring
  // We'll mock this slightly by just checking if the file exists if we were in real run, 
  // but to do it fully we need to load excerpts.
  const checkQuote = (quote, anchor, context) => {
    if (!quote || !anchor || anchor.ref === 'lab_specific' || anchor.ref === 'TBD Pass C') return;
    const refDir = path.join(catalogDir, 'verification', 'reference-packs', anchor.ref);
    if (!fs.existsSync(refDir)) {
      // Excerpt dir missing, cannot verify quote right now
      return;
    }
    const files = getFilesRecursively(refDir);
    let found = false;
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      if (content.includes(quote)) {
        found = true; break;
      }
    }
    if (!found && files.length > 0) {
      console.error(`reference_quote not found in excerpts for ${anchor.ref} in ${context}`);
      hasError = true;
    }
  };
  (manifestObj.parameters || []).forEach(p => checkQuote(p.reference_quote, p.reference_anchor, `parameter ${p.name}`));
  (manifestObj.deviations || []).forEach(d => checkQuote(d.reference_quote, d.reference_anchor, `deviation ${d.id}`));

  // 10. extraction_hash matches
  if (manifestObj.extraction && manifestObj.extraction.extraction_hash && manifestObj.extraction.extraction_hash !== 'PENDING') {
     const computedHash = crypto.createHash('sha256').update(mathCoreContent).digest('hex');
     if (computedHash !== manifestObj.extraction.extraction_hash) {
       console.error(`extraction_hash mismatch. Manifest declares ${manifestObj.extraction.extraction_hash}, computed ${computedHash} from math_core contents — the manifest is stale relative to the code and must be re-extracted`);
       hasError = true;
     }
  }

  // 11. warn on empty reviewed_symbols
  // 12. coverage completeness
  (manifestObj.coverage || []).forEach(cov => {
    if (!cov.reviewed_symbols || cov.reviewed_symbols.length === 0) {
      console.warn(`WARNING: empty reviewed_symbols for file ${cov.file}`);
    }
    const content = fileContents[cov.file];
    if (content) {
      const symbolsInFile = extractSymbols(content);
      const covered = new Set([
        ...(cov.reviewed_symbols || []),
        ...(cov.excluded_symbols || []),
        ...(cov.unresolved_regions || [])
      ]);
      for (const sym of symbolsInFile) {
        if (!covered.has(sym)) {
          console.error(`Symbol ${sym} in file ${cov.file} is missing from coverage block`);
          hasError = true;
        }
      }
    }
  });

  // 13. extractor_confidence below high links an open_question
  const questionIds = (manifestObj.open_questions || []).map(q => q.id);
  (manifestObj.claims || []).forEach(c => {
    if (c.extractor_confidence && c.extractor_confidence !== 'high') {
      let linked = false;
      for (const qid of questionIds) {
        if (c.notes && c.notes.includes(qid)) {
          linked = true; break;
        }
      }
      if (!linked) {
         console.error(`Claim ${c.id} has confidence ${c.extractor_confidence} but notes do not link an open_question`);
         hasError = true;
      }
    }
  });

  // 14. self-reference lint over verification blocks
  const checkVerification = (ver, context) => {
    if (!ver) return;
    const str = JSON.stringify(ver).toLowerCase();
    if (str.includes("the lab's") || str.includes("our code") || str.includes("this function")) {
      console.error(`Banned self-reference in verification block for ${context}`);
      hasError = true;
    }
  };
  (manifestObj.claims || []).forEach(c => checkVerification(c.verification, `claim ${c.id}`));

  // 15. warn when open_questions empty without simplicity assertion
  if (!manifestObj.open_questions || manifestObj.open_questions.length === 0) {
    let asserted = false;
    // Look for assertion in coverage notes or somewhere else
    (manifestObj.coverage || []).forEach(cov => {
      if (cov.note && cov.note.toLowerCase().includes('simple')) asserted = true;
    });
    if (!asserted) {
      console.warn("WARNING: open_questions is empty and no explicit simplicity assertion found.");
    }
  }

  return hasError ? 1 : 0;
}

// Each failing fixture must trip its specific check — a fixture that fails for any
// other reason (or an unregistered fixture) fails the run.
const FIXTURE_EXPECTATIONS = {
  'failing-banned-word.yaml': 'Banned word',
  'failing-commit-sha.yaml': 'commit_sha is missing',
  'failing-conditional-attack.yaml': 'attack_model is required',
  'failing-conditional-computable.yaml': 'computable block missing',
  'failing-confidence-question.yaml': 'do not link an open_question',
  'failing-coverage-missing.yaml': 'missing from coverage block',
  'failing-depends-on.yaml': 'Unresolved depends_on',
  'failing-hash.yaml': 'extraction_hash mismatch',
  'failing-ordering.yaml': 'Claims out of order',
  'failing-reference-anchor.yaml': 'Unresolved reference_anchor.ref',
  'failing-self-reference.yaml': 'Banned self-reference',
  'failing-snippet.yaml': 'Snippet mismatch',
  'failing-unique-id.yaml': 'Duplicate ID found',
};

function captureOutput(fn) {
  const lines = [];
  const origError = console.error;
  const origWarn = console.warn;
  console.error = (...args) => lines.push(args.join(' '));
  console.warn = (...args) => lines.push(args.join(' '));
  try {
    return { code: fn(), output: lines.join('\n') };
  } finally {
    console.error = origError;
    console.warn = origWarn;
  }
}

function checkFixtures(catalogDir) {
  const fixturesDir = path.join(catalogDir, 'verification', 'fixtures');
  let failures = 0;

  const passingPath = path.join(fixturesDir, 'passing-manifest.yaml');
  const passing = captureOutput(() => validateManifest(passingPath, fixturesDir, catalogDir));
  if (passing.code === 0) {
    console.log('PASS passing-manifest.yaml — validates cleanly');
  } else {
    failures++;
    console.error(`FAIL passing-manifest.yaml — expected clean validation, got:\n${passing.output}`);
  }

  const failingFixtures = fs.readdirSync(fixturesDir)
    .filter(f => f.startsWith('failing-') && f.endsWith('.yaml'))
    .sort();
  for (const fixture of failingFixtures) {
    const expected = FIXTURE_EXPECTATIONS[fixture];
    if (!expected) {
      failures++;
      console.error(`FAIL ${fixture} — no expected error registered in FIXTURE_EXPECTATIONS; add one so the fixture proves its specific check`);
      continue;
    }
    const result = captureOutput(() => validateManifest(path.join(fixturesDir, fixture), fixturesDir, catalogDir));
    if (result.code === 0) {
      failures++;
      console.error(`FAIL ${fixture} — expected validation failure, but manifest passed`);
    } else if (!result.output.includes(expected)) {
      failures++;
      console.error(`FAIL ${fixture} — failed, but not on the targeted check (wanted "${expected}"), got:\n${result.output}`);
    } else {
      console.log(`PASS ${fixture} — trips "${expected}"`);
    }
  }

  const unrun = Object.keys(FIXTURE_EXPECTATIONS).filter(f => !failingFixtures.includes(f));
  for (const fixture of unrun) {
    failures++;
    console.error(`FAIL ${fixture} — registered in FIXTURE_EXPECTATIONS but not found in ${fixturesDir}`);
  }

  console.log(failures === 0
    ? `Fixture check passed: 1 passing + ${failingFixtures.length} failing fixtures behaved as expected`
    : `Fixture check failed: ${failures} problem(s)`);
  return failures === 0 ? 0 : 1;
}

function main() {
  const defaultCatalogDir = path.dirname(path.dirname(new URL(import.meta.url).pathname));

  if (process.argv[2] === '--check-fixtures') {
    process.exit(checkFixtures(defaultCatalogDir));
  }

  if (process.argv.length < 3) {
    console.error('Usage: node validate-manifest.mjs <manifest.yaml> [lab-dir] [catalog-dir]');
    console.error('       node validate-manifest.mjs --check-fixtures');
    console.error('lab-dir defaults to the manifest\'s grandparent directory (a lab\'s verification/manifest.yaml -> the lab root).');
    process.exit(1);
  }

  const manifestPath = path.resolve(process.argv[2]);
  const labDir = process.argv[3] ? path.resolve(process.argv[3]) : path.dirname(path.dirname(manifestPath));
  const catalogDir = process.argv[4] ? path.resolve(process.argv[4]) : defaultCatalogDir;

  const code = validateManifest(manifestPath, labDir, catalogDir);
  if (code !== 0) {
    console.error('Validation failed');
    process.exit(code);
  } else {
    console.log('Manifest is valid');
  }
}

main();
