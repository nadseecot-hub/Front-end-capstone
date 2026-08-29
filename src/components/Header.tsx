"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import BecomeATutorModal from "./BecomeATutorModal";
import "./Header.css";

const NAV_LINKS = [{ href: "/find-tutors", label: "Find Tutors" }, { href: "/#why-choose-us", label: "How It Works" }, { href: "/#faq", label: "Resources" }];
const SUBJECTS = ["Mathematics", "Science", "Languages", "Test Prep"];
const BookIcon = () => <svg className="header__book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16M8 7h8M8 11h8" /></svg>;

export default function Header() {
  const pathname = usePathname(); const router = useRouter(); const { user, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); const [tutorModalOpen, setTutorModalOpen] = useState(false); const closeMenu = () => setMenuOpen(false);
  if (pathname.startsWith("/dashboard") || pathname === "/messages") return <header className="header header--dashboard"><div className="header__inner"><div className="header__logo" aria-label="TutorFinder dashboard"><BookIcon /><span>Tutor</span>Finder</div><button type="button" className="header__text-button" onClick={() => { void logout(); router.push("/"); }}>Log out</button></div></header>;
  return <header className="header"><div className="header__inner"><Link href="/" className="header__logo" onClick={closeMenu} aria-label="TutorFinder home"><BookIcon /><span>Tutor</span>Finder</Link><button type="button" className="header__menu-toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button><nav id="primary-navigation" className={`header__nav${menuOpen ? " header__nav--open" : ""}`} aria-label="Primary"><ul>{NAV_LINKS.slice(0, 1).map((link) => <li key={link.label}><Link href={link.href} className={pathname === link.href ? "active" : ""} onClick={closeMenu}>{link.label}</Link></li>)}<li><button type="button" className="header__nav-button" onClick={() => user && role === "tutor" ? router.push("/dashboard") : setTutorModalOpen(true)}>{user && role === "tutor" ? "Dashboard" : "Become a Tutor"}</button></li>{NAV_LINKS.slice(1).map((link) => <li key={link.label}><Link href={link.href} className={pathname === link.href ? "active" : ""} onClick={closeMenu}>{link.label}</Link></li>)}<li className="header__subjects"><button type="button" className="header__nav-button">Subjects <span aria-hidden="true">⌄</span></button><div className="header__subjects-menu">{SUBJECTS.map((subject) => <Link key={subject} href={`/search-tutors?subject=${encodeURIComponent(subject)}`} onClick={closeMenu}>{subject}</Link>)}</div></li></ul></nav><div className="header__account">{user ? <><span className="header__user-email">{user.email}</span><button type="button" className="header__text-button" onClick={() => { closeMenu(); void logout(); }}>Log out</button></> : <><Link href="/auth" className="header__login" onClick={closeMenu}>Log in</Link><Link href="/auth?mode=register" className="header__signup" onClick={closeMenu}>Sign up</Link></>}</div></div><BecomeATutorModal open={tutorModalOpen} onClose={() => setTutorModalOpen(false)} /></header>;
}
