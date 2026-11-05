import { chapterService } from "../services/chapter.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  CreateChapterSchema,
  UpdateChapterSchema,
  ChapterQuerySchema,
} from "@/lib/schemas/chapter";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class ChapterController {
  async listChapters(url: URL) {
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parse = ChapterQuerySchema.safeParse(queryParams);

    if (!parse.success) {
      return apiError(
        "INVALID_QUERY",
        "Invalid query parameters",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await chapterService.listChapters(parse.data);
      return apiSuccess(result.items, result.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to list chapters";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async getChapterBySlug(slug: string) {
    try {
      const chapter = await chapterService.getChapterBySlug(slug);
      if (!chapter) {
        return apiError("NOT_FOUND", `Chapter with slug '${slug}' not found`, 404);
      }
      return apiSuccess(chapter);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve chapter";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async createChapter(actor: AuthUser | null, body: unknown) {
    if (!actor) {
      return apiError("UNAUTHENTICATED", "Authentication required", 401);
    }

    // Rate limit writes
    const rateLimit = checkRateLimit(`rate_write_${actor.id}`, 20);
    if (!rateLimit.success) {
      return apiError("RATE_LIMITED", "Too many requests. Please wait.", 429);
    }

    const parse = CreateChapterSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid chapter payload",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const chapter = await chapterService.createChapter(actor, parse.data);
      return apiSuccess(chapter, undefined, 201);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to create chapter";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async updateChapter(actor: AuthUser | null, id: string, body: unknown) {
    if (!actor) {
      return apiError("UNAUTHENTICATED", "Authentication required", 401);
    }

    const parse = UpdateChapterSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid update payload",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const chapter = await chapterService.updateChapter(actor, id, parse.data);
      return apiSuccess(chapter);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to update chapter";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }
}

export const chapterController = new ChapterController();

