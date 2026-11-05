import { getSessionUser } from "@/lib/auth/session";
import { statsService } from "@/server/services/stats.service";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return apiError("UNAUTHENTICATED", "Authentication required", 401);
  }

  // Scoped stats based on role
  const scope =
    user.role === "national_admin" || user.role === "super_admin"
      ? undefined
      : user.role === "county_coordinator"
        ? { countyCode: user.countyCode }
        : { chapterId: user.chapterId, countyCode: user.countyCode };

  try {
    const stats = await statsService.getPlatformStats(scope);
    return apiSuccess(stats);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load statistics";
    return apiError("INTERNAL_ERROR", msg, 500);
  }
}

