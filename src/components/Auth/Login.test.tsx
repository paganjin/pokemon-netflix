import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';

import { AuthProvider } from '../../providers';
import { theme } from '../../styles';

import { Login } from '.';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>{component}</AuthProvider>
    </ThemeProvider>,
  );
};

describe('Login Component', () => {
  it('renders login form with all elements', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('PokéFlix')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to access your pokémon collection/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('can toggle between sign in and sign up modes', () => {
    renderWithProviders(<Login />);

    const toggleButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(toggleButton);

    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(
      screen.getByText(/create an account to start your pokémon journey/i),
    ).toBeInTheDocument();
  });

  it('allows user input in form fields', () => {
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  it('handles form submission', async () => {
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    });

    // Check initial state
    expect(submitButton).not.toBeDisabled();

    // Submit form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // After submission, an error message should appear since no users exist
    expect(screen.getByText(/no accounts found/i)).toBeInTheDocument();
  });
});
