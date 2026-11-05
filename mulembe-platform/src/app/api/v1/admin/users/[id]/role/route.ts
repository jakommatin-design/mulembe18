import { getSessionUser } from "@/lib/auth/session";
import { authService } from "@/server/services/auth.service";
import { UserRole, AuthorizationError } from "@/lib/auth/roles";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

const AssignRoleSchema = z.object({
  role: z.enum([
    "guest",
    "member",
    "chapter_secretary",
    "chapter_chair",
    "county_coordinator",
    "national_admin",
    "super_admin",
  ]),
  countyCode: z.string().optional(),
  chapterId: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const actor = await getSessionUser();
  if (!actor) {
    return apiError("UNAUTHENTICATED", "Authentication required", 401);
  }

  const { id: targetUserId } = await params;
  const body = await req.json().catch(() => ({}));
  const parse = AssignRoleSchema.safeParse(body);

  if (!parse.success) {
    return apiError("VALIDATION_FAILED", "Invalid role assignment parameters", 400);
  }

  try {
    await authService.assignUserRole(
      actor,
      targetUserId,
      parse.data.role as UserRole,
      {
        countyCode: parse.data.countyCode,
        chapterId: parse.data.chapterId,
      }
    );

    return apiSuccess({ message: `Assigned role ${parse.data.role} to user ${targetUserId}` });
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return apiError("FORBIDDEN", err.message, err.status);
    }
    const msg = err instanceof Error ? err.message : "Failed to assign role";
    return apiError("BAD_REQUEST", msg, 400);
  }
}

