"""Exercise the real maintenance entrypoints against Git/HTTP/API fixtures.

The fixtures use no GitHub credentials and cannot dispatch or merge remote code.
"""
import functools
import http.server
import json
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile
import threading
import unittest


SOURCE = pathlib.Path(__file__).parent


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class VerificationCliTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = pathlib.Path(self.temporary.name)
        for name in ['verify-source-map-integrations.py', 'source_map_verification_policy.py',
                     'merge-verified-source-map.py']:
            shutil.copyfile(SOURCE / name, self.root / name)
        self.repo = self.root / 'reviewed'
        origin = self.root / 'origin.git'
        subprocess.run(['git', 'init', '--bare', '-q', str(origin)], check=True)
        self.repo.mkdir()
        self.git('init', '-qb', 'main')
        self.git('config', 'user.name', 'Fleet verification fixture')
        self.git('config', 'user.email', 'fixture@example.invalid')
        lock = {'packages': {'node_modules/source-map-js': {'version': '1.2.2'}}}
        (self.repo / 'package-lock.json').write_text(json.dumps(lock))
        self.git('add', 'package-lock.json')
        self.git('commit', '-qm', 'reviewed fixture source')
        self.sha = self.git('rev-parse', 'HEAD').strip()
        self.git('remote', 'add', 'origin', str(origin))
        self.git('push', '-q', '-u', 'origin', 'main')
        dist = self.repo / 'dist'
        dist.mkdir()
        (dist / 'index.html').write_text('<main>Verified fixture application</main>')
        self.public = self.root / 'public'
        self.public.mkdir()
        shutil.copyfile(dist / 'index.html', self.public / 'index.html')
        handler = functools.partial(QuietHandler, directory=str(self.public))
        self.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)
        self.slug = 'crypto-lab-verification-fixture'
        self.cohort = self.root / 'fixture-evidence'
        self.cohort.mkdir()
        target = {'repository': 'fixture/' + self.slug, 'slug': self.slug,
                  'id': 'fixture-work', 'path': str(self.repo), 'packagePath': str(self.repo),
                  'headSha': self.sha, 'manifest': 'package-lock.json', 'pr': 1,
                  'mergeSha': self.sha}
        for name in ['pushed.json', 'merges.json']:
            (self.cohort / name).write_text(json.dumps([target]))
        urls = self.root / 'console-current-critical-20261009'
        urls.mkdir()
        (urls / 'fleet.json').write_text(json.dumps({'labs': [{
            'slug': self.slug, 'demoUrl': 'http://127.0.0.1:' + str(self.server.server_port)}]}))
        (self.root / 'fixture.json').write_text(json.dumps({'sha': self.sha}))
        (self.root / 'fleet_github.py').write_text('''
import json, os, pathlib
fixture=json.loads(pathlib.Path(__file__).with_name('fixture.json').read_text())
case=os.environ['FLEET_FIXTURE_CASE']; sha=fixture['sha']
def api(endpoint, method='GET', data=None):
    if method != 'GET':
        pathlib.Path(__file__).with_name('unexpected-mutation.txt').write_text(endpoint)
        raise AssertionError('Unexpected mutation in read-only verification')
    if case == 'api-unreadable': raise OSError('Fixture API unavailable')
    if endpoint.endswith('/branches/main'): return {'commit': {'sha': sha}}
    if '/check-runs?' in endpoint:
        checks=[{'id': 1, 'name': 'build', 'status': 'completed', 'conclusion': 'success', 'html_url': 'https://example.invalid/build'},
                {'id': 2, 'name': 'deploy', 'status': 'completed', 'conclusion': 'success', 'html_url': 'https://example.invalid/deploy'}]
        if case == 'missing-required-check': checks=checks[1:]
        return {'total_count': len(checks), 'check_runs': checks}
    if '/actions/runs?' in endpoint:
        return {'total_count': 1, 'workflow_runs': [{'id': 10, 'workflow_id': 5,
            'created_at': '2026-10-09T01:00:00Z', 'head_sha': sha, 'head_branch': 'main',
            'event': 'push', 'status': 'completed', 'conclusion': 'success',
            'run_attempt': 1, 'name': 'Fixture CI', 'html_url': 'https://example.invalid/run'}]}
    if '/actions/runs/10/jobs?' in endpoint:
        def job(name, ident):
            step={'name': 'Required verification or publication', 'status': 'completed', 'conclusion': 'success'}
            if name == 'build' and case == 'failed-required-step': step['conclusion']='failure'
            if name == 'build' and case == 'skipped-required-step': step['conclusion']='skipped'
            return {'id': ident, 'name': name, 'status': 'completed', 'conclusion': 'success',
                    'html_url': 'https://example.invalid/'+name, 'steps': [step]}
        return {'total_count': 2, 'jobs': [job('build', 3), job('deploy', 4)]}
    raise AssertionError('Unexpected fixture endpoint: '+endpoint)
def paginated(endpoint):
    if '/dependabot/alerts?' in endpoint: return []
    raise AssertionError('Unexpected fixture pagination')
''')

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.repo), *args], text=True,
                                       stderr=subprocess.PIPE)

    def invoke(self, case):
        env = {k: v for k, v in os.environ.items() if k in ['PATH', 'SYSTEMROOT', 'TMPDIR']}
        env['FLEET_FIXTURE_CASE'] = case
        return subprocess.run([sys.executable, str(self.root / 'verify-source-map-integrations.py'),
                               str(self.cohort)], cwd=self.root, env=env,
                              text=True, capture_output=True, timeout=30)

    def record(self):
        return json.loads((self.cohort / (self.slug + '-postmerge.json')).read_text())

    def test_current_jobs_steps_and_actual_http_bytes_pass(self):
        result = self.invoke('positive')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(self.record()['verifiedScopedRepair'])
        self.assertEqual(self.record()['applicationResourceCount'], 1)
        self.assertEqual(self.record()['files'][0]['http'], 200)

    def test_unreadable_new_api_invalidates_canonical_success_and_preserves_history(self):
        self.assertEqual(self.invoke('positive').returncode, 0)
        prior = self.record()
        result = self.invoke('api-unreadable')
        self.assertNotEqual(result.returncode, 0)
        current = self.record()
        self.assertFalse(current['verifiedScopedRepair'])
        self.assertEqual(current['verificationState'], 'unreadable')
        self.assertNotEqual(current['capturedAt'], prior['capturedAt'])
        history = list(self.cohort.glob('*-postmerge-history-*.json'))
        self.assertEqual(len(history), 1)
        self.assertEqual(json.loads(history[0].read_text()), prior)

    def test_successful_job_cannot_mask_failed_or_skipped_verification_step(self):
        for case in ['failed-required-step', 'skipped-required-step', 'missing-required-check']:
            with self.subTest(case=case):
                result = self.invoke(case)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(self.record()['verifiedScopedRepair'])
                self.assertFalse(self.record()['currentHeadGatesPassed'])

    def test_missing_http_resource_and_changed_bytes_fail_global_result(self):
        resource = self.public / 'index.html'
        resource.unlink()
        result = self.invoke('positive')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.record()['verifiedScopedRepair'])
        self.assertEqual(self.record()['files'][0]['verificationState'], 'unreadable')
        resource.write_text('<main>Stale deployment</main>')
        result = self.invoke('positive')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.record()['verifiedScopedRepair'])
        self.assertEqual(self.record()['files'][0]['verificationState'], 'failed')

    def test_no_public_application_files_cannot_pass(self):
        (self.repo / 'dist/index.html').unlink()
        (self.repo / 'dist/.nojekyll').write_bytes(b'\n')
        result = self.invoke('positive')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.record()['verifiedScopedRepair'])
        self.assertEqual(self.record()['applicationResourceCount'], 0)

    def test_failed_fresh_readiness_prevents_merge_from_old_success(self):
        (self.cohort / 'merge-readiness.json').write_text(json.dumps([{'ready': True}]))
        previous_merges = (self.cohort / 'merges.json').read_bytes()
        (self.root / 'check-source-map-merge-readiness.py').write_text('import sys\nsys.exit(73)\n')
        result = subprocess.run([sys.executable, str(self.root / 'merge-verified-source-map.py'),
                                 str(self.cohort)], cwd=self.root,
                                env={'PATH': os.environ['PATH'], 'FLEET_FIXTURE_CASE': 'positive'},
                                text=True, capture_output=True, timeout=30)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.root / 'unexpected-mutation.txt').exists())
        self.assertEqual((self.cohort / 'merges.json').read_bytes(), previous_merges)


if __name__ == '__main__':
    unittest.main()
