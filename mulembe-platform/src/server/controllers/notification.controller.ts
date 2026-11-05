import { notificationService } from "../services/notification.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  SendNotificationSchema,
  UpdateNotificationPreferencesSchema,
  NotificationQuerySchema,
} from "@/lib/schemas/notification";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class NotificationController {
  async send(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const rate = checkRateLimit(`rate_notif_send_${actor.id}`, 10);
    if (!rate.success) {
      return apiError("RATE_LIMITED", "Too many notification requests. Please wait.", 429);
    }

    const parse = SendNotificationSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid notification parameters",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await notificationService.sendNotification(actor, parse.data);
      return apiSuccess(result);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to dispatch notification";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async list(actor: AuthUser | null, searchParams: URLSearchParams) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const queryObj = Object.fromEntries(searchParams.entries());
    const parse = NotificationQuerySchema.safeParse(queryObj);
    if (!parse.success) {
      return apiError("VALIDATION_FAILED", "Invalid query parameters", 400);
    }

    const data = await notificationService.listUserNotifications(actor.id, parse.data);
    return apiSuccess(data);
  }

  async markAsRead(actor: AuthUser | null, id: string) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);
    if (!id) return apiError("VALIDATION_FAILED", "Notification ID required", 400);

    const success = await notificationService.markAsRead(actor.id, id);
    return apiSuccess({ success });
  }

  async markAllAsRead(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const count = await notificationService.markAllAsRead(actor.id);
    return apiSuccess({ updatedCount: count });
  }

  async getPreferences(actor: AuthUser | null) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const prefs = await notificationService.getUserPreferences(actor.id);
    return apiSuccess(prefs);
  }

  async updatePreferences(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const parse = UpdateNotificationPreferencesSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid notification preferences",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    const prefs = await notificationService.updateUserPreferences(actor.id, parse.data);
    return apiSuccess(prefs);
  }
}

export const notificationController = new NotificationController();
