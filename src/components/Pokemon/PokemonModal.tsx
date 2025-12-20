import type { Pokemon } from 'pokenode-ts';
import { useEffect } from 'react';
import { css } from 'styled-components';

import { useFavorites } from '../../providers';
import { mediaQueries, getTypeColor } from '../../styles';

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonModal = ({ pokemon, onClose }: PokemonModalProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFavoriteClick = () => {
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

  return (
    <div css={styles.modalOverlay} onClick={handleOverlayClick}>
      <div css={styles.modalContent} data-testid="pokemon-modal">
        <button css={styles.closeButton} onClick={onClose}>
          <img css={styles.closeIcon} src="/close.svg" alt="Close modal" />
        </button>

        <div css={styles.header}>
          <button css={styles.favoriteButton} onClick={handleFavoriteClick}>
            <img
              css={styles.pokeballIcon}
              src={
                isFavorite(pokemon.id)
                  ? '/pokeball-catch.svg'
                  : '/pokeball-empty.svg'
              }
              alt={
                isFavorite(pokemon.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            />
          </button>
          <img css={styles.pokemonImage} src={imageUrl} alt={pokemon.name} />
        </div>

        <div css={styles.content}>
          <h1 css={styles.pokemonName}>{pokemon.name}</h1>
          <span css={styles.pokemonId}>
            #{pokemon.id.toString().padStart(3, '0')}
          </span>

          {pokemon.types && pokemon.types.length > 0 && (
            <div css={styles.typesContainer}>
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  css={styles.typeBadge(type.type.name)}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          )}

          <div css={styles.infoGrid}>
            <div css={styles.infoCard}>
              <h3 css={styles.infoTitle}>Physical</h3>
              <div css={styles.infoValue}>
                Height:{' '}
                {pokemon.height ? `${pokemon.height / 10} m` : 'Unknown'}
                <br />
                Weight:{' '}
                {pokemon.weight ? `${pokemon.weight / 10} kg` : 'Unknown'}
              </div>
            </div>

            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div css={styles.infoCard}>
                <h3 css={styles.infoTitle}>Abilities</h3>
                <div css={styles.infoValue}>
                  {pokemon.abilities.map((ability, index) => (
                    <div key={ability.ability.name}>
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                      {index < pokemon.abilities!.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {pokemon.stats && pokemon.stats.length > 0 && (
            <div css={styles.statsContainer}>
              <h3 css={styles.infoTitle}>Base Stats</h3>
              {pokemon.stats.map((stat) => (
                <div css={styles.statItem} key={stat.stat.name}>
                  <span css={styles.statName}>
                    {stat.stat.name.replace('-', ' ')}
                  </span>
                  <div css={styles.statBar}>
                    <div css={styles.statFill((stat.base_stat / 255) * 100)} />
                  </div>
                  <span css={styles.statValue}>{stat.base_stat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: css(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: theme.spacing.lg,
  })),
  modalContent: css(({ theme }) => ({
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  })),
  closeButton: css(({ theme }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: theme.spacing.md,
    right: theme.spacing.md,
    background: 'rgba(0, 0, 0, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '1.5rem',
    zIndex: 2,
    transition: theme.transitions.fast,
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.4)',
      transform: 'scale(1.1)',
    },
  })),
  closeIcon: css(() => ({
    width: '20px',
    height: '20px',
    filter: 'invert(1)',
  })),
  header: css(() => ({
    position: 'relative',
    height: '300px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  })),
  pokemonImage: css(() => ({
    width: '200px',
    height: '200px',
    objectFit: 'contain',
    zIndex: 1,
  })),
  favoriteButton: css(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    background: 'rgba(0, 0, 0, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    zIndex: 2,
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.4)',
      transform: 'scale(1.1)',
    },
  })),
  pokeballIcon: css(({ theme }) => ({
    width: '24px',
    height: '24px',
    transition: theme.transitions.fast,
    '&:hover': {
      transform: 'scale(1.1)',
    },
  })),
  content: css(({ theme }) => ({
    padding: theme.spacing.xl,
  })),
  pokemonName: css(({ theme }) => ({
    color: theme.colors.text,
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: `0 0 ${theme.spacing.sm} 0`,
    textTransform: 'capitalize',
    [mediaQueries.mobile]: {
      fontSize: '2rem',
    },
  })),
  pokemonId: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    fontSize: '1.2rem',
    fontWeight: 500,
  })),
  typesContainer: css(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing.sm,
    margin: `${theme.spacing.lg} 0`,
    flexWrap: 'wrap',
  })),
  typeBadge: (type: string) =>
    css(({ theme }) => ({
      background: getTypeColor(type),
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: 600,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      textTransform: 'uppercase',
    })),
  infoGrid: css(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.lg,
    margin: `${theme.spacing.xl} 0`,
  })),
  infoCard: css(({ theme }) => ({
    background: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  })),
  infoTitle: css(({ theme }) => ({
    color: theme.colors.text,
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: `0 0 ${theme.spacing.md} 0`,
  })),
  infoValue: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    fontSize: '1rem',
    lineHeight: 1.5,
  })),
  statsContainer: css(({ theme }) => ({
    marginTop: theme.spacing.xl,
  })),
  statItem: css(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  })),
  statName: css(({ theme }) => ({
    color: theme.colors.text,
    fontWeight: 500,
    width: '120px',
    textTransform: 'capitalize',
    [mediaQueries.mobile]: {
      width: '100px',
      fontSize: '0.9rem',
    },
  })),
  statBar: css(({ theme }) => ({
    flex: 1,
    height: '20px',
    background: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    margin: `0 ${theme.spacing.md}`,
  })),
  statFill: (percentage: number) =>
    css(({ theme }) => ({
      height: '100%',
      width: `${Math.min(percentage, 100)}%`,
      background: `linear-gradient(90deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%)`,
      transition: 'width 0.5s ease-in-out',
    })),
  statValue: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    fontWeight: 600,
    minWidth: '40px',
    textAlign: 'right',
  })),
};
