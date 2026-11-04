# 05. REST API Specification

## 1. Global Conventions & Standards

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Authentication**: Session cookie or `Authorization: Bearer <clerk_jwt>`
- **Standard Pagination Query Params**:
  - `page`: Integer (default: `1`, min: `1`)
  - `limit`: Integer (default: `20`, max: `100`)
  - `sortBy`: String field name
  - `sortOrder`: `asc` | `desc` (default: `desc`)

### Standard Response Shape
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### Standard Error Response Shape
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The payload provided does not conform to validation schemas.",
    "details": [
      { "field": "phone", "message": "Phone number must be a valid Kenyan MSISDN (+254...)" }
    ]
  }
}
```

---

## 2. API Endpoints Catalog

### Geography (`/api/v1/geo`)
- `GET /api/v1/geo/counties`: Retrieve all 47 Kenyan counties. (Public)
- `GET /api/v1/geo/counties/:code/sub-counties`: Retrieve sub-counties for a county. (Public)
- `GET /api/v1/geo/sub-counties/:id/wards`: Retrieve wards for a sub-county. (Public)

### Chapters (`/api/v1/chapters`)
- `GET /api/v1/chapters`: List chapters with filters (`countyCode`, `search`, `status`). (Public)
- `GET /api/v1/chapters/:slug`: Retrieve full chapter details, executive committee, meeting schedule. (Public)
- `POST /api/v1/chapters`: Create a new chapter. (Requires `county_coordinator` or `national_admin`)
- `PUT /api/v1/chapters/:id`: Update chapter details. (Requires `chapter_chair` or higher)

### Members & Onboarding (`/api/v1/members`)
- `GET /api/v1/members/me`: Retrieve current logged-in member profile & permissions. (Authenticated)
- `POST /api/v1/members/register`: Submit multi-step registration & KDPA consent. (Authenticated)
- `PUT /api/v1/members/me`: Update personal profile details. (Authenticated)
- `POST /api/v1/members/me/export`: Download personal profile and activity data. (Authenticated)
- `DELETE /api/v1/members/me`: Request account and data deletion under KDPA. (Authenticated)
- `GET /api/v1/members`: Query member directory within leader's scope. (Requires `chapter_secretary`+)
- `POST /api/v1/members/:id/verify`: Approve or verify pending membership. (Requires `chapter_chair`+)

### Events & RSVPs (`/api/v1/events`)
- `GET /api/v1/events`: List public and chapter events. (Public / Scoped)
- `GET /api/v1/events/:slug`: Get event details and RSVP summary. (Public)
- `POST /api/v1/events`: Create an event. (Requires `chapter_secretary`+)
- `PUT /api/v1/events/:id`: Update an event. (Requires `chapter_secretary`+)
- `POST /api/v1/events/:id/rsvp`: Submit or update RSVP status. (Authenticated)
- `GET /api/v1/events/:id/roster`: Export attendee roster to CSV. (Requires `chapter_secretary`+)

### Announcements (`/api/v1/announcements`)
- `GET /api/v1/announcements`: Retrieve active announcements by scope. (Public)
- `POST /api/v1/announcements`: Publish announcement. (Requires `chapter_secretary`+)
- `DELETE /api/v1/announcements/:id`: Remove announcement. (Requires `chapter_chair`+)

### Webhooks & Administrative (`/api/v1/admin`)
- `POST /api/v1/webhooks/clerk`: Process Clerk user events with Svix signature verification.
- `GET /api/v1/admin/audit-logs`: Query immutable system audit logs. (Requires `national_admin`+)
- `POST /api/v1/admin/roles/assign`: Update user administrative role. (Requires `national_admin`+)
