"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTutorRegistrationViewModel } from "@/features/Auth/useTutorRegistrationViewModel";
import Link from "next/link";

const ProgressStep = ({ 
  label, 
  isActive, 
  isCompleted 
}: {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}) => {
  return (
    <div className="progress-step">
      <div className={`progress-step__circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
        {isCompleted ? '✓' : isActive ? /* active dot */ '' : /* empty */ ''}
      </div>
      <div className="progress-step__label">{label}</div>
    </div>
  );
};

const ProgressBar = ({ 
  currentStep, 
  steps 
}: {
  currentStep: string;
  steps: Array<{ label: string; value: string }>;
}) => {
  const stepIndex = steps.findIndex(step => step.value === currentStep);
  const currentIndex = stepIndex === -1 ? steps.length - 1 : stepIndex;
  const progress = (currentIndex / (steps.length - 1)) * 100;
  return (
    <div className="progress-bar">
      <div className="progress-bar__container">
        <div className="progress-bar__track" aria-hidden="true">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
        {steps.map((step, index) => (
          <React.Fragment key={step.value}>
            <ProgressStep 
              label={step.label} 
              isActive={index === currentIndex} 
              isCompleted={index < currentIndex} 
            />
            {index < steps.length - 1 && (
              <div className={`progress-bar__connector ${index < currentIndex ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="progress-bar__label">
        Step {currentIndex + 1} of {steps.length}
      </div>
    </div>
  );
};

const BecomeATutorModal: React.FC<{ 
  open: boolean; 
  onClose: () => void; 
}> = ({ open, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    // Form data
    formData,
    setName,
    setEmail,
    setSubjects,
    setPassword,
    setConfirmPassword,
    setBio,
    setEducation,
    // Step management
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    // Validation
    loading,
    error,
    handleSubmit,
    canProceed,
    // Processing
    processingMessages,
    currentProcessingMessageIndex,
    // Completion
    isComplete,
    reset,
  } = useTutorRegistrationViewModel();

  // Redirect to dashboard if already authenticated as tutor
  useEffect(() => {
    if (user && open) {
      // Check if user is a tutor (you might want to implement a proper role check)
      // For now, we'll just close the modal
      onClose();
    }
  }, [user, open, onClose]);

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

  const legacyBatModalStyles = `
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

    .bat-modal__outline {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 1rem;
      color: var(--color-text-muted);
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      padding: 0 var(--space-lg);
      height: 48px;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .bat-modal__outline:hover {
      color: var(--color-ink);
      border-color: var(--color-primary);
    }

    /* Progress bar styling */
    .progress-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: var(--space-lg);
      width: 100%;
    }

    .progress-bar__container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 400px;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .progress-step__circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      font-size: 8px;
      font-weight: bold;
    }

    .progress-step__circle.active {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-background);
    }

    .progress-step__circle.completed {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-background);
    }

    .progress-step__label {
      font-family: var(--font-body);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-align: center;
    }

    .progress-bar__connector {
      flex: 1;
      height: 2px;
      background-color: var(--color-border);
      margin: 0 4px;
    }

    .progress-bar__connector.completed {
      background-color: var(--color-primary);
    }

    .progress-bar__label {
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-top: 4px;
    }

    /* Step-specific styling */
    .bat-modal__step {
      margin-bottom: var(--space-lg);
    }

    .bat-modal__step-intro {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__step-heading {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--color-ink);
      margin-bottom: var(--space-sm);
    }

    .bat-modal__step-subtext {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .bat-modal__field-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__review-section {
      display: grid;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__review-item {
      display: flex;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .bat-modal__review-label {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }

    .bat-modal__review-value {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-ink);
      font-weight: 500;
    }

    .bat-modal__form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }

    .bat-modal__processing {
      text-align: center;
      padding: var(--space-lg);
    }

    .bat-modal__processing-message {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--color-ink);
      margin-bottom: var(--space-md);
    }

    .bat-modal__spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--space-md);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .bat-modal__complete {
      text-align: center;
      padding: var(--space-lg);
    }

    .bat-modal__checkmark {
      font-size: 3rem;
      color: var(--color-primary);
      margin-bottom: var(--space-md);
    }

    .bat-modal__complete-title {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--color-ink);
      margin-bottom: var(--space-sm);
    }

    .bat-modal__complete-subtext {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-lg);
    }
  `;

  if (!open) return null;

  // Define steps
  const steps = [
    { label: "Basic Information", value: "info" },
    { label: "Secure Account", value: "password" },
    { label: "Bio & Education", value: "bio-education" },
    { label: "Review", value: "review" },
  ];

  return (
    <>
      <style>{batModalStyles}</style>
    <div
      className="bat-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bat-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep} 
          steps={steps} 
        />

        <h2 id="bat-modal-title" className="bat-modal__title">
          Become a Tutor
        </h2>

        {isComplete ? (
          <div className="bat-modal__complete">
            <div className="bat-modal__checkmark">✓</div>
            <h3 className="bat-modal__complete-title">Congratulations — you’re ready to tutor!</h3>
            <p className="bat-modal__complete-subtext">
              Welcome to TutorFinder! You can now start offering sessions to learners.
            </p>
            <button 
              type="button" 
              className="bat-modal__submit"
              onClick={() => {
                onClose();
                router.push("/dashboard"); // Navigate to tutor dashboard
              }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : currentStep === "processing" ? (
          <div className="bat-modal__processing">
            <p className="bat-modal__processing-message">
              {processingMessages[currentProcessingMessageIndex]}
            </p>
            {/* Optional: Add a subtle spinner */}
            <div className="bat-modal__spinner"></div>
          </div>
        ) : (
          <form className="bat-modal__form" onSubmit={handleSubmit} noValidate>
            {currentStep === "info" && (
              <div className="bat-modal__step">
                <p className="bat-modal__step-intro">
                  Tell us a little about you and we'll take you through the application.
                </p>
                
                <div className="bat-modal__field">
                  <label htmlFor="bat-name" className="bat-modal__label">
                    Name
                  </label>
                  <input
                    id="bat-name"
                    type="text"
                    className="bat-modal__input"
                    value={formData.name}
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
                    value={formData.email}
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
                    value={formData.subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    placeholder="e.g. Algebra, Spanish"
                  />
                </div>

                <button 
                  type="button" 
                  className="bat-modal__submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (canProceed) nextStep();
                  }}
                  disabled={!canProceed}
                >
                  Continue
                </button>
              </div>
            )}
            
            {currentStep === "password" && (
              <div className="bat-modal__step">
                <h3 className="bat-modal__step-heading">Secure your account</h3>
                <p className="bat-modal__step-subtext">
                  Choose a password to protect your tutor account.
                </p>
                
                <div className="bat-modal__field">
                  <label htmlFor="bat-password" className="bat-modal__label">
                    Password
                  </label>
                  <input
                    id="bat-password"
                    type="password"
                    className="bat-modal__input"
                    value={formData.password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div className="bat-modal__field">
                  <label htmlFor="bat-confirm-password" className="bat-modal__label">
                    Confirm Password
                  </label>
                  <input
                    id="bat-confirm-password"
                    type="password"
                    className="bat-modal__input"
                     value={formData.confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div className="bat-modal__form-actions">
                  <button 
                    type="button" 
                    className="bat-modal__back"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    className="bat-modal__submit"
onClick={(e) => {
                       e.preventDefault();
                       if (canProceed) nextStep();
                     }}
disabled={!canProceed}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === "bio-education" && (
              <div className="bat-modal__step">
                <h3 className="bat-modal__step-heading">Tell us about yourself</h3>
                <p className="bat-modal__step-subtext">
                  Share your background (optional but recommended).
                </p>
                
                <div className="bat-modal__field">
                  <label htmlFor="bat-bio" className="bat-modal__label">
                    Bio
                  </label>
                  <textarea
                    id="bat-bio"
                    className="bat-modal__input bat-modal__textarea"
                    value={formData.bio || ""}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Share a bit about your teaching experience, approach, or what makes you unique as a tutor..."
                    rows={4}
                  />
                </div>

                <div className="bat-modal__field-group">
                  <div className="bat-modal__field">
                    <label htmlFor="bat-institution" className="bat-modal__label">
                      Institution
                    </label>
                    <input
                      id="bat-institution"
                      type="text"
                      className="bat-modal__input"
                      placeholder="University, College, or Training Program"
                    />
                  </div>
                  <div className="bat-modal__field">
                    <label htmlFor="bat-degree" className="bat-modal__label">
                      Degree/Qualification
                    </label>
                    <input
                      id="bat-degree"
                      type="text"
                      className="bat-modal__input"
                      placeholder="e.g. B.S. Mathematics, TEFL Certification"
                    />
                  </div>
                  <div className="bat-modal__field">
                    <label htmlFor="bat-fieldOfStudy" className="bat-modal__label">
                      Field of Study
                    </label>
                    <input
                      id="bat-fieldOfStudy"
                      type="text"
                      className="bat-modal__input"
                      placeholder="e.g. Mathematics, Education, Engineering"
                    />
                  </div>
                  <div className="bat-modal__field">
                    <label htmlFor="bat-year" className="bat-modal__label">
                      Year (optional)
                    </label>
                    <input
                      id="bat-year"
                      type="text"
                      className="bat-modal__input"
                      placeholder="e.g. 2020, 2018-2022"
                    />
                  </div>
                </div>

                <div className="bat-modal__form-actions">
                  <button 
                    type="button" 
                    className="bat-modal__back"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    className="bat-modal__outline"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                  >
                    Skip
                  </button>
                  <button 
                    type="button" 
                    className="bat-modal__submit"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === "review" && (
              <div className="bat-modal__step">
                <h3 className="bat-modal__step-heading">Review your information</h3>
                
                <div className="bat-modal__review-section">
                  <div className="bat-modal__review-item">
                    <span className="bat-modal__review-label">Name</span>
                    <span className="bat-modal__review-value">{formData.name}</span>
                  </div>
                  <div className="bat-modal__review-item">
                    <span className="bat-modal__review-label">Email</span>
                    <span className="bat-modal__review-value">{formData.email}</span>
                  </div>
                  <div className="bat-modal__review-item">
                    <span className="bat-modal__review-label">Subjects</span>
                    <span className="bat-modal__review-value">{formData.subjects}</span>
                  </div>
                  {formData.bio && (
                    <div className="bat-modal__review-item">
                      <span className="bat-modal__review-label">Bio</span>
                      <span className="bat-modal__review-value">{formData.bio}</span>
                    </div>
                  )}
                  {formData.education && (
                    <div className="bat-modal__review-item">
                      <span className="bat-modal__review-label">Education</span>
                      <span className="bat-modal__review-value">
                        {formData.education.degree} in {formData.education.fieldOfStudy} 
                        {formData.education.institution}${formData.education.year ? ` (${formData.education.year})` : ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bat-modal__form-actions">
                  <button 
                    type="button" 
                    className="bat-modal__back"
                    onClick={(e) => {
                      e.preventDefault();
                      prevStep();
                    }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    className="bat-modal__submit"
                    onClick={handleSubmit}
                    disabled={loading || !canProceed}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )}
</form>
         )}
       </div>
    </div>
    </>
  );
};

const batModalStyles = `
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
      max-width: 640px;
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

    .bat-modal__outline {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 1rem;
      color: var(--color-text-muted);
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      padding: 0 var(--space-lg);
      height: 48px;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .bat-modal__outline:hover {
      color: var(--color-ink);
      border-color: var(--color-primary);
    }

    .bat-modal__back {
      min-height: 48px;
      padding: 0 var(--space-md);
      color: var(--color-text-muted);
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-input);
      font: 600 1rem var(--font-body);
      cursor: pointer;
      transition: color 0.15s ease, background-color 0.15s ease;
    }

    .bat-modal__back:hover,
    .bat-modal__back:focus-visible {
      color: var(--color-ink);
      background: var(--color-surface-muted);
      outline: none;
    }

    /* Progress bar styling */
    .progress-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: var(--space-lg);
      width: 100%;
    }

    .progress-bar__container {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 400px;
      min-height: 30px;
      justify-content: space-between;
    }

    .progress-bar__track {
      position: absolute;
      top: 8px;
      left: 0;
      right: 0;
      height: 3px;
      overflow: hidden;
      background: var(--color-border);
      border-radius: var(--radius-pill);
    }

    .progress-bar__fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), #818cf8);
      border-radius: inherit;
      transition: width 0.45s ease;
    }

    .progress-step {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      padding-top: 16px;
    }

    .progress-step__circle {
      display: none;
    }

    .progress-step__circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      font-size: 8px;
      font-weight: bold;
    }

    .progress-step__circle.active {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-background);
    }

    .progress-step__circle.completed {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-background);
    }

    .progress-step__label {
      font-family: var(--font-body);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-align: center;
    }

    .progress-bar__connector {
      display: none;
    }

    .progress-bar__connector.completed {
      background-color: var(--color-primary);
    }

    .progress-bar__label {
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-top: 4px;
    }

    /* Step-specific styling */
    .bat-modal__step {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__step-intro {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__step-heading {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--color-ink);
      margin-bottom: var(--space-sm);
    }

    .bat-modal__step-subtext {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .bat-modal__field-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__review-section {
      display: grid;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .bat-modal__review-item {
      display: flex;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .bat-modal__review-label {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }

    .bat-modal__review-value {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--color-ink);
      font-weight: 500;
    }

    .bat-modal__form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }

    .bat-modal__processing {
      text-align: center;
      padding: var(--space-lg);
    }

    .bat-modal__processing-message {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--color-ink);
      margin-bottom: var(--space-md);
    }

    .bat-modal__spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--space-md);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .bat-modal__complete {
      text-align: center;
      padding: var(--space-lg);
    }

    .bat-modal__checkmark {
      font-size: 3rem;
      color: var(--color-primary);
      margin-bottom: var(--space-md);
    }

    .bat-modal__complete-title {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--color-ink);
      margin-bottom: var(--space-sm);
    }

    .bat-modal__complete-subtext {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--color-text-muted);
      margin-bottom: var(--space-lg);
    }

    @media (max-width: 640px) {
      .bat-modal__overlay {
        align-items: flex-start;
        padding: var(--space-sm);
        overflow-y: auto;
      }

      .bat-modal {
        max-height: calc(100vh - 2 * var(--space-sm));
        padding: var(--space-lg);
        border-radius: var(--radius-input);
      }

      .progress-step__label {
        max-width: 52px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .bat-modal__field-group {
        grid-template-columns: 1fr;
      }

      .bat-modal__form-actions {
        flex-direction: column-reverse;
        align-items: stretch;
      }

      .bat-modal__submit,
      .bat-modal__outline,
      .bat-modal__back {
        width: 100%;
      }
    }
  `;

export default BecomeATutorModal;
