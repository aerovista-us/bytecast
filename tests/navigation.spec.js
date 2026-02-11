/**
 * Basic navigation smoke tests
 * Tests the core user paths: Root → Playlist → Episode → Training → Orchard
 */

const { test, expect } = require('@playwright/test');
const { clearByteCastStorage, navigateAndWait, getConsoleErrors } = require('./helpers');

test.describe('ByteCast Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first-time visitor
    await clearByteCastStorage(page);
  });

  test('Root page (index.html) loads and shows primary doors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await navigateAndWait(page, '/index.html');

    // Check for primary doors
    await expect(page.locator('text=ByteCast Playlist')).toBeVisible();
    await expect(page.locator('text=Training Hub')).toBeVisible();
    await expect(page.locator('text=Seed Builder Studio')).toBeVisible();
    await expect(page.locator('text=Docs Portal')).toBeVisible();

    // Check for no critical errors
    expect(errors.length).toBe(0);
  });

  test('Playlist (seed_bytecast.html) loads and shows episode registry', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await navigateAndWait(page, '/seed_bytecast.html');

    // Check playlist loads
    await expect(page.locator('text=ByteCast Playlist').or(page.locator('h1'))).toBeVisible();

    // Check for episode links (at least EP-001 should exist)
    await expect(page.locator('a[href*="welcome_to_bytecast"]').or(
      page.locator('text=EP-001')
    )).toBeVisible({ timeout: 10000 });

    expect(errors.length).toBe(0);
  });

  test('EP-001 episode page loads with player and slides', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');

    // Check episode title
    await expect(page.locator('h1').or(page.locator('text=BYTECAST'))).toBeVisible();

    // Check for audio player
    await expect(page.locator('audio#audio').or(page.locator('audio'))).toBeVisible();

    // Check for slides section
    await expect(
      page.locator('text=Episode Slides').or(page.locator('[id*="slide"]'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('Training Hub loads and shows modules', async ({ page }) => {
    await navigateAndWait(page, '/training_hub/index.html');

    // Check hub loads
    await expect(page.locator('text=Training Hub').or(page.locator('h1'))).toBeVisible();

    // Check for navigation links
    await expect(page.locator('a[href*="index.html"]')).toBeVisible();
  });

  test('Seed Orchard UI loads', async ({ page }) => {
    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');

    // Check orchard loads
    await expect(
      page.locator('text=Seed Orchard').or(page.locator('h1')).or(page.locator('[id*="orchard"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('Navigation between pages works', async ({ page }) => {
    // Start at root
    await navigateAndWait(page, '/index.html');
    await expect(page.locator('text=ByteCast Playlist')).toBeVisible();

    // Navigate to playlist
    await page.click('a[href*="seed_bytecast"]');
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('seed_bytecast');

    // Navigate back to root
    await page.click('a[href*="index.html"]').first();
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toContain('index.html');
  });
});
