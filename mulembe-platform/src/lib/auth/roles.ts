import { z } from "zod";

export const UserRoleSchema = z.enum([
  "guest",
  "member",
  "chapter_secretary",
  "chapter_chair",
  "county_coordinator",
  "national_admin",
  "super_admin",
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  member: 1,
  chapter_secretary: 2,
  chapter_chair: 3,
  county_coordinator: 4,
  national_admin: 5,
  super_admin: 6,
};

export interface AuthUser {
  id: string; // Clerk user ID
  dbId?: string;
  email: string;
  fullName: string;
  role: UserRole;
  chapterId?: string | null;
  countyCode?: string | null;
  status: "pending" | "active" | "suspended" | "deleted";
}

export interface ResourceScope {
  chapterId?: string | null;
  countyCode?: string | null;
}

export type PermissionAction =
  | "view_public"
  | "complete_registration"
  | "edit_own_profile"
  | "download_kdpa_data"
  | "rsvp_events"
  | "view_roster"
  | "approve_members"
  | "create_chapter_event"
  | "publish_notice"
  | "create_chapter"
  | "assign_roles"
  | "inspect_audit_logs"
  | "manage_system_settings";

/**
 * Checks whether a given role meets the minimum required role.
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

/**
 * Validates role and geographic scope according to docs/02-user-roles-and-permissions.md.
 * Throws AuthorizationError (403) if unauthorized.
 */
export function assertScopeAccess(
  user: AuthUser,
  action: PermissionAction,
  targetScope?: ResourceScope
): void {
  // 1. Super admin has unrestricted national boundary for all actions
  if (user.role === "super_admin") return;

  // 2. System settings restricted to super_admin only
  if (action === "manage_system_settings") {
    throw new AuthorizationError("Only super administrators can manage system settings.");
  }

  // 3. National admin can perform all actions except system settings
  if (user.role === "national_admin") return;

  // 4. Audit logs can only be inspected by national_admin or super_admin
  if (action === "inspect_audit_logs") {
    throw new AuthorizationError("Audit logs are restricted to national and super administrators.");
  }

  // 5. Assign roles: county_coordinator can assign up to chapter roles in their county;
  // Others below national_admin cannot assign roles.
  if (action === "assign_roles") {
    if (user.role === "county_coordinator") {
      if (targetScope?.countyCode && user.countyCode === targetScope.countyCode) {
        return;
      }
      throw new AuthorizationError("County coordinators may only manage roles within their assigned county.");
    }
    throw new AuthorizationError("You do not have permission to assign administrative roles.");
  }

  // 6. Create chapter: County coordinator (within county) or above
  if (action === "create_chapter") {
    if (user.role === "county_coordinator") {
      if (!targetScope?.countyCode || user.countyCode === targetScope.countyCode) {
        return;
      }
      throw new AuthorizationError("Cannot create chapters outside your assigned county.");
    }
    throw new AuthorizationError("Insufficient privileges to create a chapter.");
  }

  // 7. Publish notice / announcement
  if (action === "publish_notice") {
    if (user.role === "county_coordinator") {
      if (!targetScope?.countyCode || user.countyCode === targetScope.countyCode) return;
      throw new AuthorizationError("Out-of-scope: Notice county does not match coordinator county.");
    }
    if (["chapter_chair", "chapter_secretary"].includes(user.role)) {
      if (!targetScope?.chapterId || user.chapterId === targetScope.chapterId) return;
      throw new AuthorizationError("Out-of-scope: Notice chapter does not match your chapter.");
    }
    throw new AuthorizationError("You do not have permission to publish notices.");
  }

  // 8. Create chapter event
  if (action === "create_chapter_event") {
    if (user.role === "county_coordinator") {
      if (!targetScope?.countyCode || user.countyCode === targetScope.countyCode) return;
      throw new AuthorizationError("Cannot create events outside your assigned county.");
    }
    if (["chapter_chair", "chapter_secretary"].includes(user.role)) {
      if (!targetScope?.chapterId || user.chapterId === targetScope.chapterId) return;
      throw new AuthorizationError("Cannot create events for a different chapter.");
    }
    throw new AuthorizationError("You do not have permission to create chapter events.");
  }

  // 9. Approve members
  if (action === "approve_members") {
    if (user.role === "county_coordinator") {
      if (!targetScope?.countyCode || user.countyCode === targetScope.countyCode) return;
      throw new AuthorizationError("Cannot approve members outside your county.");
    }
    if (user.role === "chapter_chair") {
      if (!targetScope?.chapterId || user.chapterId === targetScope.chapterId) return;
      throw new AuthorizationError("Cannot approve members outside your chapter.");
    }
    throw new AuthorizationError("Chapter secretaries or members cannot approve membership admissions.");
  }

  // 10. View member roster
  if (action === "view_roster") {
    if (user.role === "county_coordinator") {
      if (!targetScope?.countyCode || user.countyCode === targetScope.countyCode) return;
      throw new AuthorizationError("Cannot view rosters outside your assigned county.");
    }
    if (["chapter_chair", "chapter_secretary"].includes(user.role)) {
      if (!targetScope?.chapterId || user.chapterId === targetScope.chapterId) return;
      throw new AuthorizationError("Cannot view rosters for other chapters.");
    }
    throw new AuthorizationError("Insufficient permissions to inspect chapter rosters.");
  }

  // 11. Member baseline actions (rsvp, edit profile, download KDPA)
  if (["rsvp_events", "edit_own_profile", "download_kdpa_data", "complete_registration"].includes(action)) {
    if (user.role !== "guest") return;
    throw new AuthorizationError("Authentication required.", 401);
  }

  // 12. Public view
  if (action === "view_public") return;
}

