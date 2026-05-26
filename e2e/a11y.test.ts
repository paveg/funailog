import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  ['Top', '/'],
  ['Article (tech)', '/blog/2025/zod-to-valibot-migration'],
  ['Article (stack)', '/blog/2025/modern-edge-tech-stack'],
  ['Review (gadget)', '/blog/2024/review-monitors-u4025qw-dell'],
  ['About', '/about'],
] as const;

for (const [name, path] of pages) {
  test(`${name} (${path}) has no WCAG AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
