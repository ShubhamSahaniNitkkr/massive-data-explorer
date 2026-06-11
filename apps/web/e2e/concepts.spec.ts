import { expect, test } from '@playwright/test';

test.describe('Concepts on Explorer', () => {
  test('shows control center with concept toggles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Control Center')).toBeVisible();
    await expect(page.getByText('Virtualization')).toBeVisible();
    await expect(page.getByText('Massive Dataset Explorer')).toBeVisible();
  });

  test('opens concept detail modal when tile is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open Virtualization details/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('What it is')).toBeVisible();
    await expect(page.getByText('How to trigger')).toBeVisible();
    await expect(page.getByText('Simplest implementation')).toBeVisible();
    await expect(page.getByText('In this codebase')).toBeVisible();
  });

  test('disabling virtualization shows impact in table', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Disable Virtualization').click();
    await page.getByRole('grid').waitFor({ timeout: 30000 });
    await expect(page.getByText(/Virtualization disabled/i)).toBeVisible();
  });
});
