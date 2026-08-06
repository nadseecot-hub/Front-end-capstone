/* ==========================================================================
   src/types/index.ts
   --------------------------------------------------------------------------
   Central shared TypeScript types for the Mini Tutor Finder application.
   All consumers should import from here, not from individual service files.
   ========================================================================== */

/* --- Tutor domain types --------------------------------------------------- */

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  bio: string;
  price: number; // price per hour in dollars
  rating: number; // out of 5
  availability: string; // e.g., "Weekdays 5-9pm", "Weekends 10am-4pm"
}

export interface TutorSearchFilters {
  subject?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  maxPrice?: number;
}

/* --- Auth domain types ---------------------------------------------------- */

export type AuthMode = 'login' | 'register';
