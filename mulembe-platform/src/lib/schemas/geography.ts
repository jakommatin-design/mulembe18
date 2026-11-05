import { z } from "zod";

export const CountyCodeSchema = z
  .string()
  .regex(/^\d{3}$/, "County code must be a 3-digit number (e.g. '037')");

export const CountySchema = z.object({
  code: CountyCodeSchema,
  name: z.string().min(1),
  region: z.string().min(1),
});

export const SubCountySchema = z.object({
  id: z.string().min(1),
  countyCode: CountyCodeSchema,
  name: z.string().min(1),
});

export const WardSchema = z.object({
  id: z.string().min(1),
  subCountyId: z.string().min(1),
  name: z.string().min(1),
});

