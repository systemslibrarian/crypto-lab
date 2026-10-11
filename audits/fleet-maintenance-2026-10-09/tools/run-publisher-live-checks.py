"""Run inspected lab suites against public Pages; fail closed on missing evidence.

Reads: existing maintenance fleet.json, pushed/checks/postmerge records, actual
Git HEAD, original Playwright configurations and existing installed test tools.
FLEET_MAINTENANCE_ROOT selects the existing evidence directory, not a new scan.
This manual helper neither deploys nor installs dependencies or changes source.
"""
from pathlib import Path
import argparse, datetime, fcntl, hashlib, json, os, re, subprocess, sys, tempfile
p=Path(os.environ.get('FLEET_MAINTENANCE_ROOT',Path(__file__).parent)).resolve()
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--cohort',default='publisher-security-evidence')
parser.add_argument('slugs',nargs='+')
args=parser.parse_args()
cohort=args.cohort
if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',cohort):parser.error('Invalid cohort')
if any(not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',s) for s in args.slugs):parser.error('Invalid lab slug')
if len(set(args.slugs))!=len(args.slugs):parser.error('Duplicate lab targets')
out=p/cohort
if not out.resolve().is_relative_to(p) or not out.is_dir():parser.error('Existing evidence cohort unavailable or outside root')
slugs=args.slugs
attempt_context={}
env=dict(os.environ,PATH=str(p/'node24/node-v24.21.0-darwin-arm64/bin')+':'+os.environ['PATH'],CI='1')

def write_record(path, record):
    # Readers see a complete previous or current JSON object, never a torn write.
    fd,temporary=tempfile.mkstemp(dir=path.parent,prefix=path.name+'.',suffix='.tmp')
    try:
        with os.fdopen(fd,'w') as stream:
            stream.write(json.dumps(record,indent=2)+'\n');stream.flush();os.fsync(stream.fileno())
        os.replace(temporary,path)
    finally:
        if os.path.exists(temporary):os.unlink(temporary)

def run_target(slug):
    # Parse inside the attempt handler: unreadable URLs must invalidate old success.
    urls={x['slug']:x['demoUrl'] for x in json.loads((p/'console-current-critical-20261009/fleet.json').read_text())['labs']}
    recordpath=out/(slug+'-checks.json')
    record=json.loads(recordpath.read_text()) if recordpath.exists() else next(x for x in json.loads((out/'pushed.json').read_text()) if x['slug']==slug)
    root=Path(record['path']);pkg=Path(record['packagePath'])
    proof=json.loads((out/(slug+'-postmerge.json')).read_text())
    assert proof['verifiedScopedRepair'] and proof['currentTreeMatchesReviewedHead'] and proof['allApplicationResourcesVerified']
    assert not subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],cwd=root,text=True).strip(), 'Tracked source changes require a clean inspected worktree'
    sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
    assert sha==proof['currentSha'], 'Integrated tests must use actual default source'
    attempt_context[slug].update(sourceSha=sha,url=urls[slug])
    attempt_stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%f')
    configs=['playwright.config.ts']+(['playwright.a11y.config.ts'] if slug=='crypto-lab-shadow-vault' else [])
    suites=[]
    for index,config_name in enumerate(configs):
      original=(pkg/config_name).read_text()
    # Preserve the original project/device/timeouts and all test assertions.
    # The native TypeScript source config lives outside node_modules; the
    # external wrapper is .mjs and imports it without modifying tracked files.
      assert 'globalSetup' not in original and 'globalTeardown' not in original, 'Inspect extra lifecycle paths before live verification'
      match=re.search(r"testDir\s*:\s*['\"]([^'\"]+)['\"]",original)
      assert match,'Inspect dynamic or missing original testDir before running live suite'
      testdir=(pkg/match.group(1)).resolve();assert testdir.is_relative_to(pkg.resolve()) and testdir.is_dir()
      config=pkg/f'node_modules/.fleet-publisher-live-{attempt_stamp}-{index}.config.mjs'
      url=urls[slug].rstrip('/')+'/'
      config.write_text("import original from '../"+config_name+"';\n"+
        "const baseURL="+json.dumps(url)+";\nexport default { ...original, " +
        "testDir:"+json.dumps(str(testdir))+", forbidOnly:true,retries:0,workers:1,reporter:'list',webServer:undefined,"+
        "use:{...original.use,baseURL},projects:original.projects?.map(p=>({...p,use:{...p.use,baseURL}})),"+
        "outputDir:"+json.dumps(str(out/(slug+f'-live-results-{index}')))+"};\n")
      args=['npm','exec','--no','--','playwright','test','--config',str(config),'--workers=1']
      started=datetime.datetime.now(datetime.timezone.utc).isoformat()
      attempt_context[slug].update(command=' '.join(args),startedAt=started,
        originalConfiguration=config_name,configuration=str(config),
        configurationSha256=hashlib.sha256(config.read_bytes()).hexdigest(),testDir=str(testdir))
      run=subprocess.run(args,cwd=pkg,env=env,capture_output=True,text=True,timeout=1800)
      log=out/(slug+f'-live-{attempt_stamp}-{index}.log');log.write_text(run.stdout+run.stderr)
      attempt_context[slug].update(commandExit=run.returncode,browserLog=str(log))
      plain=re.sub(r'\x1b\[[0-9;]*m','',run.stdout)
      if run.returncode==0 and (not re.search(r'^\s*[1-9][0-9]* passed\b',plain,re.M) or re.search(r'^\s*[1-9][0-9]* failed\b',plain,re.M)):
        raise ValueError('Zero-exit browser output has no readable successful test result')
      result={'slug':slug,'sourceSha':sha,'command':' '.join(args),'url':urls[slug],
        'startedAt':started,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'exit':run.returncode,'result':'passed' if run.returncode==0 else 'failed','log':str(log),
        'logSha256':hashlib.sha256(log.read_bytes()).hexdigest(),'configuration':str(config),
        'configurationSha256':hashlib.sha256(config.read_bytes()).hexdigest(),
        'originalConfiguration':config_name,'testDir':str(testdir),
        'summary':'All original selected lab e2e tests against real Pages with no retries; local webServer removed. No compiler/WASM reproduction inference.'}
      suites.append(result)
      attempt_context[slug]['completedSuites']=list(suites)
      print(slug,'public',config_name,run.returncode,flush=True)
    result={**suites[0],'suites':suites,'result':'passed' if all(s['result']=='passed' for s in suites) else 'failed','exit':0 if all(s['exit']==0 for s in suites) else 1}
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==sha, 'Source revision changed during browser execution'
    assert not subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],cwd=root,text=True).strip(), 'Tracked source changed during browser execution'
    write_record(out/(slug+'-live-checks.json'),result)

if __name__ == '__main__':
    failed = False
    for slug in slugs:
        canonical = out/(slug+'-live-checks.json')
        try:
            # Acquire before archiving/invalidation. A competing invocation must
            # not overwrite the active writer's canonical record.
            with open(out/(slug+'-execution.lock'),'a') as lock:
                try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
                except BlockingIOError:
                    print(slug,'public blocked: another invocation holds the evidence lock',flush=True)
                    failed=True
                    continue
                started=datetime.datetime.now(datetime.timezone.utc).isoformat()
                attempt_context[slug]={'sourceSha':None,'startedAt':started,'completedSuites':[]}
                if canonical.exists():
                    old=canonical.read_bytes() # Preserve malformed history without parsing it.
                    stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%f')
                    history=canonical.with_name(slug+'-live-history-'+stamp+'-'+hashlib.sha256(old).hexdigest()[:12]+'.json')
                    with history.open('xb') as stream:stream.write(old)
                write_record(canonical,{'slug':slug,**attempt_context[slug],'result':'incomplete','exit':None,'running':True,'summary':'Current attempt has not established live verification; prior evidence is historical.'})
                try:
                    run_target(slug)
                except Exception as error:
                    stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%f')
                    log=out/(slug+'-live-incomplete-'+stamp+'.log')
                    partial=getattr(error,'stdout',None) or getattr(error,'output',None) or ''
                    if isinstance(partial,bytes):partial=partial.decode('utf-8',errors='replace')
                    stderr=getattr(error,'stderr',None) or ''
                    if isinstance(stderr,bytes):stderr=stderr.decode('utf-8',errors='replace')
                    log.write_text(partial+stderr+'\nCurrent live verification incomplete: '+type(error).__name__+'\n')
                    record={'slug':slug,**attempt_context[slug],'result':'incomplete','exit':None,'errorType':type(error).__name__,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'log':str(log),'logSha256':hashlib.sha256(log.read_bytes()).hexdigest(),'summary':'This current invocation could not establish success. Prior records retained as history; no CI/deployment/application/compiler success inferred.'}
                    write_record(canonical,record)
                    print(slug,'public incomplete',type(error).__name__,flush=True)
                    failed=True
        except Exception as error:
            # An unreadable evidence destination cannot be repaired by overwriting
            # somebody else's files. Report failure; never emit current success.
            print(slug,'public evidence unreadable',type(error).__name__,flush=True)
            failed=True
    sys.exit(1 if failed or any(json.loads((out/(s+'-live-checks.json')).read_text())['result']!='passed' for s in slugs) else 0)
