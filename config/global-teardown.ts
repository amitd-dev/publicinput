import { FullConfig } from '@playwright/test';
import { configurationManager } from './ConfigurationManager';

/**
 * Global teardown that runs after all tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Generate summary report
    console.log('📊 Test execution summary:');
    console.log(`Environment: ${configurationManager.getEnvironment()}`);
    console.log(`Base URL: ${configurationManager.getBaseUrl()}`);
    console.log(`Test results saved to: test-results/`);
    console.log(`HTML report available at: playwright-report/index.html`);
    
  } catch (error) {
    console.error('❌ Error during teardown:', error);
  }
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
