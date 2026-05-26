import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [['Styleguide', '/styleguide']] as const;

for (const [name, path] of pages) {
  test(`${name} (${path}) has no WCAG AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
