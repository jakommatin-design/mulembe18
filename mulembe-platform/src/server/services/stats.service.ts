import { db } from "@/lib/db";
import { users, chapters, events, memberships, announcements } from "@/lib/db/schema";
import { sql, isNull, eq, and } from "drizzle-orm";

export interface DashboardStats {
  totalMembers: number;
  pendingMembers: number;
  activeChapters: number;
  publishedEvents: number;
  activeAnnouncements: number;
  membersByCounty: Array<{ countyCode: string; count: number }>;
  membersByChapter: Array<{ chapterName: string; count: number }>;
}

export class StatsService {
  async getPlatformStats(scope?: { countyCode?: string | null; chapterId?: string | null }): Promise<DashboardStats> {
    // 1. Total & Pending members
    const userConditions = [isNull(users.deletedAt)];
    if (scope?.countyCode) {
      userConditions.push(eq(users.currentCountyCode, scope.countyCode));
    }

    const [userCountResult] = await db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`sum(case when ${users.status} = 'pending' then 1 else 0 end)`,
      })
      .from(users)
      .where(and(...userConditions));

    // 2. Active Chapters
    const chapterConditions = [eq(chapters.status, "active"), isNull(chapters.deletedAt)];
    if (scope?.countyCode) {
      chapterConditions.push(eq(chapters.countyCode, scope.countyCode));
    }

    const [chapterCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chapters)
      .where(and(...chapterConditions));

    // 3. Published Events
    const eventConditions = [eq(events.status, "published"), isNull(events.deletedAt)];
    if (scope?.chapterId) {
      eventConditions.push(eq(events.chapterId, scope.chapterId));
    }

    const [eventCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(and(...eventConditions));

    // 4. Active Announcements
    const announcementConditions = [sql`${announcements.expiresAt} IS NULL OR ${announcements.expiresAt} >= NOW()`];
    if (scope?.chapterId) {
      announcementConditions.push(eq(announcements.chapterId, scope.chapterId));
    } else if (scope?.countyCode) {
      announcementConditions.push(eq(announcements.countyCode, scope.countyCode));
    }

    const [announcementCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements)
      .where(and(...announcementConditions));

    // 5. Members by County
    const countyBreakdown = await db
      .select({
        countyCode: sql<string>`COALESCE(${users.currentCountyCode}, '037')`,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .groupBy(users.currentCountyCode)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // 6. Members by Chapter
    const chapterBreakdown = await db
      .select({
        chapterName: chapters.name,
        count: sql<number>`count(${memberships.id})`,
      })
      .from(memberships)
      .innerJoin(chapters, eq(memberships.chapterId, chapters.id))
      .groupBy(chapters.id, chapters.name)
      .orderBy(sql`count(${memberships.id}) desc`)
      .limit(10);

    return {
      totalMembers: Number(userCountResult?.total || 0),
      pendingMembers: Number(userCountResult?.pending || 0),
      activeChapters: Number(chapterCountResult?.count || 0),
      publishedEvents: Number(eventCountResult?.count || 0),
      activeAnnouncements: Number(announcementCountResult?.count || 0),
      membersByCounty: countyBreakdown.map((c) => ({
        countyCode: c.countyCode,
        count: Number(c.count || 0),
      })),
      membersByChapter: chapterBreakdown.map((ch) => ({
        chapterName: ch.chapterName,
        count: Number(ch.count || 0),
      })),
    };
  }
}

export const statsService = new StatsService();

