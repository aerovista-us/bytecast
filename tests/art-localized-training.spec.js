/**
 * Art Localized Training Path Tests
 * Tests: Listen → Slide → Engage for Episodes 0–4 + final assessment → Badges
 * Journey: art_localized_training (The Art Localized — Training)
 */

const { test, expect } = require('@playwright/test');
const {
  clearByteCastStorage,
  navigateAndWait,
  isStepDone,
  hasBadge,
} = require('./helpers');

const JOURNEY_ID = 'art_localized_training';

/** Steps to mark for Art Localized (in order). Ep0–4 listen/slide/engage + final_assessment. */
const ART_LOCALIZED_STEPS = [
  'ep0_listen',
  'ep0_slide',
  'ep0_engage',
  'ep1_listen',
  'ep1_slide',
  'ep1_engage',
  'ep2_listen',
  'ep2_slide',
  'ep2_engage',
  'ep3_listen',
  'ep3_slide',
  'ep3_engage',
  'ep4_listen',
  'ep4_slide',
  'ep4_engage',
  'final_assessment',
];

/** Run in browser: mark all Art Localized steps done and run badge minting. */
async function completeArtLocalizedPathAndMintBadges(page) {
  await page.evaluate(
    async ({ journeyId, steps }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return { error: 'ByteCastLoop not found' };
      const meta = { journeyId };
      for (const stepId of steps) {
        Loop.markStepDone(stepId, meta);
      }
      await new Promise((r) => setTimeout(r, 300));
      const wf2 = Loop.ensureWorkflowV2(journeyId);
      let config;
      try {
        config = await Loop.loadJourneyConfig('/data/journey_steps.json', null);
      } catch (e) {
        return { error: 'loadJourneyConfig failed', message: String(e) };
      }
      const journey = Loop.getJourneyById(config, journeyId);
      if (!journey) return { error: 'journey not found', journeyId };
      Loop.ensureJourneyBadges(journey, wf2);
      Loop.saveWorkflowV2(wf2, journeyId);
      return { ok: true };
    },
    { journeyId: JOURNEY_ID, steps: ART_LOCALIZED_STEPS }
  );
}

test.describe('Art Localized Training Path (art_localized_training)', () => {
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await clearByteCastStorage(page);
  });

  test('Step 1: Ep0 gates (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    await page.evaluate(({ journeyId }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      const meta = { journeyId };
      Loop.markStepDone('ep0_listen', meta);
      Loop.markStepDone('ep0_slide', meta);
      Loop.markStepDone('ep0_engage', meta);
    }, { journeyId: JOURNEY_ID });

    await page.waitForTimeout(800);

    const listenDone = await isStepDone(page, JOURNEY_ID, 'ep0_listen');
    const slideDone = await isStepDone(page, JOURNEY_ID, 'ep0_slide');
    const engageDone = await isStepDone(page, JOURNEY_ID, 'ep0_engage');

    expect(listenDone).toBe(true);
    expect(slideDone).toBe(true);
    expect(engageDone).toBe(true);
  });

  test('Step 2: Ep1 gates (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    await page.evaluate(({ journeyId, steps }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      const meta = { journeyId };
      steps.forEach((id) => Loop.markStepDone(id, meta));
    }, { journeyId: JOURNEY_ID, steps: ART_LOCALIZED_STEPS.slice(0, 6) }); // ep0 + ep1

    await page.waitForTimeout(800);

    const ep1Listen = await isStepDone(page, JOURNEY_ID, 'ep1_listen');
    const ep1Slide = await isStepDone(page, JOURNEY_ID, 'ep1_slide');
    const ep1Engage = await isStepDone(page, JOURNEY_ID, 'ep1_engage');

    expect(ep1Listen).toBe(true);
    expect(ep1Slide).toBe(true);
    expect(ep1Engage).toBe(true);
  });

  test('Step 3: Ep2 gates (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    await page.evaluate(({ journeyId, steps }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      const meta = { journeyId };
      steps.forEach((id) => Loop.markStepDone(id, meta));
    }, { journeyId: JOURNEY_ID, steps: ART_LOCALIZED_STEPS.slice(0, 9) }); // ep0, ep1, ep2

    await page.waitForTimeout(800);

    const ep2Listen = await isStepDone(page, JOURNEY_ID, 'ep2_listen');
    const ep2Engage = await isStepDone(page, JOURNEY_ID, 'ep2_engage');

    expect(ep2Listen).toBe(true);
    expect(ep2Engage).toBe(true);
  });

  test('Step 4: Ep3 gates (listen, slide, engage)', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    await page.evaluate(({ journeyId, steps }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      const meta = { journeyId };
      steps.forEach((id) => Loop.markStepDone(id, meta));
    }, { journeyId: JOURNEY_ID, steps: ART_LOCALIZED_STEPS.slice(0, 12) }); // ep0–3

    await page.waitForTimeout(800);

    const ep3Engage = await isStepDone(page, JOURNEY_ID, 'ep3_engage');
    expect(ep3Engage).toBe(true);
  });

  test('Step 5: Ep4 + final_assessment', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    await page.evaluate(({ journeyId, steps }) => {
      const Loop = window.ByteCastLoop;
      if (!Loop) return;
      const meta = { journeyId };
      steps.forEach((id) => Loop.markStepDone(id, meta));
    }, { journeyId: JOURNEY_ID, steps: ART_LOCALIZED_STEPS });

    await page.waitForTimeout(800);

    const ep4Engage = await isStepDone(page, JOURNEY_ID, 'ep4_engage');
    const finalDone = await isStepDone(page, JOURNEY_ID, 'final_assessment');

    expect(ep4Engage).toBe(true);
    expect(finalDone).toBe(true);
  });

  test('Full path: All steps → Badges minted (Listener, Foundation, Division Ally, Partner Ready, Amplifier, Certified)', async ({ page }) => {
    await navigateAndWait(page, '/seed_bytecast.html');

    const result = await completeArtLocalizedPathAndMintBadges(page);
    expect(result?.error).toBeUndefined();
    if (result?.error) return;

    await page.waitForTimeout(1500);

    expect(await hasBadge(page, 'listener_v1')).toBe(true);
    expect(await hasBadge(page, 'foundation_v1')).toBe(true);
    expect(await hasBadge(page, 'division_ally_v1')).toBe(true);
    expect(await hasBadge(page, 'partner_ready_v1')).toBe(true);
    expect(await hasBadge(page, 'amplifier_v1')).toBe(true);
    expect(await hasBadge(page, 'art_localized_certified_v1')).toBe(true);
  });
});
