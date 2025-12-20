import { test, expect } from '@playwright/test';

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

  test('should display login page for unauthenticated users', async ({ page }) => {
    await expect(page).toHaveTitle(/pokemon-netflix/);
    await expect(page.getByText('Sign in to access your Pokémon collection.')).toBeVisible();
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
    
    // Should be logged in and redirected to home page
    // On mobile, need to open dropdown to see Welcome message
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first(); // Hamburger menu with spans
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Wait for mobile dropdown to appear and target Welcome message within it
      await page.waitForTimeout(500);
      await expect(page.getByText(`Welcome, ${username}`).last()).toBeVisible(); // Use .last() to get mobile version
    } else {
      // Desktop version
      await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();
    }
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
    
    // Should be logged in successfully
    // On mobile, need to open dropdown to see Welcome message
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Wait for mobile dropdown to appear and target Welcome message within it
      await page.waitForTimeout(500);
      await expect(page.getByText(`Welcome, ${username}`).last()).toBeVisible(); // Use .last() to get mobile version
    } else {
      // Desktop version
      await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();
    }
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.getByPlaceholder('Enter your username').fill('nonexistentuser');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error message
    await expect(page.getByText('No accounts found. Please sign up first.')).toBeVisible();
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
    // On mobile, need to open dropdown to see Welcome message
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Wait for mobile dropdown to appear and target Welcome message within it
      await page.waitForTimeout(500);
      await expect(page.getByText(`Welcome, ${username}`).last()).toBeVisible(); // Use .last() to get mobile version
    } else {
      // Desktop version
      await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();
    }
    
    // Now logout (Sign Out is also in mobile dropdown)
    // Use .last() to target the mobile Sign Out button when dropdown is open
    await page.getByText('Sign Out').last().click();
    
    // Should be redirected to login page
    await expect(page.getByText('Sign in to access your Pokémon collection.')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  });

  test('should redirect authenticated users away from login page', async ({ page }) => {
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
    // On mobile, need to open dropdown to see Welcome message
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Wait for mobile dropdown to appear and target Welcome message within it
      await page.waitForTimeout(500);
      await expect(page.getByText(`Welcome, ${username}`).last()).toBeVisible(); // Use .last() to get mobile version
    } else {
      // Desktop version
      await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();
    }
    
    // Try to navigate to login page while authenticated
    await page.goto('/');
    
    // Should be redirected to home page, not login
    // On mobile, need to open dropdown again after navigation
    const mobileMenuButton2 = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton2.isVisible()) {
      await mobileMenuButton2.click();
      // Wait for mobile dropdown to appear and target Welcome message within it
      await page.waitForTimeout(500);
      await expect(page.getByText(`Welcome, ${username}`).last()).toBeVisible(); // Use .last() to get mobile version
    } else {
      // Desktop version
      await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();
    }
    await expect(page.getByText('PokéFlix')).toBeVisible();
  });
});
