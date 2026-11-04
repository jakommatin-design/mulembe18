import { describe, it, expect } from "vitest";
import {
  AuthUser,
  assertScopeAccess,
  AuthorizationError,
  hasMinimumRole,
} from "@/lib/auth/roles";

describe("Role Hierarchy & Comparison", () => {
  it("correctly identifies role seniority", () => {
    expect(hasMinimumRole("super_admin", "national_admin")).toBe(true);
    expect(hasMinimumRole("national_admin", "county_coordinator")).toBe(true);
    expect(hasMinimumRole("county_coordinator", "chapter_chair")).toBe(true);
    expect(hasMinimumRole("chapter_chair", "chapter_secretary")).toBe(true);
    expect(hasMinimumRole("chapter_secretary", "member")).toBe(true);
    expect(hasMinimumRole("member", "guest")).toBe(true);

    expect(hasMinimumRole("member", "chapter_chair")).toBe(false);
    expect(hasMinimumRole("chapter_secretary", "county_coordinator")).toBe(false);
    expect(hasMinimumRole("national_admin", "super_admin")).toBe(false);
  });
});

describe("Scope-Aware Permission Enforcement (ABAC/RBAC)", () => {
  const superAdminUser: AuthUser = {
    id: "usr_super",
    email: "super@mulembe.org",
    fullName: "Super Administrator",
    role: "super_admin",
    status: "active",
  };

  const nationalAdminUser: AuthUser = {
    id: "usr_national",
    email: "national@mulembe.org",
    fullName: "National Executive",
    role: "national_admin",
    status: "active",
  };

  const kakamegaCoordinator: AuthUser = {
    id: "usr_coord_kakamega",
    email: "coord.kakamega@mulembe.org",
    fullName: "Kakamega County Coordinator",
    role: "county_coordinator",
    countyCode: "037",
    status: "active",
  };

  const mombasaChair: AuthUser = {
    id: "usr_chair_mombasa",
    email: "chair.mombasa@mulembe.org",
    fullName: "Mombasa Chapter Chair",
    role: "chapter_chair",
    chapterId: "ch-001-mombasa",
    countyCode: "001",
    status: "active",
  };

  const mombasaSec: AuthUser = {
    id: "usr_sec_mombasa",
    email: "sec.mombasa@mulembe.org",
    fullName: "Mombasa Chapter Secretary",
    role: "chapter_secretary",
    chapterId: "ch-001-mombasa",
    countyCode: "001",
    status: "active",
  };

  const normalMember: AuthUser = {
    id: "usr_member_1",
    email: "member@mulembe.org",
    fullName: "John Masika",
    role: "member",
    status: "active",
  };

  const guestUser: AuthUser = {
    id: "guest",
    email: "",
    fullName: "Visitor",
    role: "guest",
    status: "active",
  };

  describe("Super Admin & National Admin Privileges", () => {
    it("super_admin has unrestricted access to all operations including system settings", () => {
      expect(() =>
        assertScopeAccess(superAdminUser, "manage_system_settings")
      ).not.toThrow();
      expect(() =>
        assertScopeAccess(superAdminUser, "inspect_audit_logs")
      ).not.toThrow();
      expect(() =>
        assertScopeAccess(superAdminUser, "create_chapter", { countyCode: "047" })
      ).not.toThrow();
    });

    it("national_admin can inspect audit logs and create chapters nationwide", () => {
      expect(() =>
        assertScopeAccess(nationalAdminUser, "inspect_audit_logs")
      ).not.toThrow();
      expect(() =>
        assertScopeAccess(nationalAdminUser, "create_chapter", { countyCode: "001" })
      ).not.toThrow();
    });

    it("national_admin cannot manage system settings (super_admin only)", () => {
      expect(() =>
        assertScopeAccess(nationalAdminUser, "manage_system_settings")
      ).toThrow(AuthorizationError);
    });
  });

  describe("County Coordinator Scope Isolation", () => {
    it("allows coordinator to create chapters inside their assigned county (037 Kakamega)", () => {
      expect(() =>
        assertScopeAccess(kakamegaCoordinator, "create_chapter", {
          countyCode: "037",
        })
      ).not.toThrow();
    });

    it("rejects coordinator attempting to create chapters outside their county (047 Nairobi)", () => {
      expect(() =>
        assertScopeAccess(kakamegaCoordinator, "create_chapter", {
          countyCode: "047",
        })
      ).toThrow("Cannot create chapters outside your assigned county");
    });

    it("rejects coordinator attempting to inspect system audit logs", () => {
      expect(() =>
        assertScopeAccess(kakamegaCoordinator, "inspect_audit_logs")
      ).toThrow("Audit logs are restricted");
    });
  });

  describe("Chapter Leadership Scope Isolation", () => {
    it("allows chapter chair to approve members for their own chapter", () => {
      expect(() =>
        assertScopeAccess(mombasaChair, "approve_members", {
          chapterId: "ch-001-mombasa",
        })
      ).not.toThrow();
    });

    it("rejects chapter chair attempting to approve members for a different chapter", () => {
      expect(() =>
        assertScopeAccess(mombasaChair, "approve_members", {
          chapterId: "ch-037-kakamega",
        })
      ).toThrow("Cannot approve members outside your chapter");
    });

    it("allows chapter secretary to publish notices for their own chapter", () => {
      expect(() =>
        assertScopeAccess(mombasaSec, "publish_notice", {
          chapterId: "ch-001-mombasa",
        })
      ).not.toThrow();
    });

    it("rejects chapter secretary attempting to approve members (chair/coord privilege only)", () => {
      expect(() =>
        assertScopeAccess(mombasaSec, "approve_members", {
          chapterId: "ch-001-mombasa",
        })
      ).toThrow(AuthorizationError);
    });
  });

  describe("Member & Guest Restrictions", () => {
    it("allows member to edit own profile and RSVP to events", () => {
      expect(() =>
        assertScopeAccess(normalMember, "edit_own_profile")
      ).not.toThrow();
      expect(() =>
        assertScopeAccess(normalMember, "rsvp_events")
      ).not.toThrow();
    });

    it("rejects member attempting to publish notice or create chapter event", () => {
      expect(() =>
        assertScopeAccess(normalMember, "publish_notice")
      ).toThrow(AuthorizationError);
      expect(() =>
        assertScopeAccess(normalMember, "create_chapter_event")
      ).toThrow(AuthorizationError);
    });

    it("rejects unauthenticated guest from member operations with 401 status", () => {
      try {
        assertScopeAccess(guestUser, "rsvp_events");
        expect.unreachable();
      } catch (err) {
        expect(err).toBeInstanceOf(AuthorizationError);
        expect((err as AuthorizationError).status).toBe(401);
      }
    });
  });
});
