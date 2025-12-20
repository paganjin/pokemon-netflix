import { css } from 'styled-components';

import { mediaQueries } from '../../styles';

export const Footer = () => {
  return (
    <footer css={styles.footerContainer}>
      <div css={styles.footerContent}>
        <span> 2025 PokFlix</span>
        <span css={styles.bulletSeparator}>•</span>
        <a
          css={styles.footerLink}
          href="https://github.com/Gabb-c/pokenode-ts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by pokenode-ts
        </a>
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: css(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: theme.layout.footerHeight,
    background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
    backdropFilter: theme.blur.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.fixed,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    [mediaQueries.tablet]: {
      height: theme.layout.footerHeightMobile,
      fontSize: theme.typography.fontSize.sm,
    },
  })),
  footerContent: css(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    [mediaQueries.mobile]: {
      flexDirection: 'column',
      gap: theme.spacing.xs,
      textAlign: 'center',
    },
  })),
  footerLink: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    transition: theme.transitions.fast,
    '&:hover': {
      color: theme.colors.text,
    },
  })),
  bulletSeparator: css(() => ({
    [mediaQueries.mobile]: {
      display: 'none',
    },
  })),
};
