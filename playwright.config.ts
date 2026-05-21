import { defineConfig } from '@playwright/test';
import { configureTracer } from '@heal-dev/heal-playwright-tracer';
import { HealAgentTracerPreprocessor } from '@heal-dev/heal-cli/sdk';

configureTracer({ preProcessors: [HealAgentTracerPreprocessor] });

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['@heal-dev/heal-playwright-tracer/reporter']],
  ...({
    '@playwright/test': {
      babelPlugins: [
        [require.resolve('@heal-dev/heal-playwright-tracer/code-hook-injector'), { include: [/\/tests\//] }],
      ],
    },
  } as any),
  use: {
    actionTimeout: 30_000,
    trace: 'on',
    video: 'on',
    screenshot: 'only-on-failure',
  },
});
