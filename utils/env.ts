import { config } from 'dotenv';
import path from 'path';

/**
 * Environment configuration utility
 * Loads environment variables from .env files based on the ENV variable
 */
export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private env: string;
  private config: Record<string, string | undefined> = {};

  private constructor() {
    this.env = process.env.ENV || 'dev';
    this.loadEnvironmentConfig();
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private loadEnvironmentConfig(): void {
    const envFile = `.env.${this.env}`;
    const envPath = path.resolve(process.cwd(), envFile);
    
    console.log(`Loading environment configuration from: ${envFile}`);
    
    // Load the specific environment file
    const result = config({ path: envPath });
    
    if (result.error) {
      console.warn(`Warning: Could not load ${envFile}. Using system environment variables.`);
    }
    
    // Store all environment variables
    this.config = { ...process.env } as Record<string, string | undefined>;
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }

  public getRequired(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set for environment: ${this.env}`);
    }
    return value;
  }

  public getBaseUrl(): string {
    return this.getRequired('BASE_URL');
  }

  public getUserEmail(): string {
    return this.getRequired('USER_EMAIL');
  }

  public getUserPassword(): string {
    return this.getRequired('USER_PASSWORD');
  }

  public getTimeout(): number {
    return parseInt(this.get('TIMEOUT') || '30000', 10);
  }

  public isHeadless(): boolean {
    return this.get('HEADLESS') === 'true';
  }

  public getCurrentEnvironment(): string {
    return this.env;
  }

  public getApiBaseUrl(): string {
    return this.getRequired('API_BASE_URL');
  }

  // User email getters
  public getSuperAdminEmail(): string {
    return this.get('SUPER_ADMIN_EMAIL') || 'superadmintest@publicinput.com';
  }

  public getAdminEmail(): string {
    return this.get('ADMIN_EMAIL') || 'admin_test@publicinput.org';
  }

  public getDataViewerEmail(): string {
    return this.get('DATA_VIEWER_EMAIL') || 'dataviewer_test@publicinput.org';
  }

  public getEditorEmail(): string {
    return this.get('EDITOR_EMAIL') || 'editor_test@publicinput.org';
  }

  public getNoneEmail(): string {
    return this.get('NONE_EMAIL') || 'none_test@publicinput.org';
  }

  public getPublisherEmail(): string {
    return this.get('PUBLISHER_EMAIL') || 'publisher_test@publicinput.org';
  }

  // User type enum for better type safety
  public getUserEmails(): Record<string, string> {
    return {
      SUPER_ADMIN: this.getSuperAdminEmail(),
      ADMIN: this.getAdminEmail(),
      DATA_VIEWER: this.getDataViewerEmail(),
      EDITOR: this.getEditorEmail(),
      NONE: this.getNoneEmail(),
      PUBLISHER: this.getPublisherEmail()
    };
  }
}

// Export singleton instance
export const envConfig = EnvironmentConfig.getInstance();
