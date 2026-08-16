/* ==========================================================================
   HomeModel — pure data + validation for the marketing/landing Home page.
   No React imports here; this file is consumed by the ViewModel.
   ========================================================================== */

/** Identifier so the View can pick which inline SVG icon to render. */
export type WhyChooseUsIconId = "shield" | "spark" | "clock" | "globe";

export interface WhyChooseUsPoint {
  /** Stable id used by the View to pick an icon. */
  icon: WhyChooseUsIconId;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  /** Short context, e.g. "Parent of 9th grader" or "University student". */
  role: string;
  quote: string;
  /** 1-5 inclusive. */
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/* --------------------------------------------------------------------------
   Mock data
   -------------------------------------------------------------------------- */

/** Four selling points used in the "Why Choose Us" section. */
export const whyChooseUsPoints: WhyChooseUsPoint[] = [
  {
    icon: "shield",
    title: "Vetted, Trusted Tutors",
    description:
      "Every tutor is interviewed and reference-checked, so you can book with confidence.",
  },
  {
    icon: "spark",
    title: "Matched to How You Learn",
    description:
      "Filter by subject, level, and price — and we'll surface tutors who actually fit.",
  },
  {
    icon: "clock",
    title: "Learn on Your Schedule",
    description:
      "Book one-off sessions or set a recurring rhythm that works for the whole family.",
  },
  {
    icon: "globe",
    title: "For Every Age, Every Stage",
    description:
      "From first readers to adult learners — find a tutor for any goal, any level.",
  },
];

/** Three social-proof testimonials. */
export const testimonials: Testimonial[] = [
  {
    name: "Aisha Rahman",
    role: "Parent of a 7th grader",
    quote:
      "We found a math tutor in a week. My daughter actually looks forward to sessions now — that's never happened before.",
    rating: 5,
  },
  {
    name: "Daniel Okafor",
    role: "University student",
    quote:
      "I was stuck on stats for months. One tutor, three sessions, and I finally get it. Worth every penny.",
    rating: 5,
  },
  {
    name: "Marlene Becker",
    role: "Adult learner",
    quote:
      "I'd been meaning to learn Spanish for years. TutorFinder made it easy to start — and easy to keep going.",
    rating: 4,
  },
];

/** Six common questions for the FAQ accordion. */
export const faqItems: FaqItem[] = [
  {
    question: "How do I know if a tutor is a good fit?",
    answer:
      "Every tutor profile shows their subject, level, price, and a short bio. You can book a single session first to try them out before committing to a recurring schedule.",
  },
  {
    question: "What ages and levels do you support?",
    answer:
      "TutorFinder works for learners of any age — elementary, middle and high school, university, and adults picking up a new skill or language.",
  },
  {
    question: "How much does a session cost?",
    answer:
      "Each tutor sets their own hourly rate. You can filter by max price while searching, so you only see tutors within your budget.",
  },
  {
    question: "Can I book the same tutor regularly?",
    answer:
      "Yes. After your first session you can schedule a recurring weekly slot with the same tutor, or book ad-hoc whenever you need help.",
  },
  {
    question: "How do I become a tutor?",
    answer:
      "Click 'Become a Tutor' at the top of the page. We'll take you through a short application — subject, experience, and availability — and get back to you within a few days.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "There's no formal trial, but every tutor offers a first session you can use to decide if the fit is right before booking again.",
  },
];

/* --------------------------------------------------------------------------
   Validation — kept here (not in the View) so rules are testable in isolation.
   -------------------------------------------------------------------------- */

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormPayload, string>>;

/**
 * Validate a contact-form payload. Returns an empty object when valid.
 * Rules: every field must be non-empty after trimming, and the email must
 * contain "@" with content on both sides.
 */
export function validateContactForm(
  payload: ContactFormPayload
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!payload.name.trim()) {
    errors.name = "Please enter your name.";
  }
  if (!payload.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!payload.message.trim()) {
    errors.message = "Please write a short message.";
  }

  return errors;
}
