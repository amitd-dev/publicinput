import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

/**
 * Project Admin Page Object Model
 * Handles project administration functionality including tabs and project name editing
 */
export class ProjectAdminPage extends BasePage {
  // Navigation elements
  private readonly superAdminPage: string = 'xpath=//a[@id="UserDisplayName" and contains(., "superadmintest@publicinput.com")]';
  private readonly accountNameDisplay: string = 'xpath=//span[contains(@class, "account-name")]';
  
  // Project admin page elements
  private readonly projectAdminPage: string = 'xpath=//input[@id="projectName"]';
  private readonly projectNameElement: string = 'xpath=//input[@id="projectName"]';
  private readonly projectNameInput: string = 'xpath=//input[@id="projectName"]';
  private readonly saveButton: string = 'xpath=//button[@id="projectNameSaveButton"]';
  private readonly successMessage: string = 'xpath=//span[contains(., "Successfully updated")]';
  
  // Tab elements
  private readonly activeTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="active"]';
  private readonly emailTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[contains(., "Email")]';
  private readonly textTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[contains(., "Text")]';
  private readonly participantsTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[contains(., "Participants")]';
  private readonly commentsTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[contains(., "Comments")]';
  private readonly subscribersTab: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[contains(., "Subscribers")]';
  
  // Tab content elements
  private readonly emailTabContent: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="active"]//a[contains(., "Email")]';
  private readonly textTabContent: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="active"]//a[contains(., "Text")]';
  private readonly participantsTabContent: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="active"]//a[contains(., "Participants")]';
  private readonly commentsTabContent: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="b-l active"]//a[contains(., "Comments")]';
  private readonly subscriptionsTabContent: string = 'xpath=//ul[@id="projectAdminMainTabNav"]//li[@class="active"]//a[contains(., "Subscribers")]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Retry login functionality with multiple attempts
   * Similar to retry login functionality in SegmentationPage
   */
  async retryLogin(userType: UserType, customerId?: string, maxAttempts: number = 2): Promise<void> {
    const userLoginHelpers = new UserLoginHelpers(this.page);
    let loginAttempts = 0;
    let loginSuccessful = false;
    
    while (loginAttempts < maxAttempts && !loginSuccessful) {
      try {
        TestHelpers.logStep(`Attempting ${userType} login (attempt ${loginAttempts + 1}/${maxAttempts})`);
        
        if (userType === UserType.ADMIN && customerId) {
          await userLoginHelpers.loginAsAdmin(customerId);
        } else {
          await userLoginHelpers.loginAsUser(userType, customerId);
        }
        
        loginSuccessful = true;
        TestHelpers.logStep(`${userType} login successful on attempt ${loginAttempts + 1}`);
      } catch (error) {
        loginAttempts++;
        TestHelpers.logStep(`${userType} login attempt ${loginAttempts} failed: ${error}`);
        
        if (loginAttempts >= maxAttempts) {
          throw new Error(`${userType} login failed after ${maxAttempts} attempts. Last error: ${error}`);
        }
        
        // Wait before retrying
        await this.page.waitForTimeout(2000);
      }
    }
  }

  /**
   * Navigate to project admin page for specific project
   */
  async navigateToProjectAdminPage(projectId: string): Promise<void> {
    TestHelpers.logStep(`Navigating to project admin page for project: ${projectId}`);
    const projectAdminUrl = `${this.baseUrl}/ProjectAdmin/${projectId}`;
    await this.navigateTo(projectAdminUrl);
    await this.waitForElement(this.projectAdminPage);
  }

  /**
   * Verify super admin page is loaded
   */
  async verifySuperAdminPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.superAdminPage);
  }

  /**
   * Verify account name is displayed
   */
  async verifyAccountNameDisplayed(accountName: string): Promise<boolean> {
    const accountNameSelector = `xpath=//a[@id="UserDisplayName" and contains(., "${accountName}")]`;
    return await this.isElementVisible(accountNameSelector);
  }

  /**
   * Verify project admin page is open
   */
  async verifyProjectAdminPageOpen(): Promise<boolean> {
    return await this.isElementVisible(this.projectAdminPage);
  }

  /**
   * Click on specific tab
   */
  async clickOnTab(tabName: string): Promise<void> {
    TestHelpers.logStep(`Clicking on tab: ${tabName}`);
    let tabSelector: string;
    
    switch (tabName.toLowerCase()) {
      case 'email':
        tabSelector = this.emailTab;
        break;
      case 'text':
        tabSelector = this.textTab;
        break;
      case 'participants':
        tabSelector = this.participantsTab;
        break;
      case 'comments':
        tabSelector = this.commentsTab;
        break;
      case 'subscribers':
        tabSelector = this.subscribersTab;
        break;
      default:
        throw new Error(`Unknown tab name: ${tabName}`);
    }
    
    await this.clickElement(tabSelector);
    await this.waitForSeconds(2);
  }

  /**
   * Wait for specified seconds
   */
  async waitForSeconds(seconds: number): Promise<void> {
  try {
    // Log the action being performed.
    TestHelpers.logStep(`Waiting for ${seconds} seconds`);
    
    // Wait for the specified duration.
    await this.page.waitForTimeout(seconds * 1000);
  
  } catch (error) {
    // Log an error message if the wait fails for any reason.
    console.error(`Failed to wait for ${seconds} seconds.`, error);
  }
}

  /**
   * Verify specific tab is open
   */
  async verifyTabOpen(tabName: string): Promise<boolean> {
    let tabContentSelector: string;
    switch (tabName.toLowerCase()) {
      case 'email':
        tabContentSelector = this.emailTabContent;
        break;
      case 'text':
        tabContentSelector = this.textTabContent;
        break;
      case 'participants':
        tabContentSelector = this.participantsTabContent;
        break;
      case 'comments':
        tabContentSelector = this.commentsTabContent;
        break;
      case 'subscribers':
        tabContentSelector = this.subscriptionsTabContent;
        break;
      default:
        throw new Error(`Unknown tab name: ${tabName}`);
    }
    return await this.isElementVisible(tabContentSelector);
  }

  /**
   * Click on project name to edit
   */
  async clickOnProjectName(): Promise<void> {
    TestHelpers.logStep('Clicking on project name to edit');
    await this.clickElement(this.projectNameElement);
  }

  /**
   * Update project name
   */
  async updateProjectName(newName: string): Promise<void> {
    TestHelpers.logStep(`Updating project name to: ${newName}`);
    await this.fillInput(this.projectNameInput, newName);
  }

  /**
   * Click on Save button
   */
  async clickOnSaveButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Save button');
    await this.clickElement(this.saveButton);
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Wait for success popup to disappear
   */
  async waitForSuccessMessageToDisappear(): Promise<void> {
    TestHelpers.logStep('Waiting for success message to disappear');
    await this.page.waitForSelector(this.successMessage, { state: 'hidden', timeout: 10000 });
  }

  /**
   * Verify project name is updated
   */
  async verifyProjectNameUpdated(expectedName: string): Promise<boolean> {
    // Get the current value of the project name input field
    const currentValue = await this.page.inputValue(this.projectNameInput);
    console.log(`Current project name: ${currentValue}, Expected project name: ${expectedName}`);
    return currentValue === expectedName;
  }

  /**
   * Get current project name
   */
  async getCurrentProjectName(): Promise<string> {
    return await this.getText(this.projectNameElement);
  }

  /**
   * Verify all project tabs are loading correctly
   */
  async verifyAllProjectTabsLoading(): Promise<boolean> {
    const tabs = ['Email', 'Text', 'Participants', 'Comments', 'Subscribers'];
    
    for (const tab of tabs) {
      await this.clickOnTab(tab);
      const isTabOpen = await this.verifyTabOpen(tab);
      if (!isTabOpen) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Test project name editing functionality
   */
  async testProjectNameEditing(newName: string): Promise<boolean> {
    // Click on project name
    await this.clickOnProjectName();
    
    // Update project name
    await this.updateProjectName(newName);
    
    // Click save button
    await this.clickOnSaveButton();

    await this.waitForSeconds(2);
    
    // Verify success message
    const isSuccessMessageDisplayed = await this.verifySuccessMessageDisplayed();
    if (!isSuccessMessageDisplayed) {
      return false;
    }

    await this.waitForSeconds(5);
    
    // Return true if success message is displayed
    return true;
    
    // await this.page.waitForLoadState('networkidle');
    // // Verify project name is updated
    // const isProjectNameUpdated = await this.verifyProjectNameUpdated(newName);
    // return isProjectNameUpdated;
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await this.waitForElement(this.projectAdminPage);
    await this.waitForNetworkIdle();
  }

  /**
   * Navigate to customer dashboard page
   */
  async navigateToCustomerDashboard(customerId: string): Promise<void> {
    TestHelpers.logStep(`Navigating to customer dashboard for customer: ${customerId}`);
    const customerDashboardUrl = `${this.baseUrl}/CustomerDashboard/${customerId}`;
    await this.navigateTo(customerDashboardUrl);
  }

  /**
   * Verify customer dashboard page is displayed
   */
  async verifyCustomerDashboardDisplayed(expectedTitle: string): Promise<boolean> {
    const titleSelector = `xpath=//h1[contains(text(), "${expectedTitle}")]`;
    return await this.isElementVisible(titleSelector);
  }
}
