/* depth-bounded.js — bounded diagnostic classification of pinned exports.
 * Not runnable. Shared by the opt-in partial reports, never by assurance checks.
 */
'use strict';
const path = require('path');
const { Worker } = require('worker_threads');

function waitForClassification(worker, timeoutMs) {
  return new Promise(resolve => {
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate().catch(() => {});
      resolve(value);
    };
    const timer = setTimeout(() => finish({ error: `classification timed out after ${timeoutMs}ms` }), timeoutMs);
    worker.once('message', finish);
    worker.once('error', error => finish({ error: String(error.message).split('\n')[0] }));
    worker.once('exit', code => finish({ error: `classifier exited ${code} without a result` }));
  });
}

async function classifyExports(exported, kind, { timeoutMs = 20000, concurrency = 4 } = {}) {
  const ordered = [...exported].sort(([a], [b]) => a.localeCompare(b));
  const results = new Array(ordered.length);
  let next = 0;
  async function consume() {
    for (;;) {
      const index = next++;
      if (index >= ordered.length) return;
      const [lab, source] = ordered[index];
      console.error(`DIAGNOSTIC ${kind} start ${lab} @ ${source.sha}`);
      const worker = new Worker(path.join(__dirname, 'depth-classify-worker.js'), {
        workerData: { lab, kind }, resourceLimits: { maxOldGenerationSizeMb: 256 },
      });
      const result = await waitForClassification(worker, timeoutMs);
      results[index] = result.error
        ? { unreadable: { lab, sourceSha: source.sha, state: 'UNREAD', reason: result.error } }
        : { row: { ...result.row, sourceSha: source.sha } };
      console.error(`DIAGNOSTIC ${kind} ${result.error ? 'UNREAD: ' + result.error : 'done'} ${lab}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, ordered.length) }, consume));
  const rows = results.filter(r => r.row).map(r => r.row);
  const unreadable = results.filter(r => r.unreadable).map(r => r.unreadable);
  return { rows, scan: { complete: unreadable.length === 0, attempted: ordered.length,
    classified: rows.length, unreadable, timeoutMs, concurrency } };
}
module.exports = { classifyExports, waitForClassification };
