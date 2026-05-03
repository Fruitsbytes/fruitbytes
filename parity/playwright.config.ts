import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'stencil-desktop',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3333' },
      metadata: { flavor: 'stencil', viewport: 'desktop' },
    },
    {
      name: 'stencil-mobile',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:3333' },
      metadata: { flavor: 'stencil', viewport: 'mobile' },
    },
    {
      name: 'astro-desktop',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4321' },
      metadata: { flavor: 'astro', viewport: 'desktop' },
    },
    {
      name: 'astro-mobile',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:4321' },
      metadata: { flavor: 'astro', viewport: 'mobile' },
    },
  ],
});
