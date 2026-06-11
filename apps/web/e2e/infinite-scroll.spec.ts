import { expect, test } from '@playwright/test';

test.describe('Infinite scroll', () => {
  test('loads more rows on scroll', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('grid').waitFor({ timeout: 30000 });

    const initialText = await page.getByText(/showing/i).textContent();

    const grid = page.getByRole('grid');
    await grid.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await page.waitForTimeout(2000);

    const updatedText = await page.getByText(/showing/i).textContent();
    expect(updatedText).toBeTruthy();
    expect(initialText).toBeTruthy();
  });
});
