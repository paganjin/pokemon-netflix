import React, { createContext, useContext, useState, useEffect } from 'react';

import type { User, AuthContextType } from '../types';

interface StoredUser {
  username: string;
  password: string;
  id: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'pokemon-netflix-users';
const CURRENT_USER_KEY = 'pokemon-netflix-current-user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.isAuthenticated) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // User is stored but not authenticated, clear storage
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem(CURRENT_USER_KEY);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Check auth state on mount
    checkAuthState();

    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CURRENT_USER_KEY) {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUser = (user: StoredUser) => {
    try {
      const users = getStoredUsers();

      // Ensure user object is valid before proceeding
      if (!user || !user.username || !user.id) {
        console.error('Invalid user object:', user);
        return;
      }

      const existingIndex = users.findIndex(
        (u) => u.username === user.username,
      );

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error in saveUser:', error);
    }
  };

  const signUp = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    const users = getStoredUsers();
    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      username,
      password,
    };

    saveUser(newUser);
    return { success: true, message: 'Account created successfully' };
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    const users = getStoredUsers();

    if (users.length === 0) {
      return {
        success: false,
        message: 'No accounts found. Please sign up first.',
      };
    }

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    const existingUser = user;

    const userData: User = {
      id: existingUser.id,
      username: existingUser.username,
      isAuthenticated: true,
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    if (user) {
      // Update user object with isAuthenticated: false before removing
      const loggedOutUser = { ...user, isAuthenticated: false };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedOutUser));

      // Small delay to ensure other tabs can read the updated state
      setTimeout(() => {
        localStorage.removeItem(CURRENT_USER_KEY);
      }, 100);
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    signUp,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
