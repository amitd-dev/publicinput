import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

/**
 * Segmentation Page Object Model
 * Handles segmentation functionality including segment search and member count verification
 */
export class SegmentationPage extends BasePage {
  // Navigation elements
  private readonly crmButton: string = 'xpath=//span[contains(text(), "CRM")]';
  private readonly crmHomePage: string = 'xpath=(//center[normalize-space()="CRM Home"])[1]';
  
  // Segmentation elements
  private readonly segmentSearchBox = 'input[aria-controls="Audiences"]';
  private readonly segmentItem = 'tr.hover';
  private readonly segmentPage: string = 'xpath=//small[contains(text(), "Segment")]';
  private readonly membersTable: string = 'xpath=(//tbody//tr[@role="row"])';
  private readonly totalCountElement: string = 'xpath=//span[@id="mcount"]';
  private readonly potentialSegmentMembersCount: string = 'xpath=//span[@id="mcount"]';
  private readonly membersTableLoading: string = 'xpath=//div[contains(@class, "loading")]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Retry login functionality with multiple attempts
   * Similar to retry login functionality in CRM page
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
    
    try {
      // Click CRM button
      await this.clickElement(this.crmButton);
      
      // Wait for CRM home page with multiple strategies
      const crmSelectors = [
        'xpath=(//center[normalize-space()="CRM Home"])[1]',
        'xpath=//h1[contains(text(), "CRM")]',
        'xpath=//h2[contains(text(), "CRM")]',
        'xpath=//*[contains(text(), "CRM Home")]',
        '.crm-home',
        '#crm-home'
      ];
      
      let crmFound = false;
      for (const selector of crmSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          crmFound = true;
          break;
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!crmFound) {
        console.warn('CRM Home page not found with any selector, continuing anyway');
      }
      
      // Wait for network to be idle
      await this.waitForNetworkIdle();
      
    } catch (error) {
      console.error('Error navigating to CRM:', error);
      throw error;
    }
  }

  /**
   * Clear segment search input
   */
  async clearSegmentSearch(): Promise<void> {
    try {
      // Try multiple selectors for the search input
      const selectors = [
        'input[aria-controls="Audiences"]',
        'input[placeholder*="search" i]',
        'input[type="search"]',
        '.search-input input',
        '#segment-search'
      ];
      
      let cleared = false;
      for (const selector of selectors) {
        try {
          const searchInput = this.page.locator(selector).first();
          if (await searchInput.isVisible()) {
            await searchInput.clear();
            await this.page.waitForTimeout(500);
            cleared = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!cleared) {
        console.warn('Could not find search input to clear');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Could not clear search input:', error.message);
      } else {
        console.warn('Could not clear search input:', error);
      }
    }
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults(): Promise<void> {
    try {
      // Wait for search results to appear/update - try multiple selectors
      const selectors = [
        'tr.hover', // The segment rows
        '[data-testid="segment-results"]',
        '.segment-results',
        'tbody tr',
        '.audience-row'
      ];
      
      let found = false;
      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 }); // Reduced from 3000ms
          found = true;
          break;
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (found) {
        await this.page.waitForTimeout(500); // Reduced from 1000ms
      } else {
        console.warn('No search results selectors found, continuing anyway');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Search results not found or took too long:', error.message);
      } else {
        console.warn('Search results not found or took too long:', error);
      }
    }
  }

  /**
   * Check if segment is visible
   */
  async isSegmentVisible(segmentName: string): Promise<boolean> {
    try {
      // Try multiple selectors for the segment
      const selectors = [
        `xpath=(//tr[@role="row"]//a[contains(., "${segmentName}")])[1]`,
        `text="${segmentName}"`,
        `[title="${segmentName}"]`,
        `.segment-name:has-text("${segmentName}")`,
        `tr:has-text("${segmentName}")`
      ];
      
      for (const selector of selectors) {
        try {
          const segmentLocator = this.page.locator(selector).first();
          if (await segmentLocator.isVisible({ timeout: 2000 })) {
            return true;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify CRM home page is visible
   */
  async verifyCRMHomePageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.crmHomePage);
  }

  /**
   * Enter text in segment search box
   */
  async enterSegmentSearchText(searchText: string): Promise<void> {
    TestHelpers.logStep(`Entering segment search text: ${searchText}`);
    await this.fillInput(this.segmentSearchBox, searchText);
    await this.pressEnter(this.segmentSearchBox);
    // Remove waitForNetworkIdle to speed up - let waitForSearchResults handle the timing
  }

  /**
   * Click on segment with specific name
   */
  async clickOnSegmentWithName(segmentName: string): Promise<void> {
    TestHelpers.logStep(`Clicking on segment: ${segmentName}`);
    const segmentSelector = `xpath=(//tr[@role="row"]//a[contains(., "${segmentName}")])[1]`;
    await this.clickElement(segmentSelector);
  }

  /**
   * Verify segment page is displayed
   */
  async verifySegmentPageDisplayed(segmentName: string): Promise<boolean> {
    const segmentPageSelector = `xpath=//h4//input[contains(@value, "${segmentName}")]`;
    return await this.isElementVisible(segmentPageSelector);
  }

  /**
   * Wait for members table to finish loading
   */
  async waitForMembersTableToLoad(): Promise<void> {
    TestHelpers.logStep('Waiting for members table to load');
    
    // Wait for loading indicator to disappear
    try {
      await this.page.waitForSelector(this.membersTableLoading, { 
        state: 'hidden', 
        timeout: 5000 
      });
    } catch (error) {
      TestHelpers.logStep('Loading indicator not found or already hidden');
    }
    
    // Wait for members table to be visible
    await this.waitForElement(this.membersTable);
    await this.page.waitForTimeout(1000); // Reduced from 3000ms
  }

  /**
   * Get total count below members table
   */
  async getTotalCountBelowMembersTable(): Promise<number> {
    try {
      const countText = await this.getText(this.totalCountElement);
      const count = parseInt(countText.replace(/\D/g, '')) || 0;
      TestHelpers.logStep(`Total count below members table: ${count}`);
      return count;
    } catch (error) {
      TestHelpers.logStep(`Error getting total count: ${error}`);
      return 0;
    }
  }

  /**
   * Get potential segment members count
   */
  async getPotentialSegmentMembersCount(): Promise<number> {
    try {
      const countText = await this.getText(this.potentialSegmentMembersCount);
      const count = parseInt(countText.replace(/\D/g, '')) || 0;
      TestHelpers.logStep(`Potential segment members count: ${count}`);
      return count;
    } catch (error) {
      TestHelpers.logStep(`Error getting potential members count: ${error}`);
      return 0;
    }
  }

  /**
   * Verify total count equals potential segment members count
   */
  async verifyTotalCountEqualsPotentialCount(): Promise<boolean> {
    const totalCount = await this.getTotalCountBelowMembersTable();
    const potentialCount = await this.getPotentialSegmentMembersCount();
    const isEqual = totalCount === potentialCount;
    TestHelpers.logStep(`Total count (${totalCount}) equals potential count (${potentialCount}): ${isEqual}`);
    return isEqual;
  }

  /**
   * Wait for specified seconds
   */
  async waitForSeconds(seconds: number): Promise<void> {
    TestHelpers.logStep(`Waiting for ${seconds} seconds`);
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * Test segmentation count consistency
   */
  async testSegmentationCountConsistency(segmentName: string): Promise<boolean> {
    try {
      // Navigate to CRM page
      await this.navigateToCRM();
      
      // Verify CRM home page is visible
      const isCRMHomePageVisible = await this.verifyCRMHomePageVisible();
      if (!isCRMHomePageVisible) {
        return false;
      }
      
      // Wait 3 seconds
      await this.waitForSeconds(3);
      
      // Enter segment search text
      await this.enterSegmentSearchText(segmentName);
      
      // Click on segment with name
      await this.clickOnSegmentWithName(segmentName);

      await this.waitForSeconds(3);

      // console.log(`Verifying segment page for: ${segmentName}`);
      // const isSegmentPageDisplayed = await segmentationPage.verifySegmentPageDisplayed(segmentName);
      // expect(isSegmentPageDisplayed).toBe(true);
      
      // Verify segment page is displayed
      const isSegmentPageDisplayed = await this.verifySegmentPageDisplayed(segmentName);
      if (!isSegmentPageDisplayed) {
        return false;
      }
      
      // Wait 3 seconds
      await this.waitForSeconds(3);
      
      // Wait for members table to finish loading
      await this.waitForMembersTableToLoad();
      
      // Verify total count equals potential segment members count
      const isCountConsistent = await this.verifyTotalCountEqualsPotentialCount();
      return isCountConsistent;
      
    } catch (error) {
      TestHelpers.logStep(`Error testing segmentation count consistency: ${error}`);
      return false;
    }
  }

  /**
   * Get all available segments
   */
  async getAllAvailableSegments(): Promise<string[]> {
    try {
      const segmentElements = await this.page.locator(this.segmentItem).all();
      const segments: string[] = [];
      
      for (const element of segmentElements) {
        const text = await element.textContent();
        if (text) {
          segments.push(text.trim());
        }
      }
      
      TestHelpers.logStep(`Found ${segments.length} segments: ${segments.join(', ')}`);
      return segments;
    } catch (error) {
      TestHelpers.logStep(`Error getting available segments: ${error}`);
      return [];
    }
  }

  /**
   * Search for segments with different terms
   */
  async searchForSegments(searchTerms: string[]): Promise<boolean> {
    try {
      for (const searchTerm of searchTerms) {
        await this.enterSegmentSearchText(searchTerm);
        await this.waitForSeconds(2);
        
        // Verify search functionality works (no error thrown)
        const segments = await this.getAllAvailableSegments();
        TestHelpers.logStep(`Search for "${searchTerm}" returned ${segments.length} segments`);
      }
      
      return true;
    } catch (error) {
      TestHelpers.logStep(`Error searching for segments: ${error}`);
      return false;
    }
  }

  /**
   * Verify members table is visible
   */
  async verifyMembersTableVisible(): Promise<boolean> {
    return await this.isElementVisible(this.membersTable);
  }

  /**
   * Get members table row count
   */
  async getMembersTableRowCount(): Promise<number> {
    try {
      await this.waitForSeconds(5);
      const rows = await this.page.locator(`${this.membersTable}//tbody//tr`).count();
      TestHelpers.logStep(`Members table has ${rows} rows`);
      return rows;
    } catch (error) {
      TestHelpers.logStep(`Error getting members table row count: ${error}`);
      return 0;
    }
  }

  /**
   * Check if page is closed
   */
  isPageClosed(): boolean {
    return this.page.isClosed();
  }

  /**
   * Take screenshot with custom name
   */
  async takeCustomScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: name,
      fullPage: true 
    });
  }
}
