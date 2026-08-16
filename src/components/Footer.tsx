"use client";

import Link from "next/link";

/* ==========================================================================
   Footer — site-wide, appears on every route below the page content.
   Mirrors the Header visually: ink background, parchment/white text.
   ========================================================================== */

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">
          <Link href="/" className="footer__logo-link" aria-label="TutorFinder — go to home">
            TutorFinder
          </Link>
        </div>

        <div className="footer__links">
          {/* Product column */}
          <div className="footer__column">
            <h3 className="footer__heading">Product</h3>
            <nav className="footer__nav">
              <Link href="/search-tutors" className="footer__link">
                Search Tutors
              </Link>
              <Link href="/become-a-tutor" className="footer__link">
                Become a Tutor
              </Link>
              <Link href="/leaderboard" className="footer__link">
                Leaderboard
              </Link>
            </nav>
          </div>

          {/* Company column */}
          <div className="footer__column">
            <h3 className="footer__heading">Company</h3>
            <nav className="footer__nav">
              <Link href="/" className="footer__link">
                About Us
              </Link>
              <Link href="/#faq" className="footer__link">
                FAQ
              </Link>
              <Link href="/#contact" className="footer__link">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} TutorFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}