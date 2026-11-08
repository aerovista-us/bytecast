const { test, expect } = require('@playwright/test');
const { clearByteCastStorage, navigateAndWait } = require('./helpers');

const PAGE = '/episodes/seed_builder_studio/seed_orchard_ui/index.html';
async function setup(page) {
  await clearByteCastStorage(page);
  await navigateAndWait(page, PAGE);
  await expect.poll(() => page.evaluate(() => !!window.ByteCastLoop)).toBe(true);
}
async function check(page, journeyId, badgeId) {
  return page.evaluate(async ({journeyId,badgeId}) => {
    const L=window.ByteCastLoop;
    const config=await L.loadJourneyConfig('/data/journey_steps.json',null);
    const journey=L.getJourneyById(config,journeyId);
    if(!journey) throw new Error('Missing journey: '+journeyId);
    const wf=L.ensureWorkflowV2(journeyId);
    const result=L.ensureJourneyBadges(journey,wf);
    L.saveWorkflowV2(wf,journeyId);
    return {result,hasBadge:L.badgeHas(badgeId),workflow:wf};
  },{journeyId,badgeId});
}

test.describe('Completion integrity - browser-local (NOT server certification)', () => {
  test('no completion means no exporter badge', async ({page}) => {
    await setup(page);
    const result=await check(page,'seeding_v1','seed_exporter_v1');
    expect(result.hasBadge).toBe(false);
  });
  test('missing artifact hash cannot earn exporter badge', async ({page}) => {
    await setup(page);
    await page.evaluate(() => window.ByteCastLoop.markStepDone('seed_export_v1',{journeyId:'seeding_v1',artifactName:'example.zip'}));
    const result=await check(page,'seeding_v1','seed_exporter_v1');
    expect(result.hasBadge).toBe(false);
  });
  test('complete local evidence earns local badge and survives reload', async ({page}) => {
    await setup(page);
    await page.evaluate(() => window.ByteCastLoop.markStepDone('seed_export_v1',{journeyId:'seeding_v1',artifactName:'example.zip',artifactHash:'test-only-hash'}));
    expect((await check(page,'seeding_v1','seed_exporter_v1')).hasBadge).toBe(true);
    await page.reload();
    expect(await page.evaluate(() => window.ByteCastLoop.badgeHas('seed_exporter_v1'))).toBe(true);
  });
  test('other journey completion does not satisfy seeding journey', async ({page}) => {
    await setup(page);
    await page.evaluate(() => window.ByteCastLoop.markStepDone('seed_export_v1',{journeyId:'p1_golden_path',artifactName:'example.zip',artifactHash:'test-only-hash'}));
    expect((await check(page,'seeding_v1','seed_exporter_v1')).hasBadge).toBe(false);
  });
  test('Golden Path rejects legacy episode-only completion', async ({page}) => {
    await setup(page);
    await page.evaluate(() => {
      const L=window.ByteCastLoop;
      for(const id of ['ep001_listen','ep001_slide','ep001_engage','ep002_listen','ep002_slide','ep002_engage','ep003_listen','ep003_slide','ep003_engage','ep004_listen','ep004_slide','ep004_engage','tr001a_day1_foundations','seed_export_v1','seed_publish_v1']) {
        L.markStepDone(id,{journeyId:'p1_golden_path',artifactName:'test.zip',artifactHash:'test-hash',publishedUrl:'https://example.com'});
      }
    });
    expect((await check(page,'p1_golden_path','p1_golden_path_v1')).hasBadge).toBe(false);
  });
});
