import { currentUser } from "@clerk/nextjs/server";
import { authService } from "@/server/services/auth.service";
import { AuthUser } from "./roles";

/**
 * Server-side helper to retrieve the authenticated user from the database,
 * automatically falling back to creating them if first login.
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Try fetching from DB
  const dbUser = await authService.getAuthUser(clerkUser.id);
  if (dbUser) return dbUser;

  // Safe fallback: create in DB on first login
  const primaryEmail =
    clerkUser.emailAddresses[0]?.emailAddress ?? `${clerkUser.id}@mulembe.org`;
  const fullName =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    clerkUser.username ||
    "Mulembe Member";
  const phone = clerkUser.phoneNumbers[0]?.phoneNumber || "+254700000000";

  return await authService.syncClerkUser({
    id: clerkUser.id,
    email: primaryEmail,
    fullName,
    phone,
  });
}
