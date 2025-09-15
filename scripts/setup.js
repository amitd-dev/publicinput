#!/usr/bin/env node

/**
 * Cross-platform setup script for Playwright Automation Framework
 * Works on Windows, macOS, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`📦 ${description}...`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to ${description.toLowerCase()}`, colors.red);
    log(`Error: ${error.message}`, colors.red);
    return false;
  }
}

function checkCommand(command, name) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    log(`❌ ${name} is not installed. Please install ${name} first.`, colors.red);
    return false;
  }
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

function checkEnvironmentFile(envFile) {
  if (!fs.existsSync(envFile)) {
    log(`⚠️  ${envFile} file not found. Please create it with your environment settings.`, colors.yellow);
    return false;
  }
  return true;
}

function main() {
  log('🚀 Setting up Playwright Automation Framework...', colors.cyan);
  
  // Check if Node.js is installed
  if (!checkCommand('node', 'Node.js')) {
    log('Visit: https://nodejs.org/', colors.blue);
    process.exit(1);
  }
  
  // Check if npm is installed
  if (!checkCommand('npm', 'npm')) {
    log('Visit: https://nodejs.org/', colors.blue);
    process.exit(1);
  }
  
  log('✅ Node.js and npm are installed', colors.green);
  
  // Install dependencies
  if (!execCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }
  
  // Install Playwright browsers
  if (!execCommand('npx playwright install --with-deps', 'Installing Playwright browsers')) {
    process.exit(1);
  }
  
  // Create test-results directories
  log('📁 Creating test-results directories...', colors.blue);
  const directories = [
    'test-results/screenshots',
    'test-results/traces',
    'test-results/videos',
    'test-results/downloads'
  ];
  
  directories.forEach(dir => {
    if (createDirectory(dir)) {
      log(`✅ Created ${dir}`, colors.green);
    }
  });
  
  // Check environment files
  log('🔧 Checking environment configuration...', colors.blue);
  const envFiles = ['.env.dev', '.env.qa', '.env.prod'];
  envFiles.forEach(file => checkEnvironmentFile(file));
  
  log('✅ Environment configuration checked', colors.green);
  
  // Run a quick test to verify setup
  log('🧪 Running a quick test to verify setup...', colors.blue);
  
  // Set environment variable based on OS
  const isWindows = os.platform() === 'win32';
  const envCommand = isWindows ? 'set ENV=dev &&' : 'ENV=dev';
  
  try {
    execSync(`${envCommand} npx playwright test --project=chromium --grep="should display login page elements correctly" --reporter=list`, { stdio: 'inherit' });
    log('✅ Setup verification successful!', colors.green);
  } catch (error) {
    log('⚠️  Setup verification failed. This might be expected if your application is not running.', colors.yellow);
    log('   Make sure to update the environment files with correct URLs and credentials.', colors.yellow);
  }
  
  // Display completion message
  log('', colors.reset);
  log('🎉 Playwright Automation Framework setup complete!', colors.cyan);
  log('', colors.reset);
  log('📋 Next steps:', colors.blue);
  log('1. Update .env.dev, .env.qa, and .env.prod files with your application URLs and credentials', colors.reset);
  log('2. Run tests with: npm run test:dev', colors.reset);
  log('3. View test reports with: npm run test:report', colors.reset);
  log('4. Read the README.md for detailed usage instructions', colors.reset);
  log('', colors.reset);
  log('🔗 Useful commands:', colors.blue);
  log('  npm run test:dev     - Run tests in development environment', colors.reset);
  log('  npm run test:qa      - Run tests in QA environment', colors.reset);
  log('  npm run test:prod    - Run tests in production environment', colors.reset);
  log('  npm run test:ui      - Run tests with UI mode', colors.reset);
  log('  npm run test:debug   - Run tests in debug mode', colors.reset);
  log('', colors.reset);
  log('Happy testing! 🎯', colors.cyan);
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main };
