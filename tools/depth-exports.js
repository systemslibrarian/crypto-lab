/* depth-exports.js — complete, pinned remote-export scope.
 * Not runnable. Shared by depth-audit.js and test-invocation.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function readExportSnapshot(root) {
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
  const failed = new Map();
  for (const line of lines('.export-failed.tsv')) {
    const [lab, branch, ...reason] = line.split('\t');
    if (!wanted.has(lab) || wanted.get(lab) !== branch || !reason.join('\t') || failed.has(lab)) unread('invalid or duplicate failed-export row');
    failed.set(lab, reason.join('\t'));
  }
  const exported = new Map();
  const absent = new Map();
  for (const line of lines('.exported.tsv')) {
    const [lab, branch, sha, extra] = line.split('\t');
    if (!wanted.has(lab) || wanted.get(lab) !== branch || !/^[0-9a-f]{40}$/.test(sha || '') || extra !== undefined || exported.has(lab) || absent.has(lab) || failed.has(lab)) unread('invalid, unpinned, contradictory or duplicate export row');
    const dir = path.join(root, lab);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      absent.set(lab, { sha, reason: 'recorded export source directory is absent' });
      continue;
    }
    exported.set(lab, { branch, sha });
  }
  const unreadable = [...wanted].filter(([lab]) => !exported.has(lab)).map(([lab, branch]) => ({
    lab, branch, sourceSha: absent.get(lab)?.sha || null, state: 'UNREAD',
    reason: failed.get(lab) || absent.get(lab)?.reason || 'no successful export or failure record',
  }));
  return { exported, scope: {
    complete: unreadable.length === 0, discovered: wanted.size,
    exported: exported.size, unreadable,
  } };
}
function readExports(root) {
  const snapshot = readExportSnapshot(root);
  if (!snapshot.scope.complete) throw new Error(`UNREAD: partial export: ${snapshot.scope.exported} of ${snapshot.scope.discovered} discovered labs (${snapshot.scope.unreadable.map(r => r.lab).join(', ')}). Run: node tools/depth-audit.js export`);
  return snapshot.exported;
}
module.exports = { readExports, readExportSnapshot };
