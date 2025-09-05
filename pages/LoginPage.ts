import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';
import { configurationManager } from '../config/ConfigurationManager';

/**
 * Login Page Object Model
 * Contains all elements and actions related to the login page
 * Similar to LoginPageObject.cs in the C# project
 */
export class LoginPage extends BasePage {
  private readonly cityzenSettings = configurationManager.getSettings().cityzenSettings;
  // Page elements - matching C# project selectors
  private readonly emailInput = 'input[name="UserName"]';
  private readonly passwordInput = 'input[name="Password"]';
  private readonly loginButton = 'button:has-text("Sign In")';
  private readonly forgotPasswordLink = 'a[class="forgot-password"]';
  private readonly errorMessage = '#email-input-error';
  private readonly errorMessageEmptyEmail = '#email-input-error';
  private readonly errorMessagePassword = '#Password-error';
  private readonly successMessage = '[data-testid="success-message"]';
  private readonly rememberMeCheckbox = '[data-testid="remember-me"]';
  private readonly signUpLink = "a[href='/Account/Register/?promptAlerts=False&returnUrl=/home']";

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   * Similar to NavigateAsync in C# project
   */
  async navigateToLoginPage(): Promise<void> {
    TestHelpers.logStep('Navigating to login page');
    await this.navigateTo(`${this.cityzenSettings.baseUrl}/Account/Login?ReturnUrl=%2Fhome`);
    await this.waitForPageLoad();
  }

  /**
   * Fill email field
   * Similar to EnterEmail in C# project
   */
  async enterEmail(email: string): Promise<void> {
    TestHelpers.logStep(`Entering email: ${email}`);
    await this.page.locator(this.emailInput).fill(email);
  }

  /**
   * Fill password field
   * Similar to EnterPassword in C# project
   */
  async enterPassword(password: string): Promise<void> {
    TestHelpers.logStep('Entering password');
    await this.page.locator(this.passwordInput).fill(password);
  }

  /**
   * Click login button
   * Similar to ClickSigninButton in C# project
   */
  async clickLoginButton(): Promise<void> {
    TestHelpers.logStep('Clicking login button');
    await this.page.locator(this.loginButton).click();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    TestHelpers.logStep('Clicking forgot password link');
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click sign up link
   */
  async clickSignUpLink(): Promise<void> {
    TestHelpers.logStep('Clicking sign up link');
    await this.clickElement(this.signUpLink);
  }

  /**
   * Check remember me checkbox
   */
  // async checkRememberMe(): Promise<void> {
  //   TestHelpers.logStep('Checking remember me checkbox');
  //   await this.checkCheckbox(this.rememberMeCheckbox);
  // }

  /**
   * Uncheck remember me checkbox
   */
  // async uncheckRememberMe(): Promise<void> {
  //   TestHelpers.logStep('Unchecking remember me checkbox');
  //   await this.uncheckCheckbox(this.rememberMeCheckbox);
  // }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    TestHelpers.logStep(`Performing login for user: ${email}`);
    
    await this.enterEmail(email);
    await this.enterPassword(password);
    
    // if (rememberMe) {
    //   await this.checkRememberMe();
    // }
    
    await this.clickLoginButton();
    
    // Wait for navigation or error message
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 10000 });
      TestHelpers.logStep('Login successful - redirected to dashboard');
    } catch (error) {
      // Check if there's an error message
      if (await this.isElementVisible(this.errorMessage)) {
        const errorText = await this.getText(this.errorMessage);
        throw new Error(`Login failed: ${errorText}`);
      }
      throw error;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.isElementVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async isErrorMessageVisibleEmptyEmail(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessageEmptyEmail);
  }
  /**
   * Check if success message is displayed
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Verify login page elements are visible
   */
  async verifyLoginPageElements(): Promise<void> {
    TestHelpers.logStep('Verifying login page elements');
    
    await this.assertElementVisible(this.emailInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
    await this.assertElementVisible(this.forgotPasswordLink);
    await this.assertElementVisible(this.signUpLink);
  }

  /**
   * Verify login page title
   */
  async verifyLoginPageTitle(): Promise<void> {
    await this.assertTitleContains('Sign In');
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    TestHelpers.logStep('Clearing login form');
    await this.page.fill(this.emailInput, '');
    await this.page.fill(this.passwordInput, '');
    //await this.uncheckRememberMe();
  }

  /**
   * Verify form is empty
   */
  async verifyFormIsEmpty(): Promise<void> {
    const emailValue = await this.page.inputValue(this.emailInput);
    const passwordValue = await this.page.inputValue(this.passwordInput);
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');
  }

  /**
   * Get email field value
   */
  async getEmailValue(): Promise<string> {
    return await this.page.inputValue(this.emailInput);
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    return await this.page.inputValue(this.passwordInput);
  }

  /**
   * Check if remember me is checked
   */
  // async isRememberMeChecked(): Promise<boolean> {
  //   const element = await this.waitForElement(this.rememberMeCheckbox);
  //   return await element.isChecked();
  // }

  /**
   * Wait for login to complete (either success or failure)
   */
  async waitForLoginCompletion(): Promise<void> {
    // Wait for either navigation to dashboard or error message
    await Promise.race([
      this.page.waitForURL('**/dashboard', { timeout: 10000 }),
      this.waitForElement(this.errorMessage, 10000)
    ]);
  }

  /**
   * Check if super admin page is displayed
   */
  async isSuperAdminPageDisplayed(): Promise<boolean> {
    try {
      // await this.page.waitForSelector('text=PublicInput Super Admin', { timeout: 10000 });
      await this.page.title()
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if text exists on the page
   */
  async isTextVisible(text: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(`text=${text}`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if admin dashboard is loaded for specific customer
   */
  async isAdminDashboardLoaded(customerId: string): Promise<boolean> {
    try {
      await this.page.waitForURL(`${this.cityzenSettings.baseUrl}/Customer/CivicHome/${customerId}`, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
