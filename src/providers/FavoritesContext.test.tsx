import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { FavoritesProvider, useFavorites } from './FavoritesContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.addEventListener and removeEventListener
const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

// Test component to access FavoritesContext
const TestComponent = () => {
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <div data-testid="favorites-list">
        {favorites.map((id) => (
          <span key={id} data-testid={`favorite-${id}`}>
            {id}
          </span>
        ))}
      </div>
      <div data-testid="is-favorite-1">{isFavorite(1) ? 'true' : 'false'}</div>
      <div data-testid="is-favorite-25">{isFavorite(25) ? 'true' : 'false'}</div>
      <button
        data-testid="add-pokemon-1"
        onClick={() => addToFavorites(1)}
      >
        Add Pokemon 1
      </button>
      <button
        data-testid="add-pokemon-25"
        onClick={() => addToFavorites(25)}
      >
        Add Pokemon 25
      </button>
      <button
        data-testid="remove-pokemon-1"
        onClick={() => removeFromFavorites(1)}
      >
        Remove Pokemon 1
      </button>
    </div>
  );
};

// Mock AuthContext
const mockUseAuth = {
  user: {
    id: 'test-user-123',
    username: 'testuser',
    isAuthenticated: true,
  } as { id: string; username: string; isAuthenticated: boolean } | null,
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
  signUp: vi.fn(),
};

vi.mock('./AuthContext', () => ({
  useAuth: () => mockUseAuth,
}));

const renderWithProviders = () => {
  return render(
    <FavoritesProvider>
      <TestComponent />
    </FavoritesProvider>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render with empty favorites by default', () => {
      renderWithProviders();

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('false');
    });

    it('should load user favorites from localStorage on mount', () => {
      const mockFavorites = [1, 25, 150];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return JSON.stringify(mockFavorites);
        }
        return null;
      });

      renderWithProviders();

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('3');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
      expect(screen.getByTestId('favorite-1')).toHaveTextContent('1');
      expect(screen.getByTestId('favorite-25')).toHaveTextContent('25');
      expect(screen.getByTestId('favorite-150')).toHaveTextContent('150');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return 'invalid-json';
        }
        return null;
      });

      // Mock console.error to avoid test output noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders();

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error parsing stored favorites:',
        expect.any(SyntaxError),
      );

      consoleSpy.mockRestore();
    });

    it('should handle non-array data in localStorage', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return JSON.stringify({ not: 'an array' });
        }
        return null;
      });

      renderWithProviders();

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    });
  });

  describe('Storage Event Listener', () => {
    it('should add storage event listener on mount', () => {
      renderWithProviders();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
    });

    it('should remove storage event listener on unmount', () => {
      const { unmount } = renderWithProviders();

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
    });
  });

  describe('Add to Favorites', () => {
    it('should add Pokemon to favorites', () => {
      renderWithProviders();

      fireEvent.click(screen.getByTestId('add-pokemon-1'));

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
      expect(screen.getByTestId('favorite-1')).toHaveTextContent('1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-netflix-user-favorites-test-user-123',
        JSON.stringify([1]),
      );
    });

    it('should add multiple Pokemon to favorites', () => {
      renderWithProviders();

      fireEvent.click(screen.getByTestId('add-pokemon-1'));
      fireEvent.click(screen.getByTestId('add-pokemon-25'));

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
      
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        'pokemon-netflix-user-favorites-test-user-123',
        JSON.stringify([1, 25]),
      );
    });

    it('should not add duplicate Pokemon to favorites', () => {
      renderWithProviders();

      fireEvent.click(screen.getByTestId('add-pokemon-1'));
      fireEvent.click(screen.getByTestId('add-pokemon-1')); // Duplicate

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });

    it('should not add to favorites when user is not authenticated', () => {
      // Temporarily mock unauthenticated state
      mockUseAuth.user = null;
      mockUseAuth.isAuthenticated = false;

      renderWithProviders();

      fireEvent.click(screen.getByTestId('add-pokemon-1'));

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      // Reset mock state
      mockUseAuth.user = {
        id: 'test-user-123',
        username: 'testuser',
        isAuthenticated: true,
      };
      mockUseAuth.isAuthenticated = true;
    });
  });

  describe('Remove from Favorites', () => {
    beforeEach(() => {
      // Start with some favorites
      const mockFavorites = [1, 25, 150];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return JSON.stringify(mockFavorites);
        }
        return null;
      });
    });

    it('should remove Pokemon from favorites', () => {
      renderWithProviders();

      // Verify initial state
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('3');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('remove-pokemon-1'));

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-netflix-user-favorites-test-user-123',
        JSON.stringify([25, 150]),
      );
    });

    it('should not error when removing non-existent Pokemon', () => {
      renderWithProviders();

      // Try to remove Pokemon that's not in favorites
      fireEvent.click(screen.getByTestId('remove-pokemon-1'));
      fireEvent.click(screen.getByTestId('remove-pokemon-1')); // Remove again

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    });

    it('should not remove from favorites when user is not authenticated', () => {
      // Temporarily mock unauthenticated state
      mockUseAuth.user = null;
      mockUseAuth.isAuthenticated = false;

      renderWithProviders();

      fireEvent.click(screen.getByTestId('remove-pokemon-1'));

      // Should not call setItem for removal
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      // Reset mock state
      mockUseAuth.user = {
        id: 'test-user-123',
        username: 'testuser',
        isAuthenticated: true,
      };
      mockUseAuth.isAuthenticated = true;
    });
  });

  describe('isFavorite Function', () => {
    beforeEach(() => {
      const mockFavorites = [1, 25, 150];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return JSON.stringify(mockFavorites);
        }
        return null;
      });
    });

    it('should correctly identify favorite Pokemon', () => {
      renderWithProviders();

      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
    });

    it('should correctly identify non-favorite Pokemon', () => {
      renderWithProviders();

      // Pokemon 50 is not in the mock favorites
      expect(screen.queryByTestId('is-favorite-50')).not.toBeInTheDocument();
    });
  });

  describe('Cross-tab Synchronization', () => {
    it('should update favorites when storage event is received', async () => {
      renderWithProviders();

      // Initial state
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');

      // Simulate storage event from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'pokemon-netflix-user-favorites-test-user-123',
        newValue: JSON.stringify([1, 25, 150]),
        oldValue: null,
      });

      fireEvent(window, storageEvent);

      await waitFor(() => {
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('3');
      });

      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
    });

    it('should clear favorites when storage event has null value', async () => {
      // Start with favorites
      const mockFavorites = [1, 25];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-user-favorites-test-user-123') {
          return JSON.stringify(mockFavorites);
        }
        return null;
      });

      renderWithProviders();

      expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');

      // Simulate storage event with null value (favorites cleared)
      const storageEvent = new StorageEvent('storage', {
        key: 'pokemon-netflix-user-favorites-test-user-123',
        newValue: null,
        oldValue: JSON.stringify([1, 25]),
      });

      fireEvent(window, storageEvent);

      await waitFor(() => {
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      });
    });

    it('should handle corrupted data in storage event gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders();

      // Simulate storage event with invalid JSON
      const storageEvent = new StorageEvent('storage', {
        key: 'pokemon-netflix-user-favorites-test-user-123',
        newValue: 'invalid-json',
        oldValue: null,
      });

      fireEvent(window, storageEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error parsing favorites from storage event:',
        expect.any(SyntaxError),
      );

      consoleSpy.mockRestore();
    });

    it('should ignore storage events for other keys', async () => {
      renderWithProviders();

      const initialCount = screen.getByTestId('favorites-count').textContent;

      // Simulate storage event for different key
      const storageEvent = new StorageEvent('storage', {
        key: 'some-other-key',
        newValue: JSON.stringify([1, 2, 3]),
        oldValue: null,
      });

      fireEvent(window, storageEvent);

      // Should not change favorites
      expect(screen.getByTestId('favorites-count')).toHaveTextContent(initialCount || '0');
    });
  });

  describe('useFavorites Hook', () => {
    it('should throw error when used outside FavoritesProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFavorites must be used within a FavoritesProvider');

      consoleSpy.mockRestore();
    });
  });
});
