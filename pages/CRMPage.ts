import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';

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
  private readonly newActivityButton: string = 'xpath=//button[contains(text(), "New Activity")]';
  private readonly newActivityModal: string = 'xpath=//div[contains(@class, "modal") and contains(., "New Activity")]';
  private readonly activityTypeSelect: string = 'xpath=//select[@name="activityType"]';
  private readonly currentDateButton: string = 'xpath=//button[contains(text(), "Today")]';
  private readonly associateWithProjectSelect: string = 'xpath=//select[@name="associateWithProject"]';
  private readonly activityDetailsTextarea: string = 'xpath=//textarea[@name="details"]';
  private readonly saveNewActivityButton: string = 'xpath=//button[contains(text(), "Save New Activity")]';
  private readonly activityLogTab: string = 'xpath=//a[contains(text(), "Activity Log")]';
  private readonly firstActivityEntry: string = 'xpath=//div[contains(@class, "activity-entry")][1]';
  private readonly activityEditModal: string = 'xpath=//div[contains(@class, "modal") and contains(., "Edit Activity")]';
  
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
   * Navigate to CRM page
   */
  async navigateToCRM(): Promise<void> {
    TestHelpers.logStep('Navigating to CRM page');
    await this.clickElement(this.crmButton);
    await this.waitForElement(this.crmHomePage);
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
    await this.selectOption(this.activityTypeSelect, activityType);
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
    await this.selectOption(this.associateWithProjectSelect, projectName);
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
    const detailsSelector = `xpath=//div[contains(@class, "modal")]//textarea[contains(text(), "${expectedDetails}")]`;
    return await this.isElementVisible(detailsSelector);
  }

  /**
   * Verify activity date in edit modal
   */
  async verifyActivityDateInEditModal(): Promise<boolean> {
    const dateSelector = 'xpath=//div[contains(@class, "modal")]//input[@type="date"]';
    return await this.isElementVisible(dateSelector);
  }

  /**
   * Verify associate with project in edit modal
   */
  async verifyAssociateWithProjectInEditModal(): Promise<boolean> {
    const projectSelector = 'xpath=//div[contains(@class, "modal")]//select[@name="associateWithProject"]';
    return await this.isElementVisible(projectSelector);
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
