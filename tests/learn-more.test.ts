import { test } from '@playwright/test';

test.describe('Example.com', () => {
  test('Click learn more link', async ({ page }) => {
    // --- Navigate to entry point and wait 2 seconds ---
    await page.goto('https://example.com');
    await page.waitForTimeout(2000);

    // --- Test steps ---
    // Click the "Learn more" link
    await page.getByRole('link', { name: 'Learn More' }).click();
  });
});
