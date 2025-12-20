import type { Pokemon } from 'pokenode-ts';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import {
  Layout,
  Login,
  PokemonGrid,
  FavoritesGrid,
  PokemonModal,
  NotFound,
} from './components';
import {
  AuthProvider,
  useAuth,
  FavoritesProvider,
  QueryProvider,
} from './providers';
import { GlobalStyles, theme } from './styles';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <BrowserRouter
      basename={
        process.env.NODE_ENV === 'production' ? '/pokemon-netflix' : '/'
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <PokemonGrid onPokemonClick={handlePokemonClick} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Layout>
                <FavoritesGrid onPokemonClick={handlePokemonClick} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      )}
    </BrowserRouter>
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
