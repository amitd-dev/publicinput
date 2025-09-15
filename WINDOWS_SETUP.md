# Windows Setup Guide

This guide provides Windows-specific setup instructions for the Playwright Automation Framework.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```cmd
npm run setup
```
This cross-platform script will work on Windows and automatically handle all setup steps.

### Option 2: Windows Batch Script
```cmd
npm run setup:windows
```

### Option 3: Manual Setup
```cmd
REM Install dependencies
npm install

REM Install Playwright browsers
npx playwright install --with-deps

REM Create directories
mkdir test-results\screenshots
mkdir test-results\traces
mkdir test-results\videos
mkdir test-results\downloads
```

## 🔧 Environment Variables

### Using npm Scripts (Recommended)
The framework now uses `cross-env` for cross-platform compatibility:

```cmd
REM Development environment
npm run test:dev

REM QA environment
npm run test:qa

REM Production environment
npm run test:prod
```

### Manual Environment Variable Setting

#### Command Prompt
```cmd
set ENV=dev && npm test
set ENV=qa && npm test
set ENV=prod && npm test
```

#### PowerShell
```powershell
$env:ENV="dev"; npm test
$env:ENV="qa"; npm test
$env:ENV="prod"; npm test
```

## 🛠️ Troubleshooting

### Environment Variables Not Working
If `ENV=dev` syntax doesn't work:

1. **Use npm scripts instead:**
   ```cmd
   npm run test:dev
   ```

2. **Ensure cross-env is installed:**
   ```cmd
   npm install --save-dev cross-env
   ```

### PowerShell Execution Policy
If you get execution policy errors:

```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Browser Installation Issues
If Playwright browsers fail to install:

```cmd
REM Run Command Prompt as Administrator
npx playwright install --with-deps
```

### Path Issues
- Use forward slashes (`/`) in configuration files
- Ensure Node.js is in your system PATH
- Avoid spaces in project directory path

### Antivirus Software
Some antivirus software may block Playwright:
- Add project directory to antivirus exclusions
- Temporarily disable real-time protection during setup

## 📁 Directory Structure
```
project/
├── scripts/
│   ├── setup.js        # Cross-platform setup
│   ├── setup.sh        # Unix/Linux setup
│   └── setup.bat       # Windows batch setup
├── test-results/       # Test artifacts
└── .env.*             # Environment files
```

## 🔗 Useful Commands

```cmd
REM Run tests
npm run test:dev
npm run test:qa
npm run test:prod

REM Debug mode
npm run test:debug

REM UI mode
npm run test:ui

REM View reports
npm run test:report

REM Install browsers
npm run install:browsers
```

## 📞 Support

If you encounter Windows-specific issues:

1. Check this guide first
2. Try the automated setup: `npm run setup`
3. Use Windows batch script: `npm run setup:windows`
4. Report issues with:
   - Windows version
   - Node.js version
   - Command Prompt vs PowerShell
   - Error messages

---

**Happy Testing on Windows! 🎉**
