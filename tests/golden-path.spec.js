/**
 * Golden Path Journey Tests (p1_golden_path)
 * Tests: EP-001–004 gates → TR-001A → Seed export → Publish → Badge
 */

const { test, expect } = require('@playwright/test');
const {
  clearByteCastStorage,
  navigateAndWait,
  isStepDone,
  hasBadge,
  waitForAudioReady,
} = require('./helpers');

async function completeDay1Spine(page) {
  await page.evaluate(() => {
    const L = window.ByteCastLoop;
    if (!L) return;
    const eq = (slug, code) => ({
      engageQuizPassed: true,
      engageQuizScore: 1,
      episodeSlug: slug,
      episodeCode: code,
    });
    L.markStepDone('ep001_listen', { episodeSlug: 'welcome_to_bytecast', gate: 'listen' });
    L.markStepDone('ep001_slide', { episodeSlug: 'welcome_to_bytecast', gate: 'slide' });
    L.markStepDone('ep001_engage', eq('welcome_to_bytecast', 'EP-001'));
    L.markStepDone('ep002_listen', { episodeSlug: 'aerovista_7_division_overview', gate: 'listen' });
    L.markStepDone('ep002_slide', { episodeSlug: 'aerovista_7_division_overview', gate: 'slide' });
    L.markStepDone('ep002_engage', eq('aerovista_7_division_overview', 'EP-002'));
    L.markStepDone('ep003_listen', { episodeSlug: 'the_main_doors', gate: 'listen' });
    L.markStepDone('ep003_slide', { episodeSlug: 'the_main_doors', gate: 'slide' });
    L.markStepDone('ep003_engage', eq('the_main_doors', 'EP-003'));
    L.markStepDone('ep004_listen', { episodeSlug: 'current_truth_basics', gate: 'listen' });
    L.markStepDone('ep004_slide', { episodeSlug: 'current_truth_basics', gate: 'slide' });
    L.markStepDone('ep004_engage', eq('current_truth_basics', 'EP-004'));
    L.markStepDone('tr001a_day1_foundations', {
      mission: 'tr_001a_day1_foundations',
      understandingCheckPassed: true,
      tr001aQuizPassed: true,
      tr001aQuizScore: 1,
      tr001aWritten1: 'ACOS is the unified visibility cockpit for cross-lane awareness.',
      tr001aWritten2: 'I verify against SOT and canon labels instead of assuming the newest file is official.',
      tr001aScenarioRouting: 'playlist_then_docs',
      tr001aCompletedAt: new Date().toISOString(),
    });
  });
}

test.describe('Golden Path Journey (p1_golden_path)', () => {
  test.describe.configure({ timeout: 120_000 });
  test.beforeEach(async ({ page }) => {
    await clearByteCastStorage(page);
  });

  test('Step 1: EP-001 gates completion (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await waitForAudioReady(page);

    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_listen', { episodeSlug: 'welcome_to_bytecast', gate: 'listen' });
        window.ByteCastLoop.markStepDone('ep001_slide', { episodeSlug: 'welcome_to_bytecast', gate: 'slide' });
        window.ByteCastLoop.markStepDone('ep001_engage', {
          episodeSlug: 'welcome_to_bytecast',
          episodeCode: 'EP-001',
          engageQuizPassed: true,
          engageQuizScore: 1,
        });
      }
    });

    await page.waitForTimeout(500);

    expect(await isStepDone(page, 'p1_golden_path', 'ep001_listen')).toBe(true);
    expect(await isStepDone(page, 'p1_golden_path', 'ep001_slide')).toBe(true);
    expect(await isStepDone(page, 'p1_golden_path', 'ep001_engage')).toBe(true);
  });

  test('Step 2: TR-001A training completion', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await completeDay1Spine(page);
    await page.waitForTimeout(500);

    expect(await isStepDone(page, 'p1_golden_path', 'tr001a_day1_foundations')).toBe(true);
  });

  test('Step 3: Seed export completion', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await completeDay1Spine(page);
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/episodes/seed_builder_studio/seed_orchard_ui/index.html');
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'test-seed.zip',
          artifactHash: 'abc123',
          filesCount: 5,
          exportedAt: new Date().toISOString(),
        });
      }
    });

    await page.waitForTimeout(1000);
    expect(await isStepDone(page, 'p1_golden_path', 'seed_export_v1')).toBe(true);
  });

  test('Step 4: Publish step completion', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await completeDay1Spine(page);
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/episodes/seed_builder_studio/seed_orchard_ui/index.html');
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'test-seed.zip',
          artifactHash: 'abc123',
          filesCount: 5,
        });
      }
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_publish_v1', {
          publishedUrl: 'https://example.com/test-seed',
          publishedAt: new Date().toISOString(),
        });
      }
    });

    await page.waitForTimeout(1000);
    expect(await isStepDone(page, 'p1_golden_path', 'seed_publish_v1')).toBe(true);
  });

  test('Full Golden Path: All steps → Badge minted', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await completeDay1Spine(page);
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/episodes/seed_builder_studio/seed_orchard_ui/index.html');
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_export_v1', {
          artifactName: 'test-seed.zip',
          artifactHash: 'abc123',
          filesCount: 5,
        });
        window.ByteCastLoop.markStepDone('seed_publish_v1', {
          publishedUrl: 'https://example.com/test-seed',
        });
      }
    });
    await page.waitForTimeout(2000);

    await page.evaluate(async () => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      try {
        const config = await Loop.loadJourneyConfig('/data/journey_steps.json', null);
        const journey = Loop.getJourneyById(config, 'p1_golden_path');
        if (!journey) return;
        const wf2 = Loop.ensureWorkflowV2('p1_golden_path');
        Loop.ensureJourneyBadges(journey, wf2);
        Loop.saveWorkflowV2(wf2, 'p1_golden_path');
      } catch {
        // ignore
      }
    });

    await navigateAndWait(page, '/seed_bytecast.html');
    expect(await hasBadge(page, 'p1_golden_path_v1')).toBe(true);
  });
});

