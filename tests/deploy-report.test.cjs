'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const positive = ['current', 'prior-ancestor', 'legacy-current', 'old-failure-new-success', 'new-cancelled-prior-success', 'optional-job-skipped', 'failure-diagnostic-skipped'];
const negative = ['api-error', 'pages-unread', 'pages-invalid', 'pending', 'no-main', 'unnamed', 'diff-unread', 'fetch-failed', 'tree-unread', 'workflow-unread', 'workflow-malformed', 'jobs-unread', 'jobs-invalid', 'jobs-empty', 'publish-skipped', 'publish-missing', 'publish-step-skipped', 'download-failed', 'job-failed', 'job-cancelled', 'job-pending', 'steps-unread', 'new-failure-old-success', 'prior-unrelated', 'prior-jobs-unread', 'legacy-build-unread', 'legacy-build-failed', 'legacy-wrong-commit', 'pull-request-only'];
negative.push('download-skipped', 'build-steps-unread', 'build-step-failed', 'build-step-skipped', 'needed-job-skipped');
for (const mode of [...positive, ...negative]) {
  test(`deployment report: ${mode}`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-report-'));
    try {
      const hub = path.join(root, 'crypto-lab'), tools = path.join(hub, 'tools');
      const lab = path.join(root, 'crypto-lab-fixture'), bin = path.join(root, 'bin');
      for (const dir of [tools, bin, path.join(hub, '.git'), path.join(lab, '.git'), path.join(lab, '.github/workflows')]) fs.mkdirSync(dir, { recursive: true });
      for (const name of ['deploy-sync.js', 'gate-sync.js', 'sibling-labs.js']) fs.copyFileSync(path.join(__dirname, '../tools', name), path.join(tools, name));
      fs.writeFileSync(path.join(tools, 'dispatch-census.json'), JSON.stringify({ totals: { labs: 2 } }));
      const needsBuild = mode === 'needed-job-skipped' || mode === 'build-step-skipped' || mode === 'failure-diagnostic-skipped';
      const workflow = `${mode === 'unnamed' ? '' : 'name: Ship\n'}jobs:\n  deploy:\n${needsBuild ? '    needs: build\n' : ''}    steps:\n      - name: Publish site\n        uses: actions/deploy-pages@v5\n${needsBuild ? '  build:\n    steps:\n      - name: Verify\n        run: npm test\n' : ''}${mode === 'failure-diagnostic-skipped' ? '      - name: Upload failure diagnostics\n        if: failure()\n        uses: actions/upload-artifact@v7\n' : ''}`;
      // Working-tree workflow bytes are deliberately different. Discovery and
      // job matching must read the fetched committed source, preserving local work.
      fs.writeFileSync(path.join(lab, '.github/workflows/deploy.yml'), 'name: Uncommitted\njobs: {}\n');
      fs.writeFileSync(path.join(bin, 'git'), `#!${process.execPath}
const a=process.argv.slice(2),m=process.env.DEPLOY_FIXTURE_MODE;
if(a[0]==='fetch'&&m==='fetch-failed')process.exit(1);
if(a[0]==='rev-parse'){if(m==='no-main')process.exit(1);console.log('a'.repeat(40));}
if(a[0]==='ls-tree'){if(m==='tree-unread')process.exit(1);if(!process.cwd().endsWith('crypto-lab'))console.log('.github/workflows/deploy.yml');}
if(a[0]==='show'){if(m==='workflow-unread')process.exit(1);console.log(m==='workflow-malformed'?'jobs: [':process.env.DEPLOY_FIXTURE_WORKFLOW);}
if(a[0]==='diff'&&m==='diff-unread')process.exit(1);
if(a[0]==='merge-base'&&m==='prior-unrelated')process.exit(1);
`, { mode: 0o755 });
      fs.writeFileSync(path.join(bin, 'gh'), `#!${process.execPath}
const a=process.argv.slice(2),m=process.env.DEPLOY_FIXTURE_MODE;
if(m==='api-error')process.exit(1);
if(a[0]==='api'){
 if(a[1].endsWith('/latest')){if(m==='legacy-build-unread')process.exit(1);console.log(JSON.stringify({status:m==='legacy-build-failed'?'errored':'built',commit:(m==='legacy-wrong-commit'?'b':'a').repeat(40)}));}
 else {if(m==='pages-unread')process.exit(1);console.log(m.startsWith('legacy-')?'legacy':m==='pages-invalid'?'unknown':'workflow');}
}else if(a[1]==='view'){
 if(m==='jobs-unread'||m==='prior-jobs-unread')process.exit(1);
 if(m==='jobs-invalid'){console.log('not-json');process.exit(0);}
 let steps=[{name:'Download artifact',conclusion:m==='download-failed'?'failure':m==='download-skipped'?'skipped':'success'},{name:'Publish site',conclusion:m==='publish-step-skipped'?'skipped':'success'}];
 let jobs=[{name:m==='publish-missing'?'Other':'deploy',conclusion:m==='publish-skipped'?'skipped':'success',steps:m==='steps-unread'?null:steps}];
 if(m.startsWith('job-'))jobs.push({name:'Build',conclusion:m==='job-failed'?'failure':m==='job-cancelled'?'cancelled':null});
 if(m==='optional-job-skipped')jobs.push({name:'Auto merge',conclusion:'skipped',steps:[]});
 if(m==='needed-job-skipped')jobs.push({name:'build',conclusion:'skipped',steps:[]});
 if(m.startsWith('build-'))jobs.push({name:m==='build-step-skipped'?'build':'Build',conclusion:'success',steps:m==='build-steps-unread'?null:[{name:'Verify',conclusion:m==='build-step-skipped'?'skipped':'failure'}]});
 if(m==='failure-diagnostic-skipped')jobs.push({name:'build',conclusion:'success',steps:[{name:'Verify',conclusion:'success'},{name:'Upload failure diagnostics',conclusion:'skipped'}]});
 console.log(JSON.stringify({jobs:m==='jobs-empty'?[]:jobs}));
}else{
 let r={databaseId:1,headSha:(m.startsWith('prior-')||m==='diff-unread'?'b':'a').repeat(40),event:m==='pull-request-only'?'pull_request':'push',name:'Ship',status:m==='pending'?'in_progress':'completed',conclusion:m==='pending'?null:'success',updatedAt:'2026-10-09T01:00:00Z'};
 let runs=[r];
 if(m==='new-failure-old-success'||m==='new-cancelled-prior-success')runs.unshift({...r,databaseId:2,conclusion:m==='new-failure-old-success'?'failure':'cancelled',updatedAt:'2026-10-09T02:00:00Z'});
 if(m==='old-failure-new-success')runs.push({...r,databaseId:2,conclusion:'failure',updatedAt:'2026-10-08T01:00:00Z'});
 console.log(JSON.stringify(runs));
}
`, { mode: 0o755 });
      const r = spawnSync(process.execPath, [path.join(tools, 'deploy-sync.js'), 'check'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, DEPLOY_FIXTURE_MODE: mode, DEPLOY_FIXTURE_WORKFLOW: workflow } });
      assert.equal(r.status, positive.includes(mode) ? 0 : 1, r.stdout + r.stderr);
      const claim = /All inspected deployment runs have verified publish jobs and Pages configuration/;
      if (positive.includes(mode)) assert.match(r.stdout, claim);
      else assert.doesNotMatch(r.stdout, claim);
      assert.doesNotMatch(r.stdout, /Every lab's live site is built/);
      assert.equal(fs.readFileSync(path.join(lab, '.github/workflows/deploy.yml'), 'utf8'), 'name: Uncommitted\njobs: {}\n');
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
}
