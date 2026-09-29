import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against the PRODUCTION build served by `vite preview`, so what
 * passes here is what ships. Two projects:
 *   - a11y   — the axe WCAG gate, Chromium only (a deterministic gate).
 *   - claims — the page-tells-the-truth suite (§4.1b).
 *
 * Port 4646 is unique to this lab across the fleet (never the Vite default
 * 4173: with 190 labs side by side a shared port means `reuseExistingServer`
 * silently scans a different lab's preview).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  timeout: 180_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4203/crypto-lab-sphinx-mix/',
    colorScheme: 'dark', // dark is the only theme
  },
  projects: [
    { name: 'a11y', testMatch: /a11y\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'claims', testMatch: /claims\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // Build before serving. `vite preview` serves whatever is already in dist/,
    // so without the build in front a run tests a stale bundle -- and a build
    // that FAILS leaves the previous good bundle in place, so the whole suite
    // passes green against source that no longer compiles. That silently
    // invalidates mutation checking, which is the only way we prove a test has
    // teeth. With the build in front a compile error aborts the run instead.
    command: 'npm run build && npm run preview -- --port 4646 --strictPort',
    url: 'http://localhost:4203/crypto-lab-sphinx-mix/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
