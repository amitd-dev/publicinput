import { envConfig } from '../utils/env';

/**
 * Test configuration constants and settings
 */
export class TestConfig {
  // Timeouts
  static readonly DEFAULT_TIMEOUT = 30000;
  static readonly SHORT_TIMEOUT = 5000;
  static readonly LONG_TIMEOUT = 60000;
  
  // Retry settings
  static readonly DEFAULT_RETRIES = 2;
  static readonly MAX_RETRIES = 5;
  
  // Test data
  static readonly TEST_USERS = {
    ADMIN: {
      email: envConfig.get('ADMIN_EMAIL') || 'admin@example.com',
      password: envConfig.get('ADMIN_PASSWORD') || 'admin123',
    },
    REGULAR_USER: {
      email: envConfig.get('USER_EMAIL') || 'user@example.com',
      password: envConfig.get('USER_PASSWORD') || 'user123',
    },
    GUEST: {
      email: envConfig.get('GUEST_EMAIL') || 'guest@example.com',
      password: envConfig.get('GUEST_PASSWORD') || 'guest123',
    },
  };
  
  // URLs
  static readonly URLS = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGOUT: '/logout',
  };
  
  // Selectors
  static readonly SELECTORS = {
    LOADING_SPINNER: '[data-testid="loading-spinner"]',
    ERROR_MESSAGE: '[data-testid="error-message"]',
    SUCCESS_MESSAGE: '[data-testid="success-message"]',
    NOTIFICATION: '[data-testid="notification"]',
    MODAL: '[data-testid="modal"]',
    TOAST: '[data-testid="toast"]',
  };
  
  // Test tags
  static readonly TAGS = {
    SMOKE: '@smoke',
    REGRESSION: '@regression',
    INTEGRATION: '@integration',
    E2E: '@e2e',
    SLOW: '@slow',
    FAST: '@fast',
  };
  
  // Browser settings
  static readonly BROWSER_SETTINGS = {
    HEADLESS: envConfig.isHeadless(),
    VIEWPORT: {
      DESKTOP: { width: 1920, height: 1080 },
      TABLET: { width: 768, height: 1024 },
      MOBILE: { width: 375, height: 667 },
    },
  };
  
  // API settings
  static readonly API = {
    BASE_URL: envConfig.getApiBaseUrl(),
    TIMEOUT: 10000,
    RETRIES: 3,
  };
  
  // Database settings
  static readonly DATABASE = {
    CONNECTION_STRING: envConfig.get('DB_CONNECTION_STRING'),
    TIMEOUT: 5000,
  };
  
  // File paths
  static readonly PATHS = {
    SCREENSHOTS: 'test-results/screenshots',
    VIDEOS: 'test-results/videos',
    TRACES: 'test-results/traces',
    REPORTS: 'playwright-report',
    DOWNLOADS: 'test-results/downloads',
  };
  
  // Test environment info
  static getEnvironmentInfo() {
    return {
      environment: envConfig.getCurrentEnvironment(),
      baseUrl: envConfig.getBaseUrl(),
      apiBaseUrl: envConfig.getApiBaseUrl(),
      headless: envConfig.isHeadless(),
      timeout: envConfig.getTimeout(),
    };
  }
  
  // Generate test data
  static generateTestData() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    return {
      email: `test_${random}_${timestamp}@example.com`,
      username: `testuser_${random}_${timestamp}`,
      password: `TestPass123_${random}`,
      firstName: `Test${random}`,
      lastName: `User${timestamp}`,
      phone: `+1234567890${timestamp.toString().slice(-4)}`,
    };
  }
  
  // Wait conditions
  static readonly WAIT_CONDITIONS = {
    NETWORK_IDLE: 'networkidle',
    DOM_CONTENT_LOADED: 'domcontentloaded',
    LOAD: 'load',
  };
  
  // Assertion messages
  static readonly ASSERTIONS = {
    ELEMENT_VISIBLE: 'Element should be visible',
    ELEMENT_HIDDEN: 'Element should be hidden',
    TEXT_CONTAINS: 'Element should contain text',
    URL_CONTAINS: 'URL should contain',
    TITLE_CONTAINS: 'Title should contain',
    VALUE_EQUALS: 'Value should equal',
  };
}
