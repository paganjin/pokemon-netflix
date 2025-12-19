import { css } from 'styled-components';

import { mediaQueries } from '../../styles';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div css={styles.layoutContainer}>
      <Header />
      <main css={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};

const styles = {
  layoutContainer: css(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: theme.colors.background,
  })),
  mainContent: css(({ theme }) => ({
    flex: 1,
    paddingTop: theme.layout.headerHeight,
    paddingBottom: theme.layout.footerHeight,
    [mediaQueries.tablet]: {
      paddingTop: theme.layout.headerHeightMobile,
      paddingBottom: theme.layout.footerHeightMobile,
    },
  })),
};
