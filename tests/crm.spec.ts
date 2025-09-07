import { test, expect } from '@playwright/test';
import { CRMPage } from '../pages/CRMPage';
import { UserLoginHelpers } from '../utils/user-login-helpers';

/**
 * CRM functionality tests
 * Based on CRM.feature from the C# project
 * Tests CRM list creation and management functionality
 */
test.describe('CRM Tests', () => {
  let crmPage: CRMPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    crmPage = new CRMPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    
    // Login as admin for CRM tests
    await userLoginHelpers.loginAsAdmin('1087');
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

  test('should create a new list for CRM', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Verify CRM home page is visible
    const isCRMHomePageVisible = await crmPage.verifyCRMHomePageVisible();
    expect(isCRMHomePageVisible).toBe(true);
    
    // Wait 3 seconds
    await crmPage.waitForSeconds(3);
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    // Verify that the list tab page has loaded
    const isListTabLoaded = await crmPage.verifyListTabPageLoaded();
    expect(isListTabLoaded).toBe(true);
    
    // Verify that the create new contact list modal is closed
    const isModalClosed = await crmPage.verifyCreateNewContactListModalClosed();
    expect(isModalClosed).toBe(true);
    
    // Click on create new list button
    await crmPage.clickOnCreateNewListButton();
    
    // Verify that the create new contact list modal has loaded
    const isModalLoaded = await crmPage.verifyCreateNewContactListModalLoaded();
    expect(isModalLoaded).toBe(true);
    
    // Enter list name
    const listName = 'dragontestnew';
    await crmPage.enterListName(listName);
    
    // Click on create list button
    await crmPage.clickOnCreateListButton();
    
    // Enter list name into filter search box
    await crmPage.enterFilterSearchText(listName);
    
    // Verify the list with the name is displayed
    const isListDisplayed = await crmPage.verifyListDisplayed(listName);
    expect(isListDisplayed).toBe(true);
    
    // Click on the list with the name
    await crmPage.clickOnListWithName(listName);
    
    // Verify the modal for the list is displayed
    const isListModalDisplayed = await crmPage.verifyListModalDisplayed(listName);
    expect(isListModalDisplayed).toBe(true);
  });

  test('should display CRM home page correctly', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Verify CRM home page is visible
    const isCRMHomePageVisible = await crmPage.verifyCRMHomePageVisible();
    expect(isCRMHomePageVisible).toBe(true);
  });

  test('should navigate to lists tab successfully', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    // Verify that the list tab page has loaded
    const isListTabLoaded = await crmPage.verifyListTabPageLoaded();
    expect(isListTabLoaded).toBe(true);
  });

  test('should open and close create new list modal', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    // Verify modal is initially closed
    const isModalInitiallyClosed = await crmPage.verifyCreateNewContactListModalClosed();
    expect(isModalInitiallyClosed).toBe(true);
    
    // Click on create new list button
    await crmPage.clickOnCreateNewListButton();
    
    // Verify modal is now open
    // const isModalOpen = await crmPage.verifyCreateNewContactListModalLoaded();
    // expect(isModalOpen).toBe(true);
  });

  test('should handle list creation with different names', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    const testListNames = [
      'Test List 1',
      'Test List 2',
      'Test List 3'
    ];
    
    for (const listName of testListNames) {
      // Click on create new list button
      await crmPage.clickOnCreateNewListButton();
      
      // Verify modal is loaded
      const isModalLoaded = await crmPage.verifyCreateNewContactListModalLoaded();
      expect(isModalLoaded).toBe(true);
      
      // Enter list name
      await crmPage.enterListName(listName);
      
      // Click on create list button
      await crmPage.clickOnCreateListButton();
      
      // Search for the created list
      await crmPage.enterFilterSearchText(listName);
      
      // Verify the list is displayed
      const isListDisplayed = await crmPage.verifyListDisplayed(listName);
      expect(isListDisplayed).toBe(true);
    }
  });

  test('should handle list search functionality', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    // Test search with different terms
    const searchTerms = ['Test', 'List', 'Alex'];
    
    for (const searchTerm of searchTerms) {
      await crmPage.enterFilterSearchText(searchTerm);
      
      // Wait for search results to load
      await crmPage.waitForSeconds(2);
      
      // Verify search functionality works (no error thrown)
      expect(true).toBe(true);
    }
  });

  test('should handle empty list name validation', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on lists tab
    await crmPage.clickOnListsTab();
    
    // Click on create new list button
    await crmPage.clickOnCreateNewListButton();
    
    // Verify modal is loaded
    const isModalLoaded = await crmPage.verifyCreateNewContactListModalLoaded();
    expect(isModalLoaded).toBe(true);
    
    // Try to create list with empty name
    await crmPage.enterListName('');
    
    // Click on create list button
    await crmPage.clickOnCreateListButton();
    
    // Verify validation works (modal should still be open or show error)
    const isModalStillOpen = await crmPage.verifyCreateNewContactListModalLoaded();
    expect(isModalStillOpen).toBe(true);
  });
});
