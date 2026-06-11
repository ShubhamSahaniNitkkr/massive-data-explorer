import { expect, test } from '@playwright/test';

test.describe('Sorting', () => {
  test('sorts by column header click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('grid').waitFor({ timeout: 30000 });

    const nameHeader = page.getByRole('button', { name: /sort by name/i });
    await nameHeader.click();

    await expect(nameHeader).toContainText('↑');
  });
});
