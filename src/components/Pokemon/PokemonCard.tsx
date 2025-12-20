import type { Pokemon } from 'pokenode-ts';
import { useState } from 'react';
import { css } from 'styled-components';

import PokeballCatchIcon from '../../assets/pokeball-catch.svg?react';
import PokeballEmptyIcon from '../../assets/pokeball-empty.svg?react';
import { useFavorites } from '../../providers';
import { componentStyles, mediaQueries, getTypeColor } from '../../styles';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
  isLoading?: boolean;
}

export const PokemonCard = ({
  pokemon,
  onClick,
  isLoading = false,
}: PokemonCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(pokemon.id)) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon.id);
    }
  };

  const imageUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    undefined;

  if (isLoading) {
    return (
      <div css={styles.loadingCard}>
        <div css={styles.loadingSpinner} data-testid="loading-spinner" />
      </div>
    );
  }

  return (
    <div
      css={styles.card}
      onClick={() => onClick(pokemon)}
      data-testid="pokemon-card"
    >
      <div css={styles.imageContainer}>
        <button
          css={styles.favoriteButton}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite(pokemon.id)
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
        >
          {isFavorite(pokemon.id) ? (
            <PokeballCatchIcon
              css={styles.pokeballIcon}
              data-testid="pokeball-filled"
            />
          ) : (
            <PokeballEmptyIcon
              css={styles.pokeballIcon}
              data-testid="pokeball-empty"
            />
          )}
        </button>

        <img
          css={styles.pokemonImage}
          src={imageUrl}
          alt={pokemon.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        {!imageLoaded && <div css={styles.loadingSpinner} />}
      </div>

      <div css={styles.cardContent}>
        <div>
          <h3 css={styles.pokemonName}>{pokemon.name}</h3>
          <span css={styles.pokemonId}>
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        {pokemon.types && pokemon.types.length > 0 && (
          <div css={styles.typesContainer}>
            {pokemon.types.map((type) => (
              <span key={type.type.name} css={styles.typeBadge(type.type.name)}>
                {type.type.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: css({
    ...componentStyles.card.base,
    ...componentStyles.card.interactive,
    [mediaQueries.mobile]: {
      '&:hover': {
        transform: 'none',
      },
    },
  }),
  imageContainer: css({
    position: 'relative',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'hidden',
  }),
  pokemonImage: css(({ theme }) => ({
    width: '150px',
    height: '150px',
    objectFit: 'contain',
    transition: theme.transitions.normal,
    zIndex: 1,
  })),
  favoriteButton: css(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
    transition: theme.transitions.fast,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.4)',
      transform: 'scale(1.1)',
    },
  })),
  pokeballIcon: css(({ theme }) => ({
    width: '20px',
    height: '20px',
    transition: theme.transitions.fast,
    '&:hover': {
      transform: 'scale(1.1)',
    },
  })),
  cardContent: css(({ theme }) => ({
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  })),
  pokemonName: css(({ theme }) => ({
    color: theme.colors.text,
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: 0,
    textTransform: 'capitalize',
    [mediaQueries.mobile]: {
      fontSize: '1.1rem',
    },
  })),
  pokemonId: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
    fontWeight: 500,
  })),
  typesContainer: css(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  })),
  typeBadge: (type: string) =>
    css(({ theme }) => ({
      background: getTypeColor(type),
      color: 'white',
      fontSize: '0.8rem',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.sm,
      textTransform: 'uppercase',
      fontWeight: 500,
    })),
  loadingCard: css(({ theme }) => ({
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
    textAlign: 'center',
  })),
  loadingSpinner: css(({ theme }) => ({
    width: '40px',
    height: '40px',
    border: `3px solid ${theme.colors.textSecondary}`,
    borderTop: `3px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    flexShrink: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@keyframes spin': {
      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
    },
  })),
};
