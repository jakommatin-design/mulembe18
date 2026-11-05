import { notificationService } from "../services/notification.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import { SendNotificationSchema } from "@/lib/schemas/notification";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class NotificationController {
  async send(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const rate = checkRateLimit(`rate_notif_${actor.id}`, 10);
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
}

export const notificationController = new NotificationController();
