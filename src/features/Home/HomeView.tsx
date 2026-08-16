"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomeViewModel } from "./useHomeViewModel";
import {
  whyChooseUsPoints,
  testimonials,
  type WhyChooseUsIconId,
} from "./HomeModel";
import BecomeATutorModal from "../../components/BecomeATutorModal";
import "./HomeView.css";

/* ==========================================================================
   HomeView — marketing/landing page, six sections in order:
     1. Hero              (#hero)
     2. About Us          (#about-us)
     3. Why Choose Us     (#why-choose-us)
     4. Testimonials      (#testimonials)
     5. FAQ               (#faq)
     6. Contact Us        (#contact)
   ========================================================================== */

/* --- Inline SVG icons (no external icon library) ----------------------- */
const WhyIcon: React.FC<{ id: WhyChooseUsIconId }> = ({ id }) => {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: 28,
    height: 28,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (id) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="M5.6 5.6l2.1 2.1" />
          <path d="M16.3 16.3l2.1 2.1" />
          <path d="M5.6 18.4l2.1-2.1" />
          <path d="M16.3 7.7l2.1-2.1" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "globe":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.8 3 2.8 15 0 18" />
          <path d="M12 3c-2.8 3-2.8 15 0 18" />
        </svg>
      );
  }
};

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2.5l2.95 6.0 6.6.95-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.1 1.13-6.58L2.45 9.45l6.6-.95L12 2.5z" />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`faq__chevron${open ? " faq__chevron--open" : ""}`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const HomeView: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    submitting,
    success,
    error,
    handleContactSubmit,
    faqItems,
    openFaqIndex,
    toggleFaq,
  } = useHomeViewModel();

  const [tutorModalOpen, setTutorModalOpen] = React.useState(false);

  // Placeholder hero image — file will be added separately at /public/images/hero-tutor.jpg
  const heroImageSrc = "/images/hero-tutor.jpg";

  return (
    <div className="home-view">
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section id="hero" className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <div className="hero__content">
            <h1 id="hero-heading" className="hero__heading">
              The right tutor for every learner — at any age, any level.
            </h1>
            <p className="hero__subtext">
              TutorFinder connects students of all ages with vetted tutors who
              fit how they learn. Find yours in minutes, not weeks.
            </p>
            <div className="hero__ctas">
              <Link
                href="/search-tutors"
                className="hero__cta hero__cta--primary"
              >
                Search Tutors
              </Link>
              <button
                type="button"
                className="hero__cta hero__cta--outline"
                onClick={() => setTutorModalOpen(true)}
              >
                Become a Tutor
              </button>
            </div>
          </div>

          <div className="hero__media">
            <Image
              src={heroImageSrc}
              alt="A tutor working one-on-one with a student at a desk"
              width={640}
              height={480}
              priority
              className="hero__image"
            />
          </div>
        </div>

        {/* Subtle scroll cue at the bottom of the hero */}
        <a href="#about-us" className="hero__scroll-cue" aria-label="Scroll to learn more">
          <span className="hero__scroll-cue-arrow" aria-hidden="true" />
        </a>
      </section>

      {/* ============================================================
          2. ABOUT US
          ============================================================ */}
      <section
        id="about-us"
        className="about"
        aria-labelledby="about-heading"
      >
        <div className="about__inner">
          <h2 id="about-heading" className="about__heading">
            About TutorFinder
          </h2>
          <p className="about__body">
            TutorFinder is a marketplace for one-on-one learning. We connect
            students of any age — from first readers to adult learners picking
            up a new language — with vetted tutors who match the way they want
            to learn. Browse by subject, level, and price; book a single
            session or set a recurring rhythm; learn on your schedule.
          </p>
          <p className="about__stats" aria-label="Quick stats">
            {/* Placeholder numbers — replace when real metrics are available. */}
            <span>
              <strong>1,200+</strong> vetted tutors
            </span>
            <span aria-hidden="true" className="about__stats-dot">·</span>
            <span>
              <strong>40+</strong> subjects
            </span>
            <span aria-hidden="true" className="about__stats-dot">·</span>
            <span>
              <strong>Any age, any level</strong>
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================
          3. WHY CHOOSE US
          ============================================================ */}
      <section
        id="why-choose-us"
        className="why"
        aria-labelledby="why-heading"
      >
        <div className="why__inner">
          <h2 id="why-heading" className="why__heading">
            Why Choose Us
          </h2>
          <p className="why__intro">
            Four reasons families and adult learners keep coming back.
          </p>
          <ul className="why__grid">
            {whyChooseUsPoints.map((point) => (
              <li key={point.title} className="why__card">
                <span className="why__icon" aria-hidden="true">
                  <WhyIcon id={point.icon} />
                </span>
                <h3 className="why__card-title">{point.title}</h3>
                <p className="why__card-body">{point.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          4. TESTIMONIALS
          ============================================================ */}
      <section
        id="testimonials"
        className="testimonials"
        aria-labelledby="testimonials-heading"
      >
        <div className="testimonials__inner">
          <h2 id="testimonials-heading" className="testimonials__heading">
            What Learners Are Saying
          </h2>
          <ul className="testimonials__grid">
            {testimonials.map((t) => (
              <li key={t.name} className="testimonial">
                <span className="testimonial__quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="testimonial__quote">{t.quote}</blockquote>
                <div
                  className="testimonial__stars"
                  aria-label={`Rated ${t.rating} out of 5`}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} filled={i <= t.rating} />
                  ))}
                </div>
                <p className="testimonial__name">{t.name}</p>
                <p className="testimonial__role">{t.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          5. FAQ
          ============================================================ */}
      <section id="faq" className="faq" aria-labelledby="faq-heading">
        <div className="faq__inner">
          <h2 id="faq-heading" className="faq__heading">
            Frequently Asked Questions
          </h2>
          <ul className="faq__list">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <li key={item.question} className="faq__item">
                  <button
                    type="button"
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq__question-text">{item.question}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`faq__answer-wrap${isOpen ? " faq__answer-wrap--open" : ""}`}
                  >
                    <p className="faq__answer">{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============================================================
          6. CONTACT US
          ============================================================ */}
      <section
        id="contact"
        className="contact"
        aria-labelledby="contact-heading"
      >
        <div className="contact__inner">
          <div className="contact__form-col">
            <h2 id="contact-heading" className="contact__heading">
              Get in Touch
            </h2>
            <p className="contact__intro">
              Questions, feedback, or partnership ideas? Send us a note and
              we'll get back within two business days.
            </p>

            <form
              className="contact__form"
              onSubmit={handleContactSubmit}
              noValidate
            >
              <div className="contact__field">
                <label htmlFor="contact-name" className="contact__label">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="contact__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email" className="contact__label">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="contact__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message" className="contact__label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="contact__textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What can we help with?"
                  rows={5}
                  required
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="contact__submit"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>

              {success && (
                <p className="contact__success" role="status">
                  Thanks — your message is on its way.
                </p>
              )}
              {error && (
                <p className="contact__error" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <aside className="contact__info" aria-label="Contact information">
            <h3 className="contact__info-heading">Other ways to reach us</h3>
            <dl className="contact__info-list">
              <div className="contact__info-row">
                <dt>Email</dt>
                <dd>
                  {/* Placeholder — replace with the real support address. */}
                  <a href="mailto:hello@tutorfinder.example">
                    hello@tutorfinder.example
                  </a>
                </dd>
              </div>
              <div className="contact__info-row">
                <dt>Support hours</dt>
                <dd>
                  {/* Placeholder hours — replace with real schedule. */}
                  Monday – Friday, 9:00 – 18:00 (UTC)
                </dd>
              </div>
              <div className="contact__info-row">
                <dt>Based in</dt>
                <dd>
                  {/* Placeholder location — replace with the real HQ. */}
                  Remote, serving learners worldwide
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <BecomeATutorModal
        open={tutorModalOpen}
        onClose={() => setTutorModalOpen(false)}
      />
    </div>
  );
};

export default HomeView;
