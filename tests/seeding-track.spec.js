/**
 * Seeding Track Journey Tests (seeding_v1)
 * Tests: Seed export → Badge
 */

const { test, expect } = require('@playwright/test');
const {
  clearByteCastStorage,
  navigateAndWait,
  isStepDone,
  hasBadge,
} = require('./helpers');

test.describe('Seeding Track Journey (seeding_v1)', () => {
  test.beforeEach(async ({ page }) => {
    await clearByteCastStorage(page);
  });

  test('Seed export step completion', async ({ page }) => {
    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');

    // Wait for orchard to load
    await page.waitForTimeout(2000);

    // Simulate seed export
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'standalone-seed.zip',
          artifactHash: 'def456',
          filesCount: 3,
          exportedAt: new Date().toISOString(),
        });
      }
    });

    await page.waitForTimeout(1000);

    // Verify seed export is done
    const exportDone = await isStepDone(page, 'seeding_v1', 'seed_export_v1');
    expect(exportDone).toBe(true);
  });

  test('Seeding badge minted after export', async ({ page }) => {
    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');
    await page.waitForTimeout(2000);

    // Complete seed export
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'standalone-seed.zip',
          artifactHash: 'def456',
          filesCount: 3,
        });
      }
    });

    await page.waitForTimeout(2000);

    // Navigate to playlist
    await navigateAndWait(page, '/seed_bytecast.html');

    // Verify badge is minted
    const badgeMinted = await hasBadge(page, 'seed_exporter_v1');
    expect(badgeMinted).toBe(true);
  });
});
