import type { Pokemon } from 'pokenode-ts';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import {
  Layout,
  Login,
  PokemonGrid,
  FavoritesGrid,
  PokemonModal,
} from './components';
import {
  AuthProvider,
  useAuth,
  FavoritesProvider,
  QueryProvider,
} from './providers';
import { GlobalStyles, theme } from './styles';
import type { AppPage } from './types';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout onNavigate={handleNavigate} currentPage={currentPage}>
      {currentPage === 'home' ? (
        <PokemonGrid onPokemonClick={handlePokemonClick} />
      ) : (
        <FavoritesGrid onPokemonClick={handlePokemonClick} />
      )}

      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      )}
    </Layout>
  );
};

const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
