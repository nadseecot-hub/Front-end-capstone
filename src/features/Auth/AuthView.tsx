import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthViewModel, type UserRole } from './useAuthViewModel';
import './AuthView.css';

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
    <path d="M4 5.5v16M8 7h8M8 11h8" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const AuthView: React.FC<{ initialMode?: "login" | "register" | null }> = ({ initialMode }) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    mode,
    role,
    loading,
    error,
    handleSubmit,
    toggleMode,
    setRole,
  } = useAuthViewModel(initialMode);

  const isLogin = mode === 'login';
  const isTutor = role === 'tutor';

  const nameLabel = isTutor ? 'Tutor Name' : 'Your Name';
  const headingText = isLogin
    ? isTutor ? 'Tutor Login' : 'Parent / Student Login'
    : 'Create your Tutor Finder account';
  const eyebrowText = isLogin ? 'WELCOME BACK' : 'GET STARTED';
  const subtext = isLogin
    ? 'Sign in to continue your learning journey.'
    : 'Find the right tutor and make learning more personal.';

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__form-wrapper">
          <p className="auth-page__eyebrow">{eyebrowText}</p>
          <h1 className="auth-page__heading">{headingText}</h1>
          <p className="auth-page__subtext">{subtext}</p>

          {isLogin && (
            <div className="auth-page__role-switch" role="tablist" aria-label="Select user type">
              <button
                type="button"
                role="tab"
                aria-selected={isTutor}
                className={`auth-page__role-tab ${isTutor ? 'auth-page__role-tab--active' : ''}`}
                onClick={() => setRole('tutor')}
              >
                Tutor
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isTutor}
                className={`auth-page__role-tab ${!isTutor ? 'auth-page__role-tab--active' : ''}`}
                onClick={() => setRole('parent-student')}
              >
                Parent / Student
              </button>
            </div>
          )}

          {error && (
            <div className="auth-page__error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="auth-name">
                {nameLabel}
              </label>
              <input
                id="auth-name"
                className="auth-page__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder={isTutor ? "Your tutor name" : "Your full name"}
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="auth-email">
                Email Address
              </label>
              <input
                id="auth-email"
                className="auth-page__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="auth-password">
                Password
              </label>
              <div className="auth-page__input-wrap">
                <input
                  id="auth-password"
                  className="auth-page__input auth-page__input--with-toggle"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="auth-page__password-toggle"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="auth-page__field">
                <label className="auth-page__label" htmlFor="auth-confirm-password">
                  Confirm Password
                </label>
                <div className="auth-page__input-wrap">
                  <input
                    id="auth-confirm-password"
                    className="auth-page__input auth-page__input--with-toggle"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-page__password-toggle"
                    onClick={toggleShowConfirmPassword}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            <button className="auth-page__submit" type="submit" disabled={loading}>
              {loading ? 'Processing…' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRightIcon />}
            </button>

            {isLogin && (
              <Link href="/" className="auth-page__forgot">
                Forgot password?
              </Link>
            )}
          </form>

          <div className="auth-page__footer">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={toggleMode} className="auth-page__link">
                  Create an account
                </button>
              </p>
            ) : (
              <>
                <p>
                  Already have an account?{' '}
                  <button type="button" onClick={toggleMode} className="auth-page__link">
                    Sign in
                  </button>
                </p>
                <p className="auth-page__tutor-link">
                  Are you a tutor?{' '}
                  <Link href="/become-a-tutor" className="auth-page__link">
                    Register as a tutor
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-page__illustration">
          <Image
            src="/images/auth-illustration.avif"
            alt="Effective communication and learning"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

      </div>
    </div>
  );
};

export default AuthView;
