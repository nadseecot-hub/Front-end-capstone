import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      {/* Column 1: brand / logo */}
      <div className="header__brand">
        <Link to="/" className="header__logo" aria-label="TutorFinder — go to home">
          TutorFinder
        </Link>
      </div>

      {/* Column 2: primary navigation (centers regardless of brand/icon width) */}
      <nav className="header__nav" aria-label="Primary">
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/saved-tutors"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Saved Tutors
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Column 3: account icon & auth controls */}
      <div className="header__account">
        {user ? (
          <div className="header__user-menu">
            <span className="header__user-email">{user.email}</span>
            <button
              type="button"
              className="header__logout-btn"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="header__account-icon"
            aria-label="Sign In or Register"
            title="Sign In / Register"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3.5" />
              <path d="M5.5 19.5c1.2-2.6 3.7-4 6.5-4s5.3 1.4 6.5 4" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
