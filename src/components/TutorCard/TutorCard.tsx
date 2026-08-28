import React from 'react';
import Link from 'next/link';
import { Tutor } from '../../services/tutorService';
import './TutorCard.css';

interface TutorCardProps {
  tutor: Tutor;
  /**
   * Called when the user clicks the Save button. If omitted, the button
   * is not rendered — the card stays purely presentational.
   */
  onSave?: (tutor: Tutor) => void;
  /** Disables the Save button (e.g. while a save is in flight). */
  saving?: boolean;
  /** Marks the tutor as already saved. */
  isSaved?: boolean;
}

/**
 * Deterministic mock review count.
 * The Tutor type does not include reviewsCount, so we derive a stable
 * number from the tutor id. Same tutor always shows the same number.
 * Replace with a real field when the model is extended.
 */
const deriveReviewCount = (id: string): number => {
  // Simple hash → 20..520 range
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return 20 + (Math.abs(hash) % 501);
};

const formatLevel = (level: Tutor['level']): string =>
  level.charAt(0).toUpperCase() + level.slice(1);

const StarIcon: React.FC = () => (
  <svg
    className="tutor-card__star"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2.5l2.95 6.0 6.6.95-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.1 1.13-6.58L2.45 9.45l6.6-.95L12 2.5z" />
  </svg>
);

/**
 * Profile silhouette icon — visual only, no gender signal.
 * The Tutor type does not include a gender field, so we render a
 * neutral user icon at the top-right of the card.
 */
const ProfileIcon: React.FC = () => (
  <svg
    className="tutor-card__profile-icon"
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

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onSave, saving, isSaved }) => {
  const reviewCount = deriveReviewCount(tutor.id);
  const ratingDisplay = tutor.rating.toFixed(1);

  return (
    <article className="tutor-card">
      {/* Top row: level pill (left) + rating + profile icon + save (right) */}
      <div className="tutor-card__top">
        <span className="tutor-card__level">{formatLevel(tutor.level)}</span>

        <div className="tutor-card__top-right">
          <span
            className="tutor-card__rating"
            aria-label={`Rating ${ratingDisplay} out of 5`}
          >
            <StarIcon />
            <span className="tutor-card__rating-value">{ratingDisplay}</span>
          </span>
          <span
            className="tutor-card__profile"
            aria-label="Tutor profile"
          >
            <ProfileIcon />
          </span>
          {onSave && (
            <button
              type="button"
              className={`tutor-card__save ${isSaved ? 'tutor-card__save--saved' : ''}`}
              onClick={() => !isSaved && !saving && onSave(tutor)}
              disabled={saving || isSaved}
              aria-label={
                isSaved
                  ? `${tutor.name} is saved`
                  : `Save ${tutor.name} to your saved tutors`
              }
            >
              <svg
                className="tutor-card__save-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span className="tutor-card__save-label">
                {saving ? 'Saving…' : isSaved ? 'Saved ✓' : 'Save'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Name + subject */}
      <h3 className="tutor-card__name">{tutor.name}</h3>
      <p className="tutor-card__subject">{tutor.subject}</p>

      {/* Bio with 3-line clamp */}
      <p className="tutor-card__bio">{tutor.bio}</p>

      {/* Bottom row: reserved spacer (left) + price (right) */}
      <div className="tutor-card__bottom">
        <span className="tutor-card__bottom-spacer" aria-hidden="true" />
        <span className="tutor-card__price">
          ${tutor.price}
          <span className="tutor-card__price-unit">/hr</span>
        </span>
      </div>

      {/* Reviews just above the View Profile button, left-aligned */}
      <p className="tutor-card__reviews">{reviewCount} reviews</p>

      <Link href={`/tutor/${tutor.id}`} className="tutor-card__cta">
        View Profile
      </Link>
    </article>
  );
};

export default TutorCard;
