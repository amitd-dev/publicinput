import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { UserLoginHelpers } from '../utils/user-login-helpers';
import { envConfig } from '../utils/env';

/**
 * Profile functionality tests
 * Based on UserProfile.feature from the C# project
 * Tests address management functionality in user profiles
 */
test.describe('Profile Tests', () => {
  let profilePage: ProfilePage;
  let loginPage: LoginPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    profilePage = new ProfilePage(page);
    loginPage = new LoginPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    
    // Login as super admin for each test with retry logic
    let loginAttempts = 0;
    const maxAttempts = 2;
    let loginSuccessful = false;
    
    while (loginAttempts < maxAttempts && !loginSuccessful) {
      try {
        await userLoginHelpers.loginAsSuperAdmin();
        loginSuccessful = true;
        console.log(`Profile test super admin login successful on attempt ${loginAttempts + 1}`);
      } catch (error) {
        loginAttempts++;
        console.log(`Profile test super admin login attempt ${loginAttempts} failed:`, error);
        
        if (loginAttempts >= maxAttempts) {
          throw new Error(`Profile test super admin login failed after ${maxAttempts} attempts. Last error: ${error}`);
        }
        
        // Wait before retrying
        await page.waitForTimeout(2000);
      }
    }
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

  test('should navigate to profile page successfully', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Verify we are on profile page
    const isProfilePageVisible = await profilePage.isMyProfileButtonVisible();
    expect(isProfilePageVisible).toBe(true);
  });

  test('should display profile page elements correctly', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Verify profile page elements are visible
    const isMyProfileButtonVisible = await profilePage.isMyProfileButtonVisible();
    expect(isMyProfileButtonVisible).toBe(true);
  });

  test('should load view profile page correctly', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();
    
    // Verify profile page loads with expected text
    const superAdminEmail = envConfig.getSuperAdminEmail();
    const expectedText = `SASpeakUp profile for ${superAdminEmail}`;
    const isProfileLoaded = await profilePage.verifyProfilePageLoaded(expectedText);
    expect(isProfileLoaded).toBe(true);
  });

  test('should handle address management - add, verify, and delete address', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();
    
    // Verify initial state - should have 0 addresses
    //await profilePage.waitForAddressCount(0);
    const initialAddressCount = await profilePage.getAddressCount();
    // expect(initialAddressCount).toBe(0);
    
    // Add first address
    await profilePage.clickOnAddAddressButton();
    await profilePage.enterAddress('215 Josh Ln, San Antonio, TX 78245, USA');
    await page.waitForTimeout(7000); // Wait for address to be processed
    
    // Verify address was added
    const addressAdded = await profilePage.verifyAddress('215 Josh Ln, San Antonio, TX 78245, USA');
    expect(addressAdded).toBe(true);
    const updatedAddressCount = 1+initialAddressCount;

    // Verify there is now 1 address
    const addressCountAfterAdd = await profilePage.getAddressCount();
    expect(addressCountAfterAdd).toBe(updatedAddressCount);
    
    // Try to add duplicate address
    await profilePage.clickOnAddAddressButton();
    await profilePage.enterAddress('215 Josh Ln, San Antonio, TX 78245, USA');
    await page.waitForTimeout(5000); // Wait for processing
    
    // Verify duplicate notification appears
    const notificationText = await profilePage.getNotificationText();
    const expectedNotification = "A duplicate entry for '215 Josh Ln, San Antonio, TX 78245, USA' was found. The item was not added.";
    expect(notificationText).toContain(expectedNotification);
    
    // Verify still only 1 address (duplicate not added)
    const addressCountAfterDuplicate = await profilePage.getAddressCount();
    expect(addressCountAfterDuplicate).toBe(updatedAddressCount);
    
    // Reload page to verify persistence
    await profilePage.reloadPage();
    await profilePage.waitForPageReady();
    
    // Verify address still exists after reload
    const addressAfterReload = await profilePage.verifyAddress('215 Josh Ln, San Antonio, TX 78245, USA');
    expect(addressAfterReload).toBe(true);
    
    // Delete the address
    await profilePage.clickOnAddressDeleteButton('215 Josh Ln, San Antonio, TX 78245, USA');
    await page.waitForTimeout(5000); // Wait for deletion
    
    // Verify address is deleted
    const addressDeleted = await profilePage.verifyAddressIsDeleted('215 Josh Ln, San Antonio, TX 78245, USA');
    expect(addressDeleted).toBe(true);
    
    // Verify 0 addresses remain
    const finalAddressCount = await profilePage.getAddressCount();
    expect(finalAddressCount).toBe(initialAddressCount);
  });

  test('should prevent duplicate address entries', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();
    
    // Add first address
    await profilePage.clickOnAddAddressButton();
    await profilePage.enterAddress('123 Main St, Austin, TX 78702, USA');
    await page.waitForTimeout(7000);
    
    // // Verify address was added
    // const addressAdded = await profilePage.verifyAddress('123 Main Street, Austin, TX');
    // expect(addressAdded).toBe(true);
    
    // Try to add the same address again
    await profilePage.clickOnAddAddressButton();
    await profilePage.enterAddress('123 Main St, Austin, TX 78702, USA');
    await page.waitForTimeout(5000);
    
    // Verify duplicate notification
    const isNotificationVisible = await profilePage.isNotificationVisible();
    expect(isNotificationVisible).toBe(true);
    

    // Verify duplicate notification appears
    const notificationText = await profilePage.getNotificationText();
    const expectedNotification = "A duplicate entry for '123 Main St, Austin, TX 78702, USA' was found. The item was not added.";
    expect(notificationText).toContain(expectedNotification);
    
    // Clean up - delete the address
    await profilePage.clickOnAddressDeleteButton('123 Main St, Austin, TX 78702, USA');
    await page.waitForTimeout(5000);
  });

  test('should handle multiple address operations', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();

    const initialAddressCount = await profilePage.getAddressCount();
    
    // Add multiple different addresses
    const addresses = [
      '456 Oak Ln, Piney Point Village, TX 77024, USA',
      '789 Pine St, Dallas, TX 75215, USA',
      '792 Pine St, Dallas, TX 75215, USA'
    ];
    
    for (const address of addresses) {
      await profilePage.clickOnAddAddressButton();
      await profilePage.enterAddress(address);
      await page.waitForTimeout(3000);
    }
    
    // Verify all addresses were added
    const finalAddressCount = await profilePage.getAddressCount();
    expect(finalAddressCount).toBe(addresses.length + initialAddressCount);
    
    // Clean up - delete all addresses
    for (const address of addresses) {
      await profilePage.clickOnAddressDeleteButton(address);
      await page.waitForTimeout(2000);
    }
    
    // Verify all addresses are deleted
    const finalCount = await profilePage.getAddressCount();
    expect(finalCount).toBe(initialAddressCount);
  });

  test('should handle address input validation', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();
    
    // Test empty address input
    await profilePage.clickOnAddAddressButton();
    await profilePage.clearAddressInput();
    await page.locator('xpath=//button[text()="Save"]').click();
    
    // Verify input is empty
    const isInputEmpty = await profilePage.verifyAddressInputIsEmpty();
    expect(isInputEmpty).toBe(true);
  });

  test('should persist address data after page reload', async () => {
    // Navigate to profile page
    await profilePage.navigateToSaSpeakUp();
    
    // Click on My Profile button
    await profilePage.clickOnMyProfileButton();
    
    // Click on View/Edit Profile button
    await profilePage.clickOnViewEditProfileButton();
    
    // Add an address
    const testAddress = '123 Main St, Austin, TX 78702, USA';
    await profilePage.clickOnAddAddressButton();
    await profilePage.enterAddress(testAddress);
    await page.waitForTimeout(5000);
    
    // Verify address was added
    const addressAdded = await profilePage.verifyAddress(testAddress);
    expect(addressAdded).toBe(true);
    
    // Reload the page
    await profilePage.reloadPage();
    await profilePage.waitForPageReady();
    
    // Verify address persists after reload
    const addressPersists = await profilePage.verifyAddress(testAddress);
    expect(addressPersists).toBe(true);
    
    // Clean up
    await profilePage.clickOnAddressDeleteButton(testAddress);
    await page.waitForTimeout(5000);
  });
});
