// Current-catalog browser-local acceptance. Synthetic fixtures are NOT server credentials or certificates.
const { test, expect } = require('@playwright/test');
const {clearByteCastStorage, navigateAndWait} = require('./helpers');
test.beforeEach(async ({page}) => { await clearByteCastStorage(page); });
test('Seeding: actual ZIP download creates hashed browser-local completion and badge', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('bytecast.journey.active','seeding_v1'));
  await navigateAndWait(page,'/episodes/seed_builder_studio/seed_orchard_ui/index.html');
  await page.locator('#seedName').fill('QA seeded export');
  await page.locator('#goal').fill('Check downloadable archive');
  await page.locator('#audience').fill('Internal acceptance');
  await page.locator('#seedName').evaluate(el => el.form.requestSubmit());
  const download = page.waitForEvent('download',{timeout:15000});
  await expect(page.locator('#exportZip')).toBeEnabled();
  await page.locator('#exportZip').click();
  expect((await download).suggestedFilename()).toMatch(/\.zip$/);
  await expect.poll(() => page.evaluate(() => {
    const L=window.ByteCastLoop;
    const step=L?.loadWorkflowV2('seeding_v1')?.steps?.seed_export_v1;
    return !!(step?.done && /^sha256:/.test(step?.meta?.artifactHash||'') && L.badgeHas('seed_exporter_v1'));
  })).toBe(true);
  await page.reload();
  expect(await page.evaluate(() => window.ByteCastLoop.badgeHas('seed_exporter_v1'))).toBe(true);
});

