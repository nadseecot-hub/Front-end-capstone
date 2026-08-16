"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import BecomeATutorModal from "./BecomeATutorModal";
import "./Header.css";

const NAV_LINKS: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/", label: "Home", exact: true },
  { href: "/search-tutors", label: "Search Tutors", exact: true },
  { href: "/#about-us", label: "About Us", exact: false },
  { href: "/#faq", label: "FAQs", exact: false },
  { href: "/#contact", label: "Contact", exact: false },
];

function isLinkActive(pathname: string, href: string, exact?: boolean): boolean {
  // For anchor links (/#section), we never consider them active in the traditional sense
  if (href.startsWith("/#")) {
    return false;
  }
  
  if (exact) {
    return pathname === href;
  }
  
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tutorModalOpen, setTutorModalOpen] = useState(false);

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
          {/* Public nav links (centered) */}
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
        {/* Become a Tutor button (right side, next to account icon) */}
        <button
          type="button"
          className="header__become-tutor-btn"
          onClick={() => setTutorModalOpen(true)}
          aria-label="Become a Tutor"
        >
          Become a Tutor
        </button>

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

      <BecomeATutorModal
        open={tutorModalOpen}
        onClose={() => setTutorModalOpen(false)}
      />
    </header>
  );
}
