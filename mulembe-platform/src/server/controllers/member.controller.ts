import { memberService } from "../services/member.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  RegisterMemberSchema,
  UpdateProfileSchema,
  VerifyMemberSchema,
  MemberQuerySchema,
} from "@/lib/schemas/member";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class MemberController {
  async getProfile(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      const profile = await memberService.getProfile(actor);
      return apiSuccess(profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch profile";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async registerMember(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const rate = checkRateLimit(`rate_reg_${actor.id}`, 5);
    if (!rate.success) {
      return apiError("RATE_LIMITED", "Too many attempts. Please try again shortly.", 429);
    }

    const parse = RegisterMemberSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Registration details are invalid",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await memberService.registerMember(actor, parse.data);
      return apiSuccess(result, undefined, 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async updateProfile(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const parse = UpdateProfileSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Profile update is invalid",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await memberService.updateProfile(actor, parse.data);
      return apiSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async listMembers(actor: AuthUser | null, url: URL) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parse = MemberQuerySchema.safeParse(queryParams);

    if (!parse.success) {
      return apiError(
        "INVALID_QUERY",
        "Invalid query parameters",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await memberService.listMembers(actor, parse.data);
      return apiSuccess(result.items, result.meta);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to list members";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async verifyMember(actor: AuthUser | null, targetUserId: string, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const parse = VerifyMemberSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid verification status",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await memberService.verifyMember(actor, targetUserId, parse.data.status);
      return apiSuccess(result);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Verification failed";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async getUserMembership(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      const membership = await memberService.getUserMembership(actor);
      return apiSuccess(membership);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch membership";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async joinChapter(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const chapterId = (body as { chapterId?: string })?.chapterId;
    if (!chapterId || typeof chapterId !== "string") {
      return apiError("BAD_REQUEST", "Valid chapterId is required", 400);
    }

    try {
      const membership = await memberService.joinChapter(actor, chapterId);
      return apiSuccess(membership);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to join chapter";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async leaveChapter(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      await memberService.leaveChapter(actor);
      return apiSuccess({ message: "Successfully left chapter" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to leave chapter";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async getUserRsvps(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      const rsvps = await memberService.getUserRsvps(actor);
      return apiSuccess(rsvps);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch RSVPs";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async exportUserData(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      const dossier = await memberService.exportUserData(actor);
      return apiSuccess(dossier);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export member data";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async deleteUserData(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    try {
      await memberService.deleteUserData(actor);
      return apiSuccess({ message: "Member account and personal data erased under KDPA." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to erase member data";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }
}

export const memberController = new MemberController();

