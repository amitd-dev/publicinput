import { config } from 'dotenv';
import path from 'path';
import { AppSettings, DEFAULT_APP_SETTINGS } from './AppSettings';

/**
 * Configuration manager that loads and manages application settings
 * Similar to IConfiguration in .NET
 */
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private settings: AppSettings;
  private environment: string;

  private constructor() {
    this.environment = process.env.ENV || 'dev';
    this.loadConfiguration();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * Load configuration from environment files and system environment variables
   */
  private loadConfiguration(): void {
    // Load environment-specific .env file
    const envFile = `.env.${this.environment}`;
    const envPath = path.resolve(process.cwd(), envFile);
    
    console.log(`Loading configuration for environment: ${this.environment}`);
    console.log(`Environment file: ${envFile}`);
    
    // Load the specific environment file
    const result = config({ path: envPath });
    
    if (result.error) {
      console.warn(`Warning: Could not load ${envFile}. Using system environment variables.`);
    }

    // Build settings from environment variables
    this.settings = this.buildSettingsFromEnvironment();
  }

  /**
   * Build settings object from environment variables
   */
  private buildSettingsFromEnvironment(): AppSettings {
    const settings = { ...DEFAULT_APP_SETTINGS };

    // Override with environment-specific values
    if (process.env.BASE_URL) {
      settings.cityzenSettings.baseUrl = process.env.BASE_URL;
    }

    if (process.env.BROWSER) {
      settings.browserSettings.browser = process.env.BROWSER as any;
    }

    if (process.env.HEADLESS !== undefined) {
      settings.browserSettings.headless = process.env.HEADLESS === 'true';
    }

    if (process.env.TIMEOUT) {
      settings.browserSettings.timeout = parseInt(process.env.TIMEOUT, 10);
    }

    if (process.env.SCREENSHOT_BEHAVIOR) {
      settings.testSettings.screenshotBehavior = process.env.SCREENSHOT_BEHAVIOR as any;
    }

    if (process.env.SCREENSHOT_CONTAINER) {
      settings.testSettings.screenshotContainer = process.env.SCREENSHOT_CONTAINER;
    }

    if (process.env.RETRIES) {
      settings.testSettings.retries = parseInt(process.env.RETRIES, 10);
    }

    if (process.env.WORKERS) {
      settings.testSettings.workers = parseInt(process.env.WORKERS, 10);
    }

    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      settings.azureBlobStorageConfiguration = {
        ...settings.azureBlobStorageConfiguration!,
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING
      };
    }

    // Load user account secrets from environment
    this.loadUserAccountSecrets(settings);

    return settings;
  }

  /**
   * Load user account secrets from environment variables
   */
  private loadUserAccountSecrets(settings: AppSettings): void {
    // Load secrets from environment variables
    // Format: USER_SECRET_<EMAIL_HASH>=<SECRET_KEY>
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('USER_SECRET_')) {
        const emailHash = key.replace('USER_SECRET_', '');
        const secretKey = process.env[key];
        if (secretKey) {
          // In a real implementation, you would map the hash back to the email
          // For now, we'll use the secret key directly
          settings.userAccountSecretMap.secretKeys[emailHash] = secretKey;
        }
      }
    });
  }

  /**
   * Get the current settings
   */
  public getSettings(): AppSettings {
    return this.settings;
  }

  /**
   * Get a specific setting value
   */
  public getSetting<T>(key: string): T | undefined {
    const keys = key.split('.');
    let value: any = this.settings;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value;
  }

  /**
   * Get the current environment
   */
  public getEnvironment(): string {
    return this.environment;
  }

  /**
   * Get base URL
   */
  public getBaseUrl(): string {
    return this.settings.cityzenSettings.baseUrl;
  }

  /**
   * Get browser settings
   */
  public getBrowserSettings() {
    return this.settings.browserSettings;
  }

  /**
   * Get test settings
   */
  public getTestSettings() {
    return this.settings.testSettings;
  }

  /**
   * Get user account secret map
   */
  public getUserAccountSecretMap() {
    return this.settings.userAccountSecretMap;
  }

  /**
   * Get Azure Blob Storage configuration
   */
  public getAzureBlobStorageConfiguration() {
    return this.settings.azureBlobStorageConfiguration;
  }

  /**
   * Reload configuration (useful for testing)
   */
  public reload(): void {
    this.loadConfiguration();
  }
}

// Export singleton instance
export const configurationManager = ConfigurationManager.getInstance();
