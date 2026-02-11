# ByteCast Test Runner
# Starts local server and runs Playwright tests

Write-Host "ByteCast Test Runner" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# NOTE: npm (via cmd.exe) cannot run with a UNC current directory. Use cmd pushd/popd to map a temp drive.
$repoRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
function Invoke-CmdInRepo([string]$command) {
    $quoted = $repoRoot.Replace('"','""')
    cmd /c "pushd ""$quoted"" && $command && popd"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Invoke-CmdInRepo "npm install"
}

# Check if Playwright is installed
if (-not (Test-Path "node_modules\@playwright\test")) {
    Write-Host "Installing Playwright..." -ForegroundColor Yellow
    Invoke-CmdInRepo "npm install"
    Invoke-CmdInRepo "npx playwright install chromium"
}

# Check if server is already running
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 2 -ErrorAction SilentlyContinue
    $serverRunning = $true
    Write-Host "Server already running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "Starting local server on port 8080..." -ForegroundColor Yellow
    $serverProcess = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    # Verify server started
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -ErrorAction Stop
        $serverRunning = $true
        Write-Host "Server started successfully" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Server may not have started. Tests may fail." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Running Playwright tests..." -ForegroundColor Cyan
Write-Host ""

# Run tests
Invoke-CmdInRepo "npm test"

Write-Host ""
Write-Host "Tests completed!" -ForegroundColor Cyan

# Cleanup: Stop server if we started it
if (-not $serverRunning -and $serverProcess) {
    Write-Host "Stopping test server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
}
