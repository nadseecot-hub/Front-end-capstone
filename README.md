# TutorFinder

A mini React app that helps students find a tutor that fits how they learn, 
and helps parents feel confident about who's teaching them. Built as a 
university assignment demonstrating AI-assisted development end-to-end — 
concept, architecture, implementation, and iteration.

## Live Features

- Search and filter tutors by subject, level, and max price
- AI-generated "why this tutor fits you" summary on each tutor's profile, 
  based on the user's stated need
- Full tutor detail pages: profile, education, ratings/reviews with stars, 
  contact info / availability
- Save tutors to a personal list (Firebase Realtime Database)
- Email/password authentication (Firebase Auth), with saved tutors scoped 
  per signed-in user
- Custom design system (color tokens, typography, spacing) applied consistently 
  across every screen

## Tech Stack

- React + Vite + TypeScript (functional components only)
- React Router
- Firebase (Realtime Database + Authentication)
- MVVM architecture — every screen is split into three files:
  - **Model** — business logic, validation, no React
  - **ViewModel** — a custom hook holding state and actions
  - **View** — JSX only, consumes the ViewModel
- No UI component library — all styling is custom, driven by CSS tokens in 
  `src/styles/theme.css`

## Architecture

```
src/
  components/
    Header/
    TutorCard/
  pages/
    Home/            (HomeModel, useHomeViewModel, HomeView)
    TutorDetail/      (TutorDetailModel, useTutorDetailViewModel, TutorDetailView)
    SavedTutors/       (SavedTutorsModel, useSavedTutorsViewModel, SavedTutorsView)
    Auth/             (AuthModel, useAuthViewModel, AuthView)
  services/
    tutorService.ts    (mock tutor dataset + search/filter)
    aiFitService.ts     (AI-generated fit summary)
    firebaseService.ts  (Firebase init + saved tutors CRUD)
    authService.ts       (Firebase Authentication)
  context/
    AuthContext.tsx
  styles/
    theme.css           (design tokens: color, type, spacing, radius)
  types/
```

---

## How AI Assisted

This project was built entirely through staged, scoped prompts rather than 
one-shot generation. The workflow followed a consistent pattern for every 
screen and feature:

1. **Scaffold** — create empty MVVM files with placeholder exports so the app 
   keeps compiling
2. **Logic first** — implement the Model (pure business logic, no React), 
   then the ViewModel (a hook managing state/actions), each with explicit 
   "do not" constraints so the AI didn't reach ahead into UI or unrelated files
3. **UI last** — implement the View once the logic underneath it was verified
4. **Debug in place** — when something broke (e.g. routing pointed at an 
   empty component, a search bar and tutor grid weren't rendering), the issue 
   was diagnosed by reasoning about *which layer* the bug lived in — 
   Model, ViewModel, View, or routing — before touching any code
5. **Style as a separate pass** — visual design (color tokens, typography, 
   layout, card structure) was applied only after the functional app worked, 
   using a dedicated design-tokens file so every component pulled from one 
   source of truth instead of hardcoded values
6. **Session handoffs** — when starting a new AI session, the assistant was 
   given a context-recap prompt that explicitly listed what was and wasn't 
   built yet, and was instructed to verify the real codebase before writing 
   any new code, rather than trusting the summary blindly

This structure meant every AI-generated change was scoped to one file/concern 
at a time, which kept the codebase reviewable and made it possible to catch 
and fix issues (see Manual Improvements below) without losing track of what 
changed where.

---

## Manual Improvements & Corrections

<!-- 
TODO: fill in with specific examples — e.g. a bug the AI introduced, a prompt 
that didn't produce the right result and had to be corrected, a piece of 
generated code that was rewritten by hand, or a design decision changed 
after reviewing AI output.
-->

*(to be added)*

---

## Development Prompts

Prompts are listed in the order they were used, grouped by phase.

### Phase 0 — Project Setup

```
git checkout -b feature/mini-tutor-finder
```

```
npm create vite@latest mini-tutor-finder -- --template react-ts
cd mini-tutor-finder
npm install
```

### Phase 1 — Initialize

**Init**
```
Initialize a new React application using Vite, React, and TypeScript.

Use functional components only.

Do not install any UI library.

Do not add any tutor functionality yet.
```

**Clean Vite starter**
```
Remove all default Vite content, images, styles, and demonstration code.

Leave a minimal working React application with an empty App component.

Do not create any additional components or functionality.
```

### Phase 2 — Header

**Create Header**
```
Create a reusable Header component.

The Header should contain:
- a Home navigation link
- a Saved Tutors navigation link

Use React Router links for navigation.

Only create and display the Header.

Do not create the Home or Saved Tutors screens yet.

Do not add a search input here — search is a multi-field form (subject, level, 
what they need help with), not a single text box, so it lives on the Home screen.
```

**Style Header**
```
please can you add styling to the header
```

### Phase 3 — Home MVVM Structure

```
Create the empty MVVM file structure for the Home screen.

Create:
src/pages/Home/HomeModel.ts
src/pages/Home/useHomeViewModel.ts
src/pages/Home/HomeView.tsx

Requirements:
- HomeModel.ts will later contain Home-specific data and business logic.
- useHomeViewModel.ts will later contain React state and actions.
- HomeView.tsx will later render the Home interface.

Create only minimal placeholder exports so the application can compile.

Do not add data fetching, React state, or tutor UI.
```

### Phase 4 — Tutor Data Service

**Empty service file**
```
Create a services folder and an empty tutor data service file:

src/services/tutorService.ts

Add a short comment explaining that this file will hold a local mock dataset of 
tutors and functions to search/filter them.

Do not implement the search logic yet.
```

**Implement search**
```
Implement tutor data and search inside:

src/services/tutorService.ts

Create:
- a local mock dataset of 12-15 tutors, typed as Tutor[], each with: 
  id, name, subject, level (beginner/intermediate/advanced), bio, price, rating, availability
- an exported function searchTutors(filters: TutorSearchFilters): Promise<Tutor[]>

Requirements:
- filters should include subject, level, and maxPrice (all optional)
- filter the mock dataset in-memory (no real API call)
- return a Promise to keep the interface consistent with a future real API
- use the Tutor and TutorSearchFilters types

Do not use React hooks.
Do not use useEffect.
Do not manage loading, error, or component state.
```

**Debug logs**
```
okay add console logs just to double check if it works
```

### Phase 5 — AI Fit Summary Service

**Empty service file**
```
Create an empty AI fit summary service file:

src/services/aiFitService.ts

Add a short comment explaining that this file will call an AI API to generate a 
personalized "why this tutor fits you" summary based on the user's stated need 
and the tutor's bio.

Do not implement the API request yet.
```

**Implement fit summary**
```
Implement the AI fit summary request inside:

src/services/aiFitService.ts

Create an exported async function:

getFitSummary(userNeed: string, tutor: Tutor): Promise<string>

Requirements:
- call the AI provider's chat completions endpoint
- read the API key from VITE_AI_API_KEY
- send a short system prompt instructing the model to write a 2-3 sentence 
  personalized explanation of why this tutor is a good fit, given the user's 
  need and the tutor's bio/subject
- return only the generated text
- throw a readable error when the HTTP request fails

Do not use React hooks.
Do not use useEffect.
Do not manage loading, error, or component state.
```

**Debug logs**
```
okay add console logs just to double check if it works
```

### Phase 6 — Home Model, ViewModel, View

**HomeModel**
```
Implement the Home model inside:

src/pages/Home/HomeModel.ts

Import searchTutors from tutorService.

Create and export:

getTutors(filters: TutorSearchFilters): Promise<Tutor[]>

Responsibilities:
- validate that at least one filter is meaningfully set (or allow empty = show all)
- call searchTutors with the cleaned filters
- return the tutor list

Do not use React hooks.
Do not use useState or useEffect.
Do not call fetch directly.
```

**useHomeViewModel**
```
Implement a custom hook inside:

src/pages/Home/useHomeViewModel.ts

Create and export:

useHomeViewModel()

Manage these properties using useState:
- subject
- level
- maxPrice
- tutors
- loading
- error

Create a function:

handleSearch()

The function should:
- set loading to true
- clear the previous error
- call getTutors from HomeModel using the current filters
- save the returned tutor list in tutors state
- store a readable error if the request fails
- set loading to false when finished

Return: subject, setSubject, level, setLevel, maxPrice, setMaxPrice, tutors, 
loading, error, handleSearch

Do not render JSX.
Do not call fetch directly.
Do not import tutorService directly.
```

**HomeView**
```
Implement the Home view inside:

src/pages/Home/HomeView.tsx

Requirements:
- import and use useHomeViewModel
- render a search form with subject, level, and max price inputs
- connect inputs to their respective state
- call handleSearch when the form is submitted
- prevent default form submission
- display a loading message while loading is true
- display the error message when error exists
- render the tutor list using .map()
- display tutor name, subject, price, and rating (plain text/list for now)

Do not call fetch directly.
Do not import HomeModel or tutorService.
Do not create a reusable TutorCard component yet.
```

**Initial random tutors**
```
Create an initialTutors() function inside HomeModel.

Requirements:
- automatically load all tutors when the Home screen opens, before any search
- use the existing tutorService
- keep all logic inside HomeModel
- do not use React hooks
- do not call fetch directly
```

### Phase 7 — TutorCard

```
Create a reusable TutorCard component.

Create:
src/components/TutorCard/TutorCard.tsx

Requirements:
- receive one Tutor object through props
- display: name, subject, level, price, rating, and a short bio excerpt
- add a "View Profile" link/button to the tutor detail page
- use the shared Tutor type
- keep the component presentational
- do not call APIs
- do not manage the tutor list

Update HomeView to render TutorCard using .map().
```

### Phase 8 — Tutor Detail MVVM Structure

```
Create the empty MVVM file structure for the Tutor Detail screen.

Create:
src/pages/TutorDetail/TutorDetailModel.ts
src/pages/TutorDetail/useTutorDetailViewModel.ts
src/pages/TutorDetail/TutorDetailView.tsx

Create only minimal placeholder exports so the application can compile.

Do not add AI calls, React state, or profile UI yet.
```

**TutorDetailModel**
```
Implement the Tutor Detail model inside:

src/pages/TutorDetail/TutorDetailModel.ts

Import searchTutors from tutorService and getFitSummary from aiFitService.

Create and export:
- getTutorById(id: string): Promise<Tutor | undefined>
- getFitSummaryForTutor(userNeed: string, tutor: Tutor): Promise<string>

Do not use React hooks.
Do not manage UI state.
```

**useTutorDetailViewModel**
```
Implement a custom hook inside:

src/pages/TutorDetail/useTutorDetailViewModel.ts

Create and export:

useTutorDetailViewModel(tutorId: string, userNeed: string)

Manage with useState: tutor, fitSummary, loading, error

Requirements:
- use useEffect to load the tutor and fit summary when the screen opens
- call TutorDetailModel only
- return tutor, fitSummary, loading, error

Do not render JSX.
Do not import tutorService or aiFitService directly.
```

**TutorDetailView (initial)**
```
Implement the Tutor Detail view inside:

src/pages/TutorDetail/TutorDetailView.tsx

Requirements:
- use useTutorDetailViewModel
- read tutorId from the route params
- display full tutor profile (name, subject, level, price, rating, full bio)
- display a loading state while the AI fit summary is generating
- display the AI fit summary in a visually distinct "Why this tutor fits you" section
- display a readable error if the AI call fails, without breaking the rest of the page

Do not call aiFitService or tutorService directly.
```

**TutorDetailView (full build-out)**
```
When I click "View Profile" on a tutor card, it must show the full tutor 
detail page: profile, education, ratings, reviews with clear stars, contact 
information, and availability.

Requirements:
- use theme.css design tokens for all styling — no new colors, fonts, or 
  spacing values introduced outside the token system
- keep this change scoped to TutorDetailView and its data — do not modify 
  HomeModel, useHomeViewModel, HomeView, tutorService, or routing logic
- verify the /tutor/:id route correctly renders TutorDetailView with the 
  right tutorId before finishing — confirm no route points at a placeholder
```

### Phase 9 — Routing

```
Set up React Router.

Routes:
- / → HomeView
- /tutor/:id → TutorDetailView

Requirements:
- preserve the Header on every page
- pass the user's stated need from Home to TutorDetail (query param or route state)

Do not add protected routes yet.
```

### Phase 10 — Visual Redesign

**Design tokens**
```
Create a design tokens file:

src/styles/theme.css

Define CSS custom properties on :root:

Color:
--color-ink: #16263D        (navbar, headings, primary text)
--color-parchment: #FAF6EF  (page background)
--color-amber: #E3A548      (primary accent / CTA)
--color-amber-dark: #C88A2E (CTA hover state)
--color-teal: #3F6E67       (secondary accent — subject/level badges)
--color-star: #F0B429       (rating stars)
--color-text-muted: #6B6459 (secondary text, bios, meta)
--color-surface: #FFFFFF    (card background)
--color-border: #E7E1D6     (card/input borders)

Typography:
--font-display: 'Fraunces', Georgia, serif
--font-body: 'Inter', system-ui, sans-serif

Spacing scale:
--space-xs: 4px, --space-sm: 8px, --space-md: 16px, --space-lg: 24px, 
--space-xl: 40px, --space-2xl: 64px

Radius:
--radius-card: 12px, --radius-input: 8px, --radius-pill: 999px

Import Fraunces and Inter from Google Fonts. Import theme.css once in main.tsx.

Do not apply any of these tokens to components yet. This step only defines them.
```

**Header redesign**
```
Restyle the existing Header component using the tokens in theme.css.

Requirements:
- add a site name "TutorFinder" using --font-display, placed on the left, 
  linking to Home
- keep Home and Saved Tutors nav links, centered horizontally (3-column flex 
  layout: logo | nav | account icon)
- add an account icon on the right (inline SVG, no icon library)
- background: --color-ink, text in white/parchment for contrast
- keep the account icon non-functional for now — just visual

Do not modify HomeView, TutorCard, or any routing.
Do not add authentication logic.
```

**Home hero + search redesign**
```
Restyle the top section of HomeView (the search form area) using theme.css tokens.

Requirements:
- wrap the "Find a Tutor" heading + subtext + search form in a hero section 
  with a subtle background (parchment base + soft gradient toward amber at 
  low opacity — clean, not photographic)
- heading uses --font-display, large size, --color-ink
- one line of supporting copy below the heading explaining what TutorFinder 
  offers students and parents
- restyle the search form as an elevated card on top of the hero background
- inputs get --radius-input, --color-border, visible amber focus states
- Search button uses --color-amber, white text, --color-amber-dark on hover
- "Found N tutor(s)" restyled as a smaller, muted label

Do not change useHomeViewModel or HomeModel.
Do not change what data is fetched or how filtering works — visual only.
```

**Tutor grid + card redesign**
```
Restyle the tutor results grid and TutorCard component using theme.css tokens.

Grid: CSS grid with repeat(auto-fill, minmax(280px, 1fr)) and --space-lg gap 
to fix cards sitting flush against each other.

TutorCard:
- top row: level badge (left, teal pill) and star rating (right)
- centered tutor name (--font-display) and subject below
- bio with line clamp
- review count near the rating/credibility info
- price directly above the View Profile button, right-aligned
- View Profile button: full width, ink background, white text

Do not change the Tutor type, mock data, or TutorDetail navigation logic.
```

**Redesign bug fixes**
```
Three issues to fix from the redesign:
1. There's no background visible behind "Find a Tutor" — the gradient isn't 
   rendering. Fix the hero background so it's visible.
2. The tutor cards still overlap — the grid gap isn't being applied. Fix the 
   spacing between cards.
3. Move the review count to sit just above the View Profile button, left side 
   (mirroring where price sits on the right).
4. Add a simple user profile icon (generic male/female avatar) next to the 
   rating on each card.

Keep all changes scoped to the Home hero section and TutorCard styling only.
```

### Phase 11 — Firebase, Saved Tutors, Authentication

**Firebase config (initial)**
```
Create and configure Firebase for the application.

Create:
src/services/firebaseService.ts

Requirements:
- initialize Firebase using environment variables
- export the database instance
- do not save or load any saved tutors yet
- do not modify HomeView
- do not add authentication
```

**Saved tutors service functions**
```
Inside src/services/firebaseService.ts, add functions for managing saved tutors.

Create:
- addSavedTutor(tutor: Tutor): Promise<void>
- removeSavedTutor(tutorId: string): Promise<void>
- getSavedTutors(): Promise<Tutor[]>

Requirements:
- use tutorId as the unique tutor identifier
- keep all Firebase communication inside this service
- return typed data using the shared Tutor type
- throw readable errors when operations fail
- do not use React hooks
- do not update the UI yet
```

**SavedTutorsModel**
```
Implement the Saved Tutors model inside:

src/pages/SavedTutors/SavedTutorsModel.ts

Import the Firebase service functions.

Create and export:
- loadSavedTutors(): Promise<Tutor[]>
- saveTutor(tutor: Tutor): Promise<void>
- deleteSavedTutor(tutorId: string): Promise<void>

Requirements:
- act as a wrapper around firebaseService
- do not call Firebase directly outside the service
- do not use React hooks
- do not manage loading or error state
```

**useSavedTutorsViewModel**
```
Implement a custom hook inside:

src/pages/SavedTutors/useSavedTutorsViewModel.ts

Create and export:

useSavedTutorsViewModel()

Manage with useState: savedTutors, loading, error

Create functions: loadTutors(), removeTutor(tutorId)

Requirements:
- use SavedTutorsModel only
- load saved tutors when the screen opens, using useEffect for the initial load
- update local state after a tutor is removed
- return all state and actions required by SavedTutorsView
- do not render JSX
- do not import firebaseService directly
```

**SavedTutorsView**
```
Implement the Saved Tutors view inside:

src/pages/SavedTutors/SavedTutorsView.tsx

Requirements:
- use useSavedTutorsViewModel
- display a loading message while loading
- display an error message when error exists
- render saved tutors using the existing TutorCard component and .map()
- show a friendly empty message when there are no saved tutors
- allow removing a tutor from saved tutors
- reuse theme.css tokens for consistent spacing/typography
- do not call Firebase directly
- do not import SavedTutorsModel directly
```

**Connect Save button**
```
When I click the save button on a single tutor card, nothing happens and it 
should add that tutor to saved tutors in the real-time database. Connect it.
```

**Auth and Firestore config update**
```
Install Firebase and update the existing Firebase configuration.

Requirements:
- initialize Firebase Authentication using getAuth
- initialize Cloud Firestore using getFirestore
- export auth and db
- read Firebase configuration from Vite environment variables
- use the modern modular Firebase SDK
- do not add registration or login UI yet
- do not add anything new regarding saved tutors logic yet

Update: src/services/firebaseService.ts

Also create an .env.example file containing placeholder Firebase environment 
variables.
```

**authService**
```
Create:

src/services/authService.ts

Implement and export these functions:
- registerUser(email: string, password: string)
- loginUser(email: string, password: string)
- logoutUser()
- subscribeToAuthChanges(callback)

Requirements:
- use Firebase Authentication
- use createUserWithEmailAndPassword for registration
- use signInWithEmailAndPassword for login
- use signOut for logout
- use onAuthStateChanged inside subscribeToAuthChanges
- return typed Firebase User data where appropriate
- convert Firebase errors into readable messages
- do not use React hooks
- do not use useState or useEffect
- do not render JSX
```

**Auth MVVM structure**
```
Create the MVVM file structure for authentication.

Create:
src/pages/Auth/AuthModel.ts
src/pages/Auth/useAuthViewModel.ts
src/pages/Auth/AuthView.tsx

Requirements:
- add minimal typed placeholder exports
- ensure the application still compiles
- do not implement registration or login yet
- do not add routing yet
```

**AuthModel**
```
Implement src/pages/Auth/AuthModel.ts.

Import the authentication functions from authService.

Create and export:
- register(email: string, password: string)
- login(email: string, password: string)
- logout()

Responsibilities:
- trim and normalize the email address
- validate that the email and password are not empty
- validate that the password contains at least six characters
- call the corresponding authService function
- return the authenticated Firebase User

Do not use React hooks.
Do not call Firebase Authentication directly outside authService.
Do not manage UI state.
```

**useAuthViewModel**
```
Implement the useAuthViewModel custom hook inside:

src/pages/Auth/useAuthViewModel.ts

Manage these values using useState: email, password, mode ("login"/"register"), 
loading, error

Create: handleSubmit(), toggleMode()

Requirements:
- handleSubmit should call AuthModel.login when mode is "login"
- handleSubmit should call AuthModel.register when mode is "register"
- clear previous errors before submitting
- manage the loading state
- store readable errors
- clear the password after successful authentication
- return all state and functions needed by AuthView
- do not render JSX
- do not call Firebase directly
- do not import authService directly
```

**AuthView**
```
Implement src/pages/Auth/AuthView.tsx.

Requirements:
- use useAuthViewModel
- display either "Login" or "Create Account" based on the current mode
- add a controlled email input
- add a controlled password input
- add a submit button
- disable the submit button while loading
- display readable validation or Firebase errors
- add a button for switching between login and registration
- submit the form using onSubmit, prevent default browser submission
- style using theme.css tokens so it matches Home and SavedTutors visually

Do not call Firebase directly.
Do not import AuthModel or authService.
```

**AuthContext**
```
Create a global authentication context.

Create: src/context/AuthContext.tsx

Requirements:
- use onAuthStateChanged through authService
- store the current Firebase user
- store an authLoading state while Firebase restores the session
- expose: user, authLoading, logout
- wrap the application with AuthProvider
- unsubscribe from the authentication listener when the provider unmounts
- show a loading state while authentication is being initialized
- do not add saved tutors logic
```

**Move types**
```
move types under /types
```

**Protected routes**
```
Update the application routing.

Requirements:
- add an /auth route that displays AuthView
- allow HomeView and TutorDetailView to remain publicly accessible
- protect the /saved route
- when an unauthenticated user opens /saved, redirect them to /auth
- when an authenticated user opens /auth, redirect them to /
- preserve the Header on every page
- use the user and authLoading values from AuthContext
```

**Unauthenticated save click**
```
If I am unauthenticated and click the save button from the Home page or Tutor 
Detail page, redirect me to the auth page.
```

**Move save-click logic to view model**
```
move this to viewModel
```

**Per-user saved tutors**
```
Update the existing saved tutors service so saved tutors are stored under the 
signed-in user's profile.

Use this real-time DB structure: users/{userId}/savedTutors/{tutorId}

Update the existing functions so they receive userId:
- addSavedTutor(userId: string, tutor: Tutor)
- removeSavedTutor(userId: string, tutorId: string)
- getSavedTutors(userId: string)

Requirements:
- use userId as the parent user document ID
- use tutorId as the saved-tutor document ID
- preserve the existing function behaviour
- do not use React hooks
- do not access auth.currentUser inside the service
- throw a readable error when userId is missing
- update SavedTutorsModel, useSavedTutorsViewModel, and the Save button 
  connections on TutorCard to pass the current userId from AuthContext
```

**Logout**
```
add logout button as well and connect it with logout function
```

### Phase 12 — Documentation

```
create me in readme all prompts that we used for this app
```
