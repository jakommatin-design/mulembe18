import {
  announcementRepository,
  CreateAnnouncementInput,
} from "../repositories/announcement.repository";
import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export class AnnouncementService {
  async listAnnouncements(filters?: {
    chapterId?: string;
    countyCode?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const { items, total } = await announcementRepository.list({
      chapterId: filters?.chapterId,
      countyCode: filters?.countyCode,
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

  async createAnnouncement(actor: AuthUser, input: CreateAnnouncementInput) {
    assertScopeAccess(actor, "publish_notice", {
      chapterId: input.chapterId,
      countyCode: input.countyCode,
    });

    const item = await announcementRepository.create(input);

    await auditRepository.log({
      actorId: actor.id,
      action: "announcement.published",
      targetEntity: "announcement",
      targetId: item.id,
      payloadAfter: {
        title: item.title,
        priority: item.priority,
        scope: { chapterId: item.chapterId, countyCode: item.countyCode },
      },
    });

    return item;
  }

  async deleteAnnouncement(actor: AuthUser, id: string) {
    const item = await announcementRepository.getById(id);
    if (!item) throw new Error("Announcement not found");

    assertScopeAccess(actor, "publish_notice", {
      chapterId: item.chapterId,
      countyCode: item.countyCode,
    });

    await announcementRepository.delete(id);

    await auditRepository.log({
      actorId: actor.id,
      action: "announcement.deleted",
      targetEntity: "announcement",
      targetId: id,
    });

    return true;
  }
}

export const announcementService = new AnnouncementService();
