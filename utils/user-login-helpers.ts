import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { envConfig } from './env';
import { secretManager } from '../services/SecretManager';
import { TestHelpers } from './test-helpers';

/**
 * User types enum for type safety
 */
export enum UserType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DATA_VIEWER = 'DATA_VIEWER',
  EDITOR = 'EDITOR',
  NONE = 'NONE',
  PUBLISHER = 'PUBLISHER'
}

/**
 * User login credentials interface
 */
export interface UserCredentials {
  email: string;
  password: string;
  userType: UserType;
}

/**
 * User login helper class
 * Provides methods to login with different user types
 */
export class UserLoginHelpers {
  private loginPage: LoginPage;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  /**
   * Get user credentials for a specific user type
   */
  private getUserCredentials(userType: UserType): UserCredentials {
    const userEmails = envConfig.getUserEmails();
    const email = userEmails[userType];
    
    if (!email) {
      throw new Error(`Email not found for user type: ${userType}`);
    }
    
    const password = secretManager.retrievePasswordSync(email);

    return {
      email,
      password,
      userType
    };
  }

  /**
   * Login as Super Admin
   */
  async loginAsSuperAdmin(): Promise<void> {
    const credentials = this.getUserCredentials(UserType.SUPER_ADMIN);
    await this.performLogin(credentials);
    
    // Wait for super admin dashboard
    await this.page.waitForTimeout(5000);
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/SuperAdmin/Home')) {
      throw new Error(`Super Admin login failed. Current URL: ${currentUrl}`);
    }
  }

  /**
   * Login as Admin
   */
  async loginAsAdmin(customerId: string = '1087'): Promise<void> {
    const credentials = this.getUserCredentials(UserType.ADMIN);
    await this.performLogin(credentials);
    
    // Wait for admin dashboard
    await this.page.waitForTimeout(5000);
    const isLoaded = await this.loginPage.isAdminDashboardLoaded(customerId);
    if (!isLoaded) {
      throw new Error(`Admin login failed for customer ${customerId}`);
    }
  }

  /**
   * Login as Data Viewer
   */
  async loginAsDataViewer(): Promise<void> {
    const credentials = this.getUserCredentials(UserType.DATA_VIEWER);
    await this.performLogin(credentials);
    
    // Wait for data viewer dashboard
    await this.page.waitForTimeout(5000);
    await this.verifyLoginSuccess('Data Viewer');
  }

  /**
   * Login as Editor
   */
  async loginAsEditor(): Promise<void> {
    const credentials = this.getUserCredentials(UserType.EDITOR);
    await this.performLogin(credentials);
    
    // Wait for editor dashboard
    await this.page.waitForTimeout(5000);
    await this.verifyLoginSuccess('Editor');
  }

  /**
   * Login as None (limited user)
   */
  async loginAsNone(): Promise<void> {
    const credentials = this.getUserCredentials(UserType.NONE);
    await this.performLogin(credentials);
    
    // Wait for none user dashboard
    await this.page.waitForTimeout(5000);
    await this.verifyLoginSuccess('None');
  }

  /**
   * Login as Publisher
   */
  async loginAsPublisher(): Promise<void> {
    const credentials = this.getUserCredentials(UserType.PUBLISHER);
    await this.performLogin(credentials);
    
    // Wait for publisher dashboard
    await this.page.waitForTimeout(5000);
    await this.verifyLoginSuccess('Publisher');
  }

  /**
   * Generic login method
   */
  async loginAsUser(userType: UserType, customerId?: string): Promise<void> {
    TestHelpers.logStep(`Logging in as ${userType}`);
    
    switch (userType) {
      case UserType.SUPER_ADMIN:
        await this.loginAsSuperAdmin();
        break;
      case UserType.ADMIN:
        await this.loginAsAdmin(customerId);
        break;
      case UserType.DATA_VIEWER:
        await this.loginAsDataViewer();
        break;
      case UserType.EDITOR:
        await this.loginAsEditor();
        break;
      case UserType.NONE:
        await this.loginAsNone();
        break;
      case UserType.PUBLISHER:
        await this.loginAsPublisher();
        break;
      default:
        throw new Error(`Unsupported user type: ${userType}`);
    }
  }

  /**
   * Perform the actual login process
   */
  private async performLogin(credentials: UserCredentials): Promise<void> {
    TestHelpers.logStep(`Logging in as ${credentials.userType} with email: ${credentials.email}`);
    
    // Navigate to login page
    await this.loginPage.navigateToLoginPage();
    
    // Enter credentials
    await this.loginPage.enterEmail(credentials.email);
    await this.loginPage.enterPassword(credentials.password);
    
    // Click login button
    await this.loginPage.clickLoginButton();
  }

  /**
   * Verify login success by checking URL and page content
   */
  private async verifyLoginSuccess(userType: string): Promise<void> {
    const currentUrl = this.page.url();
    const pageTitle = await this.page.title();
    
    TestHelpers.logStep(`Verifying ${userType} login success`);
    TestHelpers.logStep(`Current URL: ${currentUrl}`);
    TestHelpers.logStep(`Page title: ${pageTitle}`);
    
    // Check that we're not on the login page anymore
    if (currentUrl.includes('/Account/Login')) {
      throw new Error(`${userType} login failed - still on login page`);
    }
    
    // Check for error messages
    const hasError = await this.loginPage.isErrorMessageVisible();
    if (hasError) {
      const errorMessage = await this.loginPage.getErrorMessage();
      throw new Error(`${userType} login failed with error: ${errorMessage}`);
    }
  }

  /**
   * Get all available user types
   */
  static getAllUserTypes(): UserType[] {
    return Object.values(UserType);
  }

  /**
   * Get user type display name
   */
  static getUserTypeDisplayName(userType: UserType): string {
    const displayNames: Record<UserType, string> = {
      [UserType.SUPER_ADMIN]: 'Super Admin',
      [UserType.ADMIN]: 'Admin',
      [UserType.DATA_VIEWER]: 'Data Viewer',
      [UserType.EDITOR]: 'Editor',
      [UserType.NONE]: 'None',
      [UserType.PUBLISHER]: 'Publisher'
    };
    
    return displayNames[userType];
  }

  /**
   * Check if user has specific permissions (placeholder for future implementation)
   */
  async hasPermission(permission: string): Promise<boolean> {
    // This can be implemented based on user type and actual permission system
    // For now, return true for basic functionality
    return true;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    TestHelpers.logStep('Logging out current user');
    
    // Look for logout button/link and click it
    try {
      await this.page.click('a[href*="logout"], button:has-text("Logout"), a:has-text("Sign Out")');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      TestHelpers.logStep('Logout button not found, navigating to login page');
      await this.loginPage.navigateToLoginPage();
    }
  }
}
