import { useState, useEffect, useRef } from 'react';
import { css } from 'styled-components';

import { useAuth, useFavorites } from '../../providers';
import {
  theme,
  parseBreakpoint,
  typographyStyles,
  mediaQueries,
} from '../../styles';
import type { AppPage } from '../../types';

interface HeaderProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (page: AppPage) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > parseBreakpoint(theme.breakpoints.tablet)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header ref={headerRef} css={styles.headerContainer}>
      <h1 css={styles.logo}>PokéFlix</h1>

      {/* Desktop Navigation */}
      <nav css={styles.desktopNav}>
        <button
          css={styles.navLink(currentPage === 'home')}
          onClick={() => handleNavClick('home')}
        >
          Home
        </button>

        <button
          css={styles.navLink(currentPage === 'favorites')}
          onClick={() => handleNavClick('favorites')}
        >
          My List
          {favorites.length > 0 && (
            <span css={styles.favoritesBadge}>{favorites.length}</span>
          )}
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button css={styles.mobileMenuButton} onClick={toggleMobileMenu}>
        <span css={styles.hamburgerLine}></span>
        <span css={styles.hamburgerLine}></span>
        <span css={styles.hamburgerLine}></span>
      </button>

      <div css={styles.userInfo}>
        <span>Welcome, {user?.username}</span>
        <button css={styles.signOutButton} onClick={logout}>
          Sign Out
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div css={styles.mobileDropdown}>
          <button
            css={styles.mobileNavLink(currentPage === 'home')}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>

          <button
            css={styles.mobileNavLink(currentPage === 'favorites')}
            onClick={() => handleNavClick('favorites')}
          >
            My List
            {favorites.length > 0 && (
              <span css={styles.mobileFavoritesBadge}>{favorites.length}</span>
            )}
          </button>

          <div css={styles.mobileUserSection}>
            <span css={styles.mobileUserName}>Welcome, {user?.username}</span>
            <button css={styles.mobileSignOutButton} onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  headerContainer: css(({ theme: t }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: t.layout.headerHeight,
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: t.blur.md,
    borderBottom: `1px solid ${t.colors.surface}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${t.spacing.xl}`,
    zIndex: 1000,
    [mediaQueries.tablet]: {
      padding: `0 ${t.spacing.lg}`,
    },
    [mediaQueries.mobile]: {
      padding: `0 ${t.spacing.md}`,
    },
  })),
  logo: css(({ theme: t }) => ({
    color: t.colors.primary,
    margin: 0,
    [mediaQueries.mobile]: {
      fontSize: typographyStyles.h3.fontSize,
    },
  })),
  desktopNav: css(({ theme: t }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.lg,
    [mediaQueries.tablet]: {
      display: 'none',
    },
  })),
  navLink: (isActive: boolean) =>
    css(({ theme }) => ({
      color: isActive ? theme.colors.primary : theme.colors.text,
      background: 'none',
      border: 'none',
      ...typographyStyles.body,
      fontWeight: 500,
      cursor: 'pointer',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      transition: theme.transitions.fast,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      '&:hover': {
        background: theme.colors.surface,
        color: theme.colors.primary,
      },
      [mediaQueries.mobile]: {
        fontSize: typographyStyles.bodySmall.fontSize,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      },
    })),
  favoritesBadge: css(({ theme }) => ({
    background: theme.colors.primary,
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginLeft: theme.spacing.xs,
  })),
  userInfo: css(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    [mediaQueries.tablet]: {
      display: 'none',
    },
  })),
  signOutButton: css(({ theme }) => ({
    background: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    '&:hover': {
      background: theme.colors.primary,
      color: 'white',
      transform: 'translateY(-1px)',
    },
  })),
  mobileMenuButton: css({
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '30px',
    height: '30px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    [mediaQueries.tablet]: {
      display: 'flex',
    },
  }),
  hamburgerLine: css(({ theme }) => ({
    width: '100%',
    height: '3px',
    background: theme.colors.text,
    borderRadius: '3px',
    transition: theme.transitions.fast,
  })),
  mobileDropdown: css(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: theme.colors.surface,
    borderTop: `1px solid ${theme.colors.background}`,
    boxShadow: theme.shadows.lg,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.md,
  })),
  mobileNavLink: (isActive: boolean) =>
    css(({ theme }) => ({
      color: isActive ? theme.colors.primary : theme.colors.text,
      background: 'none',
      border: 'none',
      ...typographyStyles.bodyLarge,
      fontWeight: 500,
      cursor: 'pointer',
      padding: theme.spacing.md,
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: theme.borderRadius.md,
      transition: theme.transitions.fast,
      '&:hover': {
        background: theme.colors.background,
      },
    })),
  mobileFavoritesBadge: css(({ theme }) => ({
    background: theme.colors.primary,
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  })),
  mobileUserSection: css(({ theme }) => ({
    borderTop: `1px solid ${theme.colors.background}`,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  })),
  mobileUserName: css(({ theme }) => ({
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
    padding: theme.spacing.sm,
  })),
  mobileSignOutButton: css(({ theme }) => ({
    background: theme.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    '&:hover': {
      background: '#c40812',
    },
  })),
};
