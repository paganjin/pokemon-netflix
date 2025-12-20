import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import type { FavoritesContextType } from '../types';

import { useAuth } from './AuthContext';

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const FAVORITES_STORAGE_KEY = 'pokemon-netflix-user-favorites';

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useAuth();

  const getUserFavoritesKey = (userId: string) =>
    `${FAVORITES_STORAGE_KEY}-${userId}`;

  const loadUserFavorites = useCallback((userId: string) => {
    const userFavoritesKey = getUserFavoritesKey(userId);
    const storedFavorites = localStorage.getItem(userFavoritesKey);
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing stored favorites:', error);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, []);

  const saveUserFavorites = (userId: string, userFavorites: number[]) => {
    const userFavoritesKey = getUserFavoritesKey(userId);
    localStorage.setItem(userFavoritesKey, JSON.stringify(userFavorites));
  };

  useEffect(() => {
    if (user?.id) {
      loadUserFavorites(user.id);
    } else {
      setFavorites([]);
    }

    // Listen for favorites changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (user?.id && event.key === getUserFavoritesKey(user.id)) {
        if (event.newValue) {
          try {
            const updatedFavorites = JSON.parse(event.newValue);
            setFavorites(
              Array.isArray(updatedFavorites) ? updatedFavorites : [],
            );
          } catch (error) {
            console.error('Error parsing favorites from storage event:', error);
          }
        } else {
          setFavorites([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.id, loadUserFavorites]);

  const addToFavorites = (pokemonId: number) => {
    if (!user?.id) return;

    setFavorites((prev) => {
      if (!prev.includes(pokemonId)) {
        const newFavorites = [...prev, pokemonId];
        saveUserFavorites(user.id, newFavorites);
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFromFavorites = (pokemonId: number) => {
    if (!user?.id) return;

    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== pokemonId);
      saveUserFavorites(user.id, newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (pokemonId: number): boolean => {
    return favorites.includes(pokemonId);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
