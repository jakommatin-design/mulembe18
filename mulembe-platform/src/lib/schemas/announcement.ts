import { z } from "zod";
import { CountyCodeSchema } from "./geography";

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  priority: z.enum(["routine", "important", "urgent"]).default("routine"),
  chapterId: z.string().optional().nullable(),
  countyCode: CountyCodeSchema.optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export const AnnouncementQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  chapterId: z.string().optional(),
  countyCode: CountyCodeSchema.optional(),
});
