# TutorFinder

TutorFinder is a Next.js tutoring marketplace for students, parents, and tutors. The product lets learners discover tutors, filter and compare profiles, save tutors, view detailed tutor information, book sessions, and contact tutors.

## Live Application

Production: https://find-your-tutor.vercel.app/

Repository: https://github.com/nadseecot-hub/Front-end-capstone

## Product and design approach

The interface was rebuilt from the supplied reference images as a composition study. The images were used to understand hierarchy, proportions, whitespace, card grouping, image placement, navigation rhythm, and responsive behavior. Their photography, branding, copy, and unrelated color choices were not copied. Existing TutorFinder content and data remain the source of truth.

The visual direction is intentionally restrained:

- White and soft neutral surfaces carry most of the page.
- Indigo is reserved for primary actions, active states, links, and small accents.
- Teal, warm, and star tokens provide limited semantic variation.
- Cards use moderate radius, one-pixel borders, and low-elevation shadows.
- Each section has a different composition: editorial About, centered benefit cards, interactive testimonials, paired FAQ/contact, and a structured footer.
- Decorative shapes support an image or message; they are not used as generic background effects.
- Motion is limited to meaningful interactions such as hover lift, carousel transitions, accordion states, and subtle reveals.

This keeps the result art-directed and human rather than producing repeated rounded cards, excessive gradients, random badges, or dashboard-like decoration (commonly called AI slop).

## Technology stack

- Next.js 15 with the App Router
- React 18 and TypeScript
- Tailwind CSS plus semantic CSS custom-property tokens
- Firebase Authentication and Firestore are integrated for the tutor/student front-end flows; deployment still requires the project's Firebase environment values and rules.
- AI SDK/OpenAI chat service boundary with mock/local fallback behavior
- CSS and inline SVG icons; no carousel or icon package was added
- MVVM organization for feature screens

## Project structure

```text
src/
  app/                         App Router routes and thin page entry points
    page.tsx                   Home route
    find-tutors/page.tsx       Tutor marketplace
    find-tutors/[tutorId]/     Dynamic tutor profile route
    tutor/[id]/                Backward-compatible tutor profile route
    api/chat/route.ts          Server-side chat endpoint
    layout.tsx                 Root metadata, shell, and global styles
  features/
    Home/                      HomeModel, ViewModel, View, CSS
    FindTutors/                Search model, ViewModel, View, CSS
    TutorDetails/              Profile model, ViewModel, View, CSS
    Auth/                      Authentication screen and state
    SavedTutors/               Saved tutor screen and state
    ChatWidget/                Client chat widget and state
  components/
    AppShell.tsx               AuthProvider, Header, page content, Footer
    Header.tsx/.css            Shared responsive navbar
    Footer.tsx/.css            Shared footer and newsletter UI
    TutorCard/                 Existing reusable card used by saved tutors
  context/AuthContext.tsx      Current user, role, auth loading, logout
  services/                    Firebase, auth, tutor, and AI service boundaries
  styles/theme.css             Central design tokens
  types/index.ts               Shared TypeScript domain types
```

Feature code follows the same separation everywhere:

```text
Model       Data structures, mock data, validation, and data access
ViewModel   React state, derived values, actions, filtering, and navigation
View        Markup and presentation; it consumes the ViewModel API
```

The route files stay intentionally thin. They select a feature View and pass route parameters; they do not contain business logic.

## Design system

The tokens live in `src/styles/theme.css` and are available to all feature CSS. Tailwind exposes the same font families and token-compatible values.

```text
Heading font   DM Serif Display
Body font      Manrope

Primary        #6366F1
Primary dark   #4F46E5
Primary soft   #EEF0FF
Background     #FFFFFF
Surface muted  #F8F8FC
Ink            #171923
Muted          #667085
Border         #E8E8F0
Teal           #35B99F
Teal soft      #E9F8F4
Warm           #F4B860
Warm soft      #FFF6E6
Star           #F5B942
```

Components consume names such as `--color-primary`, `--color-ink`, `--color-border`, `--space-lg`, `--radius-card`, and `--shadow-subtle`; raw colors are not repeated throughout page components.

## Home page

The Home page remains in `src/features/Home` and uses existing content from `HomeModel.ts`.

- Hero: two-CTA composition using `/images/hero-tutor.jpg`; no search widget was added.
- About: `#about-us`, editorial two-column layout, existing copy and statistics, `/images/about-tutor.jpg`, mission card, and Learn More CTA.
- Why Choose Us: `#why-choose-us`, exactly four existing benefits in a symmetrical desktop row and stacked mobile cards.
- Testimonials: `#testimonials`, ViewModel-owned carousel state, three visible desktop cards, one visible mobile card, dots, arrows, profile imagery/avatars, and hover pause behavior.
- FAQ and contact: `#faq` and `#contact`, existing FAQ data/toggle state and existing contact validation/submission flow.
- Footer: multi-column navigation, social links, newsletter form, and mobile stacking.

The testimonial state is held in `useHomeViewModel.ts` through `currentTestimonialIndex`, `nextTestimonial`, `previousTestimonial`, and `goToTestimonial`. No carousel dependency or local carousel state in the View was introduced.

## Find Tutors page

The production route is `/find-tutors`; `/search-tutors` redirects there for compatibility.

`FindTutorsModel.ts` owns the tutor list, subject options, experience options, region options, price bounds, badges, and expertise tags. `useFindTutorsViewModel.ts` owns:

- Draft versus applied filters
- Subject, region, experience, and price filtering
- Sort order: Most Relevant, Highest Rated, Lowest Price
- Grid/list mode
- Current page and pagination
- Mobile filter drawer state
- Loading and error states

The View renders a reference-inspired marketplace: page introduction and decorative header illustration, filter sidebar, sort/view toolbar, three-column desktop tutor grid, consistent tutor card heights, empty state, pagination, and one-column mobile cards. The sidebar becomes a mobile filter panel instead of being squeezed into a narrow viewport.

The sort control remains a native accessible `<select>` with a custom closed-state appearance and inline chevron. Native opened menus remain browser/OS controlled by design.

## Tutor Details page

The profile feature is in `src/features/TutorDetails` and is available at:

```text
/find-tutors/[tutorId]
/tutor/[id]
```

`TutorDetailsModel.ts` reuses the existing tutor service and derives profile metadata, subjects, education, availability, and review data in one model boundary. `useTutorDetailsViewModel.ts` owns loading, selected availability day, active tab, save state, sharing, booking navigation, and message navigation. `TutorDetailsView.tsx` is presentation-focused.

The page includes:

- Shared navbar and back/action bar
- Profile card with avatar, badges, rating, recommendation, and student statistics
- Pricing card with booking and messaging actions
- Minimal profile tabs
- About section and feature chips
- Tutor information card
- All available subject cards
- Teaching approach, education, and availability cards
- Student/parent reviews

The page deliberately does not include a fake conversation panel, fake chat bubbles, a View All Subjects button, or a duplicate quote panel. Existing tutor records currently do not contain profile photos or full profile metadata, so initials and model-derived fallback values are used until those backend fields exist.

## Tutor dashboard and workspace

The tutor workspace is available at `/dashboard` and uses the same MVVM and token-based design system as the public marketplace. It includes:

- Dashboard overview with animated statistics, profile completeness, demand and analytics charts, bookings, messages, and recent activity.
- Tutor profile editing with photo preview, biography, subjects, education, rate, location, and availability controls.
- Bookings with Pending, Upcoming, and Past tabs plus mock Accept/Decline interactions.
- Messages with responsive conversation list, selected chat, message history, and local send behavior.
- Earnings and Reviews inner pages using reusable dashboard cards and mock presentation data.
- Avatar menu, settings/help dialogs, notification panel, responsive sidebar navigation, and simplified dashboard navbar.

This is a front-end capstone. Firebase Authentication and Firestore now provide role-aware user and tutor profiles, tutor registration, profile updates, and route protection. Bookings, messaging, earnings, reviews, and dashboard metrics do not have backend collections in this capstone, so they safely render empty/local UI states rather than fabricated user activity. No service-account credentials are used in the client.

## AI Integration

TutorFinder includes an AI-powered guidance assistant designed to help users understand and navigate the platform.

The assistant can answer questions such as:

- How can I find a tutor?
- How do I become a tutor?
- How does TutorFinder work?
- What should I do to get started?
- How can I use the platform's main features?

The AI is integrated through an OpenAI-compatible model and exposed through the application's server-side chat route.

The AI is intentionally used as a platform guidance layer rather than as a generic chatbot. Its purpose is to reduce user confusion and help students, parents, and tutors understand how to use TutorFinder.

The application also includes a local/mock fallback so the interface can continue to demonstrate its behavior when the AI service is unavailable.


## Authentication & User Roles

TutorFinder uses Firebase Authentication with Firestore-backed role management.

Supported roles:

- Tutor
- Student
- Parent

### Tutor flow

1. A user completes the Become a Tutor form.
2. Firebase Authentication creates the account.
3. A corresponding `users/{uid}` document stores the user's role.
4. A `tutors/{uid}` document stores the tutor profile.
5. The authenticated role is confirmed before routing.
6. Tutors are redirected to `/dashboard`.

### Student/Parent flow

Student and parent accounts are routed to the public application experience rather than the tutor dashboard.

Tutor dashboard access is protected by the authenticated Firebase UID and Firestore role.

Firestore security rules restrict user/tutor writes to the authenticated owner.

## Server-side and client-side relationship

Next.js Server Components are the default. Route `page.tsx` files can receive dynamic route parameters and render the correct feature without shipping unnecessary page logic to the browser. `layout.tsx` provides document metadata and the shared application shell.

Client Components are used only where browser interaction is required:

- `Header.tsx`: menu, Subjects dropdown, auth actions, and tutor modal
- Feature Views/ViewModels: form inputs, filtering, accordions, carousels, tabs, availability, and buttons
- `AuthContext.tsx`: browser Firebase auth state
- `ChatWidget`: interactive client chat UI

Server-side boundaries include the App Router pages, root metadata, and `src/app/api/chat/route.ts`. Firebase and tutor service modules provide replaceable data boundaries. The current tutor marketplace uses a clean local mock dataset, making a later Firebase query possible without rewriting the presentation layer.

## Performance & Accessibility

The application was tested using Google Lighthouse against the production deployment.

### Lighthouse Results

| Category | Desktop | Mobile |
|---|---:|---:|
| Performance | 100 | 99 |
| Accessibility | 93 | 93 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

### Performance improvements

Several performance improvements were made during development:

- Reduced unnecessary client-side JavaScript by moving static Home page content toward Server Components.
- Isolated interactive sections into smaller Client Components.
- Lazy-loaded the tutor modal so it is only loaded when required.
- Deferred Firebase authentication initialization on the Home route.
- Added responsive image sizing.
- Prioritized the main Hero image.
- Added a Firebase preconnect hint.
- Preserved zero Cumulative Layout Shift and zero Total Blocking Time in the final Lighthouse run.

The final production Lighthouse run reached 100 Performance on Desktop and 99 Performance on Mobile.

## SEO and accessibility

The root layout defines:

- `lang="en"`
- Page title: `TutorFinder`
- Description: `Find the right tutor for every learner.`

Semantic headings, navigation landmarks, buttons, labels, meaningful links, accessible dropdown/accordion controls, `aria-label` values for icon-only actions, and keyboard focus states are used throughout. Dynamic routes preserve meaningful page structure rather than rendering one large client-only dashboard. Images use meaningful alt text where image assets are available.

The implementation also includes reduced-motion handling with `prefers-reduced-motion`, so transitions and reveal effects become effectively instant while all functionality remains available.

## Responsive strategy

The layouts were designed as compositions, not desktop screens merely scaled down.

- 1440px/1280px: centered max-width containers, two-column profile areas, three-column tutor/results and review layouts, four-column footer.
- 1024px: reduced container width and subject/card columns.
- 768px: major layouts transition toward stacked content and mobile controls.
- 375px: mobile navbar, stacked Hero/About/profile sections, one-column tutor cards and reviews, mobile filter panel, stacked footer, full-width actions, and no intentional horizontal page overflow.

Responsive CSS uses existing spacing tokens and explicit SVG dimensions. This is important because inline SVGs without dimensions can fall back to browser default replaced-element sizing; scoped icon rules prevent arrows and card icons from becoming oversized.

## Reference-image workflow

For each supplied image, the implementation process was:

1. Identify the visual hierarchy and page rhythm.
2. Map image composition to existing TutorFinder sections and content.
3. Keep the existing route, feature, data, and interaction boundaries.
4. Rebuild markup around the intended composition instead of layering patches over the old UI.
5. Translate visual accents into centralized TutorFinder tokens.
6. Add responsive alternatives for mobile rather than shrinking desktop geometry.
7. Validate routes and TypeScript with a production build.

The references therefore guide design thinking while TutorFinder owns the final content, assets, colors, architecture, and behavior.

## Routes

```text
/                         Home
/find-tutors              Find Tutors marketplace
/find-tutors/[tutorId]    Tutor profile/details
/search-tutors            Compatibility redirect to /find-tutors
/tutor/[id]               Compatibility profile route
/saved                    Saved tutors
/messages                 Finder/tutor messages
/auth                     Login/register
/become-a-tutor           Tutor application entry
/dashboard                Tutor dashboard
/dashboard/profile        Tutor profile editing
/dashboard/bookings       Tutor bookings
/api/chat                 Server-side chat endpoint
```

## Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide Firebase/AI values as needed. Never commit `.env.local` or secret values.

Production validation:

```bash
npm run build
npm run start
```

The project writes Next.js build output to the system temporary directory because OneDrive can mark generated files inside the synced workspace as reparse points and cause `EINVAL`/`readlink` build failures. Generated output is ignored by Git.

## Known placeholders and future work

- `/images/hero-tutor.jpg` and `/images/about-tutor.jpg` depend on the final supplied image assets.
- Authenticated tutor profile fields, education, experience, photo references, and completeness are stored under the tutor's Firebase UID.
- Booking and message actions navigate to existing routes; backend booking/message workflows can be connected later.
- Contact and newsletter submissions currently exercise UI state; backend persistence is still a TODO.
- Social URLs currently use `#` placeholders.
- Public marketplace discovery continues to use the curated local tutor dataset; private tutor profile data is stored under the authenticated user's Firestore UID.
- `firestore.rules` restricts user/tutor writes to the authenticated owner and permits only explicitly public tutor profiles in discovery.
- Tutor login and registration resolve roles from `users/{uid}`, with tutors routed to `/dashboard` and student/parent accounts routed to the public landing experience.

## Testing

No automated unit, integration, or end-to-end test suite was added to this capstone.

Instead, the application was validated through:

- Production builds with `npm run build`
- `git diff --check`
- Manual authentication flows
- Tutor registration and role validation
- Tutor profile persistence through Firestore
- Tutor dashboard access protection
- Find Tutors filtering and navigation
- Tutor details loading
- Responsive testing across desktop and mobile layouts
- Lighthouse performance, accessibility, SEO, and best-practice audits

Automated testing is a planned future improvement, particularly for authentication, tutor registration, profile persistence, and protected dashboard routes.


## Deployment & Rollback

TutorFinder is deployed to Vercel and the production application is available at:

https://find-your-tutor.vercel.app/

### Deployment checklist

Before production deployment:

- [x] Production build completes successfully
- [x] Firebase Authentication configuration verified
- [x] Firestore configuration and security rules verified
- [x] Environment variables configured
- [x] Authentication flows manually tested
- [x] Tutor registration tested
- [x] Role-based dashboard access tested
- [x] Responsive layouts checked
- [x] Lighthouse audit completed
- [x] Production URL verified

### Rollback plan

The project is maintained in Git and deployed through Vercel.

If a production deployment introduces a regression:

1. Identify the last known-good Git commit/deployment.
2. Revert the problematic change or redeploy the previous working commit.
3. Verify the production URL and critical authentication flows.
4. Re-run the production build and Lighthouse checks before continuing development.

This provides a simple rollback path without requiring a separate infrastructure system.

## Known Limitations

TutorFinder is intentionally scoped as a frontend-focused capstone with selected Firebase functionality.

Currently implemented with Firebase:

- Authentication
- Tutor registration
- Role-based access
- Tutor profile persistence
- Education and experience data
- Profile completeness
- Firestore ownership rules
- Public tutor discovery

The following features currently use mock/local presentation data because their backend systems have not been implemented:

- Bookings and session management
- Real-time messaging
- Earnings
- Reviews
- Dashboard activity/analytics
- Notifications

The messaging and booking interfaces are therefore demonstrations of the intended frontend experience rather than production backend workflows.

Future work would include implementing the corresponding Firestore collections/backend services, real-time conversations, booking/session state management, notifications, and automated testing.

## Verification status

- Home, Find Tutors, and Tutor Details use the shared token/font system.
- Existing Home FAQ/contact behavior remains in the Home ViewModel.
- Find Tutors filtering, sorting, pagination, and mobile filters are ViewModel-owned.
- Tutor Details booking, messaging, saving, sharing, tabs, and availability are ViewModel-owned.
- No new carousel/icon UI dependency was added.
- Unused legacy TutorDetail files were removed only after confirming they were not imported.
- `npm run build` passes with zero errors.


## Reflection

The hardest part of this project was not simply writing the interface; it was repeatedly debugging and refining the design, authentication flow, and performance. I changed the design and layout more than five times before reaching a result that felt right. Authentication was another major challenge because the application needed to distinguish between tutor, student, and parent roles while keeping dashboard access protected.

The performance work was also challenging. Lighthouse initially exposed significant mobile performance problems, particularly around rendering, Firebase initialization, image delivery, and unnecessary client-side JavaScript. I had to inspect the application architecture rather than simply changing visual components. Moving appropriate content toward Server Components, isolating interactive sections, optimizing images, and deferring authentication initialization eventually brought the production Lighthouse Performance score to 100 on desktop and 99 on mobile.

If I were starting the project again, I would design and build the authentication architecture first and then connect it to the UI. I would also spend more time planning the application structure before writing components. Working with coding agents taught me that planning and inspection are just as important as implementation. Instead of immediately asking an agent to build something, inspecting the existing code, defining the exact design requirements, and giving the agent a detailed implementation prompt produced much better results.

One thing that surprised me was how much better the development process became when I switched from simply generating code to treating the coding agent as an implementation partner. I remember moving from Claude to Codex, inspecting the project, preparing a detailed design and implementation prompt, and then giving it to Codex. The resulting implementation was much closer to what I wanted than my earlier iterations. That experience taught me that AI coding tools are most effective when the developer provides clear planning, constraints, context, and acceptance criteria before implementation begins.
