import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  AuthUser,
  UserRole,
  PermissionAction,
  ResourceScope,
  assertScopeAccess,
  AuthorizationError,
} from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export interface SyncClerkUserInput {
  id: string; // Clerk ID
  email: string;
  fullName: string;
  phone?: string;
  role?: UserRole;
}

export class AuthService {
  /**
   * Syncs a user record on Clerk login or webhook.
   * If user doesn't exist, creates them with 'member' role (or specified role) and pending status.
   */
  async syncClerkUser(input: SyncClerkUserInput): Promise<AuthUser> {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, input.id))
      .limit(1);

    if (existing.length > 0) {
      const u = existing[0];
      return {
        id: u.id,
        dbId: u.id,
        email: u.email,
        fullName: u.fullName,
        role: (u.role as UserRole) || "member",
        countyCode: u.currentCountyCode,
        status: u.status as AuthUser["status"],
      };
    }

    // Create new user record
    const defaultRole: UserRole = input.role || "member";
    const phone = input.phone || "+254700000000";

    await db.insert(users).values({
      id: input.id,
      email: input.email,
      fullName: input.fullName,
      phone,
      role: defaultRole,
      status: "pending",
    });

    await auditRepository.log({
      actorId: input.id,
      action: "user.created",
      targetEntity: "user",
      targetId: input.id,
      payloadAfter: { email: input.email, fullName: input.fullName, role: defaultRole },
    });

    return {
      id: input.id,
      dbId: input.id,
      email: input.email,
      fullName: input.fullName,
      role: defaultRole,
      countyCode: null,
      status: "pending",
    };
  }

  /**
   * Retrieves an authenticated user from DB by Clerk ID.
   */
  async getAuthUser(clerkId: string): Promise<AuthUser | null> {
    const records = await db
      .select()
      .from(users)
      .where(eq(users.id, clerkId))
      .limit(1);

    if (records.length === 0) return null;
    const u = records[0];

    return {
      id: u.id,
      dbId: u.id,
      email: u.email,
      fullName: u.fullName,
      role: (u.role as UserRole) || "member",
      countyCode: u.currentCountyCode,
      status: u.status as AuthUser["status"],
    };
  }

  /**
   * Assigns a new role to a target user with scope validation and audit logging.
   */
  async assignUserRole(
    actor: AuthUser,
    targetUserId: string,
    newRole: UserRole,
    targetScope?: ResourceScope
  ): Promise<void> {
    // 1. Verify actor has permission to assign roles in this scope
    assertScopeAccess(actor, "assign_roles", targetScope);

    // 2. Fetch target user
    const target = await this.getAuthUser(targetUserId);
    if (!target) {
      throw new Error("Target user not found");
    }

    // 3. County coordinators cannot assign national_admin or super_admin
    if (
      actor.role === "county_coordinator" &&
      ["national_admin", "super_admin", "county_coordinator"].includes(newRole)
    ) {
      throw new AuthorizationError("County coordinators cannot promote users to regional or national roles.");
    }

    // 4. Update role in database
    await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, targetUserId));

    // 5. Audit log
    await auditRepository.log({
      actorId: actor.id,
      action: "user.role_assigned",
      targetEntity: "user",
      targetId: targetUserId,
      payloadBefore: { role: target.role },
      payloadAfter: { role: newRole, assignedBy: actor.id },
    });
  }

  /**
   * Asserts whether a user can perform an action in a given resource scope.
   */
  assertPermission(
    user: AuthUser,
    action: PermissionAction,
    targetScope?: ResourceScope
  ): void {
    assertScopeAccess(user, action, targetScope);
  }
}

export const authService = new AuthService();

