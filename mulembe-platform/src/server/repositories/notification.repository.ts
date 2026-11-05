import { db } from "@/lib/db";
import {
  notifications,
  notificationPreferences,
  Notification,
  NewNotification,
  NotificationPreference,
  NewNotificationPreference,
} from "@/lib/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

export class NotificationRepository {
  async create(data: Omit<NewNotification, "id"> & { id?: string }): Promise<Notification> {
    const record: NewNotification = {
      ...data,
      id: data.id || randomUUID(),
    };
    await db.insert(notifications).values(record);
    const [inserted] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, record.id));
    return inserted;
  }

  async listByUser(
    userId: string,
    options: {
      priority?: "routine" | "important" | "urgent";
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ items: Notification[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(notifications.userId, userId),
      eq(notifications.channel, "in_app"),
    ];

    if (options.priority) {
      conditions.push(eq(notifications.priority, options.priority));
    }
    if (options.unreadOnly) {
      conditions.push(eq(notifications.status, "pending"));
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(whereClause);

    const items = await db
      .select()
      .from(notifications)
      .where(whereClause)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items,
      total: Number(countResult?.count || 0),
    };
  }

  async getById(id: string): Promise<Notification | null> {
    const [item] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id));
    return item || null;
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const res = await db
      .update(notifications)
      .set({
        status: "read",
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId)
        )
      );

    return (res as unknown as [{ affectedRows?: number }])?.[0]?.affectedRows
      ? (res as unknown as [{ affectedRows?: number }])[0].affectedRows! > 0
      : true;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const res = await db
      .update(notifications)
      .set({
        status: "read",
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.channel, "in_app"),
          eq(notifications.status, "pending")
        )
      );

    return (res as unknown as [{ affectedRows?: number }])?.[0]?.affectedRows || 0;
  }

  async getPendingQueue(batchSize = 25): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          inArray(notifications.channel, ["email", "sms"]),
          sql`(${notifications.status} = 'pending' OR (${notifications.status} = 'failed' AND ${notifications.retryCount} < ${notifications.maxRetries}))`
        )
      )
      .orderBy(
        // Process urgent first, then by earliest created
        sql`CASE WHEN ${notifications.priority} = 'urgent' THEN 0 WHEN ${notifications.priority} = 'important' THEN 1 ELSE 2 END`,
        notifications.createdAt
      )
      .limit(batchSize);
  }

  async updateStatus(
    id: string,
    updates: {
      status: "pending" | "processing" | "sent" | "failed" | "read";
      retryCount?: number;
      lastError?: string | null;
      sentAt?: Date;
      metadata?: unknown;
    }
  ): Promise<boolean> {
    await db
      .update(notifications)
      .set(updates)
      .where(eq(notifications.id, id));
    return true;
  }

  async getUserPreferences(userId: string): Promise<NotificationPreference> {
    const [pref] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));

    if (pref) {
      return pref;
    }

    // Default preferences if row does not exist yet
    return {
      id: "default",
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
    data: Partial<Omit<NewNotificationPreference, "id" | "userId">>
  ): Promise<NotificationPreference> {
    const [existing] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));

    if (existing) {
      await db
        .update(notificationPreferences)
        .set(data)
        .where(eq(notificationPreferences.userId, userId));

      const [updated] = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, userId));
      return updated;
    }

    const newPrefId = randomUUID();
    const newRecord: NewNotificationPreference = {
      id: newPrefId,
      userId,
      emailEnabled: data.emailEnabled ?? true,
      smsEnabled: data.smsEnabled ?? true,
      urgentOnly: data.urgentOnly ?? false,
      eventReminders: data.eventReminders ?? true,
      announcements: data.announcements ?? true,
    };

    await db.insert(notificationPreferences).values(newRecord);
    const [inserted] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.id, newPrefId));
    return inserted;
  }
}

export const notificationRepository = new NotificationRepository();

