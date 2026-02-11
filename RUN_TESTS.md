# Running ByteCast Playwright Tests

## Prerequisites

1. **Node.js 18+** installed
2. **Python 3** installed (for local server)

## Quick Start

### Option 1: Using the PowerShell Script (Windows)

```powershell
cd "\\100.115.9.61\Collab\mini.shops\bytecast"
powershell -ExecutionPolicy Bypass -File run-tests.ps1
```

### Option 2: Manual Steps

Note: `npm` cannot run with a UNC current directory (e.g. `\\\\server\\share\\...`). If you're in a UNC path, use `run-tests.ps1` or run commands inside `cmd /c "pushd <path> && ... && popd"`.

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install chromium
```

3. **Start local server** (in a separate terminal):
```bash
python -m http.server 8080
```

4. **Run tests** (in another terminal):
```bash
npm test
```

## Running Specific Test Suites

```bash
# Navigation tests only
npm run test:navigation

# Golden Path journey
npm run test:golden-path

# Seeding Track
npm run test:seeding

# Division Track
npm run test:division

# All browsers (Windows)
npm run test:all-browsers
```

## Test Modes

### Headless (default)
```bash
npm test
```

### Headed (see browser)
```bash
npm run test:headed
```

### UI Mode (interactive)
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

## Viewing Results

After tests complete, view the HTML report:
```bash
npx playwright show-report
```

## Troubleshooting

### Server Already Running
If port 8080 is already in use, either:
- Stop the existing server, or
- Set `BYTECAST_URL` environment variable:
```bash
$env:BYTECAST_URL="http://localhost:3000"
npm test
```

### Dependencies Not Found
```bash
npm install
npx playwright install chromium
```

### Tests Fail to Connect
- Ensure local server is running on port 8080
- Check firewall settings
- Verify `baseURL` in `playwright.config.js`

## Expected Test Duration

- Navigation tests: ~30 seconds
- Golden Path: ~2-3 minutes
- Seeding Track: ~1 minute
- Division Track: ~2 minutes
- All tests: ~5-7 minutes

## Test Output

Tests will show:
- ✅ Passing tests
- ❌ Failing tests with error details
- Screenshots/videos on failure (in `test-results/`)
- HTML report (in `playwright-report/`)
