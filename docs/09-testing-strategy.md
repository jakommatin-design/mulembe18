# 09. Testing Strategy & Quality Assurance

## 1. Testing Pyramid

```
       /\
      /  \      E2E Tests (Playwright)
     /----\     - Full Onboarding & Chapter Join Flow
    /      \    - Admin Approval & Role Scoping Flow
   /--------\   Integration Tests (Vitest + TiDB Transaction Rollback)
  /          \  - Service Layer & Scope Verification
 /------------\ Unit Tests (Vitest)
/              \- Zod Schemas, Domain Helpers, Formatters
```

---

## 2. Test Suites & Frameworks

### Unit Testing (Vitest)
- **Targets**: Zod schemas in `src/lib/schemas`, utility functions, date/currency formatters, geographic mapping algorithms.
- **Execution**: Runs in under 5 seconds with in-memory execution.

### Integration Testing (Vitest + Repository Mocks / Test DB)
- **Targets**: Controller $\leftrightarrow$ Service $\leftrightarrow$ Repository interactions.
- **Crucial Invariants Tested**:
  1. Unauthorized requests return `401 Unauthorized`.
  2. A `chapter_secretary` cannot approve members in another chapter (`403 Forbidden`).
  3. A `county_coordinator` can only create events in chapters within their assigned county.
  4. Deduplication of email and phone numbers during registration.

### End-to-End Testing (Playwright)
- **Targets**: Browser testing covering mobile viewport (360x640) and desktop (1440x900).
- **Scenarios**:
  1. Public page navigation (Home $\rightarrow$ Chapters $\rightarrow$ Chapter Detail).
  2. Multi-step onboarding form with County $\rightarrow$ Sub-County cascade.
  3. Leader dashboard CSV export action.
  4. Dark mode / Light mode theme toggling.
