@echo off
echo ========================================
echo    ONO Campus - React Application
echo ========================================
echo.

REM Add Node.js to PATH temporarily
set PATH=%PATH%;C:\Program Files\nodejs

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Node.js version: 
node --version
echo npm version:
npm --version

echo.
echo Installing dependencies...
npm install

echo.
echo Starting the application...
echo The app will open automatically in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

npm start

pause
