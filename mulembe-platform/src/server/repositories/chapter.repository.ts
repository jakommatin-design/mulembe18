import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import crypto from "crypto";

export interface CreateChapterInput {
  name: string;
  slug: string;
  countyCode: string;
  subCountyId?: string | null;
  description?: string | null;
  meetingVenue?: string | null;
  meetingSchedule?: string | null;
  status?: "active" | "pending" | "inactive";
}

export interface UpdateChapterInput {
  name?: string;
  description?: string | null;
  meetingVenue?: string | null;
  meetingSchedule?: string | null;
  status?: "active" | "pending" | "inactive";
}

export class ChapterRepository {
  async getAllActive() {
    return await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.status, "active"), isNull(chapters.deletedAt)))
      .orderBy(chapters.name);
  }

  async list(filters?: { countyCode?: string; status?: string; limit?: number; offset?: number }) {
    const conditions = [isNull(chapters.deletedAt)];

    if (filters?.countyCode) {
      conditions.push(eq(chapters.countyCode, filters.countyCode));
    }
    if (filters?.status) {
      conditions.push(eq(chapters.status, filters.status));
    }

    const query = db
      .select()
      .from(chapters)
      .where(and(...conditions))
      .orderBy(chapters.name);

    if (filters?.limit) {
      query.limit(filters.limit);
    }
    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const items = await query;

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chapters)
      .where(and(...conditions));

    return {
      items,
      total: Number(countResult?.count || 0),
    };
  }

  async getById(id: string) {
    const result = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, id), isNull(chapters.deletedAt)));
    return result[0] || null;
  }

  async getBySlug(slug: string) {
    const result = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.slug, slug), isNull(chapters.deletedAt)));
    return result[0] || null;
  }

  async findBySlug(slug: string) {
    return this.getBySlug(slug);
  }

  async getByCounty(countyCode: string) {
    return await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.countyCode, countyCode), isNull(chapters.deletedAt)))
      .orderBy(chapters.name);
  }

  async create(data: CreateChapterInput) {
    const id = `ch_${crypto.randomUUID()}`;
    await db.insert(chapters).values({
      id,
      slug: data.slug,
      name: data.name,
      countyCode: data.countyCode,
      subCountyId: data.subCountyId ?? null,
      description: data.description ?? null,
      meetingVenue: data.meetingVenue ?? null,
      meetingSchedule: data.meetingSchedule ?? null,
      status: data.status || "active",
    });
    return (await this.getById(id))!;
  }

  async update(id: string, data: UpdateChapterInput) {
    await db
      .update(chapters)
      .set({
        ...(data.name ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.meetingVenue !== undefined ? { meetingVenue: data.meetingVenue } : {}),
        ...(data.meetingSchedule !== undefined ? { meetingSchedule: data.meetingSchedule } : {}),
        ...(data.status ? { status: data.status } : {}),
      })
      .where(eq(chapters.id, id));
    return await this.getById(id);
  }
}

export const chapterRepository = new ChapterRepository();
