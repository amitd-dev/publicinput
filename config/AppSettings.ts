/**
 * Main application settings configuration
 * Similar to appsettings.json in C# projects
 */
export interface AppSettings {
  userAccountSecretMap: UserAccountSecretMap;
  cityzenSettings: CityzenSettings;
  browserSettings: BrowserSettings;
  testSettings: TestSettings;
  azureBlobStorageConfiguration?: AzureBlobStorageConfiguration;
}

/**
 * User account secret mapping configuration
 * Maps user emails to their secret keys for password retrieval
 */
export interface UserAccountSecretMap {
  secretKeys: Record<string, string>;
}

/**
 * Cityzen/Public Input application settings
 */
export interface CityzenSettings {
  baseUrl: string;
}

/**
 * Browser configuration settings
 */
export interface BrowserSettings {
  browser: 'Chromium' | 'Firefox' | 'Webkit';
  headless: boolean;
  slowMo?: number;
  timeout: number;
  viewport?: {
    width: number;
    height: number;
  };
}

/**
 * Test execution settings
 */
export interface TestSettings {
  screenshotBehavior: 'Always' | 'OnlyOnFailures' | 'Never';
  screenshotContainer: string;
  retries: number;
  parallel: boolean;
  workers?: number;
}

/**
 * Azure Blob Storage configuration for test artifacts
 */
export interface AzureBlobStorageConfiguration {
  shouldGenerateSasUri: boolean;
  sasExpiryHours: number;
  connectionString: string;
  containerName?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  userAccountSecretMap: {
    secretKeys: {
      'admin_test@publicinput.org': 'TestAdminPassword',
      'dataviewer_test@publicinput.org': 'TestDataViewerPassword',
      'editor_test@publicinput.org': 'TestEditorPassword',
      'none_test@publicinput.org': 'TestNonePassword',
      'publisher_test@publicinput.org': 'TestPublisherPassword',
      'superadmintest@publicinput.com': 'TestSuperAdminPassword'
    }
  },
  cityzenSettings: {
    baseUrl: 'https://publicinput.com'
  },
  browserSettings: {
    browser: 'Chromium',
    headless: true,
    timeout: 60000,
    viewport: {
      width: 1920,
      height: 1080
    }
  },
  testSettings: {
    screenshotBehavior: 'OnlyOnFailures',
    screenshotContainer: 'publicinput-acceptance-tests',
    retries: 2,
    parallel: true,
    workers: 4
  },
  azureBlobStorageConfiguration: {
    shouldGenerateSasUri: true,
    sasExpiryHours: 336,
    connectionString: ''
  }
};
