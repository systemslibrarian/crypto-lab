import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against the PRODUCTION build served by `vite preview`, at the same
 * project subpath GitHub Pages serves, so what passes here is what ships.
 *
 * Port 4626 is unique to this lab across the fleet (never the Vite default
 * 4173 — with 170+ labs side by side a shared port means `reuseExistingServer`
 * silently scans a different lab's preview).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  timeout: 180_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The HTML report is produced EVERYWHERE, CI included. This was
  // `process.env.CI ? 'list' : [...html...]`, which meant the one run whose
  // failures nobody can reproduce by hand — the CI run — was the only run that
  // produced no report to look at. A failure-upload step added on top of that
  // would have archived an empty directory and looked like it was working.
  // `open: 'never'` is what keeps the html reporter from trying to start a
  // server on a headless runner.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200/crypto-lab-factor-forge/',
    // Kept only for the retry, so the artifact uploaded on failure carries the
    // trace of the run that actually failed rather than of every green run.
    trace: 'on-first-retry',
  },
  projects: [
    // The a11y gate is Chromium-only ON PURPOSE. Its oracle is not just
    // axe-core's `violations`: `contrast.ts` computes ratios from rendered
    // colours and `nontext-baseline.ts` pins a per-component non-text-contrast
    // baseline. Those are rendering-engine specific, so running the gate on
    // three engines would replace one deterministic signal with three
    // engine-flavoured ones and the baseline could never be pinned at all.
    {
      name: 'a11y',
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },

    // The claims suite asks whether the PAGE tells the truth, and the page is
    // BigInt arithmetic, a module worker and `<details>`/`<dialog>` semantics —
    // all three of which differ across engines. A claim that only recomputes
    // correctly in Chromium is not a claim this lab is entitled to make, so
    // every claims project below runs the whole of `claims.spec.ts`.
    //
    // Every one of these names starts with `claims`, which is what lets the
    // `test:claims` script select them with a single `--project=claims*`
    // glob. Add a claims project here and the script picks it up; that is
    // deliberate, because the defect this replaces was an exact-match
    // `--project=claims` that silently excluded `claims-mobile` and left CI
    // enforcing half the suite the README advertises.
    { name: 'claims', testMatch: /claims\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'claims-mobile', testMatch: /claims\.spec\.ts/, use: { ...devices['Pixel 5'] } },
    {
      name: 'claims-firefox',
      testMatch: /claims\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    { name: 'claims-webkit', testMatch: /claims\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // Build before serving: `vite preview` only serves whatever is already in
    // dist/, so without this a failing build leaves the previous good bundle in
    // place and the suite passes green against code that no longer compiles.
    command: 'npm run build && npm run preview -- --port 4626 --strictPort',
    url: 'http://localhost:4200/crypto-lab-factor-forge/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
