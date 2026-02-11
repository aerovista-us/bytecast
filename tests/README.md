# ByteCast Playwright Tests

Automated end-to-end tests for ByteCast workspace user journeys.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suite
```bash
npm run test:golden-path    # Golden Path journey
npm run test:seeding         # Seeding Track journey
npm run test:division        # Division Track journey
npm run test:navigation      # Basic navigation tests
```

### Run with UI mode (interactive)
```bash
npm run test:ui
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Debug mode
```bash
npm run test:debug
```

## Test Structure

- `navigation.spec.js` - Basic navigation smoke tests (Root → Playlist → Episode → Training → Orchard)
- `golden-path.spec.js` - Full Golden Path journey (EP-001 → TR-001 → Seed Export → Publish → Badge)
- `seeding-track.spec.js` - Seeding Track journey (Seed Export → Badge)
- `division-track.spec.js` - Division Track journey (EP-002 → Offer Pack → Seed Export → Badge)
- `helpers.js` - Shared utilities for localStorage checks, navigation, etc.

## Configuration

Tests run against `http://localhost:8080` by default. Set `BYTECAST_URL` environment variable to override:

```bash
BYTECAST_URL=http://localhost:3000 npm test
```

The config automatically starts a local HTTP server (`python -m http.server 8080`) if not already running.

## Test Coverage

### User Paths Tested

1. **Golden Path (p1_golden_path)**
   - EP-001 gates completion (listen, slide, engage)
   - TR-001 training completion
   - Seed export
   - Publish step
   - Badge minting

2. **Seeding Track (seeding_v1)**
   - Standalone seed export
   - Seeding badge minting

3. **Division Track (division_aerovista_v1)**
   - EP-002 listen
   - Offer Pack visit
   - Seed export
   - Division badge minting

4. **Navigation**
   - Root page loads
   - Playlist loads and shows episodes
   - Episode pages load with player/slides
   - Training Hub loads
   - Seed Orchard loads
   - Navigation between pages works

## Notes

- Tests clear localStorage before each test to simulate fresh users
- Tests verify localStorage persistence (steps marked as done, badges minted)
- Tests wait for audio elements to be ready before interacting
- Console errors are captured and checked

## CI/CD

For CI environments, tests run with:
- Retries: 2
- Workers: 1 (sequential)
- Trace on retry
- Screenshots/videos on failure
