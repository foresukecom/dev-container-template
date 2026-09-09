import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // 拡張機能はブラウザ全体で1つしか読み込めないため、ワーカーは1つに固定する
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
});
