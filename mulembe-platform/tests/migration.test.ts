import { describe, it, expect } from "vitest";
import {
  sanitizeKenyanPhone,
  sanitizeEmail,
  resolveCountyCode,
  mapLegacyRole,
  cleanAndDeduplicateMembers,
} from "../scripts/migrate/cleaner";
import { migrateLegacyData } from "../scripts/migrate/migrator";
import { LegacyExport, LegacyMember } from "../scripts/migrate/types";
import sampleData from "../scripts/migrate/sample-legacy-export.json";

describe("Prompt 11: Legacy Data Migration (mulembe18 -> mulembe-platform)", () => {
  describe("1. Phone Number Sanitization (+254 standard format)", () => {
    it("should keep already valid +254 phone numbers unchanged", () => {
      expect(sanitizeKenyanPhone("+254722123456")).toBe("+254722123456");
      expect(sanitizeKenyanPhone("+254110556677")).toBe("+254110556677");
    });

    it("should normalize 07XX numbers by prepending +254 and dropping leading 0", () => {
      expect(sanitizeKenyanPhone("0711987654")).toBe("+254711987654");
      expect(sanitizeKenyanPhone("0722001122")).toBe("+254722001122");
    });

    it("should normalize 01XX Safaricom/Airtel numbers by prepending +254 and dropping leading 0", () => {
      expect(sanitizeKenyanPhone("0110556677")).toBe("+254110556677");
      expect(sanitizeKenyanPhone("0101234567")).toBe("+254101234567");
    });

    it("should normalize numbers starting with 254 without plus sign", () => {
      expect(sanitizeKenyanPhone("254733445566")).toBe("+254733445566");
      expect(sanitizeKenyanPhone("254112345678")).toBe("+254112345678");
    });

    it("should strip internal spaces, hyphens, and brackets", () => {
      expect(sanitizeKenyanPhone("+254 722-123 456")).toBe("+254722123456");
      expect(sanitizeKenyanPhone("(0711) 987-654")).toBe("+254711987654");
    });

    it("should reject invalid lengths and non-Kenyan formats", () => {
      expect(sanitizeKenyanPhone("12345")).toBeNull();
      expect(sanitizeKenyanPhone("+12025550143")).toBeNull(); // US number
      expect(sanitizeKenyanPhone("0812345678")).toBeNull(); // Non 7/1 prefix
      expect(sanitizeKenyanPhone("")).toBeNull();
      expect(sanitizeKenyanPhone(null)).toBeNull();
    });
  });

  describe("2. Email & County Code Resolution", () => {
    it("should sanitize and lowercase emails", () => {
      expect(sanitizeEmail("  MEMBER@MULEMBE.ORG  ")).toBe("member@mulembe.org");
      expect(sanitizeEmail("invalid-email")).toBeNull();
      expect(sanitizeEmail(null)).toBeNull();
    });

    it("should resolve numeric county codes including 2-digit and 3-digit forms", () => {
      expect(resolveCountyCode("037")).toBe("037");
      expect(resolveCountyCode("37")).toBe("037");
      expect(resolveCountyCode("47")).toBe("047");
      expect(resolveCountyCode("1")).toBe("001");
    });

    it("should resolve county names to 3-digit codes", () => {
      expect(resolveCountyCode("Kakamega")).toBe("037");
      expect(resolveCountyCode("Vihiga")).toBe("038");
      expect(resolveCountyCode("Bungoma")).toBe("039");
      expect(resolveCountyCode("Busia")).toBe("040");
      expect(resolveCountyCode("Nairobi")).toBe("047");
    });

    it("should fallback gracefully on unresolvable county values", () => {
      expect(resolveCountyCode("Atlantis", "037")).toBe("037");
      expect(resolveCountyCode(null, "047")).toBe("047");
    });
  });

  describe("3. Role Mapping", () => {
    it("should map legacy roles to modern 7-role RBAC hierarchy", () => {
      expect(mapLegacyRole("admin")).toBe("national_admin");
      expect(mapLegacyRole("chairperson")).toBe("chapter_chair");
      expect(mapLegacyRole("leader")).toBe("chapter_chair");
      expect(mapLegacyRole("secretary")).toBe("chapter_secretary");
      expect(mapLegacyRole("coordinator")).toBe("county_coordinator");
      expect(mapLegacyRole("superadmin")).toBe("super_admin");
      expect(mapLegacyRole("Member")).toBe("member");
      expect(mapLegacyRole("")).toBe("member");
      expect(mapLegacyRole(null)).toBe("member");
    });
  });

  describe("4. Deduplication and Data Cleaning", () => {
    it("should clean sample legacy export and detect all discrepancies", () => {
      const { cleanedMembers, conflicts } = cleanAndDeduplicateMembers(
        sampleData.members as LegacyMember[]
      );

      // 4 valid members
      expect(cleanedMembers).toHaveLength(4);

      // Verify valid members
      const masika = cleanedMembers.find((m) => m.fullName === "Wycliffe Masika");
      expect(masika).toBeDefined();
      expect(masika?.phone).toBe("+254722123456");
      expect(masika?.currentCountyCode).toBe("039"); // Bungoma
      expect(masika?.role).toBe("chapter_chair");

      const nafula = cleanedMembers.find((m) => m.fullName === "Brenda Nafula");
      expect(nafula).toBeDefined();
      expect(nafula?.phone).toBe("+254711987654");
      expect(nafula?.currentCountyCode).toBe("038"); // Vihiga

      // 4 conflicts detected
      expect(conflicts).toHaveLength(4);

      const conflictTypes = conflicts.map((c) => c.type);
      expect(conflictTypes).toContain("duplicate_email"); // ID 105
      expect(conflictTypes).toContain("duplicate_phone"); // ID 106
      expect(conflictTypes).toContain("invalid_phone"); // ID 107
      expect(conflictTypes).toContain("missing_name"); // ID 108
    });
  });

  describe("5. Dry Run Migration Pipeline", () => {
    it("should execute dry run without writing to database and produce report", async () => {
      const report = await migrateLegacyData(sampleData as unknown as LegacyExport, {
        dryRun: true,
      });

      expect(report.dryRun).toBe(true);
      expect(report.totalLegacyMembersRead).toBe(8);
      expect(report.validMembersCleaned).toBe(4);
      expect(report.duplicateCount).toBe(2);
      expect(report.skippedCount).toBe(4);
      expect(report.insertedUsers).toBe(0);
      expect(report.updatedUsers).toBe(0);
      expect(report.membershipsCreated).toBe(0);
      expect(report.conflicts).toHaveLength(4);
      expect(report.timestamp).toBeDefined();
    });
  });
});

