import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export interface SendNotificationInput {
  channel: "email" | "sms" | "both";
  recipientEmail?: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  chapterId?: string | null;
}

export class NotificationService {
  async sendNotification(actor: AuthUser, input: SendNotificationInput) {
    assertScopeAccess(actor, "publish_notice", {
      chapterId: input.chapterId,
      countyCode: actor.countyCode,
    });

    const results = {
      emailSent: false,
      smsSent: false,
    };

    // Email dispatch (Resend API placeholder / provider)
    if (["email", "both"].includes(input.channel) && input.recipientEmail) {
      console.log(
        `✉️ [Notification] Email dispatched to ${input.recipientEmail}: "${input.subject}"`
      );
      results.emailSent = true;
    }

    // SMS dispatch (Africa's Talking placeholder / provider)
    if (["sms", "both"].includes(input.channel) && input.recipientPhone) {
      console.log(
        `📱 [Notification] SMS dispatched to ${input.recipientPhone}: "${input.message.slice(0, 50)}..."`
      );
      results.smsSent = true;
    }

    await auditRepository.log({
      actorId: actor.id,
      action: "notification.dispatched",
      targetEntity: "notification",
      targetId: input.recipientEmail || input.recipientPhone || "broadcast",
      payloadAfter: {
        channel: input.channel,
        subject: input.subject,
        chapterId: input.chapterId,
      },
    });

    return results;
  }
}

export const notificationService = new NotificationService();
