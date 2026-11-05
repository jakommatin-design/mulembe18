import { z } from "zod";
import { CountyCodeSchema } from "./geography";

export const RegisterMemberSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(150),
  phone: z
    .string()
    .regex(/^\+254\d{9}$/, "Phone number must be a valid Kenyan mobile number (+254XXXXXXXXX)"),
  nationalId: z.string().max(64).optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  clan: z.string().max(100).optional().nullable(),
  ancestralCountyCode: CountyCodeSchema,
  currentCountyCode: CountyCodeSchema,
  chapterId: z.string().optional().nullable(),
  kdpaConsent: z.literal(true, {
    errorMap: () => ({
      message: "You must consent to data processing under the Kenya Data Protection Act",
    }),
  }),
});

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(150).optional(),
  phone: z
    .string()
    .regex(/^\+254\d{9}$/, "Phone number must be in format +254XXXXXXXXX")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  clan: z.string().max(100).optional().nullable(),
  currentCountyCode: CountyCodeSchema.optional().nullable(),
});

export const VerifyMemberSchema = z.object({
  status: z.enum(["active", "suspended"]),
});

export const MemberQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  countyCode: CountyCodeSchema.optional(),
  clan: z.string().optional(),
  status: z.enum(["pending", "active", "suspended"]).optional(),
});

