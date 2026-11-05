import { z } from "zod";

export const NotificationChannelEnum = z.enum(["in_app", "email", "sms", "both", "all"]);
export const NotificationPriorityEnum = z.enum(["routine", "important", "urgent"]);
export const NotificationStatusEnum = z.enum(["pending", "processing", "sent", "failed", "read"]);

export const SendNotificationSchema = z.object({
  channel: NotificationChannelEnum,
  priority: NotificationPriorityEnum.default("routine"),
  recipientUserId: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z
    .string()
    .regex(/^\+254\d{9}$/, "Phone must be in format +254XXXXXXXXX")
    .optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(5, "Message must be at least 5 characters").max(1000),
  chapterId: z.string().optional().nullable(),
  countyCode: z.string().regex(/^\d{3}$/).optional().nullable(),
});

export const NotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  urgentOnly: z.boolean(),
  eventReminders: z.boolean(),
  announcements: z.boolean(),
});

export const UpdateNotificationPreferencesSchema = NotificationPreferencesSchema.partial();

export const NotificationQuerySchema = z.object({
  priority: NotificationPriorityEnum.optional(),
  unreadOnly: z.enum(["true", "false"]).optional().transform((v) => v === "true"),
  page: z.string().optional().transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1)),
  limit: z.string().optional().transform((v) => (v ? Math.min(100, Math.max(1, parseInt(v, 10))) : 20)),
});

export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;
