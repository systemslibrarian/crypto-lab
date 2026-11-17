/* Shape of crypto-lab-zk-arena: the gate is .mjs, not .ts. */
import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: {
    command: 'npm run preview -- --port 4712 --strictPort',
    url: 'http://localhost:4712/zk-arena/',
  },
});
