import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 5173',
    port: 5173,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
}

export default config

