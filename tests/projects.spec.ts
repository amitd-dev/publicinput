import { test, expect } from '@playwright/test';
import { ProjectsPage } from '../pages/ProjectsPage';
import { UserLoginHelpers } from '../utils/user-login-helpers';

/**
 * Projects functionality tests
 * Based on Projects.feature from the C# project
 * Tests project creation and commenting functionality
 */
test.describe('Projects Tests', () => {
  let projectsPage: ProjectsPage;
  let userLoginHelpers: UserLoginHelpers;

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page);
    userLoginHelpers = new UserLoginHelpers(page);
    
    // Login as super admin for projects tests
    await userLoginHelpers.loginAsSuperAdmin();
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

  test('should create a new project', async () => {
    // Navigate to customer dashboard page for customer with id '1087'
    await projectsPage.navigateToCustomerDashboard('1087');
    
    // Verify customer dashboard page is displayed
    const isCustomerDashboardDisplayed = await projectsPage.verifyCustomerDashboardDisplayed('City of Zen Engagement Dashboard');
    expect(isCustomerDashboardDisplayed).toBe(true);
    
    // Click on create new item button
    await projectsPage.clickOnCreateNewItemButton();
    
    // Click on Project option
    await projectsPage.clickOnProjectOption();
    
    // Verify create new project modal appears
    const isCreateNewProjectModalAppears = await projectsPage.verifyCreateNewProjectModalAppears();
    expect(isCreateNewProjectModalAppears).toBe(true);
    
    // Select department
    await projectsPage.selectDepartment('Public Works');
    
    // Type project name
    await projectsPage.typeProjectName('Test Project');
    
    // Select participant anonymity
    await projectsPage.selectParticipantAnonymity('Allow Anonymous');
    
    // Click on next button
    await projectsPage.clickOnNextButton();
    
    // Verify select location step appears
    const isSelectLocationStepAppears = await projectsPage.verifySelectLocationStepAppears();
    expect(isSelectLocationStepAppears).toBe(true);
    
    // Click add point button
    await projectsPage.clickAddPointButton();
    
    // Click anywhere on the map
    await projectsPage.clickRandomOnMap();
    
    // Click create project button
    await projectsPage.clickCreateProjectButton();
    
    // Verify project page with name 'Test Project' is loaded
    const isProjectPageLoaded = await projectsPage.verifyProjectPageLoaded('Test Project');
    expect(isProjectPageLoaded).toBe(true);
  });

  test('should comment on a multi-line comment question', async () => {
    // Navigate to public project page for project with id 'I1431'
    await projectsPage.navigateToPublicProjectPage('I1431');
    
    // Submit comment for the comment question containing poll id of '120115'
    const commentText = 'This is my test comment for the multi-line comment question.';
    await projectsPage.submitCommentForQuestion(commentText, '120115');
    
    // Click on Show All Comments button
    await projectsPage.clickOnShowAllCommentsButton();
    
    // Verify my comment is displayed
    const isMyCommentDisplayed = await projectsPage.verifyMyCommentDisplayed();
    expect(isMyCommentDisplayed).toBe(true);
  });

  test('should verify super admin page is loaded', async () => {
    // Verify super admin page is loaded
    const isSuperAdminPageLoaded = await projectsPage.verifySuperAdminPageLoaded();
    expect(isSuperAdminPageLoaded).toBe(true);
  });

  test('should verify account name is displayed', async () => {
    // Verify account name is displayed
    const isAccountNameDisplayed = await projectsPage.verifyAccountNameDisplayed('superadmintest@publicinput.com');
    expect(isAccountNameDisplayed).toBe(true);
  });

  test('should handle project creation with different departments', async () => {
    // Navigate to customer dashboard page
    await projectsPage.navigateToCustomerDashboard('1087');
    
    const departments = ['Public Works', 'Planning', 'Product Management'];
    
    for (const department of departments) {
      // Create new project with different department
      const isProjectCreated = await projectsPage.createNewProject(
        `Test Project - ${department}`,
        department,
        'Allow Anonymous'
      );
      
      expect(isProjectCreated).toBe(true);
      
      // Navigate back to customer dashboard for next iteration
      await projectsPage.navigateToCustomerDashboard('1087');
    }
  });

  test('should handle project creation with different anonymity settings', async () => {
    // Navigate to customer dashboard page
    await projectsPage.navigateToCustomerDashboard('1087');
    
    const anonymitySettings = ['Allow Anonymous', 'Require Login', 'Gated'];
    
    for (const anonymity of anonymitySettings) {
      // Create new project with different anonymity setting
      const isProjectCreated = await projectsPage.createNewProject(
        `Test Project - ${anonymity}`,
        'Public Works',
        anonymity
      );
      
      expect(isProjectCreated).toBe(true);
      
      // Navigate back to customer dashboard for next iteration
      await projectsPage.navigateToCustomerDashboard('1087');
    }
  });

  test('should handle project creation with different names', async () => {
    // Navigate to customer dashboard page
    await projectsPage.navigateToCustomerDashboard('1087');
    
    const projectNames = [
      'Test Project 1',
      'Test Project 2',
      'Test Project 3',
      'Project with Special Characters: @#$%',
      'Project with Numbers: 123456'
    ];
    
    for (const projectName of projectNames) {
      // Create new project with different name
      const isProjectCreated = await projectsPage.createNewProject(
        projectName,
        'Public Works',
        'Allow Anonymous'
      );
      
      expect(isProjectCreated).toBe(true);
      
      // Navigate back to customer dashboard for next iteration
      await projectsPage.navigateToCustomerDashboard('1087');
    }
  });

  test('should handle commenting on different projects', async () => {
    const testProjects = [
      { projectId: 'I1431', pollId: '120115' },
      { projectId: 'B2716', pollId: '120116' },
      { projectId: 'R6600', pollId: '120117' }
    ];
    
    for (const testProject of testProjects) {
      // Test commenting functionality
      const isCommentingSuccessful = await projectsPage.testCommentingFunctionality(
        testProject.projectId,
        testProject.pollId,
        `Test comment for project ${testProject.projectId}`
      );
      
      expect(isCommentingSuccessful).toBe(true);
    }
  });

  test('should handle commenting with different comment types', async () => {
    // Navigate to public project page
    await projectsPage.navigateToPublicProjectPage('I1431');
    
    const commentTypes = [
      'Short comment',
      'This is a longer comment that contains more detailed information about the topic being discussed.',
      'Comment with special characters: @#$%^&*()',
      'Comment with numbers: 123456789',
      'Multi-line comment\nwith line breaks\nand multiple paragraphs.'
    ];
    
    for (const commentText of commentTypes) {
      // Submit comment for the comment question
      await projectsPage.submitCommentForQuestion(commentText, '120115');
      
      // Click on Show All Comments button
      await projectsPage.clickOnShowAllCommentsButton();
      
      // Verify comment is displayed (basic verification)
      const isMyCommentDisplayed = await projectsPage.verifyMyCommentDisplayed();
      expect(isMyCommentDisplayed).toBe(true);
    }
  });

  test('should handle empty project name validation', async () => {
    // Navigate to customer dashboard page
    await projectsPage.navigateToCustomerDashboard('1087');
    
    // Click on create new item button
    await projectsPage.clickOnCreateNewItemButton();
    
    // Click on Project option
    await projectsPage.clickOnProjectOption();
    
    // Verify create new project modal appears
    const isCreateNewProjectModalAppears = await projectsPage.verifyCreateNewProjectModalAppears();
    expect(isCreateNewProjectModalAppears).toBe(true);
    
    // Select department
    await projectsPage.selectDepartment('Public Works');
    
    // Try to create project with empty name
    await projectsPage.typeProjectName('');
    
    // Select participant anonymity
    await projectsPage.selectParticipantAnonymity('Allow Anonymous');
    
    // Click on next button
    await projectsPage.clickOnNextButton();
    
    // Verify validation works (should not proceed to location step)
    const isSelectLocationStepAppears = await projectsPage.verifySelectLocationStepAppears();
    expect(isSelectLocationStepAppears).toBe(false);
  });

  test('should handle empty comment validation', async () => {
    // Navigate to public project page
    await projectsPage.navigateToPublicProjectPage('I1431');
    
    // Try to submit empty comment
    await projectsPage.submitCommentForQuestion('', '120115');
    
    // Click on Show All Comments button
    await projectsPage.clickOnShowAllCommentsButton();
    
    // Verify empty comment is not displayed
    const isMyCommentDisplayed = await projectsPage.verifyMyCommentDisplayed();
    expect(isMyCommentDisplayed).toBe(false);
  });
});
