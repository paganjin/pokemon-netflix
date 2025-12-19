import { createGlobalStyle } from 'styled-components';

import { typographyStyles, mediaQueries } from './theme';

export const GlobalStyles = createGlobalStyle(({ theme }) => ({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  'html, body': {
    height: '100%',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    overflowX: 'hidden',
  },

  '#root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  body: {
    ...typographyStyles.body,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  button: {
    fontFamily: 'inherit',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    outline: 'none',
    transition: theme.transitions.fast,
  },

  input: {
    fontFamily: 'inherit',
    outline: 'none',
    border: 'none',
  },

  a: {
    textDecoration: 'none',
    color: 'inherit',
    ':hover': {
      color: theme.colors.primary,
      transition: theme.transitions.fast,
    },
  },

  img: {
    maxWidth: '100%',
    height: 'auto',
  },

  h1: typographyStyles.h1,
  h2: typographyStyles.h2,
  h3: typographyStyles.h3,
  h4: typographyStyles.h4,

  '::-webkit-scrollbar': {
    width: theme.borderRadius.sm,
  },

  '::-webkit-scrollbar-track': {
    background: theme.colors.secondary,
  },

  '::-webkit-scrollbar-thumb': {
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },

  '::-webkit-scrollbar-thumb:hover': {
    background: theme.colors.textSecondary,
  },

  [mediaQueries.mobile]: {
    html: {
      fontSize: typographyStyles.bodySmall.fontSize,
    },
  },
}));
