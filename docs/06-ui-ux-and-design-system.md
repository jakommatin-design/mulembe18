# 06. UI/UX Specifications & Bootstrap Foundation

## 1. Sitemap & Public Information Architecture

```
/ (Home: Cinematic Hero, Heritage Values, National Reach, Quick Actions)
├── /about (History, Leadership Structure, Constitution, Elder Council)
├── /chapters (Directory of Chapters across 47 Counties, Search, Interactive Filters)
│   └── /chapters/[slug] (Chapter Profile, Executives, Venue, Upcoming Events)
├── /events (National & Regional Event Calendar, Category Filters)
│   └── /events/[slug] (Event Details, Directions, Online Links, RSVP Modal)
├── /news (Press Releases, Community Bulletins, Bereavement Notices)
├── /contact (National Secretariat, County Desks, Feedback Form)
├── /onboarding (Multi-step Registration Flow for Authenticated Users)
├── /profile (Member ID Card, Chapter Membership, Registered RSVPs)
└── /dashboard
    ├── /dashboard/chapter (Chapter Roster, Approvals, Meeting Planner)
    ├── /dashboard/county (County-level Chapter Aggregates, Coordinator Tools)
    └── /dashboard/national (Platform Governance, Audit Logs, Role Delegations)
```

---

## 2. Bootstrap 5 & React-Bootstrap Architecture

The platform uses standard **Bootstrap 5** loaded via Sass customization in `src/styles/theme.scss`. 

### Key Rules:
1. **No Tailwind CSS**. All layouts utilize Bootstrap grid (`container`, `row`, `col-12`, `col-md-6`, `col-lg-4`).
2. **React-Bootstrap Components**:
   - `Modal` for confirmation dialogs and RSVP flows.
   - `Dropdown` for user profile menus and chapter filters.
   - `Navbar` & `Offcanvas` for mobile responsive navigation.
   - `Toast` for non-blocking feedback notifications.
   - `Collapse` and `Accordion` for FAQ and multi-step forms.
3. **Responsive Breakpoints**:
   - `xs`: <576px (Mobile 360px+ first-class support)
   - `sm`: ≥576px
   - `md`: ≥768px (Tablets)
   - `lg`: ≥992px (Desktop)
   - `xl`: ≥1200px
   - `xxl`: ≥1400px

---

## 3. Form Patterns & Micro-Interactions

- **County-to-Ward Cascade**: Selecting a County asynchronously loads its Sub-Counties; selecting a Sub-County populates its Wards. Form retains state on connection loss via local storage syncing.
- **Glassmorphic Feedback**: Form fields turn subtly green on valid input and display contextual gold/crimson error badges beneath inputs upon validation failure.
- **Loading & Empty States**: Every listing view (members, events, chapters) implements a frosted Glass Skeleton Loader while fetching and an elegant empty state with actionable CTAs when results are empty.
