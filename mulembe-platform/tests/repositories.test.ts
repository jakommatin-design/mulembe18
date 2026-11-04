import { describe, it, expect } from "vitest";
import { geographyRepository } from "@/server/repositories/geography.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { memberRepository } from "@/server/repositories/member.repository";
import countiesData from "../scripts/data/counties.json";

describe("Geography Data Integrity", () => {
  it("contains exactly 47 official Kenyan counties", () => {
    expect(countiesData).toHaveLength(47);
  });

  it("contains the four foundational Luhya heartland counties", () => {
    const codes = countiesData.map((c) => c.code);
    expect(codes).toContain("037"); // Kakamega
    expect(codes).toContain("038"); // Vihiga
    expect(codes).toContain("039"); // Bungoma
    expect(codes).toContain("040"); // Busia
  });

  it("has valid 3-digit county codes for all entries", () => {
    for (const c of countiesData) {
      expect(c.code).toMatch(/^\d{3}$/);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.region.length).toBeGreaterThan(0);
    }
  });
});

describe("Repository Methods Interface", () => {
  it("geographyRepository exposes expected methods", () => {
    expect(typeof geographyRepository.getAllCounties).toBe("function");
    expect(typeof geographyRepository.getCountyByCode).toBe("function");
    expect(typeof geographyRepository.getSubCountiesByCounty).toBe("function");
    expect(typeof geographyRepository.getWardsBySubCounty).toBe("function");
  });

  it("chapterRepository exposes expected methods", () => {
    expect(typeof chapterRepository.getAllActive).toBe("function");
    expect(typeof chapterRepository.getBySlug).toBe("function");
    expect(typeof chapterRepository.getByCounty).toBe("function");
  });

  it("memberRepository exposes expected methods", () => {
    expect(typeof memberRepository.getById).toBe("function");
    expect(typeof memberRepository.getByEmail).toBe("function");
    expect(typeof memberRepository.getByPhone).toBe("function");
  });
});
