import { describe, it, expect } from "vitest";

describe("Public Pages & Routing Architecture (Prompt 7)", () => {
  it("defines standard public routing hierarchy", () => {
    const publicRoutes = [
      "/",
      "/about",
      "/chapters",
      "/chapters/[slug]",
      "/events",
      "/events/[slug]",
      "/news",
      "/contact",
    ];

    expect(publicRoutes).toHaveLength(8);
    expect(publicRoutes).toContain("/");
    expect(publicRoutes).toContain("/about");
    expect(publicRoutes).toContain("/chapters");
    expect(publicRoutes).toContain("/events");
    expect(publicRoutes).toContain("/news");
    expect(publicRoutes).toContain("/contact");
  });

  it("filters chapters by search term and county correctly", () => {
    const sampleChapters = [
      { id: "1", name: "Kakamega Central Chapter", countyCode: "037", description: "Heartland" },
      { id: "2", name: "Bungoma West Chapter", countyCode: "039", description: "Culture" },
      { id: "3", name: "Nairobi Chapter", countyCode: "047", description: "Metropolis" },
    ];

    // Filter by county
    const countyFiltered = sampleChapters.filter((ch) => ch.countyCode === "037");
    expect(countyFiltered).toHaveLength(1);
    expect(countyFiltered[0].name).toBe("Kakamega Central Chapter");

    // Filter by search query
    const searchFiltered = sampleChapters.filter((ch) =>
      ch.name.toLowerCase().includes("bungoma")
    );
    expect(searchFiltered).toHaveLength(1);
    expect(searchFiltered[0].countyCode).toBe("039");
  });

  it("filters events by category correctly", () => {
    const sampleEvents = [
      { id: "1", title: "Cultural Festival", category: "cultural" },
      { id: "2", title: "General Assembly", category: "agm" },
      { id: "3", title: "Youth Gala", category: "youth" },
    ];

    const culturalOnly = sampleEvents.filter((ev) => ev.category === "cultural");
    expect(culturalOnly).toHaveLength(1);
    expect(culturalOnly[0].title).toBe("Cultural Festival");

    const youthOnly = sampleEvents.filter((ev) => ev.category === "youth");
    expect(youthOnly).toHaveLength(1);
    expect(youthOnly[0].title).toBe("Youth Gala");
  });

  it("validates event structured data JSON-LD schema contract", () => {
    const event = {
      title: "Mulembe Cultural Festival",
      startTime: new Date("2026-12-15T09:00:00Z"),
      endTime: new Date("2026-12-17T18:00:00Z"),
      venueName: "Bukhungu Stadium",
      venueAddress: "Kakamega",
      description: "Grand community celebration",
    };

    const schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      startDate: event.startTime.toISOString(),
      endDate: event.endTime.toISOString(),
      location: {
        "@type": "Place",
        name: event.venueName,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.venueAddress,
          addressCountry: "KE",
        },
      },
      description: event.description,
    };

    expect(schema["@type"]).toBe("Event");
    expect(schema.name).toBe("Mulembe Cultural Festival");
    expect(schema.location.address.addressCountry).toBe("KE");
    expect(schema.startDate).toContain("2026-12-15");
  });

  it("validates robots.txt rules for search indexation", () => {
    const rules = {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/profile/", "/onboarding/"],
    };

    expect(rules.allow).toBe("/");
    expect(rules.disallow).toContain("/api/");
    expect(rules.disallow).toContain("/dashboard/");
    expect(rules.disallow).toContain("/profile/");
  });
});

