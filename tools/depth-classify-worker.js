/* depth-classify-worker.js — one read-only diagnostic classifier.
 * Not runnable. Invoked by depth-bounded.js in an isolated worker.
 */
'use strict';
const path = require('path');
const { parentPort, workerData } = require('worker_threads');
try {
  let row;
  if (workerData.kind === 'depth') {
    const { classify, walk } = require('./depth-audit.js');
    row = classify(workerData.lab, walk(path.join(__dirname, '..', '.scratch', workerData.lab)));
  } else if (workerData.kind === 'invocation') {
    row = require('./test-invocation.js').classify(workerData.lab);
  } else throw new Error('unknown diagnostic classifier');
  parentPort.postMessage({ row });
} catch (error) { parentPort.postMessage({ error: String(error.message).split('\n')[0] }); }
