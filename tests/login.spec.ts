import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';
import { envConfig } from '../utils/env';

/**
 * Login functionality tests
 * Standard Playwright test structure
 */
test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    await loginPage.navigateToLoginPage();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot on failure
    if (testInfo.status === 'failed') {
      await page.screenshot({ 
        path: `test-results/screenshots/failed-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
        fullPage: true 
      });
    }
  });

  test('should display login page elements correctly', async () => {
    // Verify all login page elements are visible
    await loginPage.verifyLoginPageElements();
    await loginPage.verifyLoginPageTitle();
  });

  test('should perform successful super admin login', async ({ page }) => {
    await userLoginHelpers.loginAsSuperAdmin();
    
    // Verify we're on the super admin dashboard
    const currentUrl = page.url();
    expect(currentUrl).toContain('/SuperAdmin/Home');
  });

  test('should perform successful admin login', async ({ page }) => {
    await userLoginHelpers.loginAsAdmin('1087');
    
    // Verify admin dashboard is loaded
    const isLoaded = await loginPage.isAdminDashboardLoaded('1087');
    expect(isLoaded).toBe(true);
  });

  test('should show error message for invalid credentials', async () => {
    const adminEmail = envConfig.getAdminEmail();
    await loginPage.enterEmail(adminEmail);
    await loginPage.enterPassword('wrongPassword');
    await loginPage.clickLoginButton();

    // Verify error message is displayed
    const textExists = await loginPage.isTextVisible('Sorry, this user name or password is invalid');
    expect(textExists).toBe(true);
  });


  // Commented out because remember me checkbox is not present in the login page
  // test('should perform successful login with remember me checked', async ({ page }) => {
  //   const email = 'admin_test@publicinput.org';
  //   const password = secretManager.retrievePasswordSync(email);

  //   await loginPage.enterEmail(email);
  //   await loginPage.enterPassword(password);
  //   await loginPage.checkRememberMe();
  //   await loginPage.clickLoginButton();

  //   // Verify successful login
  //   expect(page.url()).toContain('/dashboard');
  // });

  test('should clear form when clearForm is called', async () => {
    // Fill form with data
    await loginPage.enterEmail('test@example.com');
    await loginPage.enterPassword('testpassword');
    //await loginPage.checkRememberMe();

    // Clear form
    await loginPage.clearForm();

    // Verify form is empty
    await loginPage.verifyFormIsEmpty();
    //expect(await loginPage.isRememberMeChecked()).toBe(false);
  });

  test('should handle form validation', async () => {
    // Test empty email
    await loginPage.enterPassword('password123');
    await loginPage.clickLoginButton();
    
    // Should show validation error
    const hasError_email = await loginPage.isErrorMessageVisibleEmptyEmail();
    expect(hasError_email).toBe(true);
  });

  test('should perform successful data viewer login', async ({ page }) => {
    await userLoginHelpers.loginAsDataViewer();
    
    // Verify we're not on login page anymore
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Account/Login');
  });

  test('should perform successful editor login', async ({ page }) => {
    await userLoginHelpers.loginAsEditor();
    
    // Verify we're not on login page anymore
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Account/Login');
  });

  test('should perform successful none user login', async ({ page }) => {
    await userLoginHelpers.loginAsNone();
    
    // Verify we're not on login page anymore
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Account/Login');
  });

  test('should perform successful publisher login', async ({ page }) => {
    await userLoginHelpers.loginAsPublisher();
    
    // Verify we're not on login page anymore
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Account/Login');
  });

  test('should test all user types login functionality', async ({ page }) => {
    const userTypes = UserLoginHelpers.getAllUserTypes();
    
    for (const userType of userTypes) {
      // Navigate to login page for each user type
      await loginPage.navigateToLoginPage();
      
      try {
        await userLoginHelpers.loginAsUser(userType);
        
        // Verify login was successful
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('/Account/Login');
        
        // Logout before testing next user type
        await userLoginHelpers.logout();
        
        console.log(`✓ ${UserLoginHelpers.getUserTypeDisplayName(userType)} login successful`);
      } catch (error) {
        console.error(`✗ ${UserLoginHelpers.getUserTypeDisplayName(userType)} login failed:`, error);
        throw error;
      }
    }
  });
});
