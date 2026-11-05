# PROGRESS TRACKER: Mulembe National Platform Master Build

Status Legend:

- [x] Complete
- [ ] In Progress / Pending

---

## Build Checklist

- [x] **Prompt 0: Context and ground rules**
  - Scope and fixed decisions locked (TypeScript, Bootstrap 5 + Sass, React-Bootstrap, Next.js App Router, TiDB, Clerk, Zod, clean layered architecture).
  - Confirmation and architectural alignment completed.

- [x] **Prompt 1: Architecture and documentation set**
  - Complete documentation created in `/docs`:
    - `00-vision-and-scope.md`
    - `01-requirements.md`
    - `02-user-roles-and-permissions.md`
    - `03-system-architecture.md`
    - `04-database-design.md`
    - `05-api-specification.md`
    - `06-ui-ux-and-design-system.md`
    - `07-security-and-privacy.md`
    - `08-deployment-and-environments.md`
    - `09-testing-strategy.md`
    - `10-migration-from-mulembe18.md`
    - `docs/ADR/` (ADR 001 - 004)

- [x] **Prompt 1b: Luxury glassmorphism design system**
  - Specification created in `docs/11-glassmorphism-design-system.md`.
  - Luxury heritage emerald & gold color palette, frosted glass tokens, and responsive elevation scales defined.

- [x] **Prompt 2: Repository scaffold and tooling**
  - Clean Next.js App Router project initialized in `mulembe-platform`.
  - Installed Bootstrap 5, React-Bootstrap, Sass, Zod, Vitest.
  - Custom Sass glassmorphism theme (`src/styles/theme.scss`) created.
  - Layered directory structure established (`src/server/{controllers,services,repositories}`, `src/lib/{schemas,db,auth}`).
  - Security headers, `.env.example`, Vitest config, and `README.md` configured.

- [x] **Prompt 3: Database, migrations, and seed data**
  - Drizzle ORM schema created (`src/lib/db/schema.ts`) covering all 10 core tables: `counties`, `sub_counties`, `wards`, `users`, `chapters`, `memberships`, `events`, `rsvps`, `announcements`, `audit_logs` with proper indexes.
  - Dedicated `mulembe_national` database isolated on TiDB Cloud Serverless to prevent collisions with the legacy schema.
  - Drizzle migration generated and applied cleanly.
  - Idempotent seed script (`scripts/seed.ts`) seeded all 47 official Kenyan counties, sample sub-counties, wards, and 4 foundational chapters.
  - Repository layer created (`geography.repository.ts`, `chapter.repository.ts`, `member.repository.ts`).
  - Unit tests added in `tests/repositories.test.ts` (7 tests passing).
  - Typecheck, ESLint, and Next.js build all passing cleanly.

- [x] **Prompt 4: Authentication and authorisation**
  - Integrated Clerk (`@clerk/nextjs` + `svix`) with root `<ClerkProvider>` and custom glassmorphic sign-in (`/sign-in`) & sign-up (`/sign-up`) flows.
  - Implemented Clerk middleware (`src/middleware.ts`) enforcing authentication for protected routes and granting public access to marketing and geo endpoints.
  - Built scope-aware Role-Based and Attribute-Based Access Control (`src/lib/auth/roles.ts`) based on the 7-role permissions matrix in `docs/02-user-roles-and-permissions.md` (`guest`, `member`, `chapter_secretary`, `chapter_chair`, `county_coordinator`, `national_admin`, `super_admin`).
  - Created server auth session helper (`src/lib/auth/session.ts`) with automated DB sync and first-login fallback.
  - Created Clerk webhook endpoint (`src/app/api/webhooks/clerk/route.ts`) with Svix signature verification handling `user.created`, `user.updated`, and `user.deleted`.
  - Created Audit Log repository (`src/server/repositories/audit.repository.ts`) and wired audit logging into role assignments and user syncs.
  - Created protected `/profile` page demonstrating authenticated session status, membership verification, and KDPA compliance notice.
  - Added 14 comprehensive unit tests in `tests/auth-rbac.test.ts` (all 21 total tests passing).
  - Production build (`next build --webpack`), typecheck, and lint pass with 0 errors.

- [x] **Prompt 5: Core API modules**
  - Built all 6 modular backend domains following strict layered architecture (Zod Schemas -> Repositories -> Services -> Controllers -> Route Handlers):
    1. **Geography (`/api/v1/geo`)**:
       - `GET /api/v1/geo/counties`: Returns all 47 official Kenyan counties.
       - `GET /api/v1/geo/counties/:code/sub-counties`: Sub-county cascades with 3-digit validation.
       - `GET /api/v1/geo/sub-counties/:id/wards`: Wards within a sub-county.
    2. **Chapters (`/api/v1/chapters`)**:
       - `GET /api/v1/chapters`: Paginated, county-filtered list of active chapters.
       - `GET /api/v1/chapters/:slug`: Full chapter details by unique slug.
       - `POST /api/v1/chapters`: Role/scope guarded chapter creation (coordinator/admin) with audit logs.
       - `PUT /api/v1/chapters/:slug`: Role/scope guarded chapter updates.
    3. **Members & Onboarding (`/api/v1/members`)**:
       - `GET /api/v1/members/me`: Authenticated profile fetch.
       - `POST /api/v1/members/register`: KDPA-consented multi-step registration issuing formatted membership IDs (`MLB-XXX-XXXXX`).
       - `PUT /api/v1/members/me`: Profile updates.
       - `GET /api/v1/members`: Scoped member roster query (chapter/county boundary enforcement).
       - `POST /api/v1/members/:id/verify`: Leader verification/approval of pending members.
    4. **Events & RSVPs (`/api/v1/events`)**:
       - `GET /api/v1/events`: List public and chapter-scoped events.
       - `GET /api/v1/events/:slug`: Event details with attending RSVP counts.
       - `POST /api/v1/events`: Chapter-scoped event creation.
       - `POST /api/v1/events/:id/rsvp`: User event RSVP (attending, tentative, declined) with guest count.
    5. **Announcements (`/api/v1/announcements`)**:
       - `GET /api/v1/announcements`: Active, unexpired announcements filtered by chapter/county scope.
       - `POST /api/v1/announcements`: Publish announcement within leader scope.
       - `DELETE /api/v1/announcements/:id`: Remove announcement.
    6. **Notifications (`/api/v1/notifications`)**:
       - `POST /api/v1/notifications/send`: Multi-channel (email/sms) dispatch within leader scope.
  - Implemented standard response format (`apiSuccess`) and error format (`apiError`) per `docs/05-api-specification.md`.
  - Added in-memory sliding-window rate limiting on write and search endpoints (`src/lib/api/rate-limit.ts`).
  - Added 14 unit and integration tests in `tests/api-modules.test.ts` (all 35 suite tests passing).
  - Clean Next.js production build (`next build --webpack`), typecheck, and ESLint passing with 0 errors.

- [x] **Prompt 6: Frontend foundation and design system**
  - Fully typed HTTP client (`src/lib/api/client.ts`) with `ApiClientError`, standard envelope unwrapping, and Zod response validation.
  - Core glassmorphic UI component library built per Prompt 1b specs:
    - `GlassCard`: Frosted translucent card container with header/body/footer and interactive elevation.
    - `FormField`: Floating label styled input with validation feedback, error messages, and helper text.
    - `DataTable`: Responsive glass table with client-side sorting, pagination, and empty state support.
    - `GlassModal`: Accessible React-Bootstrap modal with frosted glass styling and backdrop blur.
    - `ConfirmDialog`: Standardized confirmation modal for destructive or critical actions.
    - `EmptyState`: Contextual zero-data illustration with call-to-action button.
    - `SkeletonLoader`: Shimmer pulse animation placeholders for cards, text rows, and user avatars.
    - `ToastProvider`: Global context provider and toast container with auto-dismiss and color variants.
  - Global application layout and shell:
    - `Navbar`: Responsive navigation bar with mobile offcanvas drawer, live Clerk auth status, profile links, and glass backdrop blur.
    - `Footer`: Comprehensive footer with Luhya county coverage badges, quick links, KDPA compliance note, and copyright.
    - `RootLayout`: Wraps application in `<ClerkProvider>` and `<ToastProvider>` with custom Inter typography and theme Sass.
    - `error.tsx` & `loading.tsx`: Graceful glassmorphic error boundary and route-level skeleton loader.
  - All 35 test suite tests passing, TypeScript strict typecheck clean, ESLint clean, and Next.js production build passing with 0 errors.

- [x] **Prompt 7: Public pages**
  - **Cinematic Home (`/`)**: High-impact editorial hero, live database counters (47 counties, active chapters, upcoming events, KDPA protection), core heritage values, featured regional chapters preview, upcoming gatherings list, official dispatches column, and call to action. Includes Organization JSON-LD structured data.
  - **About Platform (`/about`)**: Luhya historical origins, all 18 ancestral sub-tribes showcase, 3-tier governance hierarchy (Council of Elders, County Steering Desks, Ward Chapters), constitutional pillars, and Office of the Data Protection Commissioner (ODPC) privacy pledge.
  - **Chapters Directory (`/chapters`)**: Complete directory with instant client-side search across name, venue, and descriptions, county-level filter (all 47 Kenyan counties), meeting schedule & venue badges, and direct navigation.
  - **Chapter Profile (`/chapters/[slug]`)**: Dedicated chapter portal detailing meeting logistics, venue address, leadership contact desk, administrative zone, and upcoming chapter-specific events with fallback to not-found.
  - **Events & Gatherings (`/events`)**: National community calendar with category filtering (Cultural, Youth/Professional, AGM, Welfare, Sports), capacity indicators, date & EAT time formatting, and direct RSVP navigation.
  - **Event Detail & RSVP (`/events/[slug]`)**: Full event dossier, venue directions, virtual livestream broadcast links, confirmed RSVP count, interactive glass RSVP modal with attendance status selection and guest count picker, and Event JSON-LD schema for search engine event indexing.
  - **News & Official Bulletins (`/news`)**: Stream of official notices and dispatches categorized by priority (Urgent, Important, Routine) with county scopes and expiry dates.
  - **Contact & Secretariat Desks (`/contact`)**: National Secretariat headquarters details, regional desk directories (Western, Coast, Diaspora), and interactive glass inquiry form with client validation and toast dispatch notifications.
  - **SEO & Indexing**: Dynamic `src/app/sitemap.ts` (`/sitemap.xml`) indexing static routes, active chapters, and published events. Dynamic `src/app/robots.ts` (`/robots.txt`) with crawler rules and sitemap reference. Open Graph tags and meta tags across all pages.
  - **Testing & Verification**: 5 test suites with 40 passing tests in Vitest (`tests/public-pages.test.ts`), 0 TypeScript strict errors (`tsc --noEmit`), 0 ESLint warnings/errors, and complete Next.js production build (`next build --webpack`) producing 31 clean routes.

- [x] **Prompt 8: Member experience**
  - **Multi-Step Onboarding Flow (`/onboarding`)**:
    - Step 1 (Personal details): Legal full name, phone verification (`+254XXXXXXXXX`), optional national ID/passport, gender, and clan mapping.
    - Step 2 (Location & Heritage): Ancestral county selector (roots prefix) and cascading Current County $\to$ Sub-County $\to$ Ward selectors fetching live from `/api/v1/geo/*`.
    - Step 3 (Chapter Affiliation): Selection of registered chapters with venue and meeting schedule details.
    - Step 4 (KDPA Consent & Confirmation): Review summary, mandatory explicit consent checkbox under the Kenya Data Protection Act 2019, and generation of structured Membership ID (`MLB-<county>-<random5>`).
    - Form recovery: Auto-saves progress to `localStorage` (`mulembe_onboarding_draft`) so drafts survive page refresh or network drops.
  - **Member Dashboard (`/profile`)**:
    - **Digital Member Card**: Luxury glassmorphic card with holographic emerald/gold borders, formatted Member ID (`MLB-037-XXXXX`), status pill, and ODPC encrypted QR representation.
    - **Profile Management**: Profile attribute drawer with modal edit flow updating name, phone, gender, and clan via `PUT /api/v1/members/me`.
    - **Chapter Affiliation Portal**: Displays active chapter affiliation, meeting venue, member privileges, with self-service "Join Chapter" modal and "Leave Chapter" confirmation.
    - **My Gatherings & RSVPs**: Lists all events the member has RSVP'd to with dates, venues, attendance status, and direct event links.
    - **KDPA Data Rights (Self-Service)**:
      - *Right of Access*: One-click download of personal dossier archive (`.json`) containing profile, chapter records, and RSVPs via `GET /api/v1/members/export`.
      - *Right to Erasure*: Modal confirmation to permanently anonymize and delete user data via `DELETE /api/v1/members/me`.
  - **In-App Notifications Page (`/notifications`)**:
    - Member dispatch stream filtered by priority (*Urgent*, *Important*, *Routine*), county/chapter scope tags, mark-as-read acknowledgement, and dismiss actions.
  - **API Endpoints**:
    - `POST /api/v1/members/chapters/join`: Chapter joining
    - `POST /api/v1/members/chapters/leave`: Chapter departure
    - `GET /api/v1/members/rsvps`: Member RSVP query
    - `GET /api/v1/members/export`: KDPA machine-readable JSON dossier export
    - `DELETE /api/v1/members/me`: KDPA self-service account deletion and anonymization
  - **Testing & Verification**: 6 test suites with 45 passing tests (`tests/member-experience.test.ts`), 0 TypeScript strict errors (`tsc --noEmit`), 0 ESLint warnings/errors, and complete Next.js production build (`next build --webpack`) producing 36 clean routes.

- [ ] **Prompt 9: Leader and admin dashboards**
- [ ] **Prompt 10: Notifications and communication**
- [ ] **Prompt 11: Migration from mulembe18**
- [ ] **Prompt 12: Hardening, performance, and launch**
