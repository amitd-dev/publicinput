#!/bin/bash

# Playwright Automation Framework Setup Script
# This script helps set up the Playwright testing framework

echo "🚀 Setting up Playwright Automation Framework..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install --with-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed successfully"

# Create test-results directories
echo "📁 Creating test-results directories..."
mkdir -p test-results/screenshots
mkdir -p test-results/traces
mkdir -p test-results/videos
mkdir -p test-results/downloads

echo "✅ Test-results directories created"

# Check environment files
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.dev" ]; then
    echo "⚠️  .env.dev file not found. Please create it with your development environment settings."
fi

if [ ! -f ".env.qa" ]; then
    echo "⚠️  .env.qa file not found. Please create it with your QA environment settings."
fi

if [ ! -f ".env.prod" ]; then
    echo "⚠️  .env.prod file not found. Please create it with your production environment settings."
fi

echo "✅ Environment configuration checked"

# Run a quick test to verify setup
echo "🧪 Running a quick test to verify setup..."
ENV=dev npx playwright test --project=chromium --grep="should display login page elements correctly" --reporter=list

if [ $? -eq 0 ]; then
    echo "✅ Setup verification successful!"
else
    echo "⚠️  Setup verification failed. This might be expected if your application is not running."
    echo "   Make sure to update the environment files with correct URLs and credentials."
fi

echo ""
echo "🎉 Playwright Automation Framework setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.dev, .env.qa, and .env.prod files with your application URLs and credentials"
echo "2. Run tests with: npm run test:dev"
echo "3. View test reports with: npm run test:report"
echo "4. Read the README.md for detailed usage instructions"
echo ""
echo "🔗 Useful commands:"
echo "  npm run test:dev     - Run tests in development environment"
echo "  npm run test:qa      - Run tests in QA environment"
echo "  npm run test:prod    - Run tests in production environment"
echo "  npm run test:ui      - Run tests with UI mode"
echo "  npm run test:debug   - Run tests in debug mode"
echo ""
echo "Happy testing! 🎯"
