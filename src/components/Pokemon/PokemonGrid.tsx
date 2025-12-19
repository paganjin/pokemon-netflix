import type { Pokemon } from 'pokenode-ts';
import { useState, useEffect } from 'react';
import { css } from 'styled-components';

import {
  useSearchPokemon,
  usePokemonsByType,
  useInfinitePokemonList,
} from '../../hooks';
import { componentStyles } from '../../styles';

import { PokemonCard } from '.';

const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

interface PokemonGridProps {
  onPokemonClick: (pokemon: Pokemon) => void;
}

export const PokemonGrid = ({ onPokemonClick }: PokemonGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [accumulatedTypeResults, setAccumulatedTypeResults] = useState<
    Pokemon[]
  >([]);
  const [typeOffset, setTypeOffset] = useState(0);
  const [typeHasMore, setTypeHasMore] = useState(false);

  // React Query hooks - always call the same number of hooks
  const infiniteQuery = useInfinitePokemonList(20);
  const searchResults = useSearchPokemon(searchQuery, 20);
  const typeQuery = usePokemonsByType(selectedType || '', 20, typeOffset);

  // Accumulate type results when new data comes in
  useEffect(() => {
    if (typeQuery.data?.results && selectedType) {
      if (typeOffset === 0) {
        // Reset accumulated results for new type or first load
        setAccumulatedTypeResults(typeQuery.data.results);
      } else {
        // Append new results to accumulated results
        setAccumulatedTypeResults((prev) => [
          ...prev,
          ...typeQuery.data!.results,
        ]);
      }
      // Update hasMore state
      setTypeHasMore(typeQuery.data.hasMore || false);
    }
  }, [typeQuery.data, selectedType, typeOffset]);

  // Reset accumulated results when type changes
  useEffect(() => {
    if (!selectedType) {
      setAccumulatedTypeResults([]);
      setTypeHasMore(false);
    }
  }, [selectedType]);

  // Determine which data to show
  const isSearching = searchQuery.length > 0;
  const isFiltering = selectedType && !isSearching;

  let pokemon: Pokemon[] = [];
  let loading = false;
  let error = '';
  let hasMore = false;
  let loadingMore = false;

  if (isSearching) {
    pokemon = searchResults.data || [];
    loading = searchResults.isLoading;
    error = searchResults.error?.message || '';
    hasMore = false;
  } else if (isFiltering) {
    pokemon = accumulatedTypeResults;
    loading = typeQuery.isLoading && typeOffset === 0;
    error = typeQuery.error?.message || '';
    hasMore = typeHasMore;
    loadingMore = typeQuery.isFetching;
  } else {
    pokemon =
      infiniteQuery.data?.pages.flatMap(
        (page: { results: Pokemon[] }) => page.results,
      ) || [];
    loading = infiniteQuery.isLoading;
    error = infiniteQuery.error?.message || '';
    hasMore = infiniteQuery.hasNextPage || false;
    loadingMore = infiniteQuery.isFetchingNextPage;
  }

  const handleLoadMore = () => {
    if (isFiltering && hasMore) {
      setTypeOffset((prev) => prev + 20);
    } else if (!isSearching && !isFiltering) {
      infiniteQuery.fetchNextPage();
    }
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    setTypeOffset(0);
    setSearchQuery('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedType(null);
    setTypeOffset(0);
  };

  return (
    <div css={styles.container}>
      <div css={styles.controls}>
        <input
          css={styles.searchInput}
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div css={styles.typeFilters}>
          <button
            css={styles.typeButton(!selectedType)}
            onClick={() => handleTypeChange(null)}
          >
            All Types
          </button>
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              css={styles.typeButton(selectedType === type)}
              onClick={() => handleTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div css={styles.error}>Error: {error}</div>}

      {loading && pokemon.length === 0 ? (
        <div css={styles.loading}>Loading Pokémon...</div>
      ) : (
        <div css={styles.gridSection}>
          {/* Show blocking overlay when switching types */}
          {isFiltering && typeQuery.isLoading && typeOffset === 0 && (
            <div css={styles.blockingOverlay}>
              <div css={styles.loadingSpinner}>
                Loading {selectedType} Pokémon...
              </div>
            </div>
          )}

          <div css={styles.grid}>
            {pokemon.map((p) => (
              <PokemonCard
                key={`${p.id}-${p.name}`}
                pokemon={p}
                onClick={() => onPokemonClick(p)}
              />
            ))}
          </div>

          {hasMore && (
            <div css={styles.loadMoreContainer}>
              <button
                css={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: css(({ theme }) => ({
    padding: theme.spacing.lg,
  })),
  controls: css(({ theme }) => ({
    marginBottom: theme.spacing.xl,
  })),
  searchInput: css(({ theme }) => ({
    ...componentStyles.input.base,
    width: '100%',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  })),
  typeFilters: css(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  })),
  typeButton: (isActive: boolean) =>
    css(({ theme }) => ({
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
      color: isActive ? theme.colors.background : theme.colors.text,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: isActive ? theme.colors.primary : theme.colors.border,
      },
    })),
  grid: css(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  })),
  loading: css(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing.xxl,
    fontSize: '1.125rem',
    color: theme.colors.textSecondary,
  })),
  error: css(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.error,
    color: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  })),
  loadMoreContainer: css(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  })),
  loadMoreButton: css(({ theme }) => ({
    ...componentStyles.button.base,
    ...componentStyles.button.primary,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    color: theme.colors.background,
    fontWeight: 'bold',
  })),
  gridSection: css(() => ({
    position: 'relative',
  })),
  blockingOverlay: css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }),
  loadingOverlay: css(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
  })),
  loadingSpinner: css(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.lg,
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    '&::before': {
      content: '""',
      width: '40px',
      height: '40px',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      borderTop: `4px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  })),
};
