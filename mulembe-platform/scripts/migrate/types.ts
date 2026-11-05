/**
 * Types for Legacy mulembe18 Data Migration
 */

export interface LegacyMember {
  id: string | number;
  clerk_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  sub_clan?: string | null;
  clan?: string | null;
  role?: string | null;
  status?: string | null;
  residential_county_code?: string | null;
  residential_county?: string | null;
  residential_sub_county?: string | null;
  residential_ward?: string | null;
  birth_county_code?: string | null;
  birth_county?: string | null;
  chapter_id?: string | null;
  chapter_name?: string | null;
  created_at?: string | Date | null;
}

export interface LegacyEvent {
  id: string | number;
  title: string;
  slug?: string;
  description: string;
  category?: string;
  date?: string | Date;
  start_time?: string | Date;
  end_time?: string | Date;
  venue?: string;
  venue_name?: string;
  venue_address?: string;
  chapter?: string;
  chapter_id?: string;
}

export interface LegacyExport {
  members: LegacyMember[];
  events?: LegacyEvent[];
}

export interface CleanedMember {
  id: string;
  clerkId: string;
  fullName: string;
  email: string;
  phone: string;
  clan: string | null;
  currentCountyCode: string;
  ancestralCountyCode: string;
  role: "guest" | "member" | "chapter_secretary" | "chapter_chair" | "county_coordinator" | "national_admin" | "super_admin";
  status: "pending" | "active" | "suspended" | "deleted";
  chapterSlug?: string;
  createdAt: Date;
}

export interface MigrationConflict {
  type: "duplicate_email" | "duplicate_phone" | "invalid_phone" | "invalid_email" | "missing_name";
  legacyId: string | number;
  identifier: string;
  reason: string;
  data: Partial<LegacyMember>;
}

export interface MigrationReport {
  timestamp: string;
  dryRun: boolean;
  totalLegacyMembersRead: number;
  validMembersCleaned: number;
  duplicateCount: number;
  skippedCount: number;
  insertedUsers: number;
  updatedUsers: number;
  membershipsCreated: number;
  conflicts: MigrationConflict[];
}

