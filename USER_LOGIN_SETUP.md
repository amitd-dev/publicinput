# User Login Setup Guide

This guide explains how to set up user login functionality with different user types and secure email configuration.

## Overview

The test framework now supports multiple user types with secure credential management:

- **Super Admin**: Full system access
- **Admin**: Customer-specific admin access
- **Data Viewer**: Read-only data access
- **Editor**: Content editing permissions
- **None**: Limited user access
- **Publisher**: Publishing permissions

## Environment Configuration

### Adding Email Addresses to .env Files

To secure email addresses, add the following variables to your environment files (`.env.dev`, `.env.qa`, `.env.prod`):

```bash
# User Account Emails
SUPER_ADMIN_EMAIL=superadmintest@publicinput.com
ADMIN_EMAIL=admin_test@publicinput.org
DATA_VIEWER_EMAIL=dataviewer_test@publicinput.org
EDITOR_EMAIL=editor_test@publicinput.org
NONE_EMAIL=none_test@publicinput.org
PUBLISHER_EMAIL=publisher_test@publicinput.org
```

### Current .env File Structure

Your existing .env files already contain password secrets:
- `TestAdminPassword`
- `TestDataViewerPassword`
- `TestEditorPassword`
- `TestNonePassword`
- `TestPublisherPassword`
- `TestSuperAdminPassword`

## Usage Examples

### Using UserLoginHelpers in Tests

```typescript
import { UserLoginHelpers, UserType } from '../utils/user-login-helpers';

test('login as different user types', async ({ page }) => {
  const userLoginHelpers = new UserLoginHelpers(page);
  
  // Login as specific user types
  await userLoginHelpers.loginAsSuperAdmin();
  await userLoginHelpers.loginAsAdmin('1087');
  await userLoginHelpers.loginAsDataViewer();
  await userLoginHelpers.loginAsEditor();
  await userLoginHelpers.loginAsNone();
  await userLoginHelpers.loginAsPublisher();
  
  // Generic login method
  await userLoginHelpers.loginAsUser(UserType.EDITOR);
  
  // Logout
  await userLoginHelpers.logout();
});
```

### Using Environment Variables

```typescript
import { envConfig } from '../utils/env';

test('use environment emails', async ({ page }) => {
  const superAdminEmail = envConfig.getSuperAdminEmail();
  const adminEmail = envConfig.getAdminEmail();
  const dataViewerEmail = envConfig.getDataViewerEmail();
  
  // Get all user emails
  const allEmails = envConfig.getUserEmails();
  console.log(allEmails);
});
```

## New Test Cases Added

### Login Tests (`tests/login.spec.ts`)

1. **Individual User Type Tests**:
   - `should perform successful data viewer login`
   - `should perform successful editor login`
   - `should perform successful none user login`
   - `should perform successful publisher login`

2. **Comprehensive Test**:
   - `should test all user types login functionality` - Tests all user types in sequence

### Profile Tests (`tests/profile.spec.ts`)

- Updated to use environment variables for email addresses
- Uses `UserLoginHelpers` for secure login

## Security Benefits

1. **Email Addresses**: Moved from hardcoded values to environment variables
2. **Password Management**: Already using `SecretManager` for secure password retrieval
3. **Environment Separation**: Different credentials for dev/qa/prod environments
4. **Type Safety**: Enum-based user types prevent typos and provide IntelliSense

## Files Created/Modified

### New Files:
- `utils/user-login-helpers.ts` - User login management utility
- `USER_LOGIN_SETUP.md` - This documentation

### Modified Files:
- `utils/env.ts` - Added email getter methods
- `tests/login.spec.ts` - Updated to use new login helpers
- `tests/profile.spec.ts` - Updated to use environment variables

## Next Steps

1. **Add Email Variables**: Add the email variables to your `.env.dev`, `.env.qa`, and `.env.prod` files
2. **Update Passwords**: Ensure the password secrets in your .env files match your test accounts
3. **Test User Types**: Verify that all user types can successfully log in
4. **Customize URLs**: Update dashboard URL patterns if they differ from the defaults

## Troubleshooting

### Common Issues:

1. **Login Failures**: Check that email addresses and passwords in .env files are correct
2. **Environment Not Loading**: Ensure the `ENV` environment variable is set correctly
3. **Missing Permissions**: Verify that test accounts have the expected permissions for their user types

### Debug Tips:

- Use `console.log` to check current URLs and page titles
- Take screenshots on test failures
- Check the `UserLoginHelpers` logs for detailed login steps
