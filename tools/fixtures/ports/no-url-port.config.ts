import { defineConfig } from '@playwright/test';
// A config that starts a server on a port and never says where to reach it.
// Playwright then has no url to poll, so webServer readiness is whatever the
// command's exit timing happens to be.
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321 --strictPort',
    reuseExistingServer: !process.env.CI,
  },
});
