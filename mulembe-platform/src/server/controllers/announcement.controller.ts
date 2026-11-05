import { announcementService } from "../services/announcement.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  CreateAnnouncementSchema,
  AnnouncementQuerySchema,
} from "@/lib/schemas/announcement";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class AnnouncementController {
  async listAnnouncements(url: URL) {
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parse = AnnouncementQuerySchema.safeParse(queryParams);

    if (!parse.success) {
      return apiError(
        "INVALID_QUERY",
        "Invalid query parameters",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await announcementService.listAnnouncements(parse.data);
      return apiSuccess(result.items, result.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to list announcements";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async createAnnouncement(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const rate = checkRateLimit(`rate_ann_${actor.id}`, 20);
    if (!rate.success) {
      return apiError("RATE_LIMITED", "Too many requests. Please wait.", 429);
    }

    const parse = CreateAnnouncementSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid announcement data",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await announcementService.createAnnouncement(actor, parse.data);
      return apiSuccess(result, undefined, 201);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to publish announcement";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async deleteAnnouncement(actor: AuthUser | null, id: string) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      await announcementService.deleteAnnouncement(actor, id);
      return apiSuccess({ deleted: true });
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to delete announcement";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }
}

export const announcementController = new AnnouncementController();

