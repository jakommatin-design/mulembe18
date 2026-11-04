import {
  mysqlTable,
  varchar,
  text,
  int,
  datetime,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// 1. Administrative Geography: 47 Counties of Kenya
export const counties = mysqlTable(
  "counties",
  {
    code: varchar("code", { length: 3 }).primaryKey(), // '001' to '047'
    name: varchar("name", { length: 100 }).notNull(),
    region: varchar("region", { length: 100 }).notNull(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    unqName: uniqueIndex("unq_counties_name").on(table.name),
  })
);

// 2. Sub-Counties
export const subCounties = mysqlTable(
  "sub_counties",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    countyCode: varchar("county_code", { length: 3 })
      .notNull()
      .references(() => counties.code, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    idxCounty: index("idx_subcounties_county").on(table.countyCode),
  })
);

// 3. Wards
export const wards = mysqlTable(
  "wards",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    subCountyId: varchar("sub_county_id", { length: 64 })
      .notNull()
      .references(() => subCounties.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    idxSubcounty: index("idx_wards_subcounty").on(table.subCountyId),
  })
);

// 4. Users / Members (Mirroring Clerk Identity)
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 128 }).primaryKey(), // Clerk user ID
    membershipId: varchar("membership_id", { length: 32 }).unique(), // e.g., 'MLB-037-00123'
    fullName: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    nationalId: varchar("national_id", { length: 64 }), // Hashed or encrypted
    gender: varchar("gender", { length: 20 }),
    clan: varchar("clan", { length: 100 }), // Luhya sub-tribe / clan (Bukusu, Maragoli, etc.)
    role: varchar("role", { length: 32 }).default("member").notNull(), // member, chapter_sec, chapter_chair, county_coord, national_admin, super_admin
    ancestralCountyCode: varchar("ancestral_county_code", { length: 3 }),
    currentCountyCode: varchar("current_county_code", { length: 3 }),
    status: varchar("status", { length: 32 }).default("pending").notNull(), // pending, active, suspended, deleted
    kdpaConsentAt: datetime("kdpa_consent_at"),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: datetime("deleted_at"), // Soft deletion
  },
  (table) => ({
    unqEmail: uniqueIndex("unq_users_email").on(table.email),
    unqPhone: uniqueIndex("unq_users_phone").on(table.phone),
    idxRole: index("idx_users_role").on(table.role),
    idxStatus: index("idx_users_status").on(table.status),
    idxCurrentCounty: index("idx_users_current_county").on(table.currentCountyCode),
  })
);

// 5. Chapters
export const chapters = mysqlTable(
  "chapters",
  {
    id: varchar("id", { length: 64 }).primaryKey(), // UUID
    slug: varchar("slug", { length: 100 }).notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    countyCode: varchar("county_code", { length: 3 })
      .notNull()
      .references(() => counties.code),
    subCountyId: varchar("sub_county_id", { length: 64 }),
    description: text("description"),
    meetingVenue: varchar("meeting_venue", { length: 255 }),
    meetingSchedule: varchar("meeting_schedule", { length: 255 }),
    status: varchar("status", { length: 32 }).default("active").notNull(), // active, pending, inactive
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: datetime("deleted_at"),
  },
  (table) => ({
    unqSlug: uniqueIndex("unq_chapters_slug").on(table.slug),
    idxCounty: index("idx_chapters_county").on(table.countyCode),
    idxStatus: index("idx_chapters_status").on(table.status),
  })
);

// 6. Chapter Memberships
export const memberships = mysqlTable(
  "memberships",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chapterId: varchar("chapter_id", { length: 64 })
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 32 }).default("member").notNull(), // member, secretary, chairperson, treasurer
    status: varchar("status", { length: 32 }).default("pending").notNull(), // pending, active, transferred, inactive
    joinedAt: datetime("joined_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    unqUserChapter: uniqueIndex("unq_user_chapter").on(table.userId, table.chapterId),
    idxChapterStatus: index("idx_memberships_chapter_status").on(table.chapterId, table.status),
    idxUser: index("idx_memberships_user").on(table.userId),
  })
);

// 7. Events
export const events = mysqlTable(
  "events",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    chapterId: varchar("chapter_id", { length: 64 }), // Null if national event
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).default("cultural").notNull(), // cultural, agm, welfare, youth, sports
    startTime: datetime("start_time").notNull(),
    endTime: datetime("end_time").notNull(),
    venueName: varchar("venue_name", { length: 255 }).notNull(),
    venueAddress: varchar("venue_address", { length: 255 }),
    onlineUrl: varchar("online_url", { length: 500 }),
    capacity: int("capacity").default(0),
    status: varchar("status", { length: 32 }).default("published").notNull(), // draft, published, cancelled, completed
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: datetime("deleted_at"),
  },
  (table) => ({
    unqSlug: uniqueIndex("unq_events_slug").on(table.slug),
    idxChapterStart: index("idx_events_chapter_start").on(table.chapterId, table.startTime),
    idxStatusStart: index("idx_events_status_start").on(table.status, table.startTime),
  })
);

// 8. Event RSVPs
export const rsvps = mysqlTable(
  "rsvps",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    eventId: varchar("event_id", { length: 64 })
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 32 }).default("attending").notNull(), // attending, tentative, declined
    guestsCount: int("guests_count").default(0).notNull(),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    unqEventUser: uniqueIndex("unq_event_user").on(table.eventId, table.userId),
    idxEvent: index("idx_rsvps_event").on(table.eventId),
  })
);

// 9. Announcements / Notices
export const announcements = mysqlTable(
  "announcements",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    chapterId: varchar("chapter_id", { length: 64 }), // Null if national or county-wide
    countyCode: varchar("county_code", { length: 3 }), // Null if chapter or national
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    priority: varchar("priority", { length: 32 }).default("routine").notNull(), // routine, important, urgent
    expiresAt: datetime("expires_at"),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    idxScope: index("idx_announcements_scope").on(table.chapterId, table.countyCode, table.expiresAt),
  })
);

// 10. Audit Logs
export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    actorId: varchar("actor_id", { length: 128 }).notNull(),
    action: varchar("action", { length: 100 }).notNull(), // e.g. 'user.role_assigned', 'chapter.created'
    targetEntity: varchar("target_entity", { length: 50 }).notNull(), // 'user', 'chapter', 'event'
    targetId: varchar("target_id", { length: 128 }).notNull(),
    payloadBefore: json("payload_before"),
    payloadAfter: json("payload_after"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: datetime("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    idxActor: index("idx_audit_actor").on(table.actorId, table.createdAt),
    idxTarget: index("idx_audit_target").on(table.targetEntity, table.targetId),
  })
);
