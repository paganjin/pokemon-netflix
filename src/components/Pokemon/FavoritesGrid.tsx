import type { Pokemon } from 'pokenode-ts';
import { css } from 'styled-components';

import { usePokemonByIds } from '../../hooks';
import { useFavorites } from '../../providers';
import { typographyStyles, mediaQueries } from '../../styles';

import { PokemonCard } from '.';

interface FavoritesGridProps {
  onPokemonClick: (pokemon: Pokemon) => void;
}

export const FavoritesGrid = ({ onPokemonClick }: FavoritesGridProps) => {
  const { favorites } = useFavorites();

  // Use custom hook to fetch all favorite Pokemon in parallel
  const pokemonQueries = usePokemonByIds(favorites);

  const loading = pokemonQueries.some((query) => query.isLoading);
  const error = pokemonQueries.find((query) => query.error)?.error?.message;
  const favoritePokemon = pokemonQueries
    .filter((query) => query.data)
    .map((query) => query.data!)
    .sort((a, b) => a.id - b.id);

  if (error) {
    return (
      <div css={styles.gridContainer}>
        <h1 css={styles.title}>My List</h1>
        <div css={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div css={styles.gridContainer}>
        <h1 css={styles.title}>My List</h1>
        <div css={styles.grid}>
          {Array.from({ length: Math.min(favorites.length, 12) }).map(
            (_, index) => (
              <div key={index} css={styles.loadingCard}>
                <div css={styles.loadingSpinner} />
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (!favoritePokemon.length) {
    return (
      <div css={styles.gridContainer}>
        <h1 css={styles.title}>My List</h1>
        <div css={styles.emptyState}>
          <h3>Your list is empty</h3>
          <p>
            Add Pokemon to your favorites by clicking the heart icon on any
            Pokemon card.
            <br />
            Start exploring to build your collection!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div css={styles.gridContainer}>
      <h1 css={styles.title}>My List ({favoritePokemon.length})</h1>
      <div css={styles.grid}>
        {favoritePokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  gridContainer: css(({ theme }) => ({
    padding: theme.spacing.xl,
    [mediaQueries.tablet]: {
      padding: theme.spacing.lg,
    },
    [mediaQueries.mobile]: {
      padding: theme.spacing.md,
    },
  })),
  title: css(({ theme }) => ({
    marginBottom: theme.spacing.xl,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    [mediaQueries.tablet]: {
      fontSize: typographyStyles.h2.fontSize,
    },
  })),
  grid: css(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  })),
  loadingCard: css(({ theme }) => ({
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '280px',
    border: `1px solid ${theme.colors.border}`,
  })),
  loadingSpinner: css(({ theme }) => ({
    width: '40px',
    height: '40px',
    border: `3px solid ${theme.colors.textSecondary}`,
    borderTop: `3px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  })),
  emptyState: css(({ theme }) => ({
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: '1.2rem',
    marginTop: theme.spacing.xl,
  })),
  errorMessage: css(({ theme }) => ({
    color: theme.colors.error,
    textAlign: 'center',
    padding: theme.spacing.xl,
    fontSize: '1.1rem',
  })),
};
