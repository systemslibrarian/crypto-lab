/* depth-exports.js — complete, pinned remote-export scope.
 * Not runnable. Shared by depth-audit.js and test-invocation.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function readExports(root) {
  const unread = why => { throw new Error(`UNREAD: ${why}. Run: node tools/depth-audit.js export`); };
  const lines = file => {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) unread(`missing ${file}`);
    return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean);
  };
  const wanted = new Map();
  for (const line of lines('.to-export.tsv')) {
    const [lab, branch, extra] = line.split('\t');
    if (!lab || !branch || extra !== undefined || !/^[a-zA-Z0-9_.-]+$/.test(lab) || lab === '.' || lab === '..' || wanted.has(lab)) unread('invalid or duplicate discovery row');
    wanted.set(lab, branch);
  }
  if (!wanted.size) unread('empty discovered fleet');
  const failed = lines('.export-failed.tsv');
  if (failed.length) unread(`${failed.length} failed exports (${failed.map(l => l.split('\t')[0]).join(', ')})`);
  const exported = new Map();
  for (const line of lines('.exported.tsv')) {
    const [lab, branch, sha, extra] = line.split('\t');
    if (!wanted.has(lab) || wanted.get(lab) !== branch || !/^[0-9a-f]{40}$/.test(sha || '') || extra !== undefined || exported.has(lab)) unread('invalid, unpinned or duplicate export row');
    const dir = path.join(root, lab);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) unread(`missing exported source for ${lab}`);
    exported.set(lab, { branch, sha });
  }
  if (exported.size !== wanted.size) unread(`partial export: ${exported.size} of ${wanted.size} discovered labs`);
  return exported;
}
module.exports = { readExports };
