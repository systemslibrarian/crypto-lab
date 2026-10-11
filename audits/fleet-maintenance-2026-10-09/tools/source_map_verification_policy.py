"""Repository workflow roles inspected for this maintenance run.

Main and PR jobs are deliberately distinct. A missing job or application
resource remains missing unless the inspected workflow establishes its role.
Reads: caller-supplied complete current-head GitHub collections, actual Git
ancestry, and the finite manually inspected workflow-role table below.
These roles require source re-review before reuse; this is not a fleet scanner.
"""

import re
import subprocess


def contains_current_base(path, base, head):
    """Ask Git about the inspected default, never infer freshness from PR metadata."""
    if not all(isinstance(sha, str) and re.fullmatch(r'[0-9a-f]{40}', sha)
               for sha in (base, head)):
        return False
    try:
        return subprocess.run(
            ['git', '-C', str(path), 'merge-base', '--is-ancestor', base, head],
            capture_output=True, check=False,
        ).returncode == 0
    except OSError:
        return False

def required_main_jobs(slug):
    return {
        'crypto-lab-key-exchange': ['verify'],
        'crypto-lab-pake-gate': ['test (22)', 'test (24)', 'build / gate'],
        'crypto-lab-nonce-lattice': ['build-test'],
        'crypto-lab-lattice-fault': ['test', 'build'],
        'crypto-lab-zk-proof-lab': ['build', 'browser-quality'],
        'crypto-lab-isogeny-gate': ['build-and-deploy'],
        'crypto-lab-lll-break': ['test', 'build'],
        'crypto-lab-curve-lens': ['build', 'verify'],
        'crypto-lab-mls-group': ['test', 'build'],
        'crypto-lab-timing-oracle': ['build', 'quality'],
        'crypto-lab-oram-vault': ['verify', 'build'],
        'crypto-lab-silent-tally': ['test / test', 'build'],
        'crypto-lab-musig-gate': ['build', 'e2e'],
        'crypto-lab-diffie-hellman-mitm': ['build', 'verify'],
        'crypto-lab-dilithium-seal': ['build', 'audit', 'lighthouse', 'verify-deployment'],
        'crypto-lab-quantum-vault-kpqc': ['Build and test', 'Build Vite static bundle'],
        'crypto-lab-shadow-vault': ['Rust Tests & Security', 'TypeScript & Lint', 'Browser Integration Tests', 'build'],
    }.get(slug, ['build'])


def is_pages_build_marker(name, content):
    # Accept only the root marker with no non-whitespace content. In
    # particular, never hide security.txt or arbitrary unreadable dotfiles.
    return name == '.nojekyll' and not content.strip()


def required_jobs_passed(checks, names):
    if not valid_required_names(names) or not isinstance(checks, list) or not checks:
        return False
    if any(not isinstance(check, dict) for check in checks):
        return False
    for name in names:
        matching = [check for check in checks if check.get('name') == name]
        # A matching green record cannot hide a failing/unfinished duplicate.
        # Resolve workflow identity rather than guessing which duplicate counts.
        if len(matching) != 1 or matching[0].get('status') != 'completed' or matching[0].get('conclusion') != 'success':
            return False
    return True


def valid_required_names(names):
    return (isinstance(names, (list, tuple)) and bool(names)
            and all(isinstance(name, str) and bool(name.strip()) for name in names)
            and len(set(names)) == len(names))


def required_pr_jobs(slug):
    if slug == 'crypto-lab-shadow-vault':
        return ['Rust Tests & Security', 'TypeScript & Lint', 'Browser Integration Tests']
    if slug == 'crypto-lab-quantum-vault-kpqc':
        return ['Build and test', 'Build Vite static bundle', 'Build all fuzz targets (nightly)']
    if slug == 'crypto-lab-musig-gate':
        return ['build', 'e2e']
    if slug == 'crypto-lab-silent-tally':
        return ['test', 'test / test', 'build']
    if slug == 'crypto-lab-oram-vault':
        return ['verify', 'build']
    return None


def read_complete_collection(reader, endpoint, field):
    """Reject truncated, changing, duplicated or unreadable GitHub evidence."""
    response = reader(endpoint)
    total = response.get('total_count')
    page = response.get(field)
    if type(total) is not int or total < 0 or not isinstance(page, list):
        raise ValueError('Unreadable collection metadata')
    records = list(page)
    page_number = 1
    while len(records) < total:
        page_number += 1
        response = reader(endpoint + ('&' if '?' in endpoint else '?') + 'page=' + str(page_number))
        page = response.get(field)
        if response.get('total_count') != total or not isinstance(page, list) or not page:
            raise ValueError('Incomplete or changing collection')
        records.extend(page)
    if len(records) != total or any(not isinstance(r, dict) or 'id' not in r for r in records):
        raise ValueError('Incomplete collection records')
    if len({r['id'] for r in records}) != total:
        raise ValueError('Duplicate collection records')
    return records


def latest_workflow_runs(runs):
    """A newer current-head run supersedes older attempts of that workflow."""
    def order(run):
        # A rerun keeps its original ID/creation time. Completion/update time
        # also changes when a slow older attempt finishes, so cannot rank starts.
        # Old saved reports explicitly fall back to creation time.
        return (run.get('run_started_at') or run['created_at'], run['id'],
                run.get('run_attempt', 1))
    latest = {}
    for run in runs:
        key = run['workflow_id']
        previous = latest.get(key)
        if previous is None or order(run) > order(previous):
            latest[key] = run
    return list(latest.values())


def required_jobs_have_successful_steps(workflows, names, optional_skips=None):
    optional_skips = optional_skips or {}
    if not valid_required_names(names) or not isinstance(workflows, list) or not workflows:
        return False
    jobs = []
    for workflow in workflows:
        if not isinstance(workflow, dict) or not isinstance(workflow.get('jobs'), list):
            return False
        if any(not isinstance(job, dict) for job in workflow['jobs']):
            return False
        jobs.extend(workflow['jobs'])
    def successful(job):
        steps = job.get('steps')
        allowed = optional_skips.get(job['name'], [])
        return (job.get('status') == 'completed' and job.get('conclusion') == 'success'
                and isinstance(steps, list) and bool(steps)
                and all(isinstance(s, dict) and isinstance(s.get('name'), str)
                    and bool(s['name'].strip()) and s.get('status') == 'completed' and (
                    s.get('conclusion') == 'success' or
                    s.get('name') in allowed and s.get('conclusion') == 'skipped'
                ) for s in steps))
    for name in names:
        matching = [job for job in jobs if job.get('name') == name]
        if len(matching) != 1 or not successful(matching[0]):
            return False
    return True


def optional_main_step_skips(slug):
    # Inspected MuSig source: this uploads diagnostics only on failure. It is
    # distinct from the mandatory upload-pages-artifact publication stage.
    if slug == 'crypto-lab-quantum-vault-kpqc':
        return {'Build Vite static bundle': ['Upload Playwright report on failure']}
    # Ratchet deploy.yml51 uses if:failure() for this diagnostic only. Unit,
    # browser and Upload Pages artifact steps remain required and unreadable,
    # cancelled or failed diagnostics are not silently treated as success.
    if slug == 'crypto-lab-ratchet-wire':
        return {'build': ['Upload Playwright report on failure']}
    return {'e2e': ['Run actions/upload-artifact@v7']} if slug == 'crypto-lab-musig-gate' else {}
