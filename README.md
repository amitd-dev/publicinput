# Playwright Automation Testing Framework

A clean and simple Playwright automation testing framework built with TypeScript, featuring Page Object Model (POM) architecture, environment-specific configurations, and Azure DevOps CI/CD integration.

## 🚀 Features

- **TypeScript Support**: Full TypeScript implementation with type safety
- **Page Object Model**: Clean, maintainable test structure
- **Environment Management**: Dynamic environment configuration (dev, qa, prod)
- **Artifact Collection**: Automatic screenshots, videos, and traces on failure
- **CI/CD Ready**: Azure DevOps pipeline integration
- **Multi-browser Testing**: Chrome, Firefox, Safari, and mobile browsers
- **Retry Logic**: Configurable retry mechanisms for flaky tests
- **HTML Reports**: Beautiful test reports for debugging

## 📁 Project Structure

```
playwright-automation-framework/
├── pages/                    # Page Object Model classes
│   ├── BasePage.ts          # Base page with common functionality
│   └── LoginPage.ts         # Login page implementation
├── tests/                   # Test files
│   └── login.spec.ts        # Sample login tests
├── config/                  # Configuration files
│   ├── AppSettings.ts       # Configuration interfaces
│   ├── ConfigurationManager.ts # Configuration management
│   ├── global-setup.ts      # Global test setup
│   └── global-teardown.ts   # Global test cleanup
├── services/                # Service integrations
│   ├── SecretManager.ts     # Secure credential handling
│   └── AzureBlobStorageService.ts # Azure storage integration
├── test-results/           # Test artifacts (auto-generated)
│   ├── screenshots/        # Screenshots on failure
│   ├── traces/            # Playwright traces
│   └── videos/            # Test execution videos
├── .env.dev               # Development environment config
├── .env.qa                # QA environment config
├── .env.prod              # Production environment config
├── playwright.config.ts   # Playwright configuration
├── azure-pipelines.yml    # Azure DevOps pipeline
└── package.json           # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-automation-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Configure environment variables**
   - Copy and modify the `.env.dev`, `.env.qa`, and `.env.prod` files
   - Update the URLs, credentials, and other environment-specific values

## 🔧 Configuration

### Environment Variables

The framework uses environment-specific configuration files:

- **`.env.dev`** - Development environment
- **`.env.qa`** - QA environment  
- **`.env.prod`** - Production environment

Each file should contain:
```env
BASE_URL=https://your-app.com
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
API_BASE_URL=https://api.your-app.com
TIMEOUT=30000
HEADLESS=true
```

### Setting Active Environment

The active environment is determined by the `ENV` environment variable:

```bash
# Development (default)
ENV=dev npm test

# QA
ENV=qa npm test

# Production
ENV=prod npm test
```

## 🧪 Running Tests

### Local Development

```bash
# Run all tests in development environment
npm run test:dev

# Run all tests in QA environment
npm run test:qa

# Run all tests in production environment
npm run test:prod

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# View test report
npm run test:report
```

### Specific Test Execution

```bash
# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific environment
ENV=qa npx playwright test
```

## 📝 Writing Tests

### Page Object Model

Create page objects by extending the `BasePage` class:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement = '[data-testid="my-element"]';

  constructor(page: Page) {
    super(page);
  }

  async clickMyElement(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';
import { envConfig } from '../utils/env';

test.describe('My Feature Tests', () => {
  let myPage: MyPage;

  test.beforeEach(async ({ page }) => {
    myPage = new MyPage(page);
    await myPage.navigateTo('/my-page');
  });

  test('should perform my test', async () => {
    // Your test logic here
    await myPage.clickMyElement();
    // Assertions
  });
});
```

### Using Configuration Manager

```typescript
import { configurationManager } from '../config/ConfigurationManager';
import { secretManager } from '../services/SecretManager';

// Get environment-specific values
const baseUrl = configurationManager.getBaseUrl();
const settings = configurationManager.getSettings();

// Get user credentials securely
const email = 'admin_test@publicinput.org';
const password = secretManager.retrievePasswordSync(email);
```

## 🔄 CI/CD Integration

### Azure DevOps Pipeline

The framework includes a complete Azure DevOps pipeline (`azure-pipelines.yml`) that:

- Runs tests across multiple browsers (Chrome, Firefox, Safari)
- Supports environment-specific test execution
- Publishes test results and artifacts
- Includes retry logic for failed tests
- Generates HTML reports

### Pipeline Variables

Configure these variables in Azure DevOps:

- `environment`: Target environment (dev, qa, prod)
- `USER_EMAIL`: Test user email
- `USER_PASSWORD`: Test user password
- `BASE_URL`: Application base URL

### Pipeline Features

1. **Multi-browser Testing**: Tests run on Chrome, Firefox, and Safari
2. **Artifact Collection**: Screenshots, videos, and traces are saved
3. **Test Reports**: JUnit and HTML reports are published
4. **Retry Logic**: Failed tests are automatically retried
5. **Environment Support**: Different configurations for dev/qa/prod

## 📊 Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run test:report
```

The report includes:
- Test execution timeline
- Screenshots and videos
- Error details and stack traces
- Performance metrics

### Artifacts

Test artifacts are automatically saved to `test-results/`:

- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Traces**: `test-results/traces/`
- **JUnit Results**: `test-results/junit-results.xml`

## 🛡️ Best Practices

### Test Organization

1. **Use Page Object Model**: Keep page logic separate from test logic
2. **Environment Variables**: Never hardcode credentials or URLs
3. **Descriptive Test Names**: Use clear, descriptive test descriptions
4. **Test Data**: Use environment-specific test data

### Error Handling

1. **Screenshots on Failure**: Automatically captured for debugging
2. **Retry Logic**: Configure retries for flaky tests
3. **Timeout Configuration**: Set appropriate timeouts for different actions
4. **Graceful Failures**: Handle network issues and timeouts

### Performance

1. **Parallel Execution**: Tests run in parallel by default
2. **Browser Reuse**: Reuse browser instances when possible
3. **Network Optimization**: Use `waitForLoadState('networkidle')`
4. **Selective Testing**: Use tags to run specific test suites

## 🔍 Debugging

### Local Debugging

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test tests/login.spec.ts --debug

# Run with UI mode
npm run test:ui
```

### CI Debugging

1. **Check Artifacts**: Download and review screenshots/videos
2. **Review Logs**: Check pipeline execution logs
3. **Test Reports**: Use HTML reports for detailed analysis
4. **Environment Variables**: Verify environment configuration

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Include test artifacts and logs when reporting bugs

---

**Happy Testing! 🎉**
# publicinput
