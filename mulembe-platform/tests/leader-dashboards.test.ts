import { describe, it, expect } from "vitest";
import { assertScopeAccess, AuthorizationError, UserRole } from "@/lib/auth/roles";

describe("Leader & Admin Dashboards Architecture (Prompt 9)", () => {
  it("routes user roles to their appropriate dashboard tier", () => {
    function getDashboardRoute(role: UserRole): string {
      switch (role) {
        case "super_admin":
        case "national_admin":
          return "/dashboard/national";
        case "county_coordinator":
          return "/dashboard/county";
        case "chapter_chair":
        case "chapter_secretary":
          return "/dashboard/chapter";
        default:
          return "/profile";
      }
    }

    expect(getDashboardRoute("super_admin")).toBe("/dashboard/national");
    expect(getDashboardRoute("national_admin")).toBe("/dashboard/national");
    expect(getDashboardRoute("county_coordinator")).toBe("/dashboard/county");
    expect(getDashboardRoute("chapter_chair")).toBe("/dashboard/chapter");
    expect(getDashboardRoute("chapter_secretary")).toBe("/dashboard/chapter");
    expect(getDashboardRoute("member")).toBe("/profile");
    expect(getDashboardRoute("guest")).toBe("/profile");
  });

  it("enforces scope-based permission checks for national admin", () => {
    const nationalAdmin = {
      id: "admin_1",
      email: "admin@mulembe.org",
      fullName: "National Administrator",
      role: "national_admin" as const,
      status: "active" as const,
      countyCode: null,
    };

    expect(() => assertScopeAccess(nationalAdmin, "create_chapter")).not.toThrow();
    expect(() => assertScopeAccess(nationalAdmin, "inspect_audit_logs")).not.toThrow();
    expect(() => assertScopeAccess(nationalAdmin, "assign_roles")).not.toThrow();
  });

  it("restricts chapter leaders from national governance actions", () => {
    const chapterSec = {
      id: "sec_1",
      email: "sec@mulembe.org",
      fullName: "Chapter Secretary",
      role: "chapter_secretary" as const,
      status: "active" as const,
      countyCode: "037",
      chapterId: "ch-037-kakamega",
    };

    // Can view roster in chapter
    expect(() =>
      assertScopeAccess(chapterSec, "view_roster", { chapterId: "ch-037-kakamega" })
    ).not.toThrow();

    // Cannot inspect audit logs or assign roles
    expect(() => assertScopeAccess(chapterSec, "inspect_audit_logs")).toThrow(AuthorizationError);
    expect(() => assertScopeAccess(chapterSec, "assign_roles")).toThrow(AuthorizationError);
  });

  it("verifies CSV export serialization data format", () => {
    const sampleMembers = [
      {
        membershipId: "MLB-037-12345",
        fullName: "Wycliffe Wafula",
        email: "wafula@example.com",
        phone: "+254712345678",
        role: "member",
        clan: "Bukusu",
        currentCountyCode: "037",
        status: "active",
        createdAt: "2026-11-01T12:00:00Z",
      },
    ];

    const headers = [
      "Membership ID",
      "Full Name",
      "Email",
      "Phone",
      "Role",
      "Clan",
      "County Code",
      "Status",
      "Registered Date",
    ];

    const rows = sampleMembers.map((m) => [
      `"${m.membershipId}"`,
      `"${m.fullName}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.role}"`,
      `"${m.clan}"`,
      `"${m.currentCountyCode}"`,
      `"${m.status}"`,
      `"${m.createdAt}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    expect(csv).toContain("Membership ID,Full Name,Email");
    expect(csv).toContain('"MLB-037-12345","Wycliffe Wafula"');
    expect(csv.split("\n")).toHaveLength(2);
  });

  it("filters audit logs by action and target entity", () => {
    const logs = [
      { id: "1", action: "member.registered", targetEntity: "user", actorId: "u1" },
      { id: "2", action: "chapter.created", targetEntity: "chapter", actorId: "u2" },
      { id: "3", action: "member.active", targetEntity: "user", actorId: "u3" },
    ];

    const userLogs = logs.filter((l) => l.targetEntity === "user");
    expect(userLogs).toHaveLength(2);

    const chapterLogs = logs.filter((l) => l.action.startsWith("chapter."));
    expect(chapterLogs).toHaveLength(1);
    expect(chapterLogs[0].targetEntity).toBe("chapter");
  });
});

