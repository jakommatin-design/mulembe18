# 02. User Roles, Scopes, and Permissions Matrix

## 1. Hierarchy of Roles
The platform defines seven distinct user roles with strict hierarchical authority:

1. **`guest`**: Unauthenticated public visitor. Can browse public landing pages, about, news, public chapter directories, and public notices.
2. **`member`**: Authenticated community member. Can complete onboarding, view private profile, join/transfer chapters, RSVP to events, and submit mutual aid claims.
3. **`chapter_secretary`**: Administrative executive for a single local chapter. Manages chapter memberships, drafts meeting notes, registers attendees, and creates chapter-scoped notices.
4. **`chapter_chair`**: Head executive of a single local chapter. Approves membership admissions, schedules chapter AGMs/events, and oversees chapter disbursements.
5. **`county_coordinator`**: Regional administrator overseeing all chapters within an assigned Kenyan County (e.g., Kakamega, Bungoma, Nairobi, Mombasa).
6. **`national_admin`**: Platform executive managing all 47 counties, national policy announcements, elder council publications, and user disputes.
7. **`super_admin`**: Technical system owner with unrestricted access, database migration execution, role assignment, and audit log scrutiny.

---

## 2. Scope-Aware Access Control (ABAC/RBAC)
Role alone is insufficient; permissions are checked against a **Geographic/Entity Scope**:

$$\text{CanAccess}(User, Resource) = (User.role \ge RequiredRole) \land (User.scope \supseteq Resource.scope)$$

* **Chapter Scope**: Applies to `chapter_secretary` and `chapter_chair`. Can only access records where `record.chapter_id == user.chapter_id`.
* **County Scope**: Applies to `county_coordinator`. Can access any record where `record.county_code == user.county_code`.
* **National Scope**: Applies to `national_admin` and `super_admin`. Unrestricted national boundary.

---

## 3. Permissions Matrix

| Permission Action | Guest | Member | Chapter Sec | Chapter Chair | County Coord | National Admin | Super Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **View Public Pages** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Complete Member Registration** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Edit Own Profile** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Download Own Data (KDPA)** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RSVP to Events** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Chapter Member Roster** | ❌ | Own | Own Chapter | Own Chapter | County Scope | Nationwide | Nationwide |
| **Approve Chapter Members** | ❌ | ❌ | ❌ | Own Chapter | County Scope | Nationwide | Nationwide |
| **Create Chapter Event** | ❌ | ❌ | Own Chapter | Own Chapter | County Scope | Nationwide | Nationwide |
| **Publish Notice/Announcement** | ❌ | ❌ | Chapter Scope | Chapter Scope | County Scope | Nationwide | Nationwide |
| **Create New Chapter** | ❌ | ❌ | ❌ | ❌ | County Scope | Nationwide | Nationwide |
| **Assign Roles within Scope** | ❌ | ❌ | ❌ | ❌ | ❌ | Up to County | All Roles |
| **Inspect System Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **System Settings & Migrations**| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Enforcement Implementation Pattern
All permission checks are evaluated inside the **Service Layer** (not just UI or Route Handlers):

```typescript
// Example permission verification pattern in src/server/services/
export async function assertScopeAccess(
  currentUser: AuthenticatedUser,
  requiredRole: Role,
  targetScope: { chapterId?: string; countyCode?: string }
): Promise<void> {
  if (currentUser.role === "super_admin") return;
  if (currentUser.role === "national_admin" && requiredRole !== "super_admin") return;

  if (targetScope.countyCode && currentUser.role === "county_coordinator") {
    if (currentUser.countyCode === targetScope.countyCode) return;
  }

  if (targetScope.chapterId && ["chapter_chair", "chapter_secretary"].includes(currentUser.role)) {
    if (currentUser.chapterId === targetScope.chapterId) return;
  }

  throw new ForbiddenError("Insufficient role or scope privilege for this operation.");
}
```
