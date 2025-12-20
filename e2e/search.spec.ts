import { test, expect } from '@playwright/test';

test.describe('Search and Filter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Simple login setup - auth functionality is tested in auth.spec.ts
    await page.goto('/');
    const username = `sea${Date.now().toString().slice(-8)}`;
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
    
    // Wait for home page to load (focus on search functionality)
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
  });


  test('should search for Pokemon by name', async ({ page }) => {
    // Search for Pikachu
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await searchInput.fill('pikachu');
    
    // Wait for search results
    await page.waitForTimeout(1000); // Allow debounce
    
    // Should show Pikachu in results
    await expect(page.getByText('pikachu')).toBeVisible();
  });

  test('should filter Pokemon by type', async ({ page }) => {
    // Select fire type filter
    const fireTypeButton = page.getByRole('button', { name: 'Fire' });
    await fireTypeButton.click();
    
    // Wait for filtered results
    await page.waitForTimeout(2000);
    
    // Should show fire type Pokemon
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();
  });

  test('should clear search results', async ({ page }) => {
    // Search for something
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await searchInput.fill('pikachu');
    await page.waitForTimeout(1000);
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(1000);
    
    // Should show all Pokemon again
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(20);
  });

  test('should show no results message for invalid search', async ({ page }) => {
    // Search for something that doesn't exist
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await searchInput.fill('invalidpokemonname123');
    await page.waitForTimeout(1000);
    
    // Should show no Pokemon cards for invalid search
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(0);
  });

  test('should handle search and type filter combination', async ({ page }) => {
    // Apply type filter first
    const waterTypeButton = page.getByRole('button', { name: 'Water' });
    await waterTypeButton.click();
    await page.waitForTimeout(1000);
    
    // Then search within water types
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await searchInput.fill('squirtle');
    await page.waitForTimeout(1000);
    
    // Should show Squirtle (water type)
    await expect(page.getByText('squirtle')).toBeVisible();
    await expect(page.getByText('water').first()).toBeVisible(); // Use .first() to avoid strict mode
  });

  test('should load more Pokemon with Load More button', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(initialCount).toBe(20); // Verify we start with 20
    
    // Click the Load More button
    await page.getByRole('button', { name: 'Load More' }).click();
    await page.waitForTimeout(2000); // Wait for API call
    
    // Should have more Pokemon
    const newCount = await page.locator('[data-testid="pokemon-card"]').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
