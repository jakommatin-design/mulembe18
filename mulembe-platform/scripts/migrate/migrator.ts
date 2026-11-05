import { db } from "@/lib/db";
import { users, memberships, chapters, events } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { cleanAndDeduplicateMembers } from "./cleaner";
import { LegacyExport, MigrationReport } from "./types";
import { randomUUID } from "crypto";

export async function migrateLegacyData(
  exportData: LegacyExport,
  options: { dryRun?: boolean } = {}
): Promise<MigrationReport> {
  const dryRun = options.dryRun ?? false;
  const legacyMembers = exportData.members || [];
  const legacyEvents = exportData.events || [];

  // 1. Clean & Deduplicate
  const { cleanedMembers, conflicts } = cleanAndDeduplicateMembers(legacyMembers);

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    dryRun,
    totalLegacyMembersRead: legacyMembers.length,
    validMembersCleaned: cleanedMembers.length,
    duplicateCount: conflicts.filter((c) => c.type.startsWith("duplicate")).length,
    skippedCount: conflicts.length,
    insertedUsers: 0,
    updatedUsers: 0,
    membershipsCreated: 0,
    conflicts,
  };

  if (dryRun) {
    return report;
  }

  // 2. Fetch existing chapters for affiliation mapping
  const existingChapters = await db.select().from(chapters);
  const chapterSlugMap = new Map(existingChapters.map((c) => [c.slug, c.id]));

  // 3. Process Cleaned Members (Idempotent)
  for (const m of cleanedMembers) {
    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(or(eq(users.id, m.clerkId), eq(users.email, m.email), eq(users.phone, m.phone)));

      if (existingUser) {
        // Update user
        await db
          .update(users)
          .set({
            fullName: m.fullName,
            clan: m.clan,
            currentCountyCode: m.currentCountyCode,
            ancestralCountyCode: m.ancestralCountyCode,
            role: m.role,
            status: m.status,
          })
          .where(eq(users.id, existingUser.id));

        report.updatedUsers++;

        // Affiliation
        if (m.chapterSlug && chapterSlugMap.has(m.chapterSlug)) {
          const chapterId = chapterSlugMap.get(m.chapterSlug)!;
          const [existingMembership] = await db
            .select()
            .from(memberships)
            .where(eq(memberships.userId, existingUser.id));

          if (!existingMembership) {
            await db.insert(memberships).values({
              id: randomUUID(),
              userId: existingUser.id,
              chapterId,
              role: m.role === "chapter_chair" ? "chairperson" : m.role === "chapter_secretary" ? "secretary" : "member",
              status: "active",
            });
            report.membershipsCreated++;
          }
        }
      } else {
        // Insert new user
        const random5 = Math.random().toString(36).substring(2, 7).toUpperCase();
        const membershipId = `MLB-${m.currentCountyCode}-${random5}`;

        await db.insert(users).values({
          id: m.clerkId,
          membershipId,
          fullName: m.fullName,
          email: m.email,
          phone: m.phone,
          clan: m.clan,
          currentCountyCode: m.currentCountyCode,
          ancestralCountyCode: m.ancestralCountyCode,
          role: m.role,
          status: m.status,
          kdpaConsentAt: m.createdAt,
          createdAt: m.createdAt,
        });

        report.insertedUsers++;

        // Affiliation
        if (m.chapterSlug && chapterSlugMap.has(m.chapterSlug)) {
          const chapterId = chapterSlugMap.get(m.chapterSlug)!;
          await db.insert(memberships).values({
            id: randomUUID(),
            userId: m.clerkId,
            chapterId,
            role: m.role === "chapter_chair" ? "chairperson" : m.role === "chapter_secretary" ? "secretary" : "member",
            status: "active",
          });
          report.membershipsCreated++;
        }
      }
    } catch (err: unknown) {
      report.conflicts.push({
        type: "invalid_phone",
        legacyId: m.id,
        identifier: m.email,
        reason: err instanceof Error ? err.message : "Database insertion failed",
        data: { full_name: m.fullName, email: m.email, phone: m.phone },
      });
    }
  }

  // 4. Process Legacy Events (Idempotent)
  for (const ev of legacyEvents) {
    const slug = (ev.slug || ev.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const [existingEv] = await db.select().from(events).where(eq(events.slug, slug));
    if (!existingEv) {
      const startTime = ev.start_time || ev.date || new Date();
      const endTime = ev.end_time || new Date(new Date(startTime).getTime() + 4 * 3600 * 1000);

      await db.insert(events).values({
        id: randomUUID(),
        title: ev.title,
        slug,
        description: ev.description || ev.title,
        category: (ev.category as "cultural" | "agm" | "welfare" | "youth" | "sports") || "cultural",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        venueName: ev.venue_name || ev.venue || "Community Hall",
        venueAddress: ev.venue_address || "Kenya",
        status: "published",
      });
    }
  }

  return report;
}

