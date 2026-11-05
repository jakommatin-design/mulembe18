import { getSessionUser } from "@/lib/auth/session";
import { auditRepository } from "@/server/repositories/audit.repository";
import { assertScopeAccess, AuthorizationError } from "@/lib/auth/roles";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return apiError("UNAUTHENTICATED", "Authentication required", 401);
  }

  try {
    assertScopeAccess(user, "inspect_audit_logs");
    const logs = await auditRepository.getRecentLogs(100);
    return apiSuccess(logs);
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return apiError("FORBIDDEN", err.message, err.status);
    }
    const msg = err instanceof Error ? err.message : "Failed to load audit logs";
    return apiError("INTERNAL_ERROR", msg, 500);
  }
}

