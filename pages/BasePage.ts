import { Page, Locator, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';
import { envConfig } from '../utils/env';

/**
 * Base Page Object Model class
 * Contains common functionality that all page objects can inherit
 */
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = envConfig.getBaseUrl();
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    TestHelpers.logStep(`Navigating to: ${url}`);
    await this.page.goto(url);
    //await TestHelpers.waitForPageLoad(this.page);
  }

  /**
   * Navigate to the base URL
   */
  async navigateToBase(): Promise<void> {
    await this.navigateTo(this.baseUrl);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    await TestHelpers.waitForClickableElement(this.page, selector, timeout);
    return this.page.locator(selector);
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, retries: number = 3): Promise<void> {
    await TestHelpers.clickElement(this.page, selector, retries);
  }

  /**
   * Fill input field with validation
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await TestHelpers.fillInput(this.page, selector, value);
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for text to be present on page
   */
  async waitForText(text: string, timeout?: number): Promise<void> {
    await TestHelpers.waitForText(this.page, text, timeout);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await TestHelpers.takeScreenshot(this.page, name);
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(selector: string): Promise<void> {
    await TestHelpers.assertElementVisible(this.page, selector);
  }

  /**
   * Assert element contains text
   */
  async assertElementContainsText(selector: string, text: string): Promise<void> {
    await TestHelpers.assertElementContainsText(this.page, selector, text);
  }

  /**
   * Assert page title contains text
   */
  async assertTitleContains(text: string): Promise<void> {
    const title = await this.getTitle();
    expect(title).toContain(text);
  }

  /**
   * Assert current URL contains text
   */
  async assertUrlContains(text: string): Promise<void> {
    const url = this.getCurrentUrl();
    expect(url).toContain(text);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await TestHelpers.waitForPageLoad(this.page);
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.hover();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.selectOption(value);
  }

  /**
   * Check checkbox
   */
  async checkCheckbox(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.uncheck();
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }
}
