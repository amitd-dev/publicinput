import { test, expect } from '@playwright/test';
import { CRMPage } from '../pages/CRMPage';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

/**
 * Add Activity CRM functionality tests
 * Based on AddActivityCRM.feature from the C# project
 * Tests CRM activity creation and management functionality
 */
test.describe('Add Activity CRM Tests', () => {
  let crmPage: CRMPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    crmPage = new CRMPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    
    // Login as admin for each test with retry logic using CRMPage retry method
    await crmPage.retryLogin(UserType.ADMIN, '1087');
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

  test('should add activity for CRM', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Verify CRM home page is visible
    const isCRMHomePageVisible = await crmPage.verifyCRMHomePageVisible();
    expect(isCRMHomePageVisible).toBe(true);
    
    // Click on new activity button
    await crmPage.clickOnNewActivityButton();
    
    // Verify that the new activity modal is displayed
    const isNewActivityModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
    expect(isNewActivityModalDisplayed).toBe(true);
    
    // Select activity type 'Phone Call'
    await crmPage.selectActivityType('Phone Call');
    
    // Select current date
    // await crmPage.selectCurrentDate();
    
    // Select associate with a project or topic
    await crmPage.selectAssociateWithProject('Test Project');
    
    // Enter activity details
    const activityDetails = 'These are some details about this activity. this is created from Automation';
    await crmPage.enterActivityDetails(activityDetails);
    
    // Click on save new activity button
    await crmPage.clickOnSaveNewActivityButton();
    
    // Navigate back to CRM page
    await crmPage.navigateToCRM();
    
    // Wait 3 seconds
    await crmPage.waitForNetworkIdle();
    
    // Click on activity log tab
    await crmPage.clickOnActivityLogTab();

    // Search on activity log tab
    await crmPage.searchOnActivityLogTab(activityDetails);
    
    // Click on first entry type icon
    await crmPage.clickOnFirstActivityEntry();
    
    // Verify that the details of newly created activity are showing on the edit modal
    const areDetailsShowing = await crmPage.verifyActivityDetailsInEditModal(activityDetails);
    expect(areDetailsShowing).toBe(true);
    
    // Verify the date of newly created activity are showing on the edit modal
    const isDateShowing = await crmPage.verifyActivityDateInEditModal();
    expect(isDateShowing).toBe(true);
    
    // Verify the associate with a project or topic of newly created activity are showing on the edit modal
    const isProjectShowing = await crmPage.verifyAssociateWithProjectInEditModal();
    expect(isProjectShowing).toBe(true);
  });

  test('should display new activity modal correctly', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on new activity button
    await crmPage.clickOnNewActivityButton();
    
    // Verify that the new activity modal is displayed
    const isNewActivityModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
    expect(isNewActivityModalDisplayed).toBe(true);
  });

  test('should handle different activity types', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    const activityTypes = ['Phone Call', 'Email', 'Meeting', 'Note'];
    
    for (const activityType of activityTypes) {
      // Click on new activity button
      await crmPage.clickOnNewActivityButton();
      
      // Verify modal is displayed
      const isModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
      expect(isModalDisplayed).toBe(true);
      
      // Select activity type
      await crmPage.selectActivityType(activityType);
      
      // Select current date
      // await crmPage.selectCurrentDate();
      
      // Enter activity details
      await crmPage.enterActivityDetails(`Test details for ${activityType}`);
      
      // Click on save new activity button
      await crmPage.clickOnSaveNewActivityButton();
      
      // Navigate back to CRM page for next iteration
      await crmPage.navigateToCRM();
    }
  });

  test('should handle activity creation with different details', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    const testDetails = [
      'Short activity details',
      'These are some longer activity details that contain more information about the activity being performed.',
      'Activity details with special characters: @#$%^&*()',
      'Activity details with numbers: 123456789'
    ];
    
    for (const details of testDetails) {
      // Click on new activity button
      await crmPage.clickOnNewActivityButton();
      
      // Verify modal is displayed
      const isModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
      expect(isModalDisplayed).toBe(true);
      
      // Select activity type
      await crmPage.selectActivityType('Phone Call');
      
      // Select current date
      // await crmPage.selectCurrentDate();
      
      // Enter activity details
      await crmPage.enterActivityDetails(details);
      
      // Click on save new activity button
      await crmPage.clickOnSaveNewActivityButton();
      await crmPage.waitForSeconds(5);
    }
  });

  test('should handle activity creation with different projects', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    const testProjects = ['Test Project 1', 'Test Project 2', 'Public Works', 'City Planning'];
    
    for (const project of testProjects) {
      // Click on new activity button
      await crmPage.clickOnNewActivityButton();
      
      // Verify modal is displayed
      const isModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
      expect(isModalDisplayed).toBe(true);
      
      // Select activity type
      await crmPage.selectActivityType('Meeting');
      
      // Select current date
      // await crmPage.selectCurrentDate();
      
      // Select associate with project
      await crmPage.selectAssociateWithProject(project);
      
      // Enter activity details
      await crmPage.enterActivityDetails(`Activity for ${project}`);
      
      // Click on save new activity button
      await crmPage.clickOnSaveNewActivityButton();

      await crmPage.waitForSeconds(5);
      
    }
  });

  test('should verify activity log functionality', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on activity log tab
    await crmPage.clickOnActivityLogTab();
    
    // Wait for activity log to load
    await crmPage.waitForSeconds(3);
    
    // Verify we can click on first activity entry
    await crmPage.clickOnFirstActivityEntry();
    
    // Verify activity edit modal functionality
    const isDateShowing = await crmPage.verifyActivityDateInEditModal();
    expect(isDateShowing).toBe(true);
  });

  test('should handle empty activity details validation', async () => {
    // Navigate to CRM page
    await crmPage.navigateToCRM();
    
    // Click on new activity button
    await crmPage.clickOnNewActivityButton();
    
    // Verify modal is displayed
    const isModalDisplayed = await crmPage.verifyNewActivityModalDisplayed();
    expect(isModalDisplayed).toBe(true);
    
    // Select activity type
    await crmPage.selectActivityType('Phone Call');
    
    // Select current date
    await crmPage.selectCurrentDate();
    
    // Try to save with empty details
    await crmPage.enterActivityDetails('');
    
    // Click on save new activity button
    await crmPage.clickOnSaveNewActivityButton();
    
    // Verify validation works (modal should still be open or show error)
    const isModalStillOpen = await crmPage.verifyNewActivityModalDisplayed();
    expect(isModalStillOpen).toBe(true);
  });
});
