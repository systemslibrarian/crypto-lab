"""Actual CLI/Git/file controls; only the external browser command is substituted.

Synthetic browser successes are fixture plumbing, never public lab evidence.
"""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest

HELPER = Path(__file__).with_name('run-publisher-live-checks.py')


class LiveVerifierControls(unittest.TestCase):
    def setUp(self):
        self.scratch = tempfile.TemporaryDirectory(prefix='fleet-live-control-')
        self.addCleanup(self.scratch.cleanup)
        self.root = Path(self.scratch.name)
        self.repo = self.root / 'fixture'
        self.repo.mkdir()
        self.slug = 'crypto-lab-fixture'
        self.out = self.root / 'control'
        self.out.mkdir()
        self.git('init', '-q')
        self.git('config', 'user.name', 'Verification fixture')
        self.git('config', 'user.email', 'fixture@example.invalid')
        (self.repo / 'fixture.txt').write_text('Synthetic teaching source\n')
        self.git('add', 'fixture.txt')
        self.git('commit', '-qm', 'Fixture source')
        self.sha = self.git('rev-parse', 'HEAD')
        self.pkg = self.repo
        (self.pkg / 'e2e').mkdir()
        (self.pkg / 'node_modules').mkdir()
        for name in ['playwright.config.ts', 'playwright.a11y.config.ts']:
            (self.pkg / name).write_text("export default {testDir:'./e2e'};\n")
        # No npm lifecycle command may run. The fixture's only allowed external
        # command is the existing installed browser runner with --no installation.
        (self.pkg / 'package.json').write_text(json.dumps({'scripts': {
            'preinstall': 'touch LIFECYCLE-RAN', 'install': 'touch LIFECYCLE-RAN'}}))
        (self.pkg/'e2e/fixture.spec.ts').write_text('// Explicit synthetic fixture; external runner substituted\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'Tracked test configurations')
        self.sha = self.git('rev-parse', 'HEAD')
        self.write_inputs()
        hooks = self.root / 'hooks'
        hooks.mkdir()
        (hooks / 'sitecustomize.py').write_text('''import json, os, pathlib, subprocess, time
original = subprocess.run
calls = 0
def fixture(args, *a, **kw):
 global calls
 if args[0] != 'npm': return original(args, *a, **kw)
 calls += 1
 root = pathlib.Path(os.environ['FLEET_MAINTENANCE_ROOT'])
 with (root/'commands.jsonl').open('a') as stream: stream.write(json.dumps(args)+'\\n')
 assert args[:5] == ['npm','exec','--no','--','playwright']
 mode = os.environ.get('FIXTURE_BROWSER_MODE','passed')
 if mode == 'pause':
  (root/'browser-started').write_text('started')
  deadline = time.monotonic()+15
  while not (root/'browser-release').exists():
   if time.monotonic()>deadline: raise TimeoutError('Fixture release missing')
   time.sleep(.025)
 if mode == 'timeout' or mode == 'second-timeout' and calls == 2:
  raise subprocess.TimeoutExpired(args,1800,output=b'partial browser stdout',stderr=b'partial stderr')
 if mode == 'source-change': original(['git','commit','--allow-empty','-qm','Concurrent fixture change'],cwd=kw['cwd'],check=True)
 if mode == 'dirty-source': (pathlib.Path(kw['cwd'])/'fixture.txt').write_text('Changed during browser execution\\n')
 if mode == 'failed': return subprocess.CompletedProcess(args,1,'1 failed\\n','fixture assertion')
 if mode == 'zero': return subprocess.CompletedProcess(args,0,'0 passed\\n','')
 if mode == 'missing-summary': return subprocess.CompletedProcess(args,0,'setup complete\\n','')
 if mode == 'contradictory': return subprocess.CompletedProcess(args,0,'1 passed\\n1 failed\\n','')
 return subprocess.CompletedProcess(args,0,'1 passed (synthetic browser fixture)\\n','')
subprocess.run = fixture
''')
        self.env = dict(os.environ, PYTHONPATH=str(hooks),
                        FLEET_MAINTENANCE_ROOT=str(self.root))

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.repo), *args],
                                       text=True).strip()

    def write_inputs(self):
        (self.out / 'pushed.json').write_text(json.dumps([
            {'slug': self.slug, 'path': str(self.repo), 'packagePath': str(self.pkg)}]))
        self.proof = self.out / (self.slug + '-postmerge.json')
        self.proof.write_text(json.dumps({'verifiedScopedRepair': True,
            'currentTreeMatchesReviewedHead': True, 'allApplicationResourcesVerified': True,
            'currentSha': self.sha}))
        self.fleet = self.root / 'console-current-critical-20261009/fleet.json'
        self.fleet.parent.mkdir(exist_ok=True)
        self.fleet.write_text(json.dumps({'labs': [
            {'slug': self.slug, 'demoUrl': 'https://example.invalid/fixture/'}]}))
        self.canonical = self.out / (self.slug + '-live-checks.json')

    def command(self):
        return [sys.executable, '-B', str(HELPER), '--cohort=control', self.slug]

    def invoke(self, mode='passed'):
        return subprocess.run(self.command(), env=dict(self.env, FIXTURE_BROWSER_MODE=mode),
                              capture_output=True, text=True, timeout=20)

    def prime(self):
        result = self.invoke()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.old = self.canonical.read_bytes()
        self.assertEqual(json.loads(self.old)['result'], 'passed')

    def assert_history(self, content=None):
        content = self.old if content is None else content
        histories = list(self.out.glob(self.slug + '-live-history-*.json'))
        self.assertTrue(any(p.read_bytes() == content for p in histories))

    def assert_incomplete(self, result):
        self.assertNotEqual(result.returncode, 0)
        current = json.loads(self.canonical.read_text())
        self.assertEqual(current['result'], 'incomplete')
        self.assertIsNone(current['exit'])
        self.assert_history()
        return current

    def test_success_preserves_exact_historical_bytes_and_installs_nothing(self):
        self.prime()
        self.assertEqual(self.invoke().returncode, 0)
        self.assert_history()
        current = json.loads(self.canonical.read_text())
        self.assertEqual(current['sourceSha'], self.sha)
        self.assertEqual(len(current['suites']), 1)
        commands = [json.loads(line) for line in (self.root/'commands.jsonl').read_text().splitlines()]
        self.assertEqual(len(commands), 2)
        self.assertTrue(all(command[:5] == ['npm','exec','--no','--','playwright']
                            for command in commands))
        self.assertFalse((self.pkg/'LIFECYCLE-RAN').exists())
        config = Path(current['configuration']).read_text()
        self.assertIn('webServer:undefined', config)
        self.assertIn('retries:0', config)

    def test_timeout_invalidates_old_success_and_preserves_partial_logs(self):
        self.prime()
        current = self.assert_incomplete(self.invoke('timeout'))
        log = Path(current['log']).read_bytes()
        self.assertIn(b'partial browser stdout', log)
        self.assertIn(b'partial stderr', log)
        self.assertEqual(hashlib.sha256(log).hexdigest(), current['logSha256'])
        self.assertEqual(current['sourceSha'], self.sha)

    def test_missing_or_malformed_fleet_input_cannot_retain_success(self):
        for malformed in (True, False):
            with self.subTest(malformed=malformed):
                self.write_inputs()
                self.prime()
                if malformed: self.fleet.write_text('{malformed')
                else: self.fleet.unlink()
                current = self.assert_incomplete(self.invoke())
                self.assertIsNone(current['sourceSha'])

    def test_unreadable_or_malformed_proof_cannot_retain_success(self):
        for malformed in (True, False):
            with self.subTest(malformed=malformed):
                self.write_inputs()
                self.prime()
                if malformed: self.proof.write_text('{')
                else: self.proof.unlink()
                self.assert_incomplete(self.invoke())

    def test_unreadable_or_malformed_checks_cannot_retain_success(self):
        self.prime()
        checks = self.out / (self.slug + '-checks.json')
        checks.write_text('{')
        self.assert_incomplete(self.invoke())
        checks.unlink()
        (self.out/'pushed.json').unlink()
        self.assert_incomplete(self.invoke())

    def test_malformed_historical_record_is_preserved_without_parsing(self):
        self.canonical.write_bytes(b'\xff{malformed historical record')
        old = self.canonical.read_bytes()
        self.assertEqual(self.invoke().returncode, 0)
        self.assert_history(old)

    def test_changed_source_cannot_reuse_integrated_proof(self):
        self.prime()
        self.git('commit', '--allow-empty', '-qm', 'Changed current source')
        current = self.assert_incomplete(self.invoke())
        self.assertIsNone(current['sourceSha'])

    def test_unreviewed_global_setup_or_dynamic_test_directory_is_incomplete(self):
        self.prime()
        for source in ("export default {globalSetup:'./hook',testDir:'./e2e'};",
                       'export default {testDir:dynamicDirectory};'):
            with self.subTest(source=source):
                (self.pkg/'playwright.config.ts').write_text(source+'\n')
                self.git('add','playwright.config.ts')
                self.git('commit','-qm','Current configuration fixture')
                proof=json.loads(self.proof.read_text())
                proof['currentSha']=self.git('rev-parse','HEAD')
                self.proof.write_text(json.dumps(proof))
                self.assert_incomplete(self.invoke())

    def test_missing_test_directory_is_incomplete(self):
        self.prime()
        (self.pkg/'e2e/fixture.spec.ts').rename(self.out/'preserved-fixture.spec.ts')
        (self.pkg/'e2e').rmdir()
        self.git('add','e2e/fixture.spec.ts')
        self.git('commit','-qm','Missing tracked test directory fixture')
        proof=json.loads(self.proof.read_text())
        proof['currentSha']=self.git('rev-parse','HEAD')
        self.proof.write_text(json.dumps(proof))
        self.assert_incomplete(self.invoke())

    def test_tracked_local_changes_before_execution_are_incomplete(self):
        self.prime()
        (self.pkg/'fixture.txt').write_text('Uncommitted source change\n')
        self.assert_incomplete(self.invoke())
        self.assertEqual((self.pkg/'fixture.txt').read_text(), 'Uncommitted source change\n')

    def test_committed_or_uncommitted_changes_during_execution_are_incomplete(self):
        self.prime()
        for mode in ['source-change','dirty-source']:
            with self.subTest(mode=mode):
                current=self.assert_incomplete(self.invoke(mode))
                self.assertTrue(current['completedSuites'])
                self.assertEqual(current['sourceSha'], self.sha)
                # Restore fixture readability by committing intentional fixture
                # changes and updating its explicit proof, never resetting files.
                self.git('add','fixture.txt')
                if self.git('status','--porcelain','--untracked-files=no'):
                    self.git('commit','-qm','Retain intentional fixture mutation')
                self.sha=self.git('rev-parse','HEAD')
                self.write_inputs()

    def test_zero_exit_without_positive_complete_browser_result_is_incomplete(self):
        self.prime()
        for mode in ['zero', 'missing-summary', 'contradictory']:
            with self.subTest(mode=mode):
                current = self.assert_incomplete(self.invoke(mode))
                self.assertEqual(current['commandExit'], 0)
                self.assertTrue(Path(current['browserLog']).is_file())

    def test_readable_browser_assertion_failure_remains_failed(self):
        self.prime()
        result = self.invoke('failed')
        self.assertEqual(result.returncode, 1)
        current = json.loads(self.canonical.read_text())
        self.assertEqual(current['result'], 'failed')
        self.assertEqual(current['exit'], 1)
        self.assert_history()

    def test_second_shadow_suite_timeout_preserves_completed_first_suite(self):
        self.slug = 'crypto-lab-shadow-vault'
        self.write_inputs()
        self.prime()
        current = self.assert_incomplete(self.invoke('second-timeout'))
        self.assertEqual(len(current['completedSuites']), 1)
        self.assertEqual(current['completedSuites'][0]['result'], 'passed')
        self.assertEqual(current['originalConfiguration'], 'playwright.a11y.config.ts')
        self.assertIn('playwright.a11y.config.ts', Path(current['configuration']).read_text())

    def test_running_attempt_invalidates_success_and_competing_run_cannot_overwrite(self):
        self.prime()
        child = subprocess.Popen(self.command(), env=dict(self.env, FIXTURE_BROWSER_MODE='pause'),
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            deadline = time.monotonic()+10
            while not (self.root/'browser-started').exists():
                self.assertLess(time.monotonic(), deadline)
                time.sleep(.025)
            active = self.canonical.read_bytes()
            self.assertEqual(json.loads(active)['result'], 'incomplete')
            self.assertTrue(json.loads(active)['running'])
            other = self.invoke()
            self.assertNotEqual(other.returncode, 0)
            self.assertIn('another invocation', other.stdout)
            self.assertEqual(self.canonical.read_bytes(), active)
            (self.root/'browser-release').write_text('release')
            stdout, stderr = child.communicate(timeout=10)
            self.assertEqual(child.returncode, 0, stdout+stderr)
            self.assert_history()
        finally:
            if child.poll() is None:
                child.kill()
                child.communicate()

    def test_empty_duplicate_and_unsafe_targets_fail_before_evidence_mutation(self):
        self.prime()
        for tail in ([], [self.slug, self.slug], ['../outside'], ['--cohort=../outside', self.slug]):
            with self.subTest(tail=tail):
                result = subprocess.run([sys.executable,'-B',str(HELPER),'--cohort=control',*tail],
                                        env=self.env,capture_output=True,text=True,timeout=10)
                self.assertEqual(result.returncode, 2)
                self.assertEqual(self.canonical.read_bytes(), self.old)


if __name__ == '__main__':
    unittest.main()
