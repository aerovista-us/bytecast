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

Playwright starts a temporary `python -m http.server` on port 8080 unless the site is already served (see `reuseExistingServer` in `playwright.config.js`). To use **Docker Compose** instead: `docker compose up -d` from the bytecast root, then set `BYTECAST_USE_EXTERNAL_SERVER=1` and run `npm test`. Details: [docs/DOCKER_COMPOSE.md](../docs/DOCKER_COMPOSE.md).

### Run the learning-environment guardrails
```bash
python scripts/validate_learning_env.py
```

For the live Docker-served site on port `18080`:
```bash
python scripts/validate_learning_env.py --base-url http://127.0.0.1:18080
```

### One-command deploy plus smoke check
```bash
python scripts/deploy_and_smoke_check.py
```

Defaults:
- syncs the repo to `glyph@100.115.9.61:/srv/Collab/mini.shops/bytecast`
- preserves the remote `.env` by not packaging local `.env`
- runs the live guardrail against `http://127.0.0.1:18080`
- runs `node --check tests/navigation.spec.js` on the remote host after deploy

Useful flags:
```bash
python scripts/deploy_and_smoke_check.py --skip-local-validate
python scripts/deploy_and_smoke_check.py --skip-remote-node-check
python scripts/deploy_and_smoke_check.py --base-url http://127.0.0.1:8092
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
- `golden-path.spec.js` - Full Golden Path / Day 1 spine (EP-001–004 → TR-001A → Seed Export → Publish → Badge)
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
   - EP-001 through EP-004 gates (listen, slide, engage each)
   - TR-001A Day 1 foundations (replaces TR-001 on this journey)
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
