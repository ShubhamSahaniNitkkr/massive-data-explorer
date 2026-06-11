import { expect, test } from '@playwright/test';

test.describe('Filters', () => {
  test('opens filter panel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('grid').waitFor({ timeout: 30000 });

    await page.getByRole('button', { name: /filters/i }).click();
    await expect(page.getByText('Add Filter')).toBeVisible();
  });
});
