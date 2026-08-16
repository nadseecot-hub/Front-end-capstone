import { useCallback, useState } from "react";
import {
  faqItems,
  type ContactFormPayload,
  validateContactForm,
} from "./HomeModel";

/* ==========================================================================
   useHomeViewModel — state + actions for the marketing/landing Home page.

   Two concerns live here:
     1. The Contact Us form (name / email / message + submit + success/error).
     2. The FAQ accordion (which item is open).

   Validation rules live in HomeModel; this hook just wires them to React
   state and exposes everything the View needs.
   ========================================================================== */

export const useHomeViewModel = () => {
  /* ---- Contact form ---------------------------------------------------- */
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
  }, []);

  /**
   * Validate and submit the contact form. Currently a stub that logs the
   * payload to the console — the real backend integration will be wired up
   * later (see TODO).
   */
  const handleContactSubmit = useCallback(
    async (event?: { preventDefault?: () => void }): Promise<void> => {
      event?.preventDefault?.();

      const payload: ContactFormPayload = { name, email, message };
      const validationErrors = validateContactForm(payload);
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors.name ?? validationErrors.email ?? validationErrors.message ?? null);
        setSuccess(false);
        return;
      }

      setSubmitting(true);
      setError(null);
      setSuccess(false);
      try {
        // TODO: replace this stub with a real backend / Firestore write.
        // For now we simulate a network call so the loading + success states
        // can be exercised end-to-end.
        // eslint-disable-next-line no-console
        console.log("Contact form payload (stub):", payload);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setSuccess(true);
        resetForm();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
        setSuccess(false);
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, message, resetForm]
  );

  /* ---- FAQ accordion --------------------------------------------------- */
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = useCallback((index: number): void => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  }, []);

  return {
    /* contact form */
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
    /* faq */
    faqItems,
    openFaqIndex,
    toggleFaq,
  };
};
