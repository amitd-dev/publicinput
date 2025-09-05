import { FullConfig } from '@playwright/test';
import { configurationManager } from './ConfigurationManager';

/**
 * Global setup that runs before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  const settings = configurationManager.getSettings();
  console.log(`Environment: ${configurationManager.getEnvironment()}`);
  console.log(`Base URL: ${settings.cityzenSettings.baseUrl}`);
  console.log(`Browser: ${settings.browserSettings.browser}`);
  
  // Create test-results directories
  const fs = require('fs');
  const path = require('path');
  
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/traces',
    'test-results/videos'
  ];
  
  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;
