import {
  chapterRepository,
  CreateChapterInput,
  UpdateChapterInput,
} from "../repositories/chapter.repository";
import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export class ChapterService {
  async listChapters(filters?: { countyCode?: string; status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const { items, total } = await chapterRepository.list({
      countyCode: filters?.countyCode,
      status: filters?.status,
      limit,
      offset,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getChapterBySlug(slug: string) {
    return await chapterRepository.getBySlug(slug);
  }

  async createChapter(actor: AuthUser, input: CreateChapterInput) {
    // 1. Verify permission and county scope
    assertScopeAccess(actor, "create_chapter", { countyCode: input.countyCode });

    // 2. Check slug uniqueness
    const existing = await chapterRepository.getBySlug(input.slug);
    if (existing) {
      throw new Error(`A chapter with slug '${input.slug}' already exists`);
    }

    // 3. Create chapter
    const chapter = await chapterRepository.create(input);

    // 4. Audit log
    await auditRepository.log({
      actorId: actor.id,
      action: "chapter.created",
      targetEntity: "chapter",
      targetId: chapter.id,
      payloadAfter: { name: chapter.name, countyCode: chapter.countyCode, slug: chapter.slug },
    });

    return chapter;
  }

  async updateChapter(actor: AuthUser, id: string, input: UpdateChapterInput) {
    const chapter = await chapterRepository.getById(id);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Check scope: Chapter chair for own chapter, coordinator for county, or admin
    assertScopeAccess(actor, "publish_notice", {
      chapterId: chapter.id,
      countyCode: chapter.countyCode,
    });

    const updated = await chapterRepository.update(id, input);

    await auditRepository.log({
      actorId: actor.id,
      action: "chapter.updated",
      targetEntity: "chapter",
      targetId: id,
      payloadBefore: { name: chapter.name, status: chapter.status },
      payloadAfter: input as Record<string, unknown>,
    });

    return updated;
  }
}

export const chapterService = new ChapterService();

