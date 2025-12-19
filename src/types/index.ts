import type { Pokemon } from 'pokenode-ts';

export interface User {
  id: string;
  username: string;
}

// Custom list response type for our app
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export type AppPage = 'home' | 'favorites';

export interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  signUp: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (pokemonId: number) => void;
  removeFromFavorites: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
}
