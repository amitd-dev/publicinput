import { test, expect } from '@playwright/test';
import { ProjectAdminPage } from '../pages/ProjectAdminPage';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

/**
 * Project Admin functionality tests
 * Based on ProjectAdmin.feature from the C# project
 * Tests project administration functionality including tabs and project name editing
 */
test.describe('Project Admin Tests', () => {
  let projectAdminPage: ProjectAdminPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    projectAdminPage = new ProjectAdminPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    
    // Login as super admin for each test with retry logic using ProjectAdminPage retry method
    await projectAdminPage.retryLogin(UserType.SUPER_ADMIN);
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

  test('should verify project tabs are loading', async () => {
    // Navigate to project admin page for project with id 'B2716'
    await projectAdminPage.navigateToProjectAdminPage('B2716');
    
    // Verify the project admin page should open
    const isProjectAdminPageOpen = await projectAdminPage.verifyProjectAdminPageOpen();
    expect(isProjectAdminPageOpen).toBe(true);
    
    // Test each tab
    const tabs = [
      { name: 'Email', expectedContent: 'email' },
      { name: 'Text', expectedContent: 'text' },
      { name: 'Participants', expectedContent: 'participants' },
      { name: 'Comments', expectedContent: 'comments' },
      { name: 'Subscribers', expectedContent: 'subscribers' }
    ];
    
    for (const tab of tabs) {
      // Click on the tab
      await projectAdminPage.clickOnTab(tab.name);
      // Wait for tab content to load
      // Verify the tab should open
      const isTabOpen = await projectAdminPage.verifyTabOpen(tab.name);
      expect(isTabOpen).toBe(true);
    }
  });

  test('should verify project name can be edited', async () => {
    test.setTimeout(1200000);
    // Navigate to project admin page for project with id 'R6600'
    await projectAdminPage.navigateToProjectAdminPage('R6600');
    
    // Verify the project admin page should open
    const isProjectAdminPageOpen = await projectAdminPage.verifyProjectAdminPageOpen();
    expect(isProjectAdminPageOpen).toBe(true);
    
    // Test first name change
    const newProjectName1 = 'Project Renamed Test';
    const isFirstEditSuccessful = await projectAdminPage.testProjectNameEditing(newProjectName1);
    expect(isFirstEditSuccessful).toBe(true);
    
    
    // Test second name change
    const newProjectName2 = 'Testing Project Renaming';
    const isSecondEditSuccessful = await projectAdminPage.testProjectNameEditing(newProjectName2);
    expect(isSecondEditSuccessful).toBe(true);
  });

  test('should verify super admin page is loaded', async () => {
    // Verify super admin page is loaded
    const isSuperAdminPageLoaded = await projectAdminPage.verifySuperAdminPageLoaded();
    expect(isSuperAdminPageLoaded).toBe(true);
  });

  test('should verify account name is displayed', async () => {
    // Verify account name is displayed
    const isAccountNameDisplayed = await projectAdminPage.verifyAccountNameDisplayed('superadmintest@publicinput.com');
    expect(isAccountNameDisplayed).toBe(true);
  });

  test('should handle project admin page navigation for different projects', async () => {
    const projectIds = ['B2716', 'R6600', 'I1431'];
    
    for (const projectId of projectIds) {
      // Navigate to project admin page
      await projectAdminPage.navigateToProjectAdminPage(projectId);
      
      // Verify the project admin page should open
      const isProjectAdminPageOpen = await projectAdminPage.verifyProjectAdminPageOpen();
      expect(isProjectAdminPageOpen).toBe(true);
      
      // Wait for page to be ready
      await projectAdminPage.waitForPageReady();
    }
  });

  test('should verify all project tabs functionality', async () => {
    // Navigate to project admin page
    await projectAdminPage.navigateToProjectAdminPage('B2716');
    
    // Verify all project tabs are loading correctly
    const areAllTabsLoading = await projectAdminPage.verifyAllProjectTabsLoading();
    expect(areAllTabsLoading).toBe(true);
  });

  test('should handle project name editing with different names', async () => {

    test.setTimeout(1200000);
    // Navigate to project admin page
    await projectAdminPage.navigateToProjectAdminPage('R6600');
    
    const testProjectNames = [
      'Test Project Name 1',
      'Test Project Name 2',
      'Test Project Name 3'
    ];
    
    for (const projectName of testProjectNames) {
      // Test project name editing
      const isEditSuccessful = await projectAdminPage.testProjectNameEditing(projectName);
      expect(isEditSuccessful).toBe(true);
      
      // Verify project name is updated
      const isProjectNameUpdated = await projectAdminPage.verifyProjectNameUpdated(projectName);
      expect(isProjectNameUpdated).toBe(true);
    }
  });

  test('should handle empty project name validation', async () => {
    // Navigate to project admin page
    await projectAdminPage.navigateToProjectAdminPage('R6600');
    
    // Click on project name
    await projectAdminPage.clickOnProjectName();
    
    // Try to update with empty name
    await projectAdminPage.updateProjectName('');
    
    // Click save button
    await projectAdminPage.clickOnSaveButton();
    
    // Verify validation works (should not show success message or should show error)
    const isSuccessMessageDisplayed = await projectAdminPage.verifySuccessMessageDisplayed();
    expect(isSuccessMessageDisplayed).toBe(false);
  });

  test('should handle project name editing with special characters', async () => {
    // Navigate to project admin page
    await projectAdminPage.navigateToProjectAdminPage('R6600');
    
    const specialCharacterNames = [
      'Project with Special Chars: @#$%',
      'Project with Numbers: 123456',
      'Project with Spaces and Symbols: !@#$%^&*()'
    ];
    
    for (const projectName of specialCharacterNames) {
      // Test project name editing
      const isEditSuccessful = await projectAdminPage.testProjectNameEditing(projectName);
      expect(isEditSuccessful).toBe(true);
      
      // Verify project name is updated
      const isProjectNameUpdated = await projectAdminPage.verifyProjectNameUpdated(projectName);
      expect(isProjectNameUpdated).toBe(true);
    }
  });

  test('should verify customer dashboard navigation', async () => {
    // Navigate to customer dashboard page for customer with id '1087'
    await projectAdminPage.navigateToCustomerDashboard('1087');
    
    // Verify customer dashboard page is displayed
    const isCustomerDashboardDisplayed = await projectAdminPage.verifyCustomerDashboardDisplayed('City of Zen Engagement Dashboard');
    expect(isCustomerDashboardDisplayed).toBe(true);
  });
});
