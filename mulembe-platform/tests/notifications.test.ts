import { describe, it, expect, beforeEach } from "vitest";
import {
  ResendEmailProvider,
  AfricasTalkingSmsProvider,
  MockEmailProvider,
  MockSmsProvider,
} from "@/server/notifications/provider";
import {
  NotificationQueueService,
} from "@/server/services/notification-queue.service";
import { NotificationRepository } from "@/server/repositories/notification.repository";
import { Notification, NotificationPreference } from "@/lib/db/schema";
import {
  SendNotificationSchema,
  NotificationPreferencesSchema,
  UpdateNotificationPreferencesSchema,
} from "@/lib/schemas/notification";

// In-Memory Repository Mock for deterministic tests
class InMemoryNotificationRepository extends NotificationRepository {
  public notifications: Notification[] = [];
  public preferences: Map<string, NotificationPreference> = new Map();

  async create(
    data: Partial<Notification> & { channel: string; title: string; message: string }
  ): Promise<Notification> {
    const record: Notification = {
      id: data.id || `notif-${this.notifications.length + 1}`,
      userId: data.userId || null,
      channel: data.channel,
      title: data.title,
      message: data.message,
      priority: data.priority || "routine",
      status: data.status || "pending",
      targetDestination: data.targetDestination || null,
      metadata: data.metadata || null,
      retryCount: data.retryCount || 0,
      maxRetries: data.maxRetries || 3,
      lastError: data.lastError || null,
      sentAt: data.sentAt || null,
      readAt: data.readAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notifications.push(record);
    return record;
  }

  async getPendingQueue(batchSize = 25): Promise<Notification[]> {
    return this.notifications
      .filter(
        (n) =>
          ["email", "sms"].includes(n.channel) &&
          (n.status === "pending" || (n.status === "failed" && n.retryCount < n.maxRetries))
      )
      .slice(0, batchSize);
  }

  async updateStatus(id: string, updates: Partial<Notification>): Promise<boolean> {
    const item = this.notifications.find((n) => n.id === id);
    if (!item) return false;
    Object.assign(item, updates, { updatedAt: new Date() });
    return true;
  }

  async listByUser(userId: string) {
    const items = this.notifications.filter(
      (n) => n.userId === userId && n.channel === "in_app"
    );
    return { items, total: items.length };
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const item = this.notifications.find((n) => n.id === id && n.userId === userId);
    if (item) {
      item.status = "read";
      item.readAt = new Date();
      return true;
    }
    return false;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    for (const item of this.notifications) {
      if (item.userId === userId && item.channel === "in_app" && item.status === "pending") {
        item.status = "read";
        item.readAt = new Date();
        count++;
      }
    }
    return count;
  }

  async getUserPreferences(userId: string): Promise<NotificationPreference> {
    if (this.preferences.has(userId)) {
      return this.preferences.get(userId)!;
    }
    return {
      id: `pref-${userId}`,
      userId,
      emailEnabled: true,
      smsEnabled: true,
      urgentOnly: false,
      eventReminders: true,
      announcements: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async upsertUserPreferences(
    userId: string,
    data: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    const existing = await this.getUserPreferences(userId);
    const updated: NotificationPreference = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.preferences.set(userId, updated);
    return updated;
  }
}

describe("Prompt 10: Notifications & Communication System", () => {
  let mockEmail: MockEmailProvider;
  let mockSms: MockSmsProvider;
  let repo: InMemoryNotificationRepository;
  let service: NotificationQueueService;

  beforeEach(() => {
    mockEmail = new MockEmailProvider();
    mockSms = new MockSmsProvider();
    repo = new InMemoryNotificationRepository();
    service = new NotificationQueueService(
      mockEmail,
      mockSms,
      repo as unknown as NotificationRepository
    );
  });

  describe("1. Notification Provider Interfaces", () => {
    it("should instantiate ResendEmailProvider and send in test/mock mode", async () => {
      const resend = new ResendEmailProvider("mock-key");
      expect(resend.name).toBe("resend");

      const result = await resend.send({
        to: "member@mulembe.org",
        subject: "Welcome to Mulembe",
        html: "<p>Hello</p>",
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe("resend");
      expect(result.id).toBeDefined();
    });

    it("should instantiate AfricasTalkingSmsProvider and send in test/mock mode", async () => {
      const at = new AfricasTalkingSmsProvider("mock-key", "sandbox", "MULEMBE");
      expect(at.name).toBe("africas_talking");

      const result = await at.send({
        to: "+254712345678",
        message: "Your Mulembe verification code is 1234",
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe("africas_talking");
      expect(result.id).toBeDefined();
    });

    it("should track mock email & sms messages and simulate errors", async () => {
      await mockEmail.send({ to: "test@org.ke", subject: "Test", html: "body" });
      expect(mockEmail.sent).toHaveLength(1);
      expect(mockEmail.sent[0].to).toBe("test@org.ke");

      mockEmail.shouldFail = true;
      const failed = await mockEmail.send({ to: "fail@org.ke", subject: "Test", html: "body" });
      expect(failed.success).toBe(false);
      expect(failed.error).toContain("Simulated Email Failure");
    });
  });

  describe("2. Notification Schemas Validation", () => {
    it("should validate valid notification input", () => {
      const valid = SendNotificationSchema.safeParse({
        channel: "both",
        priority: "urgent",
        recipientEmail: "chair@kakamega.org",
        recipientPhone: "+254722000000",
        subject: "Urgent Council Meeting",
        message: "Notice for upcoming council deliberation in Kakamega town.",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject invalid Kenyan phone number format", () => {
      const invalid = SendNotificationSchema.safeParse({
        channel: "sms",
        recipientPhone: "0722000000", // Needs +254
        subject: "Notice",
        message: "Hello world",
      });
      expect(invalid.success).toBe(false);
    });

    it("should validate and update notification preferences schema", () => {
      const valid = NotificationPreferencesSchema.safeParse({
        emailEnabled: true,
        smsEnabled: false,
        urgentOnly: true,
        eventReminders: true,
        announcements: false,
      });
      expect(valid.success).toBe(true);

      const partial = UpdateNotificationPreferencesSchema.safeParse({
        urgentOnly: true,
      });
      expect(partial.success).toBe(true);
    });
  });

  describe("3. Notification Queue & Member Preferences Filtering", () => {
    it("should enqueue both in_app and email for recipient with default preferences", async () => {
      const result = await service.enqueue({
        userId: "user-1",
        recipientEmail: "user1@mulembe.org",
        channel: "all",
        subject: "Chapter Meeting",
        message: "Gathering scheduled for Saturday.",
      });

      expect(result.inAppCreated).toBe(true);
      expect(result.emailQueued).toBe(true);
      expect(repo.notifications).toHaveLength(2); // 1 in_app, 1 email
    });

    it("should suppress email if user has disabled email preference", async () => {
      await repo.upsertUserPreferences("user-no-email", { emailEnabled: false });

      const result = await service.enqueue({
        userId: "user-no-email",
        recipientEmail: "user@test.ke",
        channel: "email",
        subject: "Newsletter",
        message: "Here is your weekly update.",
      });

      expect(result.emailQueued).toBe(false);
      expect(result.suppressedReasons).toBeDefined();
      expect(result.suppressedReasons?.[0]).toContain("Email disabled");
    });

    it("should suppress routine notifications when user has urgentOnly enabled", async () => {
      await repo.upsertUserPreferences("user-urgent-only", { urgentOnly: true });

      // Routine dispatch -> suppressed
      const routine = await service.enqueue({
        userId: "user-urgent-only",
        recipientEmail: "user@test.ke",
        recipientPhone: "+254711223344",
        channel: "both",
        priority: "routine",
        subject: "Cultural Tidbit",
        message: "Did you know...",
      });

      expect(routine.emailQueued).toBe(false);
      expect(routine.smsQueued).toBe(false);
      expect(routine.suppressedReasons?.[0]).toContain("Urgent notifications only");

      // Urgent dispatch -> allowed
      const urgent = await service.enqueue({
        userId: "user-urgent-only",
        recipientEmail: "user@test.ke",
        recipientPhone: "+254711223344",
        channel: "both",
        priority: "urgent",
        subject: "Emergency Relief Notice",
        message: "Urgent welfare fundraiser launched.",
      });

      expect(urgent.emailQueued).toBe(true);
      expect(urgent.smsQueued).toBe(true);
    });
  });

  describe("4. Worker Queue Batch Processing & Retries", () => {
    it("should process pending queue items and mark them sent", async () => {
      await repo.create({
        channel: "email",
        title: "Test Email",
        message: "Hello",
        status: "pending",
        targetDestination: "dest@test.com",
      });
      await repo.create({
        channel: "sms",
        title: "Test SMS",
        message: "Hello",
        status: "pending",
        targetDestination: "+254711223344",
      });

      const batch = await service.processBatch(10);
      expect(batch.processed).toBe(2);
      expect(batch.succeeded).toBe(2);
      expect(batch.failed).toBe(0);

      expect(mockEmail.sent).toHaveLength(1);
      expect(mockSms.sent).toHaveLength(1);
      expect(repo.notifications.every((n) => n.status === "sent")).toBe(true);
    });

    it("should handle provider failures, record error, and increment retryCount", async () => {
      mockEmail.shouldFail = true;

      await repo.create({
        channel: "email",
        title: "Failing Email",
        message: "Hello",
        status: "pending",
        targetDestination: "fail@test.com",
      });

      const batch = await service.processBatch(10);
      expect(batch.processed).toBe(1);
      expect(batch.succeeded).toBe(0);
      expect(batch.failed).toBe(1);
      expect(batch.retried).toBe(1);

      const failedItem = repo.notifications[0];
      expect(failedItem.status).toBe("failed");
      expect(failedItem.retryCount).toBe(1);
      expect(failedItem.lastError).toContain("Simulated Email Failure");
    });
  });

  describe("5. In-App Notifications Mark-As-Read", () => {
    it("should list in-app notifications and mark individual or all as read", async () => {
      const n1 = await repo.create({
        userId: "member-a",
        channel: "in_app",
        title: "Notice 1",
        message: "Msg 1",
        status: "pending",
      });
      await repo.create({
        userId: "member-a",
        channel: "in_app",
        title: "Notice 2",
        message: "Msg 2",
        status: "pending",
      });

      const list = await repo.listByUser("member-a");
      expect(list.total).toBe(2);

      // Mark single read
      await repo.markAsRead(n1.id, "member-a");
      expect(repo.notifications.find((n) => n.id === n1.id)?.status).toBe("read");

      // Mark all read
      const updatedCount = await repo.markAllAsRead("member-a");
      expect(updatedCount).toBe(1);
      expect(repo.notifications.every((n) => n.status === "read")).toBe(true);
    });
  });
});

