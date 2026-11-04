import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export class ChapterRepository {
  async getAllActive() {
    return await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.status, "active"), isNull(chapters.deletedAt)))
      .orderBy(chapters.name);
  }

  async getBySlug(slug: string) {
    const result = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.slug, slug), isNull(chapters.deletedAt)));
    return result[0] || null;
  }

  async getByCounty(countyCode: string) {
    return await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.countyCode, countyCode), isNull(chapters.deletedAt)))
      .orderBy(chapters.name);
  }
}

export const chapterRepository = new ChapterRepository();

