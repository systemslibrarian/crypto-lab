import unittest
import pathlib
import subprocess
import tempfile
from source_map_verification_policy import (
    is_pages_build_marker, required_jobs_passed, required_main_jobs, contains_current_base,
    required_pr_jobs,
    read_complete_collection, latest_workflow_runs,
    required_jobs_have_successful_steps, optional_main_step_skips,
)


class VerificationPolicyTests(unittest.TestCase):
    def test_git_ancestry_controls_current_base_freshness(self):
        with tempfile.TemporaryDirectory() as directory:
            def git(*args):
                return subprocess.check_output(['git', '-C', directory, *args], text=True).strip()
            git('init', '-q')
            git('config', 'user.name', 'Verification fixture')
            git('config', 'user.email', 'fixture@example.invalid')
            git('commit', '--allow-empty', '-qm', 'starting base')
            old = git('rev-parse', 'HEAD')
            git('commit', '--allow-empty', '-qm', 'concurrent default repair')
            current = git('rev-parse', 'HEAD')
            git('checkout', '-qb', 'proposed', old)
            git('commit', '--allow-empty', '-qm', 'proposed update')
            stale_head = git('rev-parse', 'HEAD')
            self.assertFalse(contains_current_base(directory, current, stale_head))
            git('merge', '--no-ff', '-qm', 'preserve concurrent default', current)
            head = git('rev-parse', 'HEAD')
            self.assertTrue(contains_current_base(directory, current, head))
            self.assertTrue(contains_current_base(directory, current, current))
            self.assertFalse(contains_current_base(directory, '0' * 40, head))
            self.assertFalse(contains_current_base(directory, current, '--all'))
            self.assertFalse(contains_current_base(pathlib.Path(directory) / 'absent', current, head))

    def test_main_workflow_is_distinct_from_pr(self):
        self.assertEqual(required_main_jobs('crypto-lab-model-breach'), ['build'])
        checks = [{'name': 'build', 'status': 'completed', 'conclusion': 'success'}]
        self.assertTrue(required_jobs_passed(checks, required_main_jobs('crypto-lab-model-breach')))
        self.assertFalse(required_jobs_passed(checks, ['check']))

    def test_required_failures_and_unfinished_evidence_stay_pending(self):
        for status, result in [('completed', 'failure'), ('completed', 'cancelled'),
                               ('completed', 'skipped'), ('in_progress', None),
                               ('queued', None)]:
            with self.subTest(status=status, result=result):
                self.assertFalse(required_jobs_passed(
                    [{'name': 'build', 'status': status, 'conclusion': result}], ['build']))
        self.assertFalse(required_jobs_passed([], ['build']))
        self.assertFalse(required_jobs_passed(
            [{'name': 'deploy', 'status': 'completed', 'conclusion': 'success'}], ['build']))

    def test_all_required_stages_must_pass(self):
        checks = [{'name': 'build', 'status': 'completed', 'conclusion': 'success'}]
        self.assertFalse(required_jobs_passed(checks, ['build', 'browser-quality']))
        checks.append({'name': 'browser-quality', 'status': 'completed', 'conclusion': 'success'})
        self.assertTrue(required_jobs_passed(checks, ['build', 'browser-quality']))

    def test_timing_quality_is_required_without_changing_deploy_dependencies(self):
        required = required_main_jobs('crypto-lab-timing-oracle')
        checks = [{'name': 'build', 'status': 'completed', 'conclusion': 'success'}]
        self.assertFalse(required_jobs_passed(checks, required))
        checks.append({'name': 'quality', 'status': 'completed', 'conclusion': 'success'})
        self.assertTrue(required_jobs_passed(checks, required))

    def test_only_root_whitespace_marker_is_metadata(self):
        for content in [b'', b'\n', b' \r\n\t']:
            self.assertTrue(is_pages_build_marker('.nojekyll', content))
        for name, content in [('.nojekyll', b'not empty'), ('nested/.nojekyll', b''),
                              ('.well-known/security.txt', b''), ('index.html', b''),
                              ('.env', b'')]:
            self.assertFalse(is_pages_build_marker(name, content))

    def test_native_verifiers_cannot_be_replaced_by_a_successful_build(self):
        build = {'name': 'build', 'status': 'completed', 'conclusion': 'success'}
        for slug in ['crypto-lab-oram-vault', 'crypto-lab-silent-tally', 'crypto-lab-musig-gate']:
            for required in [required_main_jobs(slug), required_pr_jobs(slug)]:
                self.assertFalse(required_jobs_passed([build], required))
                complete = [dict(build, name=name) for name in required]
                self.assertTrue(required_jobs_passed(complete, required))
                for result in ['skipped', 'cancelled', 'failure', None]:
                    incomplete = [dict(c) for c in complete]
                    incomplete[0]['conclusion'] = result
                    self.assertFalse(required_jobs_passed(incomplete, required))

    def test_truncated_and_unreadable_collections_never_pass(self):
        pages = [{'total_count': 3, 'jobs': [{'id': 1}, {'id': 2}]},
                 {'total_count': 3, 'jobs': [{'id': 3}]}]
        calls = []
        def reader(endpoint):
            calls.append(endpoint)
            return pages[len(calls) - 1]
        self.assertEqual(len(read_complete_collection(reader, 'jobs?per_page=100', 'jobs')), 3)
        self.assertEqual(calls[1], 'jobs?per_page=100&page=2')
        for bad in [[], None, {'jobs': []}, {'total_count': 2, 'jobs': [{'id': 1}, {'id': 1}]},
                    {'total_count': 1, 'jobs': [{'name': 'build'}]},
                    {'total_count': 0, 'jobs': [{'id': 1}]}]:
            with self.assertRaises((ValueError, AttributeError)):
                read_complete_collection(lambda _: bad, 'jobs', 'jobs')
        with self.assertRaises(ValueError):
            read_complete_collection(lambda _: {'total_count': 2, 'jobs': []}, 'jobs', 'jobs')
        def unreadable(_):
            raise OSError('API unavailable')
        with self.assertRaises(OSError):
            read_complete_collection(unreadable, 'jobs', 'jobs')

    def test_newest_workflow_evidence_supersedes_old_failure_or_cancellation(self):
        old = dict(workflow_id=7, id=1, created_at='2026-10-09T01:00:00Z', conclusion='failure')
        new = dict(old, id=2, created_at='2026-10-09T02:00:00Z', conclusion='success')
        other = dict(old, workflow_id=8)
        self.assertEqual(latest_workflow_runs([new, old, other]), [new, other])
        pending = dict(new, id=3, created_at='2026-10-09T03:00:00Z', conclusion=None)
        self.assertEqual(latest_workflow_runs([old, pending, new]), [pending])
        retry = dict(new, run_attempt=2, conclusion='cancelled')
        self.assertEqual(latest_workflow_runs([new, retry]), [retry])

    def test_successful_job_cannot_hide_failed_missing_or_skipped_steps(self):
        good = dict(name='build', status='completed', conclusion='success',
                    steps=[dict(name='Download required artifact', status='completed', conclusion='success')])
        def verify(job, **kwargs):
            return required_jobs_have_successful_steps([{'jobs': [job]}], ['build'], **kwargs)
        self.assertTrue(verify(good))
        for steps in [None, [], *[[{'name': 'Download required artifact', 'status': 'completed', 'conclusion': result}]
                                for result in ['failure', 'skipped', 'cancelled', None]],
                      [{'name': 'Download required artifact', 'status': 'in_progress', 'conclusion': None}]]:
            self.assertFalse(verify(dict(good, steps=steps)))
        diagnostic = dict(name='e2e', status='completed', conclusion='success', steps=[
            dict(name='Browser tests', status='completed', conclusion='success'),
            dict(name='Run actions/upload-artifact@v7', status='completed', conclusion='skipped')])
        self.assertTrue(required_jobs_have_successful_steps([{'jobs': [diagnostic]}], ['e2e'],
                                                          optional_main_step_skips('crypto-lab-musig-gate')))
        diagnostic['steps'][1]['name'] = 'Run actions/upload-pages-artifact@v5'
        self.assertFalse(required_jobs_have_successful_steps([{'jobs': [diagnostic]}], ['e2e'],
                                                           optional_main_step_skips('crypto-lab-musig-gate')))


if __name__ == '__main__':
    unittest.main()
