import React from 'react';
import { useAuthViewModel } from './useAuthViewModel';
import './AuthView.css';

/**
 * Presentational View component for Authentication screen.
 */
export const AuthView: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel();

  const isLogin = mode === 'login';

  return (
    <div className="auth-view">
      <div className="auth-view__header">
        <h1 className="auth-view__heading">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="auth-view__subtext">
          {isLogin
            ? 'Sign in to save and manage your favorite tutors'
            : 'Sign up to start saving tutors to your personal dashboard'}
        </p>
      </div>

      {error && (
        <div className="auth-view__error" role="alert">
          {error}
        </div>
      )}

      <form className="auth-view__form" onSubmit={handleSubmit} noValidate>
        <div className="auth-view__field">
          <label className="auth-view__label" htmlFor="auth-email">
            Email Address
          </label>
          <input
            id="auth-email"
            className="auth-view__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="student@university.edu"
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-view__field">
          <label className="auth-view__label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="auth-view__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
        </div>

        <button
          className="auth-view__submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Processing...'
            : isLogin
            ? 'Sign In'
            : 'Create Account'}
        </button>
      </form>

      <div className="auth-view__footer">
        <button
          className="auth-view__toggle-btn"
          type="button"
          onClick={toggleMode}
          disabled={loading}
        >
          {isLogin
            ? "Don't have an account? Register here"
            : 'Already have an account? Sign in here'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;
