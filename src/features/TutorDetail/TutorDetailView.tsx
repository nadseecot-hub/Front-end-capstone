import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTutorDetailViewModel } from './useTutorDetailViewModel';
import { Tutor } from '../../services/tutorService';
import './TutorDetailView.css';

/* -------------------------------------------------------------------------- */
/*  Inline icons (no library)                                                  */
/* -------------------------------------------------------------------------- */

const StarIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    className="tutor-detail__star"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2.5l2.95 6.0 6.6.95-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.1 1.13-6.58L2.45 9.45l6.6-.95L12 2.5z" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const MailIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const BookIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
    <path d="M4 17a3 3 0 0 1 3-3h11" />
  </svg>
);

const ProfileIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Mock data derived from the tutor (kept inside the view so it doesn't      */
/*  touch the Tutor type, the service, or the model — no new logic).          */
/* -------------------------------------------------------------------------- */

const deriveReviewCount = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return 20 + (Math.abs(hash) % 501);
};

const deriveEducation = (subject: string): string => {
  // Stable, subject-flavored placeholder. Replace with a real field later.
  return `M.S. in ${subject}, B.S. in ${subject}`;
};

const deriveContactEmail = (name: string, id: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
  return `${slug || 'tutor'}.${id}@tutorfinder.example`;
};

const deriveSampleReviews = (id: string, rating: number) => {
  const pool = [
    'Explained concepts clearly and patiently.',
    'My confidence in this subject has really improved.',
    'Helpful, organized, and easy to follow.',
    'Great at breaking down difficult problems.',
    'Punctual, prepared, and genuinely invested in progress.',
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 17 + id.charCodeAt(i)) | 0;
  const stars = Math.max(3, Math.min(5, Math.round(rating)));
  return [0, 1, 2].map((offset) => {
    const text = pool[Math.abs(h + offset * 7) % pool.length];
    return { text, stars };
  });
};

const formatLevel = (level: Tutor['level']): string =>
  level.charAt(0).toUpperCase() + level.slice(1);

/* -------------------------------------------------------------------------- */
/*  Stars renderer                                                             */
/* -------------------------------------------------------------------------- */

const Stars: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 16,
}) => {
  const rounded = Math.round(value);
  return (
    <span className="tutor-detail__stars" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} size={size} />
      ))}
      <span className="tutor-detail__stars-overlay" style={{ width: `${(rounded / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} size={size} />
        ))}
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  View                                                                       */
/* -------------------------------------------------------------------------- */

const TutorDetailView: React.FC = () => {
  const { id: tutorId } = useParams<{ id: string }>();
  const id = tutorId ?? '';

  const { tutor, fitSummary, loading, error, saving, saveError, isSaved, handleSaveTutor } = useTutorDetailViewModel(
    id,
    'I need help improving my grades and understanding core concepts.'
  );

  const activeTutor = tutor;
  const activeFitSummary = fitSummary;
  const activeLoading = loading;
  const activeError = error;

  if (activeLoading) {
    return (
      <div className="tutor-detail tutor-detail--state">
        <p>Loading tutor details…</p>
      </div>
    );
  }

  if (!activeTutor) {
    return (
      <div className="tutor-detail tutor-detail--state">
        <h1>Tutor not found</h1>
        <p>We couldn't find a tutor with that id.</p>
        <Link to="/" className="tutor-detail__back-link">
          ← Back to search
        </Link>
      </div>
    );
  }

  const reviewCount = deriveReviewCount(activeTutor.id);
  const education = deriveEducation(activeTutor.subject);
  const contactEmail = deriveContactEmail(activeTutor.name, activeTutor.id);
  const sampleReviews = deriveSampleReviews(activeTutor.id, activeTutor.rating);

  return (
    <div className="tutor-detail">
      {/* ---------- Header: identity + price + CTA ---------- */}
      <header className="tutor-detail__header">
        <div className="tutor-detail__avatar" aria-hidden="true">
          <ProfileIcon />
        </div>

        <div className="tutor-detail__id">
          <h1 className="tutor-detail__name">{activeTutor.name}</h1>
          <p className="tutor-detail__subject">{activeTutor.subject}</p>

          <div className="tutor-detail__meta">
            <span className="tutor-detail__level">{formatLevel(activeTutor.level)}</span>
            <span className="tutor-detail__meta-dot" aria-hidden="true">·</span>
            <span className="tutor-detail__rating">
              <Stars value={activeTutor.rating} />
              <span className="tutor-detail__rating-value">{activeTutor.rating.toFixed(1)}</span>
              <span className="tutor-detail__rating-count">({reviewCount} reviews)</span>
            </span>
          </div>
        </div>

        <div className="tutor-detail__price-block">
          <div className="tutor-detail__price">
            ${activeTutor.price}
            <span className="tutor-detail__price-unit">/hr</span>
          </div>
          <button
            type="button"
            className="tutor-detail__cta"
            onClick={() => (window.location.href = `mailto:${contactEmail}`)}
          >
            Contact tutor
          </button>
          <button
            type="button"
            className="tutor-detail__cta tutor-detail__cta--secondary"
            onClick={handleSaveTutor}
            disabled={saving || isSaved}
            aria-label={isSaved ? `${activeTutor.name} is saved` : `Save ${activeTutor.name} to your saved tutors`}
          >
            {saving ? 'Saving…' : isSaved ? 'Saved ✓' : 'Save tutor'}
          </button>
          {saveError && (
            <p className="tutor-detail__error" role="alert">
              Couldn’t save tutor: {saveError}
            </p>
          )}
        </div>
      </header>

      {/* ---------- Two-column body ---------- */}
      <div className="tutor-detail__body">
        {/* Left: main content */}
        <div className="tutor-detail__main">
          {/* About */}
          <section className="tutor-detail__section">
            <h2 className="tutor-detail__section-title">About</h2>
            <p className="tutor-detail__bio">{activeTutor.bio}</p>
          </section>

          {/* Education */}
          <section className="tutor-detail__section">
            <h2 className="tutor-detail__section-title">Education</h2>
            <ul className="tutor-detail__list">
              <li className="tutor-detail__list-item">
                <span className="tutor-detail__list-icon"><BookIcon /></span>
                <span>{education}</span>
              </li>
            </ul>
          </section>

          {/* Reviews */}
          <section className="tutor-detail__section">
            <div className="tutor-detail__section-head">
              <h2 className="tutor-detail__section-title">Reviews</h2>
              <span className="tutor-detail__section-meta">
                {activeTutor.rating.toFixed(1)} · {reviewCount} reviews
              </span>
            </div>

            <div className="tutor-detail__rating-summary" aria-label="Rating breakdown">
              {[5, 4, 3, 2, 1].map((star) => {
                // Stable synthetic distribution; dominant bucket is the rounded rating.
                const dominant = Math.max(1, Math.round(activeTutor.rating));
                const pct =
                  star === dominant ? 72
                    : star === dominant - 1 || star === dominant + 1 ? 18
                    : star === 5 || star === 1 ? 4
                    : 6;
                return (
                  <div className="tutor-detail__rating-row" key={star}>
                    <span className="tutor-detail__rating-row-label">{star}</span>
                    <StarIcon size={12} />
                    <span
                      className="tutor-detail__rating-bar"
                      role="presentation"
                    >
                      <span
                        className="tutor-detail__rating-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="tutor-detail__rating-row-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>

            <ul className="tutor-detail__reviews">
              {sampleReviews.map((r, i) => (
                <li className="tutor-detail__review" key={i}>
                  <div className="tutor-detail__review-head">
                    <Stars value={r.stars} size={14} />
                    <span className="tutor-detail__review-meta">Verified student</span>
                  </div>
                  <p className="tutor-detail__review-text">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right: sidebar */}
        <aside className="tutor-detail__sidebar">
          {/* Availability */}
          <section className="tutor-detail__panel">
            <h3 className="tutor-detail__panel-title">
              <span className="tutor-detail__panel-icon"><ClockIcon /></span>
              Availability
            </h3>
            <p className="tutor-detail__availability">{activeTutor.availability}</p>
          </section>

          {/* Contact */}
          <section className="tutor-detail__panel">
            <h3 className="tutor-detail__panel-title">
              <span className="tutor-detail__panel-icon"><MailIcon /></span>
              Contact
            </h3>
            <p className="tutor-detail__contact-line">
              <span className="tutor-detail__contact-label">Email</span>
              <a
                className="tutor-detail__contact-value"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </a>
            </p>
            <p className="tutor-detail__contact-line">
              <span className="tutor-detail__contact-label">Rate</span>
              <span className="tutor-detail__contact-value">
                ${activeTutor.price}/hr
              </span>
            </p>
          </section>

          {/* Fit summary (AI) */}
          <section className="tutor-detail__panel tutor-detail__panel--accent">
            <h3 className="tutor-detail__panel-title">Why this tutor fits you</h3>
            {activeError ? (
              <p className="tutor-detail__error">
                Could not load fit summary: {activeError}
              </p>
            ) : (
              <p className="tutor-detail__fit">{activeFitSummary ?? 'Generating…'}</p>
            )}
          </section>
        </aside>
      </div>

      <Link to="/" className="tutor-detail__back-link">
        ← Back to search
      </Link>
    </div>
  );
};

export default TutorDetailView;
