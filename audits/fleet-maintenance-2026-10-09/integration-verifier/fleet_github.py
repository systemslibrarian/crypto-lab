"""Existing helper credentials stay in memory; responses contain no credential material."""
import json,os,subprocess,urllib.request,urllib.error
r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',capture_output=True,text=True,check=True)
credential=dict(s.split('=',1) for s in r.stdout.splitlines() if '=' in s)
token=credential['password']
environment=dict(os.environ,GH_TOKEN=token)
def api(endpoint,method='GET',data=None):
    request=urllib.request.Request('https://api.github.com/'+endpoint,method=method,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},data=None if data is None else json.dumps(data).encode())
    with urllib.request.urlopen(request,timeout=45) as response:
        body=response.read()
        return json.loads(body) if body else None
def optional(endpoint):
    try:return api(endpoint)
    except urllib.error.HTTPError as e:return {'error':'HTTP '+str(e.code)}
def paginated(endpoint):
    url='https://api.github.com/'+endpoint;items=[]
    for _ in range(100):
        if not url.startswith('https://api.github.com/'):raise ValueError('Unexpected pagination host')
        request=urllib.request.Request(url,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'})
        with urllib.request.urlopen(request,timeout=45) as response:
            page=json.loads(response.read());link=response.headers.get('Link','')
        if not isinstance(page,list):raise ValueError('Unexpected paginated response')
        items.extend(page)
        next_links=[part.split(';')[0].strip().strip('<>') for part in link.split(',') if 'rel="next"' in part]
        if not next_links:return items
        url=next_links[0]
    raise ValueError('Pagination did not terminate')
