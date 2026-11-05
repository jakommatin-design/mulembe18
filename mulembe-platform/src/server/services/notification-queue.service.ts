import {
  notificationRepository,
  NotificationRepository,
} from "../repositories/notification.repository";
import {
  EmailProvider,
  SmsProvider,
  defaultEmailProvider,
  defaultSmsProvider,
} from "../notifications/provider";
import { Notification } from "@/lib/db/schema";

export interface EnqueueNotificationParams {
  userId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: "in_app" | "email" | "sms" | "both" | "all";
  priority?: "routine" | "important" | "urgent";
  subject: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface EnqueueResult {
  inAppCreated: boolean;
  emailQueued: boolean;
  smsQueued: boolean;
  suppressedReasons?: string[];
}

export interface ProcessBatchResult {
  processed: number;
  succeeded: number;
  failed: number;
  retried: number;
  items: Array<{
    id: string;
    channel: string;
    success: boolean;
    providerId?: string;
    error?: string;
  }>;
}

export class NotificationQueueService {
  constructor(
    private emailProvider: EmailProvider = defaultEmailProvider,
    private smsProvider: SmsProvider = defaultSmsProvider,
    private repo: NotificationRepository = notificationRepository
  ) {}

  // Allows injecting custom / mock providers for testing
  setProviders(emailProvider: EmailProvider, smsProvider: SmsProvider) {
    this.emailProvider = emailProvider;
    this.smsProvider = smsProvider;
  }

  async enqueue(params: EnqueueNotificationParams): Promise<EnqueueResult> {
    const priority = params.priority || "routine";
    const suppressedReasons: string[] = [];
    let inAppCreated = false;
    let emailQueued = false;
    let smsQueued = false;

    // Check user preferences if userId is provided
    let emailAllowed = Boolean(params.recipientEmail);
    let smsAllowed = Boolean(params.recipientPhone);

    if (params.userId) {
      const prefs = await this.repo.getUserPreferences(params.userId);
      if (prefs.urgentOnly && priority !== "urgent") {
        emailAllowed = false;
        smsAllowed = false;
        suppressedReasons.push("Suppressed by user preference: Urgent notifications only");
      } else {
        if (!prefs.emailEnabled) {
          emailAllowed = false;
          suppressedReasons.push("Suppressed by user preference: Email disabled");
        }
        if (!prefs.smsEnabled) {
          smsAllowed = false;
          suppressedReasons.push("Suppressed by user preference: SMS disabled");
        }
      }
    }

    // 1. In-App Notification (always immediate if userId exists and channel requests it)
    if (["in_app", "all"].includes(params.channel) && params.userId) {
      await this.repo.create({
        userId: params.userId,
        channel: "in_app",
        title: params.subject,
        message: params.message,
        priority,
        status: "pending", // For in-app, 'pending' means unread
        metadata: params.metadata,
      });
      inAppCreated = true;
    }

    // 2. Email Delivery Queue
    if (["email", "both", "all"].includes(params.channel) && emailAllowed && params.recipientEmail) {
      await this.repo.create({
        userId: params.userId,
        channel: "email",
        title: params.subject,
        message: params.message,
        priority,
        status: "pending",
        targetDestination: params.recipientEmail,
        metadata: params.metadata,
      });
      emailQueued = true;
    }

    // 3. SMS Delivery Queue
    if (["sms", "both", "all"].includes(params.channel) && smsAllowed && params.recipientPhone) {
      await this.repo.create({
        userId: params.userId,
        channel: "sms",
        title: params.subject,
        message: params.message,
        priority,
        status: "pending",
        targetDestination: params.recipientPhone,
        metadata: params.metadata,
      });
      smsQueued = true;
    }

    return {
      inAppCreated,
      emailQueued,
      smsQueued,
      suppressedReasons: suppressedReasons.length ? suppressedReasons : undefined,
    };
  }

  async processBatch(batchSize = 25): Promise<ProcessBatchResult> {
    const queue = await this.repo.getPendingQueue(batchSize);
    const result: ProcessBatchResult = {
      processed: queue.length,
      succeeded: 0,
      failed: 0,
      retried: 0,
      items: [],
    };

    if (queue.length === 0) {
      return result;
    }

    for (const item of queue) {
      await this.processItem(item, result);
    }

    return result;
  }

  private async processItem(item: Notification, summary: ProcessBatchResult) {
    // 1. Atomically mark as processing
    await this.repo.updateStatus(item.id, { status: "processing" });

    try {
      if (item.channel === "email" && item.targetDestination) {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; border-radius: 12px; background-color: #0b1512; color: #f9fafb;">
            <h2 style="color: #34d399; margin-top: 0;">${item.title}</h2>
            <p style="font-size: 16px; line-height: 1.6;">${item.message}</p>
            <hr style="border: none; border-top: 1px solid #1f2937; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">Mulembe National Platform • Kenya Data Protection Act 2019 Compliant</p>
          </div>
        `;

        const res = await this.emailProvider.send({
          to: item.targetDestination,
          subject: item.title,
          html: emailHtml,
          text: item.message,
        });

        if (res.success) {
          await this.repo.updateStatus(item.id, {
            status: "sent",
            sentAt: new Date(),
            metadata: {
              ...(typeof item.metadata === "object" && item.metadata !== null ? item.metadata : {}),
              providerId: res.id,
              provider: res.provider,
            },
          });
          summary.succeeded++;
          summary.items.push({ id: item.id, channel: item.channel, success: true, providerId: res.id });
        } else {
          await this.handleFailure(item, res.error || "Email delivery failed", summary);
        }
      } else if (item.channel === "sms" && item.targetDestination) {
        const res = await this.smsProvider.send({
          to: item.targetDestination,
          message: `${item.title}: ${item.message}`,
        });

        if (res.success) {
          await this.repo.updateStatus(item.id, {
            status: "sent",
            sentAt: new Date(),
            metadata: {
              ...(typeof item.metadata === "object" && item.metadata !== null ? item.metadata : {}),
              providerId: res.id,
              provider: res.provider,
            },
          });
          summary.succeeded++;
          summary.items.push({ id: item.id, channel: item.channel, success: true, providerId: res.id });
        } else {
          await this.handleFailure(item, res.error || "SMS delivery failed", summary);
        }
      } else {
        await this.handleFailure(item, "Missing destination or unsupported channel", summary);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected queue worker error";
      await this.handleFailure(item, msg, summary);
    }
  }

  private async handleFailure(item: Notification, error: string, summary: ProcessBatchResult) {
    const nextRetry = item.retryCount + 1;
    await this.repo.updateStatus(item.id, {
      status: "failed",
      retryCount: nextRetry,
      lastError: error,
    });

    summary.failed++;
    if (nextRetry < item.maxRetries) {
      summary.retried++;
    }
    summary.items.push({ id: item.id, channel: item.channel, success: false, error });
  }
}

export const notificationQueueService = new NotificationQueueService();

