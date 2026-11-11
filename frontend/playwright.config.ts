import { defineConfig, devices } from "@playwright/test";

const apiUrl = "http://127.0.0.1:3000";
const frontendUrl = "http://127.0.0.1:5173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: frontendUrl,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm --prefix ../backend run dev",
      url: `${apiUrl}/productos`,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: "test",
        PORT: "3000",
      },
    },
    {
      command: "npm run dev -- --host 127.0.0.1",
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
