import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';

/**
 * Projects Page Object Model
 * Handles project creation and commenting functionality
 */
export class ProjectsPage extends BasePage {
  // Navigation elements
  private readonly superAdminPage: string = 'xpath=//a[@id="UserDisplayName" and contains(., "superadmintest@publicinput.com")]';
  private readonly accountNameDisplay: string = 'xpath=//span[contains(@class, "account-name")]';
  private readonly customerDashboardPage: string = 'xpath=//h2[contains(text(), "Engagement Dashboard")]';
  
  // Project creation elements
  private readonly createNewItemButton: string = 'xpath=(//button[normalize-space()="Create new item"])[1]';
  private readonly projectOption = 'a[data-target="#NewProjectModal"]';
  private readonly createNewProjectModal: string = 'xpath=(//h4[normalize-space()="Create a New Project"])[1]';
  private readonly departmentSelect: string = 'xpath=(//select[@name="DeptId"])[1]';
  private readonly projectNameInput: string = 'xpath=(//input[@name="name"])[1]';
  private readonly participantAnonymitySelect: string = 'xpath=//select[@name="participantAnonymity"]';
  private readonly nextButton = 'button[class="btn btn-success nextBtn"]';
  private readonly selectLocationStep: string = 'xpath=(//label[contains(text(),"Project Location")])[1]';
  private readonly addPointButton: string = 'xpath=(//div[@class="overviewMapEditor-drawPointButton btn btn-success btn-sm"][normalize-space()="Add point"])[1]';
  private readonly mapElement: string = 'xpath=//div[contains(@class, "map-container")]';
  private readonly createProjectButton: string = 'xpath=(//button[normalize-space()="Create Project"])[1]';
  private readonly projectPage: string = 'xpath=//h1[contains(text(), "Project")]';
  private readonly skipmapButton = '#skipLocationAndCreate';
  
  // Commenting elements
  private readonly publicProjectPage: string = 'xpath=(//input[@id="projectName"])[1]';
  private readonly commentQuestion: string = 'xpath=//div[contains(@class, "comment-question")]';
  private readonly commentTextarea: string = 'xpath=//textarea[@name="comment"]';
  private readonly submitCommentButton: string = 'xpath=//button[contains(text(), "Submit Comment")]';
  private readonly showAllCommentsButton: string = 'xpath=//button[contains(text(), "Show All Comments")]';
  private readonly commentsList: string = 'xpath=//div[contains(@class, "comments-list")]';
  private readonly myComment: string = 'xpath=//div[contains(@class, "comment-item") and contains(., "My comment")]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to customer dashboard page
   */
  async navigateToCustomerDashboard(customerId: string): Promise<void> {
    TestHelpers.logStep(`Navigating to customer dashboard for customer: ${customerId}`);
    const customerDashboardUrl = `${this.baseUrl}/Customer/CivicHome/${customerId}`;
    await this.navigateTo(customerDashboardUrl);
    await this.waitForElement(this.customerDashboardPage);
  }

  /**
   * Navigate to public project page
   */
  async navigateToPublicProjectPage(projectId: string): Promise<void> {
    TestHelpers.logStep(`Navigating to public project page for project: ${projectId}`);
    const publicProjectUrl = `${this.baseUrl}/Customer/Index/1087/${projectId}`;
    await this.navigateTo(publicProjectUrl);
    await this.waitForElement(this.publicProjectPage);
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
   * Verify customer dashboard page is displayed
   */
  async verifyCustomerDashboardDisplayed(expectedTitle: string): Promise<boolean> {
    const titleSelector = `xpath=//h2[contains(text(), "${expectedTitle}")]`;
    return await this.isElementVisible(titleSelector);
  }

  /**
   * Click on create new item button
   */
  async clickOnCreateNewItemButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Create New Item button');
    await this.clickElement(this.createNewItemButton);
  }

  /**
   * Click on Project option
   */
  async clickOnProjectOption(): Promise<void> {
    TestHelpers.logStep('Clicking on Project option');
    await this.clickElement(this.projectOption);
  }

  /**
   * Verify create new project modal appears
   */
  async verifyCreateNewProjectModalAppears(): Promise<boolean> {
    return await this.isElementVisible(this.createNewProjectModal);
  }

  /**
   * Select department
   */
  async selectDepartment(department: string): Promise<void> {
    TestHelpers.logStep(`Selecting department: ${department}`);
    await this.selectOption(this.departmentSelect, department);
  }

  /**
   * Type project name
   */
  async typeProjectName(projectName: string): Promise<void> {
    TestHelpers.logStep(`Typing project name: ${projectName}`);
    await this.fillInput(this.projectNameInput, projectName);
  }

  /**
   * Select participant anonymity
   */
  async selectParticipantAnonymity(anonymity: string): Promise<void> {
    TestHelpers.logStep(`Selecting participant anonymity: ${anonymity}`);
    const labelSelector = `xpath=//label[contains(., "${anonymity}")]`;
    await this.clickElement(labelSelector);
  }

  /**
   * Click on next button
   */
  async clickOnNextButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Next button');
    await this.clickElement(this.nextButton);
  }

  /**
   * Verify select location step appears
   */
  async verifySelectLocationStepAppears(): Promise<boolean> {
    return await this.isElementVisible(this.selectLocationStep);
  }

  /**
   * Click add point button
   */
  async clickAddPointButton(): Promise<void> {
    TestHelpers.logStep('Clicking Add Point button');
    await this.clickElement(this.addPointButton);
  }

  /**
   * Click anywhere on the map
   */
  async clickAnywhereOnMap(): Promise<void> {
    TestHelpers.logStep('Clicking anywhere on the map');
    await this.clickElement(this.mapElement);
  }

  async skipMapCreateProject(): Promise<void> {
    TestHelpers.logStep('Clicking skip map and create project button');
    await this.clickElement(this.skipmapButton);
  }

  /**
   * Click randomly on the map within the modal
   */
  async clickRandomOnMap(): Promise<void> {
    TestHelpers.logStep('Clicking randomly on the map');
    
    try {
      // Target the map iframe within the modal by using the overview-map-outer container
      const mapIframe = '.overview-map-outer iframe';
      await this.waitForElement(mapIframe);
      
      // Get the bounding box of the map iframe
      const iframeBoundingBox = await this.page.locator(mapIframe).boundingBox();
      
      if (!iframeBoundingBox) {
        throw new Error('Map iframe not found or not visible');
      }
      
      // Generate random coordinates within the iframe bounds
      // Add some padding to avoid clicking on the edges
      const padding = 20;
      const minX = iframeBoundingBox.x + padding;
      const maxX = iframeBoundingBox.x + iframeBoundingBox.width - padding;
      const minY = iframeBoundingBox.y + padding;
      const maxY = iframeBoundingBox.y + iframeBoundingBox.height - padding;
      
      // Generate random coordinates
      const randomX = minX + Math.random() * (maxX - minX);
      const randomY = minY + Math.random() * (maxY - minY);
      
      // Click at the random coordinates
      await this.page.mouse.click(randomX, randomY);
      
      TestHelpers.logStep(`Clicked at coordinates: (${randomX.toFixed(2)}, ${randomY.toFixed(2)})`);
      
    } catch (error) {
      TestHelpers.logStep(`Error clicking on map: ${error}`);
      throw error;
    }
  }

   /**
   * Wait for specified seconds
   */
  async waitForSeconds(seconds: number): Promise<void> {
    TestHelpers.logStep(`Waiting for ${seconds} seconds`);
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * Click create project button
   */
  async clickCreateProjectButton(): Promise<void> {
    TestHelpers.logStep('Clicking Create Project button');
    await this.clickElement(this.createProjectButton);
    await this.waitForSeconds(5);
  }

  /**
   * Verify project page with specific name is loaded
   */
  async verifyProjectPageLoaded(projectName: string): Promise<boolean> {
    const projectPageSelector = `xpath=//input[@id='projectName' and contains(@value, "${projectName}")]`;
    return await this.isElementVisible(projectPageSelector);
  }

  /**
   * Submit comment for comment question
   */
  async submitCommentForQuestion(commentText: string, pollId: string): Promise<void> {
    TestHelpers.logStep(`Submitting comment for poll ${pollId}: ${commentText}`);
    
    // Find the comment question with specific poll id
    const commentQuestionSelector = `xpath=//div[contains(@class, "comment-question") and contains(@data-poll-id, "${pollId}")]`;
    await this.waitForElement(commentQuestionSelector);
    
    // Find textarea within this question
    const textareaSelector = `${commentQuestionSelector}//textarea[@name="comment"]`;
    await this.fillInput(textareaSelector, commentText);
    
    // Find and click submit button within this question
    const submitButtonSelector = `${commentQuestionSelector}//button[contains(text(), "Submit Comment")]`;
    await this.clickElement(submitButtonSelector);
  }

  /**
   * Click on Show All Comments button
   */
  async clickOnShowAllCommentsButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Show All Comments button');
    await this.clickElement(this.showAllCommentsButton);
  }

  /**
   * Verify my comment is displayed
   */
  async verifyMyCommentDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.myComment);
  }

  /**
   * Create a new project with specified parameters
   */
  async createNewProject(projectName: string, department: string, anonymity: string): Promise<boolean> {
    try {
      // Click on create new item button
      await this.clickOnCreateNewItemButton();
      
      // Click on Project option
      await this.clickOnProjectOption();
      
      // Verify create new project modal appears
      const isModalAppears = await this.verifyCreateNewProjectModalAppears();
      if (!isModalAppears) {
        return false;
      }
      
      // Select department
      await this.selectDepartment(department);
      
      // Type project name
      await this.typeProjectName(projectName);
      
      // Select participant anonymity
      await this.selectParticipantAnonymity(anonymity);
      
      // Click on next button
      await this.clickOnNextButton();
      
      // Verify select location step appears
      const isLocationStepAppears = await this.verifySelectLocationStepAppears();
      if (!isLocationStepAppears) {
        return false;
      }
      
      // Click add point button
      await this.clickAddPointButton();
      
      // Click anywhere on the map
      await this.clickRandomOnMap();
      
      // Click create project button
      await this.clickCreateProjectButton();
      
      // Verify project page is loaded
      const isProjectPageLoaded = await this.verifyProjectPageLoaded(projectName);
      return isProjectPageLoaded;
      
    } catch (error) {
      TestHelpers.logStep(`Error creating project: ${error}`);
      return false;
    }
  }

  /**
   * Test commenting functionality
   */
  async testCommentingFunctionality(projectId: string, pollId: string, commentText: string): Promise<boolean> {
    try {
      // Navigate to public project page
      await this.navigateToPublicProjectPage(projectId);
      
      // Submit comment for the comment question
      await this.submitCommentForQuestion(commentText, pollId);
      
      // Click on Show All Comments button
      await this.clickOnShowAllCommentsButton();
      
      // Verify my comment is displayed
      const isMyCommentDisplayed = await this.verifyMyCommentDisplayed();
      return isMyCommentDisplayed;
      
    } catch (error) {
      TestHelpers.logStep(`Error testing commenting functionality: ${error}`);
      return false;
    }
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await this.waitForElement(this.customerDashboardPage);
    await this.waitForNetworkIdle();
  }
}
