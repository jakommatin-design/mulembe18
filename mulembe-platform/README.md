# Mulembe National Platform

The official digital infrastructure for the Luhya community across Kenya's 47 counties and global diaspora.

## Tech Stack
- **Framework:** Next.js 16+ App Router (TypeScript, Strict Mode)
- **Styling:** Bootstrap 5 with custom Sass (`src/styles/theme.scss`) + React-Bootstrap. **No Tailwind CSS.**
- **Design System:** Luxury Glassmorphism with deep heritage emerald (`#08281A`) and gold (`#D4AF37`) accents.
- **Database:** TiDB Cloud Serverless (MySQL-compatible) with Drizzle ORM.
- **Auth:** Clerk with role mirroring.
- **Validation:** Zod schemas shared between frontend and backend (`src/lib/schemas`).
- **Testing:** Vitest (Unit/Integration) and Playwright (E2E).

---

## Directory Structure
```
mulembe-platform/
├── docs/                 # Complete architecture and specifications
├── tests/                # Vitest & Playwright test suites
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── design-system/# Living interactive style guide
│   │   └── api/          # Route handlers
│   ├── components/       # Reusable Bootstrap & React components
│   ├── lib/              # Shared schemas, db client, auth helpers
│   ├── server/           # Controllers, Services, Repositories
│   └── styles/           # Custom Sass glassmorphism theme
└── .env.example          # Environment variable template
```

---

## Verification & Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm run test

# 3. Type check (strict mode)
npm run typecheck

# 4. Lint check
npm run lint

# 5. Production build
npm run build

# 6. Run development server
npm run dev
```

Visit `http://localhost:3000/design-system` to explore the interactive glassmorphism component showcase.
