@echo off
REM Playwright Automation Framework Setup Script for Windows
REM This script helps set up the Playwright testing framework on Windows

echo 🚀 Setting up Playwright Automation Framework...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Install Playwright browsers
echo 🌐 Installing Playwright browsers...
npx playwright install --with-deps

if %errorlevel% neq 0 (
    echo ❌ Failed to install Playwright browsers
    exit /b 1
)

echo ✅ Playwright browsers installed successfully

REM Create test-results directories
echo 📁 Creating test-results directories...
if not exist "test-results\screenshots" mkdir "test-results\screenshots"
if not exist "test-results\traces" mkdir "test-results\traces"
if not exist "test-results\videos" mkdir "test-results\videos"
if not exist "test-results\downloads" mkdir "test-results\downloads"

echo ✅ Test-results directories created

REM Check environment files
echo 🔧 Checking environment configuration...

if not exist ".env.dev" (
    echo ⚠️  .env.dev file not found. Please create it with your development environment settings.
)

if not exist ".env.qa" (
    echo ⚠️  .env.qa file not found. Please create it with your QA environment settings.
)

if not exist ".env.prod" (
    echo ⚠️  .env.prod file not found. Please create it with your production environment settings.
)

echo ✅ Environment configuration checked

REM Run a quick test to verify setup
echo 🧪 Running a quick test to verify setup...
set ENV=dev
npx playwright test --project=chromium --grep="should display login page elements correctly" --reporter=list

if %errorlevel% equ 0 (
    echo ✅ Setup verification successful!
) else (
    echo ⚠️  Setup verification failed. This might be expected if your application is not running.
    echo    Make sure to update the environment files with correct URLs and credentials.
)

echo.
echo 🎉 Playwright Automation Framework setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.dev, .env.qa, and .env.prod files with your application URLs and credentials
echo 2. Run tests with: npm run test:dev
echo 3. View test reports with: npm run test:report
echo 4. Read the README.md for detailed usage instructions
echo.
echo 🔗 Useful commands:
echo   npm run test:dev     - Run tests in development environment
echo   npm run test:qa      - Run tests in QA environment
echo   npm run test:prod    - Run tests in production environment
echo   npm run test:ui      - Run tests with UI mode
echo   npm run test:debug   - Run tests in debug mode
echo.
echo Happy testing! 🎯
