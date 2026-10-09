import concurrent.futures,json,pathlib,subprocess,sys
from fleet_github import api,optional
from source_map_verification_policy import contains_current_base, required_pr_jobs, read_complete_collection
root=pathlib.Path(__file__).parent;out=root/(sys.argv[1] if len(sys.argv)>1 else 'source-map-cohort-evidence');targets=json.load(open(out/'pull-requests.json'))
merged={x['repository'] for x in json.load(open(out/'merges.json'))} if (out/'merges.json').exists() else set()
# Recheck pending PRs only; merged records retain their original evidence.
targets=[x for x in targets if x['repository'] not in merged]
previous=json.load(open(out/'merge-readiness.json')) if (out/'merge-readiness.json').exists() else []
completed=[x for x in previous if x['repository'] in merged]
if len(sys.argv)==1:targets.append({'repository':'systemslibrarian/crypto-counsel','pr':11,'headSha':'4de0cfe1dcfe016f1e51667ee30e3b334f196e2f','baseSha':'76318770ed5757f1097988f02b4c0966a68163b3'})
def read(x):
 repo=x['repository'];p=api('repos/'+repo+'/pulls/'+str(x['pr']));c=read_complete_collection(api,'repos/'+repo+'/commits/'+x['headSha']+'/check-runs?filter=latest&per_page=100','check_runs');b=api('repos/'+repo+'/branches/main')['commit']['sha'];protection=optional('repos/'+repo+'/branches/main/protection');rules=optional('repos/'+repo+'/rules/branches/main');gitbase=subprocess.run(['git','ls-remote','https://github.com/'+repo+'.git','refs/heads/main'],capture_output=True,text=True,check=True).stdout.split()[0]
 documented={'crypto-lab-spdz-forge':['validate'],'crypto-lab-schnorr-forge':['validate'],'crypto-lab-pake-gate':['test (22)','test (24)','browser-gate / gate'],'crypto-lab-power-trace':['verify'],'crypto-lab-key-exchange':['verify'],'crypto-lab-nonce-lattice':['build-test'],'crypto-lab-model-breach':['check'],'crypto-lab-lattice-fault':['test'],'crypto-lab-hawk':['verify'],'crypto-lab-falcon-seal':['test-and-build'],'crypto-lab-isogeny-gate':['test','e2e'],'crypto-lab-elgamal-plain':['test'],'crypto-lab-curve-lens':['verify'],'crypto-lab-dkg-gate':['verify'],'crypto-lab-diffie-hellman-mitm':['build','verify'],'crypto-lab-dilithium-seal':['build','audit','lighthouse'],'crypto-lab-mls-group':['test','build'],'crypto-lab-timing-oracle':['build','quality']}
 required=documented.get(repo.split('/')[-1],['validate'] if repo.endswith('crypto-counsel') else ['build','browser-quality'] if repo.endswith('zk-proof-lab') else ['checks (22)','checks (24)'] if repo.endswith('traitor-trace') else ['build'])
 if repo.endswith('crypto-lab-lll-break'):required=['test']
 required=required_pr_jobs(repo.split('/')[-1]) or required
 checks=[{'name':y['name'],'conclusion':y['conclusion'],'status':y['status'],'url':y['html_url'],'appId':y.get('app',{}).get('id')} for y in c];passed=all(any(y['name']==n and y['status']=='completed' and y['conclusion']=='success' for y in checks) for n in required)
 pr_only_skips=['deploy','dependabot-auto-merge']+(['verify-deployment'] if repo.endswith('crypto-lab-dilithium-seal') else [])+(['smoke'] if repo.endswith('crypto-lab-pq-chooser') else [])
 safe=all(y['status']=='completed' and (y['conclusion']=='success' or y['name'] in pr_only_skips and y['conclusion']=='skipped') for y in checks)
 protected_ok=protection=={'error':'HTTP 404'}
 if isinstance(protection,dict) and 'required_status_checks' in protection and 'error' not in protection:
  status=protection['required_status_checks'];contexts=status.get('contexts',[]);configured=status.get('checks',[])
  protected_ok=not protection.get('required_pull_request_reviews') and not protection.get('required_signatures',{}).get('enabled') and not protection.get('required_linear_history',{}).get('enabled') and not protection.get('required_conversation_resolution',{}).get('enabled') and not protection.get('lock_branch',{}).get('enabled') and all(any(y['name']==name and y['status']=='completed' and y['conclusion']=='success' for y in checks) for name in contexts) and all(any(y['name']==rule['context'] and y['status']=='completed' and y['conclusion']=='success' and (rule.get('app_id') is None or y['appId']==rule['app_id']) for y in checks) for rule in configured)
 rules_ok=isinstance(rules,list)
 if rules_ok:
  for rule in rules:
   kind=rule.get('type')
   if kind in ['deletion','non_fast_forward']:continue
   if kind!='required_status_checks':rules_ok=False;break
   params=rule.get('parameters',{})
   for required_check in params.get('required_status_checks',[]):
    integration=required_check.get('integration_id')
    if not any(y['name']==required_check['context'] and y['status']=='completed' and y['conclusion']=='success' and (integration is None or y['appId']==integration) for y in checks):rules_ok=False
 ready=p['state']=='open' and not p['draft'] and p['mergeable'] and p['mergeable_state']=='clean' and p['head']['sha']==x['headSha'] and p['base']['ref']=='main' and p['base']['repo']['full_name']==repo and b==gitbase==x['baseSha'] and contains_current_base(x['path'], b, x['headSha']) and passed and safe and rules_ok and protected_ok
 return {**x,'state':p['state'],'actualHead':p['head']['sha'],'actualBase':b,'prReportedBaseSha':p['base']['sha'],'headContainsCurrentDefault':contains_current_base(x['path'],b,x['headSha']),'gitBase':gitbase,'protection':protection,'rules':rules,'requiredJobs':required,'checks':checks,'ready':bool(ready)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:records=list(pool.map(read,targets))
(out/'merge-readiness.json').write_text(json.dumps(completed+records,indent=2)+'\n');print(json.dumps([{'repo':x['repository'],'pr':x['pr'],'ready':x['ready'],'checks':[(y['name'],y['conclusion']) for y in x['checks']]} for x in records]))
