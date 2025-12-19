import { rem } from 'polished';

export const theme = {
  colors: {
    primary: '#e50914',
    primaryHover: '#b8070f',
    secondary: '#221f1f',
    background: '#141414',
    surface: '#2f2f2f',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    accent: '#46d369',
    warning: '#f5c518',
    error: '#e50914',
    border: '#404040',
    // Pokemon type colors
    pokemonTypes: {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      default: '#68A090',
    },
  },
  breakpoints: {
    mobile: rem(480),
    tablet: rem(768),
    desktop: rem(1024),
    large: rem(1200),
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 2px 4px #1a1a1a',
    md: '0 4px 8px #333333',
    lg: '0 8px 16px #4d4d4d',
    xl: '0 16px 32px #666666',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  blur: {
    sm: 'blur(5px)',
    md: 'blur(10px)',
    lg: 'blur(20px)',
  },
  typography: {
    fontSize: {
      xs: rem(12),
      sm: rem(14),
      base: rem(16),
      lg: rem(18),
      xl: rem(20),
      '2xl': rem(24),
      '3xl': rem(30),
      '4xl': rem(36),
      '5xl': rem(48),
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  layout: {
    headerHeight: rem(70),
    footerHeight: rem(50),
    headerHeightMobile: rem(60),
    footerHeightMobile: rem(40),
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export type Theme = typeof theme;

// Utility function to parse breakpoint values for JavaScript usage
export const parseBreakpoint = (breakpoint: string): number => {
  return parseInt(breakpoint.replace('px', ''), 10);
};

// Media query utilities for consistent breakpoint usage
export const mediaQueries = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (max-width: ${theme.breakpoints.desktop})`,
  large: `@media (max-width: ${theme.breakpoints.large})`,
};

// Pokemon type color utility
export const getTypeColor = (type: string): string => {
  return (
    theme.colors.pokemonTypes[type as keyof typeof theme.colors.pokemonTypes] ||
    theme.colors.pokemonTypes.default
  );
};

// Reusable component styles
export const componentStyles = {
  button: {
    base: {
      fontFamily: 'inherit',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      transition: theme.transitions.fast,
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.fontSize.base,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      '&:hover:not(:disabled)': {
        backgroundColor: theme.colors.primaryHover,
        transform: 'translateY(-2px)',
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      '&:hover': {
        backgroundColor: theme.colors.border,
      },
    },
  },
  input: {
    base: {
      fontFamily: 'inherit',
      outline: 'none',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      transition: theme.transitions.fast,
      '&:focus': {
        borderColor: theme.colors.primary,
      },
    },
  },
  card: {
    base: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.md,
      overflow: 'hidden',
    },
    interactive: {
      cursor: 'pointer',
      transition: theme.transitions.normal,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows.lg,
      },
    },
  },
};

// Reusable typography styles
export const typographyStyles = {
  h1: {
    fontSize: rem(36),
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.lg,
  },
  h2: {
    fontSize: rem(30),
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.md,
  },
  h3: {
    fontSize: rem(24),
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.md,
  },
  h4: {
    fontSize: rem(20),
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontSize: rem(16),
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.normal,
  },
  bodyLarge: {
    fontSize: rem(18),
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  bodySmall: {
    fontSize: rem(14),
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.normal,
  },
  caption: {
    fontSize: rem(12),
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.normal,
  },
};
