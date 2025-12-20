import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const waitForMobileMenuAnimation = async (page: Page) => {
  await page.waitForTimeout(300);
};

const expectWelcomeMessage = async (page: Page, username: string) => {
  const mobileMenuButton = page.getByTestId('mobile-menu-button');
  const welcomeText = `Welcome, ${username}`;

  if (await mobileMenuButton.isVisible()) {
    await mobileMenuButton.click();
    await waitForMobileMenuAnimation(page);
    await expect(page.getByTestId('mobile-welcome')).toHaveText(welcomeText);
    await mobileMenuButton.click(); // close menu
    await waitForMobileMenuAnimation(page);
  } else {
    await expect(page.getByTestId('desktop-welcome')).toHaveText(welcomeText);
  }
};

const clickSignOutButton = async (page: Page) => {
  const mobileMenuButton = page.getByTestId('mobile-menu-button');

  if (await mobileMenuButton.isVisible()) {
    await mobileMenuButton.click();
    await waitForMobileMenuAnimation(page);
    await page.getByTestId('mobile-sign-out').click();
  } else {
    await page.getByTestId('desktop-sign-out').click();
  }
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Clean up localStorage after each test to prevent interference
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should display login page for unauthenticated users', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Pokemon Netflix');
    await expect(
      page.getByText('Sign in to access your Pokémon collection.'),
    ).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('should allow user to sign up with new account', async ({ page }) => {
    const username = `user${Date.now().toString().slice(-8)}`;
    const password = 'testpassword123';

    // Switch to sign up mode first
    await page.getByText('Sign Up').click();

    // Fill in sign up form
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);

    // Submit sign up form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for form to switch to Sign In mode (indicates successful signup)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Success message may appear briefly, but form switching is the reliable indicator
    await page.waitForTimeout(500); // Allow any success message to appear/disappear

    // Now login with the created account (form is cleared, need to fill again)
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expectWelcomeMessage(page, username);
    await expect(page.getByText('PokéFlix')).toBeVisible();
  });

  test('should allow user to login with existing account', async ({ page }) => {
    // First create an account
    const username = `login${Date.now().toString().slice(-8)}`;
    const password = 'loginpassword123';

    // Switch to sign up mode
    await page.getByText('Sign Up').click();

    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for form to switch to Sign In mode (indicates successful signup)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.waitForTimeout(500); // Allow any success message to appear/disappear

    // Form is already in Sign In mode and cleared, fill credentials again
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expectWelcomeMessage(page, username);
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.getByPlaceholder('Enter your username').fill('nonexistentuser');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should show error message
    await expect(
      page.getByText('No accounts found. Please sign up first.'),
    ).toBeVisible();
  });

  test('should prevent duplicate username registration', async ({ page }) => {
    const username = `dup${Date.now().toString().slice(-8)}`;
    const password = 'password123';

    // Create first account
    await page.getByText('Sign Up').click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for form to switch to Sign In mode (indicates successful signup)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.waitForTimeout(500);

    // Switch back to Sign Up mode to try duplicate registration
    await page.getByText('Sign Up').click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should show error message
    await expect(page.getByText('Username already exists')).toBeVisible();
  });

  test('should logout user successfully', async ({ page }) => {
    // Create account and login
    const username = `out${Date.now().toString().slice(-8)}`;
    const password = 'password123';

    await page.getByText('Sign Up').click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for form to switch to Sign In mode (indicates successful signup)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.waitForTimeout(500);

    // Login with created account (form already in Sign In mode)
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expectWelcomeMessage(page, username);

    // Now logout
    await clickSignOutButton(page);

    // Should be redirected to login page
    await expect(
      page.getByText('Sign in to access your Pokémon collection.'),
    ).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  });

  test('should redirect authenticated users away from login page', async ({
    page,
  }) => {
    // Create account and login
    const username = `red${Date.now().toString().slice(-8)}`;
    const password = 'password123';

    await page.getByText('Sign Up').click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for form to switch to Sign In mode (indicates successful signup)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.waitForTimeout(500);

    // Login with created account (form already in Sign In mode)
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expectWelcomeMessage(page, username);

    // Try to navigate to login page while authenticated
    await page.goto('/');

    // Should be redirected to home page, not login
    await expectWelcomeMessage(page, username);
    await expect(page.getByText('PokéFlix')).toBeVisible();
  });

  test('should show NotFound page for invalid routes when not logged in', async ({
    page,
  }) => {
    await page.goto('/invalid-route');

    // Should see NotFound page without layout
    await expect(page.getByText('404')).toBeVisible();
    await expect(
      page.getByText(/Oops! The page you're looking for doesn't exist/),
    ).toBeVisible();
    await expect(page.getByText('Go to Login')).toBeVisible();
  });

  test('should navigate from NotFound to login', async ({ page }) => {
    await page.goto('/invalid-route');

    // Click "Go to Login" link
    await page.getByText('Go to Login').click();

    // Should navigate to login page
    await expect(page).toHaveURL('/login');
    await expect(
      page.getByText('Sign in to access your Pokémon collection.'),
    ).toBeVisible();
  });
});
