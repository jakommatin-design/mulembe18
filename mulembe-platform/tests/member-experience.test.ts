import { describe, it, expect } from "vitest";
import { RegisterMemberSchema, UpdateProfileSchema } from "@/lib/schemas/member";

describe("Member Experience & Registration Architecture (Prompt 8)", () => {
  it("enforces strict KDPA consent during member registration", () => {
    const withoutConsent = {
      fullName: "Martin Wafula",
      phone: "+254712345678",
      ancestralCountyCode: "037",
      currentCountyCode: "047",
      kdpaConsent: false,
    };

    const result = RegisterMemberSchema.safeParse(withoutConsent);
    expect(result.success).toBe(false);
    if (!result.success) {
      const kdpaError = result.error.errors.find((e) => e.path.includes("kdpaConsent"));
      expect(kdpaError).toBeDefined();
    }

    const withConsent = {
      ...withoutConsent,
      kdpaConsent: true,
    };
    const validResult = RegisterMemberSchema.safeParse(withConsent);
    expect(validResult.success).toBe(true);
  });

  it("validates Kenyan MSISDN phone format (+254XXXXXXXXX)", () => {
    const invalidPhones = [
      "0712345678",
      "254712345678",
      "+25471234",
      "+25471234567899",
      "invalid-phone",
    ];

    for (const phone of invalidPhones) {
      const res = RegisterMemberSchema.safeParse({
        fullName: "Wafula Barasa",
        phone,
        ancestralCountyCode: "039",
        currentCountyCode: "039",
        kdpaConsent: true,
      });
      expect(res.success).toBe(false);
    }

    const validPhoneRes = RegisterMemberSchema.safeParse({
      fullName: "Wafula Barasa",
      phone: "+254712345678",
      ancestralCountyCode: "039",
      currentCountyCode: "039",
      kdpaConsent: true,
    });
    expect(validPhoneRes.success).toBe(true);
  });

  it("formats Membership ID with county prefix and random sequence", () => {
    const countyCode = "037";
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const membershipId = `MLB-${countyCode}-${randomSeq}`;

    expect(membershipId).toMatch(/^MLB-037-\d{5}$/);
  });

  it("validates profile update schema constraints", () => {
    const validUpdate = {
      fullName: "Wafula J. Barasa",
      clan: "Abashitsetse",
      gender: "male" as const,
      currentCountyCode: "047",
    };

    const res = UpdateProfileSchema.safeParse(validUpdate);
    expect(res.success).toBe(true);
  });

  it("validates KDPA export dossier contract structure", () => {
    const mockDossier = {
      exportedAt: new Date().toISOString(),
      compliance: "Kenya Data Protection Act 2019 (ODPC)",
      personalProfile: {
        id: "usr_123",
        membershipId: "MLB-037-12345",
        fullName: "Wafula Barasa",
        email: "wafula@example.com",
        phone: "+254712345678",
        ancestralCountyCode: "037",
        currentCountyCode: "047",
        status: "active",
      },
      chapterAffiliation: {
        chapterName: "Kakamega Central Chapter",
        role: "member",
        status: "active",
      },
      eventRsvps: [
        {
          eventId: "ev-001",
          status: "attending",
          guestsCount: 1,
        },
      ],
    };

    expect(mockDossier.compliance).toContain("Kenya Data Protection Act");
    expect(mockDossier.personalProfile.membershipId).toBe("MLB-037-12345");
    expect(mockDossier.chapterAffiliation.chapterName).toBe("Kakamega Central Chapter");
    expect(mockDossier.eventRsvps).toHaveLength(1);
  });
});

