import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "pnpm run preview",
    port: 8788
  },
  testDir: "tests",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
