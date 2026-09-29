import { defineConfig, devices } from '@playwright/test';

// Browser-level coverage for the teaching flows plus the axe-core WCAG gate.
// Spins up `vite preview` against the production build for each run so the
// assertions exercise the shipped bundle, not the dev server.
export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4214/crypto-lab-ssh-handshake/',
		trace: 'retain-on-failure',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
	webServer: {
		// Build before previewing: `preview` only serves whatever is already in
		// dist/, so without the build a failing compile leaves the previous good
		// bundle on disk and the suite passes green against source that no longer
		// compiles — which silently invalidates mutation checking.
		command: 'npm run build && npm run preview -- --port 4214 --strictPort --host 127.0.0.1',
		url: 'http://127.0.0.1:4214/crypto-lab-ssh-handshake/',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
