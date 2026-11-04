# 01. Functional & Non-Functional Requirements

## 1. Functional Requirements (FR)

### Module 1: Geographic Hierarchy & Chapter Organization
- **FR-GEO-01**: The system shall store and validate the complete official Kenyan administrative hierarchy: 47 Counties, Sub-Counties, and Wards.
- **FR-GEO-02**: Chapters must be bound to a specific geographic scope (County, Sub-County, or Diaspora territory).
- **FR-GEO-03**: Users shall be able to browse and filter chapters by County and keyword search.
- **FR-GEO-04**: Each chapter page shall display executive leadership, meeting schedules, active events, and public notices.

### Module 2: Member Identity & Lifecycle
- **FR-MEM-01**: User authentication shall be authenticated via Clerk, supporting Email/Password, Google OAuth, and Phone SMS OTP.
- **FR-MEM-02**: Multi-step registration must capture:
  1. Personal Profile (Full Name, Gender, DOB, National ID/Passport).
  2. Cultural/Ancestral Heritage (Sub-tribe/Clan, Ancestral County/Ward).
  3. Current Residence (Current County, Sub-County, Ward, or Diaspora Country).
  4. Chapter Affiliation (Primary Chapter).
  5. Mandatory KDPA Consent.
- **FR-MEM-03**: Members shall have a unique, cryptographically verifiable Membership ID (e.g., `MLB-047-XXXXXX`).
- **FR-MEM-04**: Members may request chapter transfers, subject to chapter leadership review.
- **FR-MEM-05**: Members must be able to export their personal data (JSON/PDF) and request account deletion in compliance with KDPA.

### Module 3: Event Management & RSVPs
- **FR-EVT-01**: Chapter leaders and National Admins may create, edit, cancel, and publish events within their scope.
- **FR-EVT-02**: Events must specify: Title, Description, Category (Cultural, AGM, Welfare, Youth, Diaspora), Venue (Physical or Virtual URL), Start/End Dates, Capacity, and RSVP Deadlines.
- **FR-EVT-03**: Verified members can RSVP (Attending, Tentative, Declined) with optional guest count.
- **FR-EVT-04**: Leaders can export attendance rosters to CSV.

### Module 4: Announcements & Noticeboard
- **FR-NOT-01**: Announcements can be published with scope targeting: Chapter-only, County-wide, or National.
- **FR-NOT-02**: Notices support urgency levels: Routine, Important, and Urgent/Bereavement.
- **FR-NOT-03**: System must enforce an expiration date on operational notices.

### Module 5: Administrative Dashboards
- **FR-DASH-01**: Chapter Secretaries/Chairs shall have access to the Chapter Management Dashboard.
- **FR-DASH-02**: County Coordinators shall access aggregate statistics and member directories across their constituent chapters.
- **FR-DASH-03**: National Admins shall have system-wide visibility, chapter creation privileges, and audit log inspection.
- **FR-DASH-04**: All dashboards must support CSV export of filtered member and event records.

---

## 2. Non-Functional Requirements (NFR)

### Performance & Scalability
- **NFR-PERF-01**: Server response times (TTFB) for cached public pages shall be under 200ms on Vercel Edge.
- **NFR-PERF-02**: API Route handlers shall execute in under 400ms (p95) on TiDB Cloud Serverless.
- **NFR-PERF-03**: Client JavaScript bundle footprint must be minimized using React Server Components by default.

### Security & Privacy
- **NFR-SEC-01**: All database connections must enforce TLS/SSL with valid certificates.
- **NFR-SEC-02**: Clerk session tokens must be validated on every mutating API endpoint.
- **NFR-SEC-03**: Input payloads must be strictly validated using shared Zod schemas before hitting business logic.
- **NFR-SEC-04**: Rate limiting must be enforced on all public search and form submission endpoints (Upstash Redis or in-memory sliding window).
- **NFR-SEC-05**: OWASP Top 10 vulnerabilities (XSS, CSRF, SQL Injection, SSRF) must be mitigated by design.

### Usability & Accessibility
- **NFR-A11Y-01**: All user interface elements must satisfy WCAG 2.1 Level AA color contrast ratios (minimum 4.5:1 for normal text).
- **NFR-A11Y-02**: Responsive layouts must function seamlessly on viewports from 360px (mobile) up to 2560px (4K monitors).
- **NFR-A11Y-03**: Interactive components must support full keyboard navigation (Tab, Enter, Escape, Arrow keys) and screen reader ARIA landmarks.
