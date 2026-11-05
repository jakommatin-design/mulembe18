import { z } from "zod";

export const SendNotificationSchema = z.object({
  channel: z.enum(["email", "sms", "both"]),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z
    .string()
    .regex(/^\+254\d{9}$/, "Phone must be in format +254XXXXXXXXX")
    .optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(5).max(1000),
  chapterId: z.string().optional().nullable(),
});

