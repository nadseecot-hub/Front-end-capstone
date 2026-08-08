"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const NAV_LINKS: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/", label: "Home", exact: true },
  { href: "/saved", label: "Saved Tutors" },
  { href: "/messages", label: "Messages" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/become-a-tutor", label: "Become a Tutor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/analytics", label: "Analytics" },
];

function isLinkActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__brand">
        <Link
          href="/"
          className="header__logo"
          aria-label="TutorFinder — go to home"
          onClick={closeMenu}
        >
          TutorFinder
        </Link>
      </div>

      <button
        type="button"
        className="header__menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="header__menu-bar" aria-hidden="true" />
        <span className="header__menu-bar" aria-hidden="true" />
        <span className="header__menu-bar" aria-hidden="true" />
      </button>

      <nav
        id="primary-navigation"
        className={`header__nav${menuOpen ? " header__nav--open" : ""}`}
        aria-label="Primary"
      >
        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label, exact }) => (
            <li key={href}>
              <Link
                href={href}
                className={isLinkActive(pathname, href, exact) ? "active" : ""}
                onClick={closeMenu}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header__account">
        {user ? (
          <div className="header__user-menu">
            <span className="header__user-email">{user.email}</span>
            <button
              type="button"
              className="header__logout-btn"
              onClick={() => {
                closeMenu();
                void logout();
              }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="header__account-icon"
            aria-label="Sign In or Register"
            title="Sign In / Register"
            onClick={closeMenu}
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
}
