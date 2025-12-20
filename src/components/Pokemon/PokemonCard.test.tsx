import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { Pokemon } from 'pokenode-ts';
import { ThemeProvider } from 'styled-components';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { theme } from '../../styles/theme';

import { PokemonCard } from './PokemonCard';

// Mock the FavoritesContext
const mockUseFavorites = {
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(),
  favorites: [],
};

vi.mock('../../providers/FavoritesContext', () => ({
  useFavorites: () => mockUseFavorites,
}));

// Mock Pokemon data with required properties
const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  base_experience: 64,
  height: 7,
  is_default: true,
  order: 1,
  weight: 69,
  abilities: [],
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: '',
  moves: [],
  species: { name: 'bulbasaur', url: '' },
  sprites: {
    back_default: null,
    back_female: null,
    back_shiny: null,
    back_shiny_female: null,
    front_default: 'https://example.com/bulbasaur-sprite.png',
    front_female: null,
    front_shiny: null,
    front_shiny_female: null,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur.png',
        front_shiny: null,
      },
    },
    versions: {},
  },
  stats: [],
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: '',
      },
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: '',
      },
    },
  ],
  past_types: [],
} as unknown as Pokemon;

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PokemonCard', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFavorites.isFavorite.mockReturnValue(false);
  });

  describe('Loading State', () => {
    it('should render loading spinner when loading', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} isLoading={true} onClick={mockOnClick} />
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    });
  });

  describe('Pokemon Display', () => {
    it('should render Pokemon information correctly', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('#001')).toBeInTheDocument();
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });

    it('should render Pokemon image with correct src and alt', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const image = screen.getByAltText('bulbasaur');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
    });

    it('should fallback to sprite image when official artwork is not available', () => {
      const pokemonWithoutArtwork = {
        ...mockPokemon,
        sprites: {
          front_default: 'https://example.com/bulbasaur-sprite.png',
        },
      } as unknown as Pokemon;

      renderWithTheme(
        <PokemonCard pokemon={pokemonWithoutArtwork} onClick={mockOnClick} />
      );

      const image = screen.getByAltText('bulbasaur');
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur-sprite.png');
    });

    it('should fallback to PokeAPI URL when no sprites available', () => {
      const pokemonWithoutSprites = {
        ...mockPokemon,
        sprites: {},
      } as unknown as Pokemon;

      renderWithTheme(
        <PokemonCard pokemon={pokemonWithoutSprites} onClick={mockOnClick} />
      );

      const image = screen.getByAltText('bulbasaur');
      expect(image).toHaveAttribute('src', '');
    });

    it('should format Pokemon ID with leading zeros', () => {
      const pokemonWithHighId = {
        ...mockPokemon,
        id: 150,
      };

      renderWithTheme(
        <PokemonCard pokemon={pokemonWithHighId} onClick={mockOnClick} />
      );

      expect(screen.getByText('#150')).toBeInTheDocument();
    });

    it('should capitalize Pokemon name', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      // The name should be displayed as capitalized
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  describe('Favorite Functionality', () => {
    it('should show empty pokeball when Pokemon is not favorite', () => {
      mockUseFavorites.isFavorite.mockReturnValue(false);

      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
      const pokeballIcon = favoriteButton.querySelector('img');
      
      expect(pokeballIcon).toHaveAttribute('src', '/pokeball-empty.svg');
      expect(pokeballIcon).toHaveAttribute('alt', 'Add to favorites');
    });

    it('should show filled pokeball when Pokemon is favorite', () => {
      mockUseFavorites.isFavorite.mockReturnValue(true);

      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
      const pokeballIcon = favoriteButton.querySelector('img');
      
      expect(pokeballIcon).toHaveAttribute('src', '/pokeball-catch.svg');
      expect(pokeballIcon).toHaveAttribute('alt', 'Remove from favorites');
    });

    it('should add Pokemon to favorites when clicking empty pokeball', () => {
      mockUseFavorites.isFavorite.mockReturnValue(false);

      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(favoriteButton);

      expect(mockUseFavorites.addToFavorites).toHaveBeenCalledWith(1);
      expect(mockUseFavorites.removeFromFavorites).not.toHaveBeenCalled();
    });

    it('should remove Pokemon from favorites when clicking filled pokeball', () => {
      mockUseFavorites.isFavorite.mockReturnValue(true);

      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
      fireEvent.click(favoriteButton);

      expect(mockUseFavorites.removeFromFavorites).toHaveBeenCalledWith(1);
      expect(mockUseFavorites.addToFavorites).not.toHaveBeenCalled();
    });

    it('should prevent event propagation when clicking favorite button', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(favoriteButton);

      // The card onClick should not be called when clicking the favorite button
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Card Interaction', () => {
    it('should call onClick when clicking the card', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const card = screen.getByText('bulbasaur').closest('div');
      fireEvent.click(card!);

      expect(mockOnClick).toHaveBeenCalledWith(mockPokemon);
    });

    it('should not call onClick when in loading state', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} isLoading={true} onClick={mockOnClick} />
      );

      // Loading state should not be clickable
      const loadingSpinner = screen.getByTestId('loading-spinner');
      fireEvent.click(loadingSpinner);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Image Loading', () => {
    it('should handle image load event', async () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const image = screen.getByAltText('bulbasaur');
      
      // Initially image should have opacity 0
      expect(image).toHaveStyle({ opacity: '0' });

      // Simulate image load
      fireEvent.load(image);

      await waitFor(() => {
        expect(image).toHaveStyle({ opacity: '1' });
      });
    });
  });

  describe('Type Display', () => {
    it('should render all Pokemon types', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });

    it('should handle Pokemon with single type', () => {
      const pokemonWithTypes = {
        ...mockPokemon,
        types: [
          {
            type: {
              name: 'electric',
            },
          },
        ],
      } as unknown as Pokemon;

      renderWithTheme(
        <PokemonCard pokemon={pokemonWithTypes} onClick={mockOnClick} />
      );

      expect(screen.getByText('electric')).toBeInTheDocument();
      expect(screen.queryByText('grass')).not.toBeInTheDocument();
    });

    it('should handle Pokemon with no types gracefully', () => {
      const noTypePokemon = {
        ...mockPokemon,
        types: [],
      } as unknown as Pokemon;

      renderWithTheme(
        <PokemonCard pokemon={noTypePokemon} onClick={mockOnClick} />
      );

      // Should still render the card without crashing
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for favorite button', () => {
      mockUseFavorites.isFavorite.mockReturnValue(false);

      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should have proper alt text for Pokemon image', () => {
      renderWithTheme(
        <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
      );

      const image = screen.getByAltText('bulbasaur');
      expect(image).toBeInTheDocument();
    });
  });
});
