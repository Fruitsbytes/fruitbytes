import { test } from '@playwright/test';
import path from 'node:path';

const ROUTES = [
  { path: '/welcome', slug: 'welcome' },
  { path: '/about-me', slug: 'about-me' },
  { path: '/contact-me', slug: 'contact-me' },
  { path: '/my-blog', slug: 'my-blog' },
  { path: '/my-projects', slug: 'my-projects' },
  { path: '/console-log', slug: 'console-log' },
  { path: '/', slug: 'root' },
];

for (const route of ROUTES) {
  test(`capture ${route.slug}`, async ({ page }, testInfo) => {
    const flavor = testInfo.project.metadata.flavor as string;
    const viewport = testInfo.project.metadata.viewport as string;

    await page.goto(route.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const outPath = path.join(
      'baselines',
      flavor,
      `${route.slug}-${viewport}.png`,
    );

    await page.screenshot({
      path: outPath,
      fullPage: true,
      animations: 'disabled',
    });
  });
}
