import { describe, it, expect } from "vitest";
import nextConfig from "../next.config";
import { maskPhone, maskEmail, maskNationalId } from "@/lib/privacy/masking";
import * as fs from "fs";
import * as path from "path";

describe("Prompt 12: Hardening, Performance, and Launch Readiness", () => {
  describe("1. Security Headers Configuration", () => {
    it("should configure strict security headers in next.config.ts", async () => {
      expect(nextConfig.headers).toBeDefined();
      const headerRules = await nextConfig.headers!();
      expect(headerRules).toHaveLength(1);

      const headers = headerRules[0].headers;
      const headerMap = new Map(headers.map((h) => [h.key, h.value]));

      expect(headerMap.get("X-Frame-Options")).toBe("DENY");
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
      expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(headerMap.get("Strict-Transport-Security")).toContain("max-age=63072000");
      expect(headerMap.get("Permissions-Policy")).toContain("camera=()");
      expect(headerMap.get("X-XSS-Protection")).toBe("1; mode=block");
    });
  });

  describe("2. KDPA Privacy Data Masking", () => {
    it("should mask Kenyan phone numbers protecting against scraping", () => {
      expect(maskPhone("+254722123456")).toBe("+25472****56");
      expect(maskPhone("0711987654")).toBe("071198****54");
      expect(maskPhone("")).toBe("");
      expect(maskPhone(null)).toBe("");
    });

    it("should mask email addresses preventing harvesting", () => {
      expect(maskEmail("wycliffe.masika@mulembe.org")).toBe("wy***a@mulembe.org");
      expect(maskEmail("jo@test.com")).toBe("j***@test.com");
      expect(maskEmail("invalid")).toBe("");
      expect(maskEmail(null)).toBe("");
    });

    it("should mask national ID numbers preserving only last 4 digits", () => {
      expect(maskNationalId("12345678")).toBe("***5678");
      expect(maskNationalId("9876")).toBe("***9876");
      expect(maskNationalId("")).toBe("");
    });
  });

  describe("3. Environment Variables & Launch Configuration", () => {
    it("should document all required variables in .env.example", () => {
      const envExamplePath = path.join(__dirname, "../.env.example");
      expect(fs.existsSync(envExamplePath)).toBe(true);

      const content = fs.readFileSync(envExamplePath, "utf-8");
      expect(content).toContain("DATABASE_URL");
      expect(content).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
      expect(content).toContain("CLERK_SECRET_KEY");
      expect(content).toContain("RESEND_API_KEY");
      expect(content).toContain("AFRICAS_TALKING_API_KEY");
      expect(content).toContain("CRON_SECRET");
    });

    it("should define vercel.json with scheduled cron configuration", () => {
      const vercelJsonPath = path.join(__dirname, "../vercel.json");
      expect(fs.existsSync(vercelJsonPath)).toBe(true);

      const config = JSON.parse(fs.readFileSync(vercelJsonPath, "utf-8"));
      expect(config.crons).toBeDefined();
      expect(config.crons[0].path).toBe("/api/cron/notifications");
      expect(config.crons[0].schedule).toBe("*/5 * * * *");
    });
  });

  describe("4. Error Pages & Health Check Endpoints", () => {
    it("should ensure not-found and error boundary files exist", () => {
      const notFoundPath = path.join(__dirname, "../src/app/not-found.tsx");
      const errorPath = path.join(__dirname, "../src/app/error.tsx");
      const healthPath = path.join(__dirname, "../src/app/api/health/route.ts");

      expect(fs.existsSync(notFoundPath)).toBe(true);
      expect(fs.existsSync(errorPath)).toBe(true);
      expect(fs.existsSync(healthPath)).toBe(true);
    });
  });
});

