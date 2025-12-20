import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AuthProvider, useAuth } from './AuthContext';

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

// Test component to access AuthContext
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, signUp } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `${user.username} (${user.id})` : 'no-user'}
      </div>
      <button
        data-testid="login-btn"
        onClick={async () => await login('testuser', 'password123')}
      >
        Login
      </button>
      <button
        data-testid="signup-btn"
        onClick={async () => await signUp('newuser', 'password123')}
      >
        Sign Up
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render with unauthenticated state by default', () => {
      renderWithAuthProvider();

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated',
      );
      expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');
    });

    it('should restore authenticated user from localStorage on mount', () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        isAuthenticated: true,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      renderWithAuthProvider();

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'authenticated',
      );
      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'testuser (user-123)',
      );
    });

    it('should not authenticate user if isAuthenticated is false in localStorage', () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        isAuthenticated: false,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      renderWithAuthProvider();

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated',
      );
      expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pokemon-netflix-current-user',
      );
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      renderWithAuthProvider();

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated',
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'pokemon-netflix-current-user',
      );
    });
  });

  describe('Storage Event Listener', () => {
    it('should add storage event listener on mount', () => {
      renderWithAuthProvider();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
    });

    it('should remove storage event listener on unmount', () => {
      const { unmount } = renderWithAuthProvider();

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
    });
  });

  describe('Sign Up', () => {
    beforeEach(() => {
      // Mock existing users in localStorage
      const existingUsers = [
        { id: 'user-1', username: 'existinguser', password: 'password123' },
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-users') {
          return JSON.stringify(existingUsers);
        }
        return null;
      });
    });

    it('should successfully create new user account', async () => {
      renderWithAuthProvider();

      fireEvent.click(screen.getByTestId('signup-btn'));

      // Wait a bit for the signup to complete
      await waitFor(() => {
        // After signup, user should still be unauthenticated (signup doesn't auto-login)
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'not-authenticated',
        );
      });

      // User should not be logged in after signup
      expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');

      // But the user should be saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-netflix-users',
        expect.stringContaining('newuser'),
      );
    });

    it('should prevent duplicate username registration', async () => {
      renderWithAuthProvider();

      // Try to sign up with existing username
      fireEvent.click(screen.getByTestId('signup-btn'));

      // Should remain unauthenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated',
      );
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      // Mock existing users in localStorage
      const existingUsers = [
        { id: 'user-1', username: 'testuser', password: 'password123' },
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-users') {
          return JSON.stringify(existingUsers);
        }
        return null;
      });
    });

    it('should successfully login with valid credentials', async () => {
      renderWithAuthProvider();

      fireEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'authenticated',
        );
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'testuser (user-1)',
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-netflix-current-user',
        expect.stringContaining('"isAuthenticated":true'),
      );
    });

    it('should fail login with invalid credentials', () => {
      // Mock no existing users
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'pokemon-netflix-users') {
          return JSON.stringify([]);
        }
        return null;
      });

      renderWithAuthProvider();

      fireEvent.click(screen.getByTestId('login-btn'));

      // Should remain unauthenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated',
      );
    });
  });

  describe('Logout', () => {
    it('should successfully logout authenticated user', async () => {
      // Start with authenticated user
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        isAuthenticated: true,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      renderWithAuthProvider();

      // Verify user is authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'authenticated',
      );

      // Logout
      fireEvent.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'not-authenticated',
        );
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');

      // Should first set isAuthenticated to false, then remove after delay
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-netflix-current-user',
        expect.stringContaining('"isAuthenticated":false'),
      );
    });
  });

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Mock console.error to avoid test output noise
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
