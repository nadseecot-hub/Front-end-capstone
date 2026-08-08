TutorFinder — Capstone (Next.js)

A tutoring platform connecting students/parents ("Finders") with tutors, evolving from a class assignment into a real product. This phase migrates the original Vite/React MVP to Next.js (App Router) as the foundation for that build-out.

Live preview:
Repo: https://github.com/nadseecot-hub/Front-end-capstone

Tech Stack
Next.js (App Router) + TypeScript
Tailwind CSS, tokens ported from the original design system
Firebase (Authentication + Realtime Database)
MVVM architecture per screen (Model / ViewModel / View)
Project Structure
src/
  app/                  Next.js routes (file-based routing, thin — 
                         each page.tsx imports and renders a View)
  features/             MVVM triads per screen (Model, ViewModel, View) — 
                         formerly src/pages/ in the Vite version, renamed 
                         to avoid colliding with Next.js's routing convention
  components/           Shared presentational components (Header, TutorCard)
  context/               AuthContext (user, role, authLoading, logout)
  services/               tutorService, aiFitService, firebaseService, authService
  styles/                theme.css — design tokens, mirrored into tailwind.config.js
  types/                 Shared TypeScript types
Routes
Route	Screen	Visible to
/	Home	Everyone
/tutor/[id]	Tutor Detail	Everyone
/saved	Saved Tutors	Finder (authenticated)
/messages	Chat	Finder & Tutor (authenticated)
/leaderboard	Top Tutors	Everyone
/auth	Login / Register	Unauthenticated
/become-a-tutor	Tutor application	Unauthenticated & Finder
/dashboard	Dashboard overview	Tutor
/dashboard/profile	Edit profile	Tutor
/dashboard/bookings	Manage bookings	Tutor
/dashboard/analytics	Demand, saves, clicks, impressions	Tutor (surfaced inside Dashboard, not a standalone nav link)
/health	Health check — fetches and renders mock tutor data	Internal/dev only

The Header renders a different nav set depending on auth state and role (finder vs tutor), read from AuthContext. Role currently defaults to finder on signup; the Become a Tutor flow upgrades it — that upgrade flow is not implemented yet, only the read path.

Setup
bash
npm install

Copy .env.example to .env.local and fill in real values:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_AI_API_KEY=
bash
npm run dev       # local dev server
npm run build      # production build — must pass with zero errors

.env.local is gitignored. Only .env.example (placeholders) is committed.

Migration Notes (Vite → Next.js)

The original app was Vite + React + React Router. This phase ported it to Next.js App Router:

src/pages/ (MVVM files) renamed to src/features/ — Next.js treats a literal pages/ folder as a routing convention, so the old name collided
React Router → Next.js file-based routing (app/.../page.tsx)
theme.css custom properties mirrored into tailwind.config.js — same token values, both systems still work side by side
VITE_* env vars renamed to NEXT_PUBLIC_* for anything read client-side
Views classified per-file as Server or Client Components (Server by default; Client only where useState/useEffect/handlers are needed)
Vite-only files (App.tsx, main.tsx, vite.config.ts, index.html) removed once the Next.js shell was confirmed working

Known gotcha, documented for future reference: the project was originally inside a OneDrive-synced folder, which caused a cryptic UNKNOWN: unknown error, read failure partway through npm run build. OneDrive's file locking during sync intermittently blocks Node's rapid file reads during the build. Fixed by moving the project to a non-synced local path (C:\dev\...). Keep future projects out of OneDrive/Dropbox-synced folders entirely.

Prompts Used This Phase

Next.js scaffold + Foundations setup (pages→features rename, Tailwind token port, env var conversion, 12 placeholder routes, Server/Client Component classification, responsiveness check, Vite cleanup) — full prompt kept in project notes; summary of what it covered is reflected in the Project Structure and Routes sections above.

Role-aware Header

Add a role concept to authentication and make the Header role-aware.

1. In firebaseService.ts, add a function getUserRole(userId: string): 
   Promise<'finder' | 'tutor'> that reads a role field from the user's 
   profile in the database, defaulting to 'finder' if none is set yet.

2. In AuthContext.tsx, fetch and expose the user's role alongside the 
   existing user and authLoading values.

3. Update the Header component to render nav links conditionally based on 
   auth state and role.

4. Remove the standalone Analytics nav link — analytics lives inside the 
   Dashboard page instead.

Do not implement the actual "Become a Tutor" upgrade flow yet — just read 
the role field, don't write to it beyond the default.

Repo cleanup before first commit

Before committing: consolidate duplicate types/ and .env files left over 
from the migration, confirm no secrets are staged via git status, verify 
.gitignore covers .env/.env.local/node_modules/.next, then commit and push.
Roadmap

Foundations phase (this README) is placeholder routes + working build + deploy only. Next, building out gradually, page by page:

 Become a Tutor — application form + role upgrade on submit
 Dashboard — profile editing, bookings management, analytics (demand, saves, clicks, impressions)
 Messages — Finder ↔ Tutor chat
 Leaderboard — ranked by saves/demand
 Home, Tutor Detail, Saved Tutors — full functionality ported over from the original MVP, restyled for the current design system
