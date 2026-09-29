import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4701/crypto-lab-stream-ward/',
    colorScheme: 'dark',
  },
  webServer: {
    // Build first: `preview` only serves whatever is already in dist/, so without
    // this a failed build would leave the previous good bundle in place and the
    // suite would pass green against source that no longer compiles.
    command: 'npm run build && npm run preview -- --port 4671 --strictPort',
    url: 'http://localhost:4701/crypto-lab-stream-ward/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
