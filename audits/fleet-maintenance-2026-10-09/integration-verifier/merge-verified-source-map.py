import json,pathlib,sys,subprocess
from fleet_github import api

out=pathlib.Path(__file__).parent/sys.argv[1]
# Never merge from an old successful readiness file after a failed new read.
# The refresh must itself finish successfully; pending/failed gates stay false.
subprocess.run([sys.executable, str(pathlib.Path(__file__).with_name('check-source-map-merge-readiness.py')),
                str(out)], capture_output=True, check=True, timeout=300)
targets=json.load(open(out/'merge-readiness.json'))
saved=json.load(open(out/'merges.json')) if (out/'merges.json').exists() else []
for t in targets:
    if any(x['repository']==t['repository'] for x in saved):continue
    endpoint='repos/'+t['repository']+'/pulls/'+str(t['pr'])
    current=api(endpoint)
    assert current['head']['sha']==t['headSha'],(t['repository'],'Head moved')
    if current['merged']:
        sha=current['merge_commit_sha']
    else:
        if not t['ready']:continue
        assert current['state']=='open' and not current['draft'] and current['mergeable']
        assert api('repos/'+t['repository']+'/branches/main')['commit']['sha']==t['baseSha'],(t['repository'],'Base moved')
        try:
            result=api(endpoint+'/merge','PUT',{'sha':t['headSha'],'merge_method':'merge'})
            assert result['merged'],result
        except Exception:
            current=api(endpoint)
            if not current['merged']:raise
        current=api(endpoint)
        assert current['merged'] and current['head']['sha']==t['headSha']
        sha=current['merge_commit_sha']
    saved.append({**t,'mergeSha':sha})
    (out/'merges.json').write_text(json.dumps(saved,indent=2)+'\n')
    print(json.dumps({'repository':t['repository'],'pr':t['pr'],'mergeSha':sha}),flush=True)
