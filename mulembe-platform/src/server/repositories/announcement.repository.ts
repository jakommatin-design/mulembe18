import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, and, or, isNull, gte, desc, sql } from "drizzle-orm";
import crypto from "crypto";

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: "routine" | "important" | "urgent";
  chapterId?: string | null;
  countyCode?: string | null;
  expiresAt?: Date | null;
}

export class AnnouncementRepository {
  async list(filters?: {
    chapterId?: string | null;
    countyCode?: string | null;
    limit?: number;
    offset?: number;
  }) {
    const now = new Date();
    const expiryCondition = or(
      isNull(announcements.expiresAt),
      gte(announcements.expiresAt, now)
    );

    const conditions = [expiryCondition];

    if (filters?.chapterId) {
      conditions.push(eq(announcements.chapterId, filters.chapterId));
    }
    if (filters?.countyCode) {
      conditions.push(eq(announcements.countyCode, filters.countyCode));
    }

    const query = db
      .select()
      .from(announcements)
      .where(and(...conditions))
      .orderBy(desc(announcements.createdAt));

    if (filters?.limit) query.limit(filters.limit);
    if (filters?.offset) query.offset(filters.offset);

    const items = await query;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements)
      .where(and(...conditions));

    return {
      items,
      total: Number(countResult?.count || 0),
    };
  }

  async getById(id: string) {
    const result = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id));
    return result[0] || null;
  }

  async create(data: CreateAnnouncementInput) {
    const id = `ann_${crypto.randomUUID()}`;
    await db.insert(announcements).values({
      id,
      title: data.title,
      content: data.content,
      priority: data.priority || "routine",
      chapterId: data.chapterId ?? null,
      countyCode: data.countyCode ?? null,
      expiresAt: data.expiresAt ?? null,
    });
    return (await this.getById(id))!;
  }

  async delete(id: string) {
    await db.delete(announcements).where(eq(announcements.id, id));
    return true;
  }
}

export const announcementRepository = new AnnouncementRepository();
