/* Shape of crypto-lab-babel-hash and four siblings: the gate lives one level
 * down, under demos/<name>/, and the lab root holds no config at all. */
import { defineConfig } from '@playwright/test';
const PORT = 4714;
export default defineConfig({
  use: { baseURL: `http://localhost:${PORT}/demo-app/` },
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/demo-app/`,
  },
});
