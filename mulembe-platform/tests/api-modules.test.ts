import { describe, it, expect } from "vitest";
import { CountyCodeSchema } from "@/lib/schemas/geography";
import { CreateChapterSchema, ChapterQuerySchema } from "@/lib/schemas/chapter";
import { RegisterMemberSchema } from "@/lib/schemas/member";
import { CreateEventSchema, RsvpSchema } from "@/lib/schemas/event";
import { CreateAnnouncementSchema } from "@/lib/schemas/announcement";
import { SendNotificationSchema } from "@/lib/schemas/notification";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { apiSuccess, apiError } from "@/lib/api/response";

describe("Core API Zod Schemas Validation", () => {
  describe("Geography Schemas", () => {
    it("validates 3-digit county codes correctly", () => {
      expect(CountyCodeSchema.safeParse("037").success).toBe(true);
      expect(CountyCodeSchema.safeParse("001").success).toBe(true);
      expect(CountyCodeSchema.safeParse("37").success).toBe(false);
      expect(CountyCodeSchema.safeParse("abc").success).toBe(false);
      expect(CountyCodeSchema.safeParse("0371").success).toBe(false);
    });
  });

  describe("Chapter Schemas", () => {
    it("validates chapter creation with valid slug and county", () => {
      const valid = {
        name: "Kakamega Central",
        slug: "kakamega-central",
        countyCode: "037",
        meetingVenue: "Bukhungu Social Hall",
      };
      expect(CreateChapterSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects invalid chapter slugs with uppercase or special characters", () => {
      const invalid = {
        name: "Kakamega Central",
        slug: "Kakamega_Central!",
        countyCode: "037",
      };
      expect(CreateChapterSchema.safeParse(invalid).success).toBe(false);
    });

    it("parses chapter query pagination defaults", () => {
      const parsed = ChapterQuerySchema.parse({});
      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(20);
    });
  });

  describe("Member Schemas", () => {
    it("validates member registration with strict Kenyan phone MSISDN and KDPA consent", () => {
      const valid = {
        fullName: "Wafula Masika",
        phone: "+254712345678",
        ancestralCountyCode: "039",
        currentCountyCode: "047",
        kdpaConsent: true,
      };
      expect(RegisterMemberSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects member registration without KDPA consent", () => {
      const invalid = {
        fullName: "Wafula Masika",
        phone: "+254712345678",
        ancestralCountyCode: "039",
        currentCountyCode: "047",
        kdpaConsent: false,
      };
      expect(RegisterMemberSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects non-Kenyan international phone numbers", () => {
      const invalid = {
        fullName: "Wafula Masika",
        phone: "+15551234567",
        ancestralCountyCode: "039",
        currentCountyCode: "047",
        kdpaConsent: true,
      };
      expect(RegisterMemberSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("Event Schemas", () => {
    it("validates event creation payload", () => {
      const valid = {
        title: "Annual Luhya Cultural Festival",
        slug: "annual-cultural-festival-2026",
        description: "Celebrating heritage, food, and music from all 18 sub-tribes.",
        category: "cultural",
        startTime: "2026-12-10T10:00:00Z",
        endTime: "2026-12-10T18:00:00Z",
        venueName: "Bukhungu Stadium",
      };
      expect(CreateEventSchema.safeParse(valid).success).toBe(true);
    });

    it("validates RSVP with guest counts within bounds (0-10)", () => {
      expect(RsvpSchema.safeParse({ status: "attending", guestsCount: 2 }).success).toBe(true);
      expect(RsvpSchema.safeParse({ status: "attending", guestsCount: 15 }).success).toBe(false);
    });
  });

  describe("Announcement Schemas", () => {
    it("validates announcement creation", () => {
      const valid = {
        title: "County Bursary Application Window",
        content: "Bursary applications for 2026 academic year are now open to chapter members.",
        priority: "important",
        countyCode: "038",
      };
      expect(CreateAnnouncementSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe("Notification Schemas", () => {
    it("validates email and sms notification dispatch", () => {
      const valid = {
        channel: "email",
        recipientEmail: "member@mulembe.org",
        subject: "Meeting Notice",
        message: "Monthly chapter meeting on Sunday.",
      };
      expect(SendNotificationSchema.safeParse(valid).success).toBe(true);
    });
  });
});

describe("API Response & Rate Limiting Infrastructure", () => {
  it("formats standard success response shape per API specification", async () => {
    const res = apiSuccess({ id: 1 }, { page: 1, limit: 10, total: 1, totalPages: 1 });
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(1);
    expect(data.meta.total).toBe(1);
  });

  it("formats standard error response shape per API specification", async () => {
    const res = apiError("FORBIDDEN", "Insufficient role", 403, [
      { field: "scope", message: "Outside assigned county" },
    ]);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("FORBIDDEN");
    expect(data.error.details).toHaveLength(1);
  });

  it("enforces sliding window rate limit and throttles after threshold", () => {
    const key = `test_key_${Date.now()}`;
    const limit = 3;

    // First 3 requests succeed
    expect(checkRateLimit(key, limit).success).toBe(true);
    expect(checkRateLimit(key, limit).success).toBe(true);
    expect(checkRateLimit(key, limit).success).toBe(true);

    // 4th request gets blocked
    const throttled = checkRateLimit(key, limit);
    expect(throttled.success).toBe(false);
    expect(throttled.remaining).toBe(0);
  });
});
