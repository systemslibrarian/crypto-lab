import concurrent.futures, datetime, hashlib, json, pathlib, subprocess, sys, urllib.request
from fleet_github import api, paginated
from source_map_verification_policy import (is_pages_build_marker, required_jobs_passed,
    required_main_jobs, read_complete_collection, latest_workflow_runs,
    required_jobs_have_successful_steps, optional_main_step_skips)

root = pathlib.Path(__file__).parent
captured = datetime.datetime.now(datetime.timezone.utc).isoformat()
targets = []
pending_only='--pending' in sys.argv
repository_filter=next((a.split('=',1)[1] for a in sys.argv[1:] if a.startswith('--repository=')),None)
cohorts=[a for a in sys.argv[1:] if not a.startswith('--')] or ['source-map-cohort-evidence', 'source-map-second-evidence']
for cohort in cohorts:
    pushed = {x['repository']: x for x in json.load(open(root/cohort/'pushed.json'))}
    for merged in json.load(open(root/cohort/'merges.json')):
        if merged['repository'] in pushed:
            target={**pushed[merged['repository']], 'pr': merged['pr'], 'mergeSha': merged['mergeSha'], 'cohort': cohort}
            old=root/cohort/(target['slug']+'-postmerge.json')
            if (repository_filter is None or target['repository']==repository_filter) and (repository_filter is not None or not pending_only or not old.exists() or not json.load(open(old))['verifiedScopedRepair']):targets.append(target)
urls = {x['slug']: x['demoUrl'] for x in json.load(open(root/'console-current-critical-20261009/fleet.json'))['labs']}

def verify(t):
    repo = t['repository']; p = pathlib.Path(t['path']); pkg = pathlib.Path(t['packagePath'])
    reviewed = t['headSha']
    if t['slug'] == 'crypto-lab-lattice-builder':
        p = root/'crypto-lab-lattice-builder-a11y'; pkg = p
        reviewed = '292d95d0b9cadfb20fd93b44d632f6940f6a30d9'
    if t['slug'] == 'crypto-lab-pq-tls-handshake':
        p = root/'crypto-lab-pq-tls-handshake-motion'; pkg = p
        reviewed = 'ea028d9d322f01e8f9d0c39911fd71bebf640e11'
    if t['slug'] == 'crypto-lab-psi-gate':
        p = root/'crypto-lab-psi-gate-pages-contact'; pkg = p
        reviewed = 'b1cb8b75fce8a779ddb903e8f9f2f9082f3de781'
    if t['slug']=='crypto-lab-hpke-envelope':
        p=root/'hpke-noble-consumers/crypto-lab-hpke-envelope';pkg=p
        reviewed='da7110c871e3d8055aa65e45b4afa6bd283d4224'
        hpke_checks=json.load(open(root/'hpke-noble-consumer-checks.json'))
        own_checks=[c for c in hpke_checks if c['repository']==t['slug'] and c['sourceSha']==reviewed]
        assert len(own_checks)==5 and all(c['result']=='passed' for c in own_checks),'HPKE migration not fully tested'
    subsequent_reviews={
        'crypto-lab-key-exchange': ('crypto-lab-key-exchange-current-final','a5578bafbe1b691da43ee3e367e2584483f510be'),
        'crypto-lab-kyber-vault': ('crypto-lab-kyber-vault-current-final','394479e8df1e941e4618de5f407fe810bdc7ba26'),
    }
    if t['slug'] in subsequent_reviews:
        directory, reviewed=subsequent_reviews[t['slug']]
        p=root/directory;pkg=p/pathlib.Path(t['manifest']).parent
        final_checks=json.load(open(root/'key-kyber-subsequent-default-final-checks.json'))
        applicable=[c for c in final_checks if c['repository']==t['slug'] and c['sourceSha']==reviewed]
        assert len(applicable)==5 and all(c['result']=='passed' for c in applicable),'Subsequent default not fully tested'
    subprocess.run(['git', '-C', str(p), 'fetch', 'origin', 'main'], capture_output=True, check=True)
    sha = api('repos/'+repo+'/branches/main')['commit']['sha']
    assert sha == subprocess.check_output(['git', '-C', str(p), 'rev-parse', 'origin/main'], text=True).strip()
    subprocess.run(['git', '-C', str(p), 'merge-base', '--is-ancestor', t['mergeSha'], sha], capture_output=True, check=True)
    tree = lambda ref: subprocess.check_output(['git', '-C', str(p), 'rev-parse', ref+'^{tree}'], text=True).strip()
    same_tree = tree(reviewed) == tree(sha)
    delta = subprocess.check_output(['git', '-C', str(p), 'diff', '--name-only', reviewed, sha], text=True).splitlines()
    all_checks = read_complete_collection(api, 'repos/'+repo+'/commits/'+sha+'/check-runs?filter=latest&per_page=100', 'check_runs')
    checks = [{'name': c['name'], 'status': c['status'], 'conclusion': c['conclusion'], 'url': c['html_url']} for c in all_checks]
    runs = read_complete_collection(api, 'repos/'+repo+'/actions/runs?head_sha='+sha+'&per_page=100', 'workflow_runs')
    app_runs = latest_workflow_runs([r for r in runs if r['head_sha'] == sha and r['head_branch'] == 'main' and r['event'] in ['push', 'workflow_dispatch']])
    workflows = []
    for run in app_runs:
        jobs = read_complete_collection(api, 'repos/'+repo+'/actions/runs/'+str(run['id'])+'/jobs?per_page=100', 'jobs')
        workflows.append({'id': run['id'], 'name': run['name'], 'event': run['event'], 'status': run['status'], 'conclusion': run['conclusion'], 'runAttempt': run.get('run_attempt'), 'url': run['html_url'], 'jobs': [{'name': j['name'], 'conclusion': j['conclusion'], 'status': j['status'], 'url': j['html_url'], 'steps': [{'name': s['name'], 'conclusion': s['conclusion'], 'status': s['status']} for s in j['steps']]} for j in jobs]})
    deployed = any(w['conclusion'] == 'success' and any(j['name'] == 'deploy' and j['conclusion'] == 'success' or t['slug'] == 'crypto-lab-world-ciphers' and j['conclusion'] == 'success' and any(s['name'] == 'Deploy' and s['conclusion'] == 'success' for s in j['steps']) or t['slug']=='crypto-lab-isogeny-gate' and j['name']=='build-and-deploy' and j['conclusion']=='success' and any(s['name']=='Deploy to GitHub Pages' and s['conclusion']=='success' for s in j['steps']) for j in w['jobs']) for w in workflows)
    # Traitor's 22/24 matrix is a PR gate; its current-main publishing workflow
    # runs build, unit KATs, and all browser engines instead. Keep both states.
    required = required_main_jobs(t['slug'])
    permitted_skips=['dependabot-auto-merge']+(['browser-gate','browser-gate / gate'] if t['slug']=='crypto-lab-pake-gate' else [])+(['dependency-review'] if t['slug']=='crypto-lab-kyber-vault' else [])
    gate_pass = required_jobs_passed(checks, required) and all(c['status'] == 'completed' and (c['conclusion'] == 'success' or c['name'] in permitted_skips and c['conclusion'] == 'skipped') for c in checks)
    steps_pass = required_jobs_have_successful_steps(workflows, required, optional_main_step_skips(t['slug']))
    gate_pass = gate_pass and steps_pass
    alerts = paginated('repos/'+repo+'/dependabot/alerts?state=open&per_page=100')
    source_alerts = [{'number': a['number'], 'package': a['dependency']['package']['name'], 'manifest': a['dependency']['manifest_path'], 'ghsa': a['security_advisory']['ghsa_id']} for a in alerts if a['dependency']['package']['name'] == 'source-map-js']
    lock = json.loads(subprocess.check_output(['git', '-C', str(p), 'show', sha+':'+t['manifest']], text=True))
    versions = {k: v['version'] for k, v in lock['packages'].items() if k.endswith('/source-map-js')}
    files = []
    build_evidence = {'origin': 'local-reviewed-build', 'sourceSha': reviewed}
    if same_tree and deployed and gate_pass:
        dist = pkg/'dist'
        if t.get('ciArtifact'):
            artifact = t['ciArtifact']
            current = api('repos/'+repo+'/actions/artifacts/'+str(artifact['id']))
            assert current['name'] == 'github-pages' and not current['expired']
            assert current['workflow_run']['head_sha'] == sha == artifact['sourceSha']
            assert current['workflow_run']['id'] == artifact['runId']
            assert any(w['id'] == artifact['runId'] and w['conclusion'] == 'success' for w in workflows)
            archive = pathlib.Path(artifact['archive'])
            assert hashlib.sha256(archive.read_bytes()).hexdigest() == artifact['archiveSha256']
            dist = pathlib.Path(artifact['dist'])
            build_evidence = {**artifact, 'origin': 'authenticated-current-head-CI-artifact',
                              'summary': 'Deployment bytes verified against exact current-head CI artifact. This does not establish reproducible source-to-binary provenance.'}
        assert dist.is_dir() and not dist.is_symlink()
        for f in sorted(dist.rglob('*')):
            if not f.is_file(): continue
            assert not f.is_symlink()
            name = str(f.relative_to(dist)); expected = f.read_bytes()
            if is_pages_build_marker(name, expected):
                files.append({'path': name, 'role': 'deployment-metadata', 'verificationState': 'N/A-public-resource', 'summary': 'Root GitHub Pages build marker contains only whitespace; not an application resource.'}); continue
            url = urls[t['slug']].rstrip('/')+'/'+urllib.parse.quote(name)
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'Cache-Control': 'no-cache'}), timeout=60) as response:
                    actual = response.read(); code = response.status
                files.append({'path': name, 'url': url, 'role': 'public-resource', 'http': code, 'sameBytes': expected == actual, 'expectedSha256': hashlib.sha256(expected).hexdigest(), 'actualSha256': hashlib.sha256(actual).hexdigest(), 'verificationState': 'verified' if code == 200 and expected == actual else 'failed'})
            except Exception as e:
                files.append({'path': name, 'url': url, 'role': 'public-resource', 'verificationState': 'unreadable', 'error': type(e).__name__+': '+str(e)})
    public = [f for f in files if f['role'] == 'public-resource']
    verified = same_tree and gate_pass and deployed and bool(public) and all(f['verificationState'] == 'verified' for f in public) and bool(versions) and all(v == '1.2.2' for v in versions.values()) and not source_alerts
    result = {'repository': repo, 'slug': t['slug'], 'workId': t['id'], 'cohort': t['cohort'], 'capturedAt': captured, 'repairPr': t['pr'], 'repairHeadSha': t['headSha'], 'repairMergeSha': t['mergeSha'], 'reviewedHeadSha': reviewed, 'currentSha': sha, 'currentTreeMatchesReviewedHead': same_tree, 'subsequentFiles': delta, 'checks': checks, 'integratedWorkflows': workflows, 'currentHeadGatesPassed': gate_pass, 'deploymentSucceeded': deployed, 'versions': versions, 'sourceMapAlerts': source_alerts, 'otherOpenAdvisories': len(alerts)-len(source_alerts), 'files': files, 'applicationResourceCount': len(public), 'allApplicationResourcesVerified': bool(public) and all(f['verificationState'] == 'verified' for f in public), 'verifiedScopedRepair': verified}
    result['buildEvidence'] = build_evidence
    result['requiredJobStepsPassed'] = steps_pass
    result['verificationState'] = 'verified' if verified else 'incomplete'
    previous = root/t['cohort']/(t['slug']+'-postmerge.json')
    if previous.exists():
        old = json.loads(previous.read_text())
        stamp = ''.join(c if c.isalnum() else '-' for c in old.get('capturedAt', 'undated'))
        history = previous.with_name(t['slug']+'-postmerge-history-'+stamp+'.json')
        if not history.exists(): history.write_bytes(previous.read_bytes())
    (root/t['cohort']/(t['slug']+'-postmerge.json')).write_text(json.dumps(result, indent=2)+'\n')
    print(t['slug']+' '+json.dumps({'verified': verified, 'tree': same_tree, 'ci': gate_pass, 'deploy': deployed, 'public': len(public), 'advisories': len(alerts), 'delta': delta}), flush=True)
    return result

def verify_safely(target):
    try:
        return verify(target)
    except Exception as error:
        # An unreadable new invocation must never leave an old success in the
        # canonical record where automation could mistake it for fresh proof.
        path = root/target['cohort']/(target['slug']+'-postmerge.json')
        if path.exists():
            old = json.loads(path.read_text())
            stamp = ''.join(c if c.isalnum() else '-' for c in old.get('capturedAt', 'undated'))
            history = path.with_name(target['slug']+'-postmerge-history-'+stamp+'.json')
            if not history.exists(): history.write_bytes(path.read_bytes())
        result = {'repository': target['repository'], 'slug': target['slug'],
                  'workId': target['id'], 'capturedAt': captured,
                  'currentSha': None, 'verifiedScopedRepair': False,
                  'verificationState': 'unreadable', 'errorType': type(error).__name__,
                  'summary': 'Current verification could not be completed; prior evidence retained in history. No closure or deployment success is inferred.'}
        path.write_text(json.dumps(result, indent=2)+'\n')
        print(target['slug']+' verification unreadable: '+type(error).__name__, flush=True)
        return result

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    records = list(pool.map(verify_safely, targets))
(root/(('source-map-postmerge-verification-'+pathlib.Path(cohorts[0]).name+'.json') if sys.argv[1:] else 'source-map-postmerge-verification.json')).write_text(json.dumps(records, indent=2)+'\n')
sys.exit(0 if all(r['verifiedScopedRepair'] for r in records) else 1)
