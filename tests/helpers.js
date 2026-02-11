/**
 * Helper utilities for ByteCast Playwright tests
 */

/**
 * Clear all ByteCast localStorage keys
 * @param {import('@playwright/test').Page} page
 */
async function clearByteCastStorage(page) {
  // localStorage is blocked on about:blank; ensure we're on the ByteCast origin first.
  const url = String(page.url() || "");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  }
  await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bytecast.')) {
        localStorage.removeItem(key);
      }
    });
  });
}

/**
 * Get ByteCast localStorage value
 * @param {import('@playwright/test').Page} page
 * @param {string} key
 * @returns {Promise<any>}
 */
async function getStorageValue(page, key) {
  return await page.evaluate((k) => {
    const value = localStorage.getItem(k);
    return value ? JSON.parse(value) : null;
  }, key);
}

/**
 * Check if a step is marked as done in localStorage
 * @param {import('@playwright/test').Page} page
 * @param {string} journeyId
 * @param {string} stepId
 * @returns {Promise<boolean>}
 */
async function isStepDone(page, journeyId, stepId) {
  const workflowKey = `bytecast.workflow.v2.${journeyId}`;
  const workflow = await getStorageValue(page, workflowKey);
  if (!workflow || !workflow.steps) return false;
  const step = workflow.steps[stepId];
  return step && step.done === true;
}

/**
 * Check if a badge is minted
 * @param {import('@playwright/test').Page} page
 * @param {string} badgeId
 * @returns {Promise<boolean>}
 */
async function hasBadge(page, badgeId) {
  const badges = await getStorageValue(page, 'bytecast.badges.v1');
  if (!badges) return false;
  return badges.some(b => b.id === badgeId);
}

/**
 * Wait for console errors (returns array of error messages)
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout
 * @returns {Promise<string[]>}
 */
async function waitForConsoleErrors(page, timeout = 5000) {
  const errors = [];
  const handler = msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  };
  page.on('console', handler);
  await page.waitForTimeout(timeout);
  page.off('console', handler);
  return errors;
}

/**
 * Get all console errors from page load
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>}
 */
async function getConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Wait for audio element to be ready
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
async function waitForAudioReady(page, selector = '#audio') {
  await page.waitForSelector(selector);
  // Preload is often "metadata" in ByteCast packs, so "loadeddata" may never fire.
  await page.waitForFunction((sel) => {
    const audio = document.querySelector(sel);
    if (!audio) return true;
    if (audio.error) return true;
    if (audio.readyState >= 1 && Number.isFinite(audio.duration) && audio.duration > 0) return true;
    return false;
  }, selector, { timeout: 15_000 });
}

/**
 * Navigate and wait for page to be ready
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
async function navigateAndWait(page, path) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  // Wait a bit for any async initialization
  await page.waitForTimeout(500);
}

module.exports = {
  clearByteCastStorage,
  getStorageValue,
  isStepDone,
  hasBadge,
  waitForConsoleErrors,
  getConsoleErrors,
  waitForAudioReady,
  navigateAndWait,
};
