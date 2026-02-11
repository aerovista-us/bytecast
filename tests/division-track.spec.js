/**
 * Division Track Journey Tests (division_aerovista_v1)
 * Tests: EP-002 listen → Offer Pack visit → Seed export → Badge
 */

const { test, expect } = require('@playwright/test');
const {
  clearByteCastStorage,
  navigateAndWait,
  isStepDone,
  hasBadge,
  waitForAudioReady,
} = require('./helpers');

test.describe('Division Track Journey (division_aerovista_v1)', () => {
  test.beforeEach(async ({ page }) => {
    await clearByteCastStorage(page);
  });

  test('EP-002 listen step completion', async ({ page }) => {
    await navigateAndWait(page, '/episodes/aerovista_7_division_overview/index.html');

    // Wait for audio to be ready
    await waitForAudioReady(page);

    // Simulate completing listen step
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep002_listen', {
          episode: 'aerovista_7_division_overview',
        });
      }
    });

    await page.waitForTimeout(1000);

    // Verify listen step is done
    const listenDone = await isStepDone(page, 'division_aerovista_v1', 'ep002_listen');
    expect(listenDone).toBe(true);
  });

  test('Offer Pack visit step completion', async ({ page }) => {
    // Complete EP-002 listen first
    await navigateAndWait(page, '/episodes/aerovista_7_division_overview/index.html');
    await waitForAudioReady(page);
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep002_listen', {
          episode: 'aerovista_7_division_overview',
        });
      }
    });
    await page.waitForTimeout(500);

    // Navigate to Offer Pack
    await navigateAndWait(page, '/aerovista_offer_pack/app/index.html');

    // Simulate offer pack visit completion
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('offer_pack_visit', {
          app: 'aerovista_offer_pack',
        });
      }
    });

    await page.waitForTimeout(1000);

    // Verify offer pack visit is done
    const visitDone = await isStepDone(page, 'division_aerovista_v1', 'offer_pack_visit');
    expect(visitDone).toBe(true);
  });

  test('Full Division Track: All steps → Badge minted', async ({ page }) => {
    // Complete EP-002 listen
    await navigateAndWait(page, '/episodes/aerovista_7_division_overview/index.html');
    await waitForAudioReady(page);
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep002_listen', {
          episode: 'aerovista_7_division_overview',
        });
      }
    });
    await page.waitForTimeout(500);

    // Complete Offer Pack visit
    await navigateAndWait(page, '/aerovista_offer_pack/app/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('offer_pack_visit', {
          app: 'aerovista_offer_pack',
        });
      }
    });
    await page.waitForTimeout(500);

    // Complete Seed export
    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'division-seed.zip',
          artifactHash: 'ghi789',
          filesCount: 4,
        });
      }
    });
    await page.waitForTimeout(2000);

    // Navigate to playlist to check badge
    await navigateAndWait(page, '/seed_bytecast.html');

    // Verify badge is minted
    const badgeMinted = await hasBadge(page, 'division_aerovista_v1');
    expect(badgeMinted).toBe(true);
  });
});
