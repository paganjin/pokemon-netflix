import { test, expect } from '@playwright/test';

test.describe('Favorites Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Simple login setup - auth functionality is tested in auth.spec.ts
    await page.goto('/');
    const username = `fav${Date.now().toString().slice(-8)}`;
    const password = 'password123';

    // Quick signup and login
    await page.getByText('Sign Up').click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.waitForTimeout(500);
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for home page to load (focus on favorites functionality)
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
  });


  test('should add Pokemon to favorites from home page', async ({ page }) => {
    // Click on first Pokemon's favorite button (empty pokeball)
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    const favoriteButton = firstCard.locator('button').first();
    await favoriteButton.click();
    
    // Verify pokeball changed to filled
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
  });

  test('should remove Pokemon from favorites', async ({ page }) => {
    // Add a Pokemon to favorites first
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    const addButton = firstCard.locator('button').first();
    await addButton.click();
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    
    // Remove from favorites
    const removeButton = firstCard.locator('button').first();
    await removeButton.click();
    
    // Verify pokeball changed back to empty
    await expect(firstCard.locator('img[src="/pokeball-empty.svg"]')).toBeVisible();
  });

  test('should display favorites in My List page', async ({ page }) => {
    // Add a Pokemon to favorites
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    const pokemonName = await firstCard.locator('h3').textContent();
    
    await firstCard.locator('button').first().click();
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    
    // Navigate to My List (handle mobile dropdown)
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
    }
    await page.getByRole('link', { name: 'My List' }).click();
    await expect(page).toHaveURL('/favorites');
    
    // Verify Pokemon appears in favorites
    await expect(page.getByRole('heading', { name: 'My List' })).toBeVisible();
    await expect(page.getByText(pokemonName || '')).toBeVisible();
  });

  test('should show empty state when no favorites', async ({ page }) => {
    // Navigate to My List without adding any favorites (handle mobile dropdown)
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
    }
    await page.getByRole('link', { name: 'My List' }).click();
    await expect(page).toHaveURL('/favorites');
    
    // Should show empty state
    await expect(page.getByText('Your list is empty')).toBeVisible();
    await expect(page.getByText('Add Pokemon to your favorites by clicking the heart icon on any Pokemon card.')).toBeVisible();
  });

  test('should persist favorites after page refresh', async ({ page }) => {
    // Add a Pokemon to favorites
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    await firstCard.locator('button').first().click();
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Verify favorite is still there after refresh
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
    const refreshedFirstCard = page.locator('[data-testid="pokemon-card"]').first();
    await expect(refreshedFirstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
  });

  test('should add and remove favorites from Pokemon modal', async ({ page }) => {
    // Click on first card to open modal
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    await firstCard.click();
    
    // Modal should open
    await expect(page.locator('[data-testid="pokemon-modal"]')).toBeVisible();
    
    // Add to favorites from modal (second button - first is close button)
    const modalFavoriteButton = page.locator('[data-testid="pokemon-modal"] button').nth(1);
    await modalFavoriteButton.click();
    
    // Verify pokeball changed in modal
    await expect(page.locator('[data-testid="pokemon-modal"] img[src="/pokeball-catch.svg"]')).toBeVisible();
    
    // Close modal by clicking outside or escape key
    await page.keyboard.press('Escape');
    
    // Verify pokeball changed in card
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
  });

  test('should handle multiple favorites correctly', async ({ page }) => {
    // Add multiple Pokemon to favorites
    const cards = page.locator('[data-testid="pokemon-card"]');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    const thirdCard = cards.nth(2);
    
    // Add first three Pokemon to favorites
    await firstCard.locator('button').first().click();
    await secondCard.locator('button').first().click();
    await thirdCard.locator('button').first().click();
    
    // Verify all are favorited
    await expect(firstCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    await expect(secondCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    await expect(thirdCard.locator('img[src="/pokeball-catch.svg"]')).toBeVisible();
    
    // Navigate to My List (handle mobile dropdown)
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('span') }).first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
    }
    await page.getByRole('link', { name: 'My List' }).click();
    
    // Should show 3 favorites
    await expect(page.getByText('My List (3)')).toBeVisible();
  });
});
