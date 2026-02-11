# Playwright Tests Setup — Added

**Date:** 2026-02-10  
**Status:** Added (run locally to verify)

---

## Overview

Comprehensive Playwright test suite created to automate user journey testing across multiple paths in the ByteCast workspace.

---

## Files Created

### Configuration
- `package.json` - Node.js dependencies and test scripts
- `playwright.config.js` - Playwright configuration (multi-browser, auto-server)
- `.gitignore` - Updated to exclude test artifacts

### Test Files
- `tests/helpers.js` - Shared utilities (localStorage checks, navigation helpers)
- `tests/navigation.spec.js` - Basic navigation smoke tests
- `tests/golden-path.spec.js` - Full Golden Path journey tests
- `tests/seeding-track.spec.js` - Seeding Track journey tests
- `tests/division-track.spec.js` - Division Track journey tests
- `tests/README.md` - Test documentation

### Documentation Updates
- `docs/JOURNEY_SMOKE_TESTS.md` - Updated with automated testing section

---

## Test Coverage (Targets)

### 1. Navigation Tests (`navigation.spec.js`)
- Root page loads and shows primary doors
- Playlist loads and shows episode registry
- EP-001 episode page loads with player and slides
- Training Hub loads and shows modules
- Seed Orchard UI loads
- Navigation between pages works

### 2. Golden Path Journey (`golden-path.spec.js`)
- EP-001 gates completion (listen, slide, engage)
- TR-001 training completion
- Seed export completion
- Publish step completion
- Full journey → Badge minted

### 3. Seeding Track (`seeding-track.spec.js`)
- Standalone seed export
- Seeding badge minted after export

### 4. Division Track (`division-track.spec.js`)
- EP-002 listen step completion
- Offer Pack visit step completion
- Full Division Track → Badge minted

---

## Features

### Automated Verification
- **localStorage persistence** - Verifies steps are marked as done
- **Badge minting** - Confirms badges are minted when requirements met
- **Console error detection** - Captures and reports JavaScript errors
- **Audio readiness** - Waits for audio elements to be ready
- **Navigation flow** - Tests user paths through the application

### Multi-Browser Support
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

### Test Modes
- Headless (default)
- Headed (see browser)
- UI mode (interactive)
- Debug mode

---

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific test suite
npm run test:navigation
npm run test:golden-path
npm run test:seeding
npm run test:division

# Run with UI (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed
```

---

## Configuration

### Base URL
- Default: `http://localhost:8080`
- Override: Set `BYTECAST_URL` environment variable

### Auto Server
- Automatically starts `python -m http.server 8080` if not running
- Reuses existing server in non-CI environments

### CI/CD Ready
- Retries: 2 (on CI)
- Workers: 1 (sequential on CI)
- Trace on retry
- Screenshots/videos on failure

---

## Test Structure

### Helper Functions (`helpers.js`)
- `clearByteCastStorage()` - Clear localStorage for fresh user simulation
- `getStorageValue()` - Get localStorage value
- `isStepDone()` - Check if journey step is complete
- `hasBadge()` - Check if badge is minted
- `waitForAudioReady()` - Wait for audio element
- `navigateAndWait()` - Navigate and wait for page ready

### Test Pattern
1. Clear localStorage (fresh user)
2. Navigate to page
3. Simulate user interactions
4. Verify localStorage state
5. Check badge minting (where applicable)

---

## Integration with Manual Testing

The Playwright tests complement the manual smoke test template:
- **Manual tests** - Human verification of UX, visual checks, edge cases
- **Automated tests** - Regression testing, localStorage verification, badge flows

Both methods are documented in `docs/JOURNEY_SMOKE_TESTS.md`.

---

## Next Steps

1. **Run tests** - Execute `npm test` to verify setup
2. **Review results** - Check HTML report for test results
3. **Extend tests** - Add more specific user scenarios as needed
4. **CI integration** - Add to CI/CD pipeline for automated regression testing

---

## Notes

- Tests simulate user interactions via JavaScript evaluation (not full UI automation)
- Tests verify localStorage state to confirm completion tracking
- Tests wait for async operations (audio loading, page initialization)
- Tests are designed to be fast and reliable

---

**End of Setup Documentation**
