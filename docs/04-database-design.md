# 04. Database Design & Entity-Relationship Model

## 1. Relational ER Diagram

```mermaid
erDiagram
    COUNTIES ||--o{ SUB_COUNTIES : contains
    SUB_COUNTIES ||--o{ WARDS : contains
    COUNTIES ||--o{ CHAPTERS : hosts
    CHAPTERS ||--o{ MEMBERSHIPS : enrolls
    USERS ||--o{ MEMBERSHIPS : holds
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ NOTIFICATIONS : receives
    CHAPTERS ||--o{ EVENTS : organizes
    EVENTS ||--o{ RSVPS : collects
    USERS ||--o{ RSVPS : makes
    CHAPTERS ||--o{ ANNOUNCEMENTS : broadcasts

    COUNTIES {
        string code PK "001 to 047"
        string name "e.g., Kakamega, Bungoma, Nairobi"
        string region "Western, Coast, Rift Valley, etc."
    }

    SUB_COUNTIES {
        string id PK
        string county_code FK
        string name
    }

    WARDS {
        string id PK
        string sub_county_id FK
        string name
    }

    USERS {
        string id PK "Clerk User ID"
        string national_id UK "Encrypted / Hashed"
        string email UK
        string phone UK
        string full_name
        string clan
        string role "member, chapter_sec, chapter_chair, county_coord, national_admin, super_admin"
        string ancestral_county_code FK
        string current_county_code FK
        string status "pending, active, suspended, deleted"
        datetime kdpa_consent_at
        datetime created_at
        datetime updated_at
        datetime deleted_at "Soft delete"
    }

    CHAPTERS {
        string id PK "UUID"
        string slug UK
        string name "e.g., Mombasa Coastal Chapter"
        string county_code FK
        string sub_county_id FK "Optional"
        string description
        string meeting_venue
        string meeting_schedule
        string status "active, pending, inactive"
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    MEMBERSHIPS {
        string id PK
        string user_id FK
        string chapter_id FK
        string role "member, secretary, chairperson, treasurer"
        string status "pending, active, transferred, inactive"
        datetime joined_at
        datetime updated_at
    }

    EVENTS {
        string id PK
        string chapter_id FK "Null if national"
        string title
        string slug UK
        string description
        string category "cultural, agm, welfare, youth, sports"
        datetime start_time
        datetime end_time
        string venue_name
        string venue_address
        string online_url
        int capacity
        string status "draft, published, cancelled, completed"
        datetime created_at
        datetime updated_at
    }

    RSVPS {
        string id PK
        string event_id FK
        string user_id FK
        string status "attending, tentative, declined"
        int guests_count
        datetime created_at
        datetime updated_at
    }

    ANNOUNCEMENTS {
        string id PK
        string chapter_id FK "Null if national"
        string county_code FK "Null if chapter or national"
        string title
        text content
        string priority "routine, important, urgent"
        datetime expires_at
        datetime created_at
    }

    NOTIFICATIONS {
        string id PK
        string user_id FK
        string title
        string message
        string channel "in_app, email, sms"
        string status "pending, sent, failed, read"
        datetime created_at
    }

    AUDIT_LOGS {
        string id PK
        string actor_id FK "User ID"
        string action "e.g., user.role_updated, chapter.created"
        string target_entity "user, chapter, event"
        string target_id
        json payload_before
        json payload_after
        string ip_address
        string user_agent
        datetime created_at
    }
```

---

## 2. Indexing Strategy for TiDB Cloud Scale

To support tens of thousands of members across Kenya with sub-50ms query latency:

1. **`users` Table**:
   - `INDEX idx_users_phone (phone)`
   - `INDEX idx_users_email (email)`
   - `INDEX idx_users_role (role)`
   - `INDEX idx_users_current_county (current_county_code)`
   - `INDEX idx_users_clan (clan)`
2. **`memberships` Table**:
   - `UNIQUE INDEX unq_user_chapter (user_id, chapter_id)`
   - `INDEX idx_memberships_chapter_status (chapter_id, status)`
3. **`events` Table**:
   - `INDEX idx_events_chapter_start (chapter_id, start_time)`
   - `INDEX idx_events_status_start (status, start_time)`
4. **`announcements` Table**:
   - `INDEX idx_announcements_scope (chapter_id, county_code, expires_at)`
5. **`audit_logs` Table**:
   - `INDEX idx_audit_actor (actor_id, created_at)`
   - `INDEX idx_audit_target (target_entity, target_id)`
