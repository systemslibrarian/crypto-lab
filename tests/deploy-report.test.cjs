'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// Drive the actual CLI, including its fleet floor and report, with controlled
// command responses. An unavailable endpoint must withdraw the global claim.
for (const mode of ['current', 'api-error', 'pages-unread', 'pending', 'no-main', 'unnamed', 'diff-unread']) {
  test(`deployment report: ${mode}`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-report-'));
    try {
      const hub = path.join(root, 'crypto-lab');
      const tools = path.join(hub, 'tools');
      const lab = path.join(root, 'crypto-lab-fixture');
      const bin = path.join(root, 'bin');
      for (const dir of [tools, bin, path.join(hub, '.git'), path.join(lab, '.git'), path.join(lab, '.github/workflows')]) fs.mkdirSync(dir, { recursive: true });
      for (const name of ['deploy-sync.js', 'gate-sync.js', 'sibling-labs.js']) fs.copyFileSync(path.join(__dirname, '../tools', name), path.join(tools, name));
      fs.writeFileSync(path.join(tools, 'dispatch-census.json'), JSON.stringify({ totals: { labs: 2 } }));
      fs.writeFileSync(path.join(lab, '.github/workflows/deploy.yml'), `${mode === 'unnamed' ? '' : 'name: Ship\n'}jobs:\n  deploy:\n    steps:\n      - uses: actions/deploy-pages@v5\n`);
      fs.writeFileSync(path.join(bin, 'git'), `#!${process.execPath}\nconst a=process.argv.slice(2),m=process.env.DEPLOY_FIXTURE_MODE;if(a[0]==='rev-parse'){if(m==='no-main')process.exit(1);console.log('a'.repeat(40));}if(a[0]==='diff'&&m==='diff-unread')process.exit(1);\n`, { mode: 0o755 });
      fs.writeFileSync(path.join(bin, 'gh'), `#!${process.execPath}\nconst a=process.argv.slice(2),m=process.env.DEPLOY_FIXTURE_MODE;if(m==='api-error'||(m==='pages-unread'&&a[0]==='api'))process.exit(1);if(a[0]==='api')console.log('workflow');else console.log(JSON.stringify([{databaseId:1,headSha:(m==='diff-unread'?'b':'a').repeat(40),event:'push',name:'Ship',status:m==='pending'?'in_progress':'completed',conclusion:m==='pending'?null:'success'}]));\n`, { mode: 0o755 });
      const r = spawnSync(process.execPath, [path.join(tools, 'deploy-sync.js'), 'check'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, DEPLOY_FIXTURE_MODE: mode } });
      assert.equal(r.status, mode === 'current' ? 0 : 1, r.stdout + r.stderr);
      const claim = /Every lab's live site is built from the sha on its main/;
      if (mode === 'current') assert.match(r.stdout, claim);
      else assert.doesNotMatch(r.stdout, claim);
      if (mode === 'pending') assert.match(r.stdout, /Still running \(1\)/);
      else if (mode !== 'current') assert.match(r.stdout, /Could not determine \(1\)/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}
