"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ==========================================================================
   BecomeATutorModal — momentum-capture step, not the full application.
   Fields: name, email, subject(s). On submit, navigates to /become-a-tutor.

   Dismissible via:
     - close button (X)
     - click outside the modal panel (on the overlay)
     - Escape key
   ========================================================================== */

interface BecomeATutorModalProps {
  open: boolean;
  onClose: () => void;
}

const BecomeATutorModal: React.FC<BecomeATutorModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjects, setSubjects] = useState("");

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Escape key dismisses
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Stub: hand off to the full application route. Real persistence
    // would capture the partial interest and forward it as query params.
    onClose();
    router.push("/become-a-tutor");
  };

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="bat-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bat-modal-title"
      onClick={handleOverlayClick}
    >
      <div className="bat-modal">
        <button
          type="button"
          className="bat-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
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
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id="bat-modal-title" className="bat-modal__title">
          Become a Tutor
        </h2>
        <p className="bat-modal__intro">
          Tell us a little about you and we'll take you to the full application.
        </p>

        <form className="bat-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="bat-modal__field">
            <label htmlFor="bat-name" className="bat-modal__label">
              Name
            </label>
            <input
              id="bat-name"
              type="text"
              className="bat-modal__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="bat-modal__field">
            <label htmlFor="bat-email" className="bat-modal__label">
              Email
            </label>
            <input
              id="bat-email"
              type="email"
              className="bat-modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="bat-modal__field">
            <label htmlFor="bat-subjects" className="bat-modal__label">
              Subject(s)
            </label>
            <input
              id="bat-subjects"
              type="text"
              className="bat-modal__input"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g. Algebra, Spanish"
            />
          </div>

          <button type="submit" className="bat-modal__submit">
            Continue to Application
          </button>
        </form>
      </div>

      <style jsx>{`
        .bat-modal__overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background-color: rgba(22, 38, 61, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          box-sizing: border-box;
          animation: bat-fade 0.15s ease;
        }

        @keyframes bat-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .bat-modal {
          position: relative;
          width: 100%;
          max-width: 460px;
          max-height: calc(100vh - 2 * var(--space-md));
          overflow-y: auto;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: var(--space-xl);
          box-shadow: 0 24px 48px -16px rgba(22, 38, 61, 0.4);
          font-family: var(--font-body);
          color: var(--color-ink);
          box-sizing: border-box;
          animation: bat-pop 0.18s ease;
        }

        @keyframes bat-pop {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .bat-modal__close {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .bat-modal__close:hover,
        .bat-modal__close:focus-visible {
          color: var(--color-amber);
          border-color: var(--color-amber);
          outline: none;
        }

        .bat-modal__title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.5rem;
          line-height: 1.2;
          color: var(--color-ink);
          margin: 0 0 var(--space-xs);
        }

        .bat-modal__intro {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.55;
          color: var(--color-text-muted);
          margin: 0 0 var(--space-lg);
        }

        .bat-modal__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .bat-modal__field {
          display: flex;
          flex-direction: column;
        }

        .bat-modal__label {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-ink);
          margin-bottom: var(--space-xs);
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }

        .bat-modal__input {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-ink);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-input);
          padding: var(--space-sm) var(--space-md);
          height: 44px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .bat-modal__input::placeholder {
          color: var(--color-text-muted);
          opacity: 0.8;
        }

        .bat-modal__input:hover {
          border-color: var(--color-teal);
        }

        .bat-modal__input:focus-visible {
          outline: 2px solid var(--color-amber);
          outline-offset: 2px;
          border-color: var(--color-amber);
        }

        .bat-modal__submit {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
          background-color: var(--color-amber);
          border: 1px solid var(--color-amber);
          border-radius: var(--radius-input);
          padding: 0 var(--space-lg);
          height: 48px;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease,
            transform 0.05s ease;
        }

        .bat-modal__submit:hover {
          background-color: var(--color-amber-dark);
          border-color: var(--color-amber-dark);
        }

        .bat-modal__submit:focus-visible {
          outline: 2px solid var(--color-amber-dark);
          outline-offset: 2px;
        }

        .bat-modal__submit:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
};

export default BecomeATutorModal;
