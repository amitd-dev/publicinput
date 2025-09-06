import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/test-helpers';
import { configurationManager } from '../config/ConfigurationManager';

/**
 * Profile Page Object Model
 * Contains all elements and actions related to the profile page
 * Similar to ProfilePageObject.cs in the C# project
 */
export class ProfilePage extends BasePage {
  private readonly cityzenSettings = configurationManager.getSettings().cityzenSettings;
  
  // Page elements - matching C# project selectors
  private readonly myProfileButton = 'text=My Profile';
  private readonly viewEditProfileButton = 'text=View/Edit Profile';
  private readonly addAddressButton = 'xpath=//button[contains(text(),"Add Address")]';
  private readonly addressInput = '.editable-input > input';
  private readonly saveButton = 'xpath=//button[text()="Save"]';
  private readonly addressRow = 'div.location-row';
  private readonly addressValue = 'span.attr-value';
  private readonly removeAddressButton = 'button.remove-attr';
  private readonly confirmDeleteButton = '.btn.btn-danger.btn-delete';
  private readonly notificationContainer = 'div.notifyjs-container';
  private readonly notificationBootstrap = 'div.notifyjs-bootstrap-warn';
  private readonly notificationText = 'span';
  private readonly addressEditorForm = 'div.address-editor-form';
  private readonly addressEditbtn = 'button.edit-attr-btn';
  private readonly profileName = 'text=profile name';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to SASpeakUp profile page
   * Similar to NavigateToSaSpeakUpAsync in C# project
   */
  async navigateToSaSpeakUp(): Promise<void> {
    TestHelpers.logStep('Navigating to SASpeakUp profile page');
    await this.navigateTo(`${this.cityzenSettings.baseUrl}/saspeakup`);
    //await this.waitForPageLoad();
  }

  /**
   * Check if profile page is displayed
   * Similar to ProfilePageDisplayed in C# project
   */
  async isProfilePageDisplayed(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.profileName, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if text exists on the page
   * Similar to TextExists in C# project
   */
  async isTextVisible(text: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(`text=${text}`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on My Profile button
   * Similar to ClickOnViewProfileButton in C# project
   */
  async clickOnMyProfileButton(): Promise<void> {
    TestHelpers.logStep('Clicking on My Profile button');
    await this.page.locator(this.myProfileButton).first().click();
  }

  /**
   * Check if My Profile button is visible
   * Similar to IsViewProfileButtonVisible in C# project
   */
  async isMyProfileButtonVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.myProfileButton, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on View/Edit Profile button
   * Similar to ClickOnViewEditProfileButton in C# project
   */
  async clickOnViewEditProfileButton(): Promise<void> {
    TestHelpers.logStep('Clicking on View/Edit Profile button');
    await this.page.locator(this.viewEditProfileButton).click();
  }

  /**
   * Click on Add Address button
   * Similar to AsyncClickOnAddAddressBtn in C# project
   */
  async clickOnAddAddressButton(): Promise<void> {
    TestHelpers.logStep('Clicking on Add Address button');
    await this.page.locator(this.addAddressButton).click();
  }

  /**
   * Enter address and save
   * Similar to AsyncEnterAddress in C# project
   */
  async enterAddress(address: string): Promise<void> {
    TestHelpers.logStep(`Entering address: ${address}`);
    await this.page.fill(this.addressInput, address);
    await this.page.locator(this.saveButton).click();
  }

  /**
   * Click on address delete button
   * Similar to ClickOnAddressDeleteButton in C# project
   */
  async clickOnAddressDeleteButton(address: string): Promise<void> {
    TestHelpers.logStep(`Clicking delete button for address: ${address}`);
    await this.page.locator(this.addressRow)
      .locator(this.addressValue)
      .locator(`text=${address}`)
      .locator('..')
      .locator(this.removeAddressButton)
      .click();
      await this.page.locator(this.confirmDeleteButton).click();
  }

  /**
   * Verify address is added
   * Similar to VerifyAddress in C# project
   */
  async verifyAddress(address: string): Promise<boolean> {
    try {
      //await this.page.locator(this.notificationContainer).waitFor({ timeout: 5000 });
      await this.page.waitForLoadState();
      await this.page.waitForSelector(`xpath=(//span[contains(text(),'${address}')])[1]`, { timeout: 16000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify address is deleted
   * Similar to VerifyAddressIsDeleted in C# project
   */
  async verifyAddressIsDeleted(address: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(`xpath=(//span[contains(text(),'${address}')])[1]`, {
        state: 'hidden',
        timeout: 16000
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify profile page is loaded with specific text
   * Similar to VerifyProfilePageLoaded in C# project
   */
  async verifyProfilePageLoaded(text: string): Promise<boolean> {
    try {
      await this.page.waitForLoadState();
      await this.page.waitForSelector(`text=${text}`, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get notification text
   * Similar to GetNotificationTextAsync in C# project
   */
  async getNotificationText(): Promise<string> {
    try {
      const notificationElement = this.page.locator(this.notificationContainer)
        .locator(this.notificationBootstrap)
        .locator(this.notificationText);
      
      await notificationElement.waitFor({ timeout: 5000 });
      return await notificationElement.innerText();
    } catch {
      return '';
    }
  }

  /**
   * Get all addresses for the profile
   * Similar to GetAddressesAsync in C# project
   */
  async getAddresses(): Promise<string[]> {
    try {
      const addressElements = this.page.locator(this.addressEditorForm)
        .locator(this.addressValue);
      
      await addressElements.first().waitFor({ timeout: 5000 });
      return await addressElements.allInnerTexts();
    } catch {
      return [];
    }
  }

  /**
   * Get count of addresses
   */
  async getAddressCount(): Promise<number> {
    const addresses = await this.getAddresses();
    return addresses.length;
  }

  /**
   * Wait for specific number of addresses
   */
  async waitForAddressCount(expectedCount: number, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      (count) => {
        const addressElements = document.querySelectorAll('div.address-editor-form span.attr-value');
        return addressElements.length === count;
      },
      expectedCount,
      { timeout }
    );
  }

  /**
   * Check if notification is visible
   */
  async isNotificationVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.notificationContainer, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for notification to appear
   */
  async waitForNotification(timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(this.notificationContainer, { timeout });
  }

  /**
   * Clear address input field
   */
  async clearAddressInput(): Promise<void> {
    TestHelpers.logStep('Clearing address input field');
    await this.page.fill(this.addressInput, '');
  }

  /**
   * Verify address input is empty
   */
  async verifyAddressInputIsEmpty(): Promise<boolean> {
    const value = await this.page.inputValue(this.addressInput);
    return value === '';
  }

  /**
   * Reload the page and wait for load
   */
  async reloadPage(): Promise<void> {
    TestHelpers.logStep('Reloading profile page');
    await this.reload();
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take screenshot of current state
   */
  async takeProfileScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(`profile-${name}`);
  }
}
