import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'pnpm preview --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
