import { Page, expect } from '@playwright/test';
import { envConfig } from './env';

/**
 * Common test helper functions
 */
export class TestHelpers {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    await page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be visible and clickable
   */
  static async waitForClickableElement(page: Page, selector: string, timeout?: number): Promise<void> {
    await page.waitForSelector(selector, { 
      state: 'visible',
      timeout: timeout || envConfig.getTimeout()
    });
    await page.waitForSelector(selector, { 
      state: 'attached',
      timeout: timeout || envConfig.getTimeout()
    });
  }

  /**
   * Fill input field with validation
   */
  static async fillInput(page: Page, selector: string, value: string): Promise<void> {
    await this.waitForClickableElement(page, selector);
    await page.fill(selector, value);
    
    // Verify the value was set correctly
    const inputValue = await page.inputValue(selector);
    expect(inputValue).toBe(value);
  }

  /**
   * Click element with retry logic
   */
  static async clickElement(page: Page, selector: string, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.waitForClickableElement(page, selector);
        await page.click(selector);
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for text to be present on page
   */
  static async waitForText(page: Page, text: string, timeout?: number): Promise<void> {
    await page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      text,
      { timeout: timeout || envConfig.getTimeout() }
    );
  }

  /**
   * Generate random email for testing
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test_${random}_${timestamp}@example.com`;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Log test step with timestamp
   */
  static logStep(step: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] STEP: ${step}`);
  }

  /**
   * Assert element is visible
   */
  static async assertElementVisible(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).toBeVisible();
  }

  /**
   * Assert element contains text
   */
  static async assertElementContainsText(page: Page, selector: string, text: string): Promise<void> {
    await expect(page.locator(selector)).toContainText(text);
  }
}
