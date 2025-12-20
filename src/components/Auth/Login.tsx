import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-components';

import { useAuth } from '../../providers';
import { typographyStyles, componentStyles } from '../../styles';

interface FormData {
  username: string;
  password: string;
}

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(data.username, data.password);
        if (result.success) {
          setSuccess(result.message);
          setIsSignUp(false);
          reset();
        } else {
          setError(result.message);
        }
      } else {
        const result = await login(data.username, data.password);
        if (!result.success) {
          setError(result.message);
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    reset();
  };

  return (
    <div css={styles.loginContainer}>
      <div css={styles.loginCard}>
        <h1 css={styles.logo}>PokéFlix</h1>
        <form css={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div css={styles.inputGroup}>
            <label css={styles.label} htmlFor="username">
              Username
            </label>
            <input
              css={[styles.input, errors.username && styles.inputError]}
              id="username"
              type="text"
              placeholder="Enter your username"
              disabled={isLoading}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be less than 20 characters',
                },
              })}
            />
            {errors.username && (
              <span css={styles.fieldError}>{errors.username.message}</span>
            )}
          </div>

          <div css={styles.inputGroup}>
            <label css={styles.label} htmlFor="password">
              Password
            </label>
            <input
              css={[styles.input, errors.password && styles.inputError]}
              id="password"
              type="password"
              placeholder="Enter your password"
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <span css={styles.fieldError}>{errors.password.message}</span>
            )}
          </div>

          <button
            css={styles.button(isLoading)}
            type="submit"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) {
                return isSignUp ? 'Creating Account...' : 'Signing In...';
              }
              return isSignUp ? 'Sign Up' : 'Sign In';
            })()}
          </button>

          {error && <div css={styles.errorMessage}>{error}</div>}
          {success && <div css={styles.successMessage}>{success}</div>}
        </form>

        <div css={styles.toggleSection}>
          <p css={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button css={styles.toggleButton} onClick={toggleMode} type="button">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <p css={styles.helpText}>
          {isSignUp
            ? 'Create an account to start your Pokémon journey!'
            : 'Sign in to access your Pokémon collection.'}
        </p>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: css(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #141414 0%, #2f2f2f 100%)',
    padding: theme.spacing.xl,
  })),
  loginCard: css(({ theme }) => ({
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: theme.blur.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    width: '100%',
    maxWidth: '400px',
    boxShadow: theme.shadows.xl,
  })),
  logo: css(({ theme }) => ({
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  })),
  form: css(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  })),
  inputGroup: css(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  })),
  label: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.text,
    fontWeight: 500,
  })),
  input: css(({ theme }) => ({
    ...componentStyles.input.base,
    background: theme.colors.surface,
    border: '2px solid transparent',
    '&::placeholder': {
      color: theme.colors.textSecondary,
    },
  })),
  inputError: css(({ theme }) => ({
    border: `2px solid ${theme.colors.error}`,
    '&:focus': {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`,
    },
  })),
  fieldError: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontSize: '0.875rem',
  })),
  button: (isLoading: boolean) =>
    css(({ theme }) => ({
      ...componentStyles.button.base,
      background: isLoading ? theme.colors.surface : theme.colors.primary,
      color: isLoading ? theme.colors.textSecondary : 'white',
      fontWeight: 600,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      '&:hover': {
        background: isLoading
          ? theme.colors.surface
          : theme.colors.primaryHover,
      },
    })),
  errorMessage: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  })),
  helpText: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  })),
  successMessage: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.accent,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    background: 'rgba(70, 211, 105, 0.1)',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.accent}`,
  })),
  toggleSection: css(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.surface}`,
  })),
  toggleText: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    color: theme.colors.textSecondary,
    margin: 0,
  })),
  toggleButton: css(({ theme }) => ({
    ...typographyStyles.bodySmall,
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: theme.transitions.fast,
    '&:hover': {
      color: theme.colors.primaryHover,
    },
  })),
};
