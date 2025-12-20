import { Link } from 'react-router-dom';
import { css } from 'styled-components';

import { useAuth } from '../../providers';
import { Layout } from '../Layout';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  const content = (
    <div css={styles.container}>
      <h1 css={styles.title}>404</h1>
      <p css={styles.message}>
        Oops! The page you're looking for doesn't exist. Maybe this Pokémon
        escaped to another dimension?
      </p>
      <Link css={styles.homeLink} to={isAuthenticated ? '/' : '/login'}>
        {isAuthenticated ? 'Return to Home' : 'Go to Login'}
      </Link>
    </div>
  );

  // If user is authenticated, wrap in Layout. If not, show standalone.
  return isAuthenticated ? <Layout>{content}</Layout> : content;
};

export default NotFound;

const styles = {
  container: css(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: theme.spacing.xl,
  })),
  title: css(({ theme }) => ({
    fontSize: '4rem',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    margin: 0,
  })),
  message: css(({ theme }) => ({
    fontSize: '1.2rem',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    maxWidth: '500px',
    margin: `0 0 ${theme.spacing.xl} 0`,
  })),
  homeLink: css(({ theme }) => ({
    background: theme.colors.primary,
    color: theme.colors.background,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: theme.colors.primaryHover,
      transform: 'translateY(-2px)',
    },
  })),
};
