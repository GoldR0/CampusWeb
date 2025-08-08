# ONO Campus - React Application Launcher
# PowerShell Script

Write-Host "========================================" -ForegroundColor Green
Write-Host "   ONO Campus - React Application" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Add Node.js to PATH temporarily
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Starting the application..." -ForegroundColor Yellow
Write-Host "The app will open automatically in your browser at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Magenta
Write-Host ""

npm start
