import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens"),
  description: z.string().min(10),
  category: z.enum(["cultural", "agm", "welfare", "youth", "sports"]).default("cultural"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  venueName: z.string().min(2).max(255),
  venueAddress: z.string().max(255).optional().nullable(),
  onlineUrl: z.string().url().max(500).optional().nullable(),
  capacity: z.coerce.number().int().min(0).default(0),
  chapterId: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).default("published"),
});

export const RsvpSchema = z.object({
  status: z.enum(["attending", "tentative", "declined"]),
  guestsCount: z.coerce.number().int().min(0).max(10).default(0),
});

export const EventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  chapterId: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).default("published"),
});

