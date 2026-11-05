import { z } from "zod";
import { CountyCodeSchema } from "./geography";

export const CreateChapterSchema = z.object({
  name: z.string().min(3, "Chapter name must be at least 3 characters").max(150),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens"),
  countyCode: CountyCodeSchema,
  subCountyId: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  meetingVenue: z.string().max(255).optional().nullable(),
  meetingSchedule: z.string().max(255).optional().nullable(),
  status: z.enum(["active", "pending", "inactive"]).default("active"),
});

export const UpdateChapterSchema = z.object({
  name: z.string().min(3).max(150).optional(),
  description: z.string().max(1000).optional().nullable(),
  meetingVenue: z.string().max(255).optional().nullable(),
  meetingSchedule: z.string().max(255).optional().nullable(),
  status: z.enum(["active", "pending", "inactive"]).optional(),
});

export const ChapterQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  countyCode: CountyCodeSchema.optional(),
  status: z.enum(["active", "pending", "inactive"]).optional(),
});

