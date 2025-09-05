import { configurationManager } from '../config/ConfigurationManager';

/**
 * Secret manager for handling secure credential retrieval
 * Similar to Azure Key Vault integration in C# project
 */
export class SecretManager {
  private static instance: SecretManager;
  private secretCache: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  /**
   * Retrieve password for a user account
   * Similar to PIAzureVault.RetrieveSecretFromVault in C# project
   */
  public async retrievePassword(email: string): Promise<string> {
    const settings = configurationManager.getSettings();
    const secretMap = settings.userAccountSecretMap;
    
    // Check if we have a cached password
    if (this.secretCache.has(email)) {
      return this.secretCache.get(email)!;
    }

    // Get the secret key for this email
    const secretKey = secretMap.secretKeys[email];
    if (!secretKey) {
      throw new Error(`No secret key found for email: ${email}`);
    }

    // In a real implementation, this would retrieve from Azure Key Vault
    // For now, we'll use environment variables or return the secret key as password
    let password: string;

    if (process.env[secretKey]) {
      // Password is stored as environment variable
      password = process.env[secretKey]!;
    } else if (process.env[`PASSWORD_${email.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
      // Password is stored with email-based key
      password = process.env[`PASSWORD_${email.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]!;
    } else {
      // Fallback: use the secret key as password (for demo purposes)
      // In production, this should never happen
      console.warn(`Warning: Using secret key as password for ${email}. This should not happen in production.`);
      password = secretKey;
    }

    // Cache the password
    this.secretCache.set(email, password);
    
    return password;
  }

  /**
   * Retrieve password for a user account (synchronous version)
   */
  public retrievePasswordSync(email: string): string {
    const settings = configurationManager.getSettings();
    const secretMap = settings.userAccountSecretMap;
    
    // Check if we have a cached password
    if (this.secretCache.has(email)) {
      return this.secretCache.get(email)!;
    }

    // Get the secret key for this email
    const secretKey = secretMap.secretKeys[email];
    if (!secretKey) {
      throw new Error(`No secret key found for email: ${email}`);
    }

    // In a real implementation, this would retrieve from Azure Key Vault
    let password: string;

    if (process.env[secretKey]) {
      password = process.env[secretKey]!;
    } else if (process.env[`PASSWORD_${email.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
      password = process.env[`PASSWORD_${email.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]!;
    } else {
      console.warn(`Warning: Using secret key as password for ${email}. This should not happen in production.`);
      password = secretKey;
    }

    // Cache the password
    this.secretCache.set(email, password);
    
    return password;
  }

  /**
   * Clear the secret cache
   */
  public clearCache(): void {
    this.secretCache.clear();
  }

  /**
   * Get all available user accounts
   */
  public getAvailableAccounts(): string[] {
    const settings = configurationManager.getSettings();
    return Object.keys(settings.userAccountSecretMap.secretKeys);
  }

  /**
   * Check if an account exists in the secret map
   */
  public hasAccount(email: string): boolean {
    const settings = configurationManager.getSettings();
    return email in settings.userAccountSecretMap.secretKeys;
  }

  /**
   * Add a new account to the secret map (for testing purposes)
   */
  public addAccount(email: string, secretKey: string): void {
    const settings = configurationManager.getSettings();
    settings.userAccountSecretMap.secretKeys[email] = secretKey;
  }

  /**
   * Remove an account from the secret map
   */
  public removeAccount(email: string): void {
    const settings = configurationManager.getSettings();
    delete settings.userAccountSecretMap.secretKeys[email];
    this.secretCache.delete(email);
  }

  /**
   * Get account information (without password)
   */
  public getAccountInfo(email: string): { email: string; secretKey: string; hasPassword: boolean } | null {
    const settings = configurationManager.getSettings();
    const secretKey = settings.userAccountSecretMap.secretKeys[email];
    
    if (!secretKey) {
      return null;
    }

    const hasPassword = process.env[secretKey] !== undefined || 
                       process.env[`PASSWORD_${email.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] !== undefined;

    return {
      email,
      secretKey,
      hasPassword
    };
  }
}

// Export singleton instance
export const secretManager = SecretManager.getInstance();
