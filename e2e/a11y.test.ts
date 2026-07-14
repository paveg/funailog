import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  ['Home', '/'],
  ['Blog listing', '/blog'],
  ['Blog archive', '/blog/archive'],
  ['Article', '/blog/2026/kubernetes-hard-way-apple-silicon-part1-environment'],
  ['Portfolio', '/portfolio'],
] as const;

for (const [name, path] of pages) {
  test(`${name} (${path}) has no WCAG AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
