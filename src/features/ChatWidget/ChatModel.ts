/* ==========================================================================
   ChatModel — configuration, types, and constants for the AI chat widget.
   
   This module centralizes:
   - Model selection (OpenRouter free tier)
   - System prompt for tutor finder support
   - Message types and interfaces
   - Default settings
   ========================================================================== */

/* --------------------------------------------------------------------------
   OpenRouter Configuration
   -------------------------------------------------------------------------- */

export const OPENROUTER_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.1-8b-instruct",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  siteName: "TutorFinder",
} as const;

/* --------------------------------------------------------------------------
   System Prompt — defines the assistant's behavior and personality
   -------------------------------------------------------------------------- */

export const SYSTEM_PROMPT = `You are a friendly and helpful support assistant for TutorFinder, a platform that connects students with vetted tutors.

Your role is to:
- Help users find the right tutor for their learning needs
- Answer questions about how TutorFinder works
- Explain the tutor search and booking process
- Provide information about subjects, pricing, and scheduling
- Help tutors understand how to join the platform
- Guide users through account issues and common problems

Guidelines:
- Be concise but thorough — aim for 2-4 sentences unless more detail is needed
- Use a warm, encouraging tone that matches TutorFinder's supportive brand
- If you don't know something specific about a tutor or user account, direct them to contact support
- Never share or ask for personal information like passwords or payment details
- If asked about pricing, mention that each tutor sets their own hourly rate and users can filter by price
- Encourage users to browse tutors and try a first session to see if it's a good fit

Platform details you can share:
- Subjects: 40+ subjects including math, science, languages, music, and more
- Levels: Elementary through university and adult learners
- Booking: Single sessions or recurring weekly slots
- Safety: All tutors are interviewed and reference-checked
- Support hours: Monday–Friday, 9:00–18:00 UTC
- Contact: hello@tutorfinder.example`;

/* --------------------------------------------------------------------------
   Message Types
   -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

/* --------------------------------------------------------------------------
   Default Settings
   -------------------------------------------------------------------------- */

export const CHAT_DEFAULTS = {
  maxTokens: 1024,
  temperature: 0.7,
} as const;

/* --------------------------------------------------------------------------
   Quick Action Suggestions — shown when chat opens
   -------------------------------------------------------------------------- */

export const QUICK_ACTIONS = [
  "How do I find a tutor?",
  "What subjects are available?",
  "How does pricing work?",
  "How do I become a tutor?",
] as const;

export type QuickAction = typeof QUICK_ACTIONS[number];
