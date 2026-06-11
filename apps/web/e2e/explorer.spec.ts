import { expect, test } from '@playwright/test';

test.describe('Explorer', () => {
  test('loads page with data table', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Massive Dataset Explorer')).toBeVisible();
    await expect(page.getByRole('grid', { name: /users data table/i })).toBeVisible({ timeout: 30000 });
  });

  test('sticky header is visible', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('grid').waitFor({ timeout: 30000 });
    await expect(page.getByRole('columnheader', { name: /email/i })).toBeVisible();
  });
});
