/**
 * Golden Path Journey Tests (p1_golden_path)
 * Tests: EP-001 gates → TR-001 → Seed export → Publish → Badge
 */

const { test, expect } = require('@playwright/test');
const {
  clearByteCastStorage,
  navigateAndWait,
  isStepDone,
  hasBadge,
  waitForAudioReady,
} = require('./helpers');

test.describe('Golden Path Journey (p1_golden_path)', () => {
  test.describe.configure({ timeout: 120_000 });
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate fresh user
    await clearByteCastStorage(page);
  });

  test('Step 1: EP-001 gates completion (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');

    // Wait for audio to be ready
    await waitForAudioReady(page);

    // Simulate completing listen gate (trigger audio play event)
    await page.evaluate(() => {
      const audio = document.querySelector('#audio');
      if (audio) {
        // Mark listen as done (simulate user interaction)
        if (window.ByteCastLoop) {
          window.ByteCastLoop.markStepDone('ep001_listen', {
            episode: 'welcome_to_bytecast',
            gate: 'listen',
          });
        }
      }
    });

    // Simulate completing slide gate (navigate through slides)
    await page.evaluate(() => {
      // Trigger slide completion
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_slide', {
          episode: 'welcome_to_bytecast',
          gate: 'slide',
        });
      }
    });

    // Simulate completing engage gate (complete quest/quiz)
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_engage', {
          episode: 'welcome_to_bytecast',
          gate: 'engage',
        });
      }
    });

    // Wait a bit for localStorage to update
    await page.waitForTimeout(1000);

    // Verify ep001_gates is complete (all sub-steps done)
    const listenDone = await isStepDone(page, 'p1_golden_path', 'ep001_listen');
    const slideDone = await isStepDone(page, 'p1_golden_path', 'ep001_slide');
    const engageDone = await isStepDone(page, 'p1_golden_path', 'ep001_engage');

    expect(listenDone).toBe(true);
    expect(slideDone).toBe(true);
    expect(engageDone).toBe(true);
  });

  test('Step 2: TR-001 training completion', async ({ page }) => {
    // First complete EP-001 gates
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_listen', { episode: 'welcome_to_bytecast', gate: 'listen' });
        window.ByteCastLoop.markStepDone('ep001_slide', { episode: 'welcome_to_bytecast', gate: 'slide' });
        window.ByteCastLoop.markStepDone('ep001_engage', { episode: 'welcome_to_bytecast', gate: 'engage' });
      }
    });
    await page.waitForTimeout(500);

    // Navigate to training
    await navigateAndWait(page, '/training_missions/tr_001_golden_path/index.html');

    // Complete training (simulate checkpoint completion)
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('tr001_golden_path', {
          mission: 'tr_001_golden_path',
          checkpoints: 3,
        });
      }
    });

    await page.waitForTimeout(1000);

    // Verify training step is done
    const trainingDone = await isStepDone(page, 'p1_golden_path', 'tr001_golden_path');
    expect(trainingDone).toBe(true);
  });

  test('Step 3: Seed export completion', async ({ page }) => {
    // Complete prerequisites
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_listen', { episode: 'welcome_to_bytecast', gate: 'listen' });
        window.ByteCastLoop.markStepDone('ep001_slide', { episode: 'welcome_to_bytecast', gate: 'slide' });
        window.ByteCastLoop.markStepDone('ep001_engage', { episode: 'welcome_to_bytecast', gate: 'engage' });
      }
    });
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/training_missions/tr_001_golden_path/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('tr001_golden_path', { mission: 'tr_001_golden_path', checkpoints: 3 });
      }
    });
    await page.waitForTimeout(500);

    // Navigate to Seed Orchard
    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');

    // Wait for orchard to load
    await page.waitForTimeout(2000);

    // Simulate seed export (this would normally be triggered by UI)
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

    // Verify seed export is done
    const exportDone = await isStepDone(page, 'p1_golden_path', 'seed_export_v1');
    expect(exportDone).toBe(true);
  });

  test('Step 4: Publish step completion', async ({ page }) => {
    // Complete all prerequisites
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_listen', { episode: 'welcome_to_bytecast', gate: 'listen' });
        window.ByteCastLoop.markStepDone('ep001_slide', { episode: 'welcome_to_bytecast', gate: 'slide' });
        window.ByteCastLoop.markStepDone('ep001_engage', { episode: 'welcome_to_bytecast', gate: 'engage' });
      }
    });
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/training_missions/tr_001_golden_path/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('tr001_golden_path', { mission: 'tr_001_golden_path', checkpoints: 3 });
      }
    });
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');
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

    // Simulate publish step
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('seed_publish_v1', {
          publishedUrl: 'https://example.com/test-seed',
          publishedAt: new Date().toISOString(),
        });
      }
    });

    await page.waitForTimeout(1000);

    // Verify publish step is done
    const publishDone = await isStepDone(page, 'p1_golden_path', 'seed_publish_v1');
    expect(publishDone).toBe(true);
  });

  test('Full Golden Path: All steps → Badge minted', async ({ page }) => {
    // Complete entire journey
    await navigateAndWait(page, '/episodes/welcome_to_bytecast/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('ep001_listen', { episode: 'welcome_to_bytecast', gate: 'listen' });
        window.ByteCastLoop.markStepDone('ep001_slide', { episode: 'welcome_to_bytecast', gate: 'slide' });
        window.ByteCastLoop.markStepDone('ep001_engage', { episode: 'welcome_to_bytecast', gate: 'engage' });
      }
    });
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/training_missions/tr_001_golden_path/index.html');
    await page.evaluate(() => {
      if (window.ByteCastLoop) {
        window.ByteCastLoop.markStepDone('tr001_golden_path', { mission: 'tr_001_golden_path', checkpoints: 3 });
      }
    });
    await page.waitForTimeout(500);

    await navigateAndWait(page, '/seed_builder_studio/seed_orchard_ui/index.html');
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

    // Orchard is the canonical place to enforce badge rules after proof steps are done.
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

    // Navigate to playlist to check badge is visible
    await navigateAndWait(page, '/seed_bytecast.html');

    // Verify badge is minted
    const badgeMinted = await hasBadge(page, 'p1_golden_path_v1');
    expect(badgeMinted).toBe(true);
  });
});
