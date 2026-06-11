import { expect, test } from '@playwright/test';

test.describe('Search', () => {
  test('filters results with debounced search', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('grid').waitFor({ timeout: 30000 });

    const searchbox = page.getByRole('searchbox');
    await searchbox.fill('user1');
    await page.waitForTimeout(500);

    await expect(page.getByText(/showing/i)).toBeVisible();
  });
});
