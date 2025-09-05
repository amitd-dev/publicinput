# Simplified Playwright Framework

This framework has been simplified to use standard Playwright patterns without BDD-style step definitions or C# patterns.

## 🎯 **What's Included**

### ✅ **Core Features**
- **Standard Playwright Tests**: Clean, straightforward test structure
- **Page Object Model**: Organized page objects with common functionality
- **Environment Configuration**: Multi-environment support (dev, qa, prod)
- **Secret Management**: Secure credential handling
- **Azure Integration**: Optional Azure Blob Storage for artifacts
- **CI/CD Ready**: Azure DevOps pipeline integration

### ✅ **Project Structure**
```
playwright-automation-framework/
├── pages/                    # Page Object Model
│   ├── BasePage.ts          # Common page functionality
│   └── LoginPage.ts         # Login page implementation
├── tests/                   # Test files
│   └── login.spec.ts        # Standard Playwright tests
├── config/                  # Configuration management
│   ├── AppSettings.ts       # Configuration interfaces
│   ├── ConfigurationManager.ts # Environment handling
│   ├── global-setup.ts      # Test setup
│   └── global-teardown.ts   # Test cleanup
├── services/                # External integrations
│   ├── SecretManager.ts     # Credential management
│   └── AzureBlobStorageService.ts # Azure storage
└── .env.{dev,qa,prod}      # Environment configs
```

## 🚀 **Quick Start**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run setup:**
   ```bash
   npm run setup
   ```

3. **Update environment files** with your URLs and credentials

4. **Run tests:**
   ```bash
   npm run test:dev
   ```

## 📝 **Writing Tests**

### Simple Test Example
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { secretManager } from '../services/SecretManager';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    const email = 'admin_test@publicinput.org';
    const password = secretManager.retrievePasswordSync(email);
    
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    
    // Verify success
    const isLoaded = await loginPage.isSuperAdminPageDisplayed();
    expect(isLoaded).toBe(true);
  });
});
```

## 🔧 **Configuration**

### Environment Variables
```env
# .env.dev
BASE_URL=https://dev.publicinput.com
BROWSER=Chromium
HEADLESS=true
TIMEOUT=60000

# User credentials
TestAdminPassword=your_admin_password
TestSuperAdminPassword=your_superadmin_password
```

### Using Configuration
```typescript
import { configurationManager } from '../config/ConfigurationManager';

const baseUrl = configurationManager.getBaseUrl();
const settings = configurationManager.getSettings();
```

## 🎭 **Page Objects**

### Base Page
```typescript
export abstract class BasePage {
  protected page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
  
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }
}
```

### Specific Page
```typescript
export class LoginPage extends BasePage {
  private readonly emailInput = 'input[name="UserName"]';
  private readonly passwordInput = 'input[name="Password"]';
  
  async enterEmail(email: string): Promise<void> {
    await this.page.fill(this.emailInput, email);
  }
  
  async enterPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }
}
```

## 🔐 **Secret Management**

```typescript
import { secretManager } from '../services/SecretManager';

// Get password for user
const password = secretManager.retrievePasswordSync('admin_test@publicinput.org');

// Check if account exists
const hasAccount = secretManager.hasAccount('admin_test@publicinput.org');
```

## 🚀 **Running Tests**

```bash
# Run all tests in development
npm run test:dev

# Run all tests in QA
npm run test:qa

# Run all tests in production
npm run test:prod

# Run with UI mode
npm run test:ui

# Run in debug mode
npm run test:debug

# View test report
npm run test:report
```

## 📊 **Features**

- ✅ **Simple Structure**: No complex BDD patterns
- ✅ **Standard Playwright**: Uses official Playwright patterns
- ✅ **Environment Support**: Easy switching between environments
- ✅ **Secure Credentials**: Proper secret management
- ✅ **CI/CD Ready**: Azure DevOps pipeline included
- ✅ **TypeScript**: Full type safety
- ✅ **Page Objects**: Clean, maintainable page structure
- ✅ **Artifacts**: Screenshots, videos, traces on failure

## 🎯 **Benefits**

1. **Easy to Understand**: Standard Playwright patterns
2. **Quick Setup**: Minimal configuration required
3. **Flexible**: Easy to extend and modify
4. **Secure**: Proper credential handling
5. **CI/CD Ready**: Production-ready pipeline
6. **Well Documented**: Clear examples and documentation

This simplified framework provides all the essential features for robust test automation while maintaining simplicity and ease of use.
