import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

/**
 * CRM Page Object Model
 * Handles CRM functionality including lists and activities
 */
export class CRMPage extends BasePage {
  // Navigation elements
  private readonly crmButton: string = 'xpath=//span[contains(text(), "CRM")]';
  private readonly crmHomePage: string = 'xpath=(//center[normalize-space()="CRM Home"])[1]';
  
  // List management elements
  private readonly listsTab: string = 'xpath=//div[contains(text(), "Lists")]';
  private readonly createNewListButton: string = 'xpath=(//a[normalize-space()="Create New List"])[1]';
  private readonly createNewContactListModal: string = 'xpath=//h3[normalize-space()="Create new contact list"]';
  private readonly listNameInput: string = 'xpath=//input[@name="name"]';
  private readonly createListButton: string = 'xpath=//button[contains(text(), "Create List")]';
  private readonly filterSearchBox: string = 'xpath=//input[@placeholder="Search lists"]';
  private readonly listItem = '.subscriber-list-row';
  
  // Activity management elements
  private readonly newActivityButton = 'a.btn.btn-default.m-t-sm.m-b-sm.open-new-activity-modal';
  private readonly newActivityModal = '.activity-edit-col.col-xs-12';
  private readonly activityTypeSelectButton = '(//a[@class="chosen-single"])[2]';
  private readonly activityTypeSearchInput = 'div[id="Activity_ActivityType_chosen"] input[type="text"]';
  private readonly activityTypeSelect = 'li.active-result:nth-child(1)';
  private readonly currentDateButton: string = 'xpath=(//input[@id="Activity_TimeStamp"])[1]';
  private readonly associateWithProjectbtn = 'div[id="projSelect_chosen"] span';
  private readonly associateWithProjectsearchinput = 'div[id="projSelect_chosen"] input[type="text"]';
  private readonly associateWithProjectSelect = 'li.active-result.group-option:nth-child(1)';
  private readonly activityDetailsTextarea: string = 'xpath=//textarea[@id="Activity_Notes"]';
  private readonly saveNewActivityButton= '.btn.btn-primary.m-t-xs.add-new-activity';
  private readonly activityLogTab = 'div[data-tab-name="activity"]';
  private readonly activityTableSearchInput = 'input[aria-controls="activity-tracker-table"]';
  private readonly firstActivityEntry: string = 'xpath=(//a[@class="edit-activity"])[1]';
  private readonly activityEditModal: string = 'xpath=//h4[normalize-space()="Edit Activity"]';
  
  // Segment elements
  private readonly segmentSearchBox: string = 'xpath=//input[@placeholder="Search segments..."]';
  private readonly segmentItem: string = 'xpath=//div[contains(@class, "segment-item")]';
  private readonly segmentPage: string = 'xpath=//h1[contains(text(), "Segment")]';
  private readonly membersTable: string = 'xpath=//table[contains(@class, "members-table")]';
  private readonly totalCountElement: string = 'xpath=//div[contains(@class, "total-count")]';
  private readonly potentialSegmentMembersCount: string = 'xpath=//div[contains(@class, "potential-members-count")]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Retry login with specified user type and customer ID
   * Similar to retry login functionality in profile page
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
   * Navigate to CRM page
   */
  async navigateToCRM(): Promise<void> {
    TestHelpers.logStep('Navigating to CRM page');
    await this.clickElement(this.crmButton);
    await this.waitForElement(this.crmHomePage);
    // await this.waitForSeconds(4);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify CRM home page is visible
   */
  async verifyCRMHomePageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.crmHomePage);
  }

  /**
   * Click on Lists tab
   */
  async clickOnListsTab(): Promise<void> {
    TestHelpers.logStep('Clicking on Lists tab');
    await this.clickElement(this.listsTab);
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify that the list tab page has loaded
   */
  async verifyListTabPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.listsTab);
  }

  /**
   * Verify that the create new contact list modal is closed
   */
  async verifyCreateNewContactListModalClosed(): Promise<boolean> {
    return !(await this.isElementVisible(this.createNewContactListModal));
  }

  /**
   * Click on create new list button
   */
  async clickOnCreateNewListButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Create New List button');
    await this.clickElement(this.createNewListButton);
  }

  /**
   * Verify that the create new contact list modal has loaded
   */
  async verifyCreateNewContactListModalLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.createNewContactListModal);
  }

  /**
   * Enter list name
   */
  async enterListName(listName: string): Promise<void> {
    TestHelpers.logStep(`Entering list name: ${listName}`);
    await this.fillInput(this.listNameInput, listName);
  }

  /**
   * Click on create list button
   */
  async clickOnCreateListButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Create List button');
    await this.clickElement(this.createListButton);
  }

  /**
   * Enter text into filter search box
   */
  async enterFilterSearchText(searchText: string): Promise<void> {
    TestHelpers.logStep(`Entering search text: ${searchText}`);
    await this.clickElement(this.filterSearchBox);
    await this.fillInput(this.filterSearchBox, searchText);
    await this.pressEnter(this.filterSearchBox);
  }

  /**
   * Verify list with specific name is displayed
   */
  async verifyListDisplayed(listName: string): Promise<boolean> {
    const listSelector = `xpath=//tr[@class='subscriber-list-row odd']//a[@class='pointer' and contains(text(), "${listName}")]`;
    return await this.isElementVisible(listSelector);
  }

  /**
   * Click on list with specific name
   */
  async clickOnListWithName(listName: string): Promise<void> {
    TestHelpers.logStep(`Clicking on list: ${listName}`);
    const listSelector = `xpath=(//tr[@class='subscriber-list-row odd']//a[@class='pointer' and contains(text(), "${listName}")])[1]`;
    await this.clickElement(listSelector);
  }

  /**
   * Verify modal for list with specific name is displayed
   */
  async verifyListModalDisplayed(listName: string): Promise<boolean> {
    const modalSelector = `xpath=(//input[@value="${listName}"])[1]`;
    return await this.isElementVisible(modalSelector);
  }

  /**
   * Click on new activity button
   */
  async clickOnNewActivityButton(): Promise<void> {
    TestHelpers.logStep('Clicking on New Activity button');
    await this.waitForNetworkIdle();
    await this.waitForSeconds(3);
    await this.clickElement(this.newActivityButton);
  }

  /**
   * Verify that the new activity modal is displayed
   */
  async verifyNewActivityModalDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.newActivityModal);
  }

  /**
   * Select activity type
   */
  async selectActivityType(activityType: string): Promise<void> {
    TestHelpers.logStep(`Selecting activity type: ${activityType}`);
    
    // Click on the activity type select button to open dropdown
    await this.clickElement(this.activityTypeSelectButton);
    
    // Search for the activity type
    await this.fillInput(this.activityTypeSearchInput, activityType);
    await this.pressEnter(this.activityTypeSearchInput);
    
    // Wait for search results and select the first result
    // await this.waitForElement(this.activityTypeSelect);
    // await this.clickElement(this.activityTypeSelect);
  }

   async searchOnActivityLogTab(searchString: string): Promise<void> {
    TestHelpers.logStep(`Searching on activity log tab: ${searchString}`);
    
    // Click on the activity type select button to open dropdown
    await this.clickElement(this.activityTableSearchInput);
    
    // Search for the activity type
    await this.fillInput(this.activityTableSearchInput, searchString);
    await this.pressEnter(this.activityTableSearchInput);
    await this.waitForSeconds(5);
  }

  /**
   * Select current date
   */
  async selectCurrentDate(): Promise<void> {
    TestHelpers.logStep('Selecting current date');
    await this.clickElement(this.currentDateButton);
  }

  /**
   * Select associate with project or topic
   */
  async selectAssociateWithProject(projectName: string): Promise<void> {
    TestHelpers.logStep(`Selecting associate with project: ${projectName}`);
    // Click on the activity type select button to open dropdown
    await this.clickElement(this.associateWithProjectbtn);
    
    // Search for the activity type
    await this.fillInput(this.associateWithProjectsearchinput, projectName);
    await this.pressEnter(this.associateWithProjectsearchinput);
    
    // Wait for search results and select the first result
    // await this.waitForElement(this.associateWithProjectSelect);
    // await this.clickElement(this.associateWithProjectSelect);
  }

  /**
   * Enter activity details
   */
  async enterActivityDetails(details: string): Promise<void> {
    TestHelpers.logStep(`Entering activity details: ${details}`);
    await this.fillInput(this.activityDetailsTextarea, details);
  }

  /**
   * Click on save new activity button
   */
  async clickOnSaveNewActivityButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Save New Activity button');
    await this.clickElement(this.saveNewActivityButton);
  }

  /**
   * Click on activity log tab
   */
  async clickOnActivityLogTab(): Promise<void> {
    TestHelpers.logStep('Clicking on Activity Log tab');
    await this.waitForNetworkIdle();
    await this.clickElement(this.activityLogTab);
  }

  /**
   * Click on first entry type icon
   */
  async clickOnFirstActivityEntry(): Promise<void> {
    TestHelpers.logStep('Clicking on first activity entry');
    await this.clickElement(this.firstActivityEntry);
  }

  /**
   * Verify activity details in edit modal
   */
  async verifyActivityDetailsInEditModal(expectedDetails: string): Promise<boolean> {
    const detailsSelector = `xpath=//textarea[@id='Activity_Notes' and contains(text(), "${expectedDetails}")]`;
    return await this.isElementVisible(detailsSelector);

  }

  /**
   * Verify activity date in edit modal
   */
  async verifyActivityDateInEditModal(): Promise<boolean> {
    const dateSelector = 'xpath=//input[@id="Activity_TimeStamp"]';
    return await this.isElementVisible(dateSelector);
  }

  /**
   * Verify associate with project in edit modal
   */
  async verifyAssociateWithProjectInEditModal(): Promise<boolean> {
    return await this.isElementVisible(this.associateWithProjectbtn);
  }

  /**
   * Enter text in segment search box
   */
  async enterSegmentSearchText(searchText: string): Promise<void> {
    TestHelpers.logStep(`Entering segment search text: ${searchText}`);
    await this.fillInput(this.segmentSearchBox, searchText);
  }

  /**
   * Click on segment with specific name
   */
  async clickOnSegmentWithName(segmentName: string): Promise<void> {
    TestHelpers.logStep(`Clicking on segment: ${segmentName}`);
    const segmentSelector = `xpath=//div[contains(@class, "segment-item") and contains(text(), "${segmentName}")]`;
    await this.clickElement(segmentSelector);
  }

  /**
   * Verify segment page is displayed
   */
  async verifySegmentPageDisplayed(segmentName: string): Promise<boolean> {
    const segmentPageSelector = `xpath=//h1[contains(text(), "${segmentName}")]`;
    return await this.isElementVisible(segmentPageSelector);
  }

  /**
   * Wait for members table to finish loading
   */
  async waitForMembersTableToLoad(): Promise<void> {
    TestHelpers.logStep('Waiting for members table to load');
    await this.waitForElement(this.membersTable);
    await this.page.waitForTimeout(3000);
  }

  /**
   * Get total count below members table
   */
  async getTotalCountBelowMembersTable(): Promise<number> {
    const countText = await this.getText(this.totalCountElement);
    return parseInt(countText.replace(/\D/g, '')) || 0;
  }

  /**
   * Get potential segment members count
   */
  async getPotentialSegmentMembersCount(): Promise<number> {
    const countText = await this.getText(this.potentialSegmentMembersCount);
    return parseInt(countText.replace(/\D/g, '')) || 0;
  }

  /**
   * Verify total count equals potential segment members count
   */
  async verifyTotalCountEqualsPotentialCount(): Promise<boolean> {
    const totalCount = await this.getTotalCountBelowMembersTable();
    const potentialCount = await this.getPotentialSegmentMembersCount();
    return totalCount === potentialCount;
  }

  /**
   * Wait for specified seconds
   */
  async waitForSeconds(seconds: number): Promise<void> {
    TestHelpers.logStep(`Waiting for ${seconds} seconds`);
    await this.page.waitForLoadState('networkidle');
  }
}
