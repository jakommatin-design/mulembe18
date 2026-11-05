import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { notificationQueueService } from "./notification-queue.service";
import {
  SendNotificationInput,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from "@/lib/schemas/notification";

export class NotificationService {
  async sendNotification(actor: AuthUser, input: SendNotificationInput) {
    assertScopeAccess(actor, "publish_notice", {
      chapterId: input.chapterId,
      countyCode: actor.countyCode,
    });

    const queueResult = await notificationQueueService.enqueue({
      userId: input.recipientUserId,
      recipientEmail: input.recipientEmail,
      recipientPhone: input.recipientPhone,
      channel: input.channel,
      priority: input.priority,
      subject: input.subject,
      message: input.message,
      metadata: {
        dispatchedBy: actor.id,
        role: actor.role,
        chapterId: input.chapterId,
        countyCode: input.countyCode,
      },
    });

    await auditRepository.log({
      actorId: actor.id,
      action: "notification.dispatched",
      targetEntity: "notification",
      targetId: input.recipientUserId || input.recipientEmail || input.recipientPhone || "broadcast",
      payloadAfter: {
        channel: input.channel,
        priority: input.priority,
        subject: input.subject,
        chapterId: input.chapterId,
        queueResult,
      },
    });

    return {
      emailSent: queueResult.emailQueued,
      smsSent: queueResult.smsQueued,
      inAppSent: queueResult.inAppCreated,
      suppressedReasons: queueResult.suppressedReasons,
    };
  }

  async listUserNotifications(
    userId: string,
    options?: {
      priority?: "routine" | "important" | "urgent";
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    return await notificationRepository.listByUser(userId, options);
  }

  async markAsRead(userId: string, notificationId: string) {
    return await notificationRepository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    return await notificationRepository.markAllAsRead(userId);
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const pref = await notificationRepository.getUserPreferences(userId);
    return {
      emailEnabled: pref.emailEnabled,
      smsEnabled: pref.smsEnabled,
      urgentOnly: pref.urgentOnly,
      eventReminders: pref.eventReminders,
      announcements: pref.announcements,
    };
  }

  async updateUserPreferences(
    userId: string,
    updates: UpdateNotificationPreferencesInput
  ): Promise<NotificationPreferences> {
    const updated = await notificationRepository.upsertUserPreferences(userId, updates);
    return {
      emailEnabled: updated.emailEnabled,
      smsEnabled: updated.smsEnabled,
      urgentOnly: updated.urgentOnly,
      eventReminders: updated.eventReminders,
      announcements: updated.announcements,
    };
  }
}

export const notificationService = new NotificationService();
