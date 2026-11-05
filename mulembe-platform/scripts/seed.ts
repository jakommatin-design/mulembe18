import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { counties, subCounties, wards, chapters, events, announcements } from "../src/lib/db/schema";
import countiesData from "./data/counties.json";

async function main() {
  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) throw new Error("DATABASE_URL not set in .env.local");

  console.log("🔗 Connecting to TiDB Cloud...");
  const connection = await mysql.createConnection({
    uri: connectionString,
    ssl: { rejectUnauthorized: true },
  });
  const db = drizzle(connection);

  console.log("🌱 Starting Mulembe National Platform Database Seed...");

  // 1. Seed 47 Counties
  console.log("➡️ Seeding 47 Kenyan Counties...");
  for (const c of countiesData) {
    await db
      .insert(counties)
      .values({ code: c.code, name: c.name, region: c.region })
      .onDuplicateKeyUpdate({ set: { name: c.name, region: c.region } });
  }
  console.log("✓ 47 Counties seeded.");

  // 2. Seed Sub-Counties
  console.log("➡️ Seeding Sub-Counties & Wards...");
  const sampleSubCounties = [
    // Kakamega (037)
    { id: "sc-037-01", countyCode: "037", name: "Lurambi" },
    { id: "sc-037-02", countyCode: "037", name: "Malava" },
    { id: "sc-037-03", countyCode: "037", name: "Mumias West" },
    { id: "sc-037-04", countyCode: "037", name: "Shinyalu" },
    { id: "sc-037-05", countyCode: "037", name: "Ikolomani" },
    // Bungoma (039)
    { id: "sc-039-01", countyCode: "039", name: "Kanduyi" },
    { id: "sc-039-02", countyCode: "039", name: "Webuye East" },
    { id: "sc-039-03", countyCode: "039", name: "Kimilili" },
    // Vihiga (038)
    { id: "sc-038-01", countyCode: "038", name: "Sabatia" },
    { id: "sc-038-02", countyCode: "038", name: "Vihiga" },
    { id: "sc-038-03", countyCode: "038", name: "Hamisi" },
    // Mombasa (001)
    { id: "sc-001-01", countyCode: "001", name: "Mvita" },
    { id: "sc-001-02", countyCode: "001", name: "Nyali" },
    { id: "sc-001-03", countyCode: "001", name: "Kisauni" },
    // Nairobi (047)
    { id: "sc-047-01", countyCode: "047", name: "Westlands" },
    { id: "sc-047-02", countyCode: "047", name: "Lang'ata" },
    { id: "sc-047-03", countyCode: "047", name: "Kasarani" },
  ];

  for (const sc of sampleSubCounties) {
    await db
      .insert(subCounties)
      .values(sc)
      .onDuplicateKeyUpdate({ set: { name: sc.name } });
  }

  // 3. Seed Wards
  const sampleWards = [
    { id: "w-037-01-01", subCountyId: "sc-037-01", name: "Sheywe" },
    { id: "w-037-01-02", subCountyId: "sc-037-01", name: "Mahiakalo" },
    { id: "w-037-01-03", subCountyId: "sc-037-01", name: "Shirere" },
    { id: "w-039-01-01", subCountyId: "sc-039-01", name: "Bukusu Central" },
    { id: "w-039-01-02", subCountyId: "sc-039-01", name: "Musikoma" },
    { id: "w-001-01-01", subCountyId: "sc-001-01", name: "Majengo" },
    { id: "w-001-02-01", subCountyId: "sc-001-02", name: "Kongowea" },
    { id: "w-047-01-01", subCountyId: "sc-047-01", name: "Parklands/Highridge" },
  ];

  for (const w of sampleWards) {
    await db
      .insert(wards)
      .values(w)
      .onDuplicateKeyUpdate({ set: { name: w.name } });
  }
  console.log("✓ Sub-Counties and Wards seeded.");

  // 4. Seed Foundational Chapters
  console.log("➡️ Seeding Foundational Chapters...");
  const sampleChapters = [
    {
      id: "ch-001-mombasa",
      slug: "mombasa-coastal",
      name: "Mombasa Coastal Chapter",
      countyCode: "001",
      description:
        "Serving Luhya community members across the Coast region with welfare and cultural programs.",
      meetingVenue: "Mombasa Cultural Center, Mvita",
      meetingSchedule: "First Saturday of every month at 2:00 PM",
      status: "active",
    },
    {
      id: "ch-037-kakamega",
      slug: "kakamega-central",
      name: "Kakamega Central Chapter",
      countyCode: "037",
      description:
        "Heartland chapter coordinating agricultural initiatives and elder council dialogues.",
      meetingVenue: "Bukhungu Social Hall, Kakamega",
      meetingSchedule: "Third Sunday of every month at 3:00 PM",
      status: "active",
    },
    {
      id: "ch-047-nairobi",
      slug: "nairobi-metropolis",
      name: "Nairobi Metropolis Chapter",
      countyCode: "047",
      description:
        "Urban chapter focusing on youth professional mentorship, investment clubs, and diaspora liaison.",
      meetingVenue: "Ufungamano House, Nairobi",
      meetingSchedule: "Second Sunday of every month at 2:30 PM",
      status: "active",
    },
    {
      id: "ch-039-bungoma",
      slug: "bungoma-west",
      name: "Bungoma West Chapter",
      countyCode: "039",
      description: "Cultural preservation and youth education sponsorship initiatives.",
      meetingVenue: "Kanduyi Community Centre, Bungoma",
      meetingSchedule: "Last Saturday of every month at 10:00 AM",
      status: "active",
    },
  ];

  for (const ch of sampleChapters) {
    await db
      .insert(chapters)
      .values(ch)
      .onDuplicateKeyUpdate({
        set: {
          name: ch.name,
          description: ch.description,
          meetingVenue: ch.meetingVenue,
          meetingSchedule: ch.meetingSchedule,
        },
      });
  }
  console.log("✓ Chapters seeded.");

  // 5. Seed Events
  console.log("➡️ Seeding Foundational Events...");
  const sampleEvents = [
    {
      id: "ev-001-cultural-festival",
      slug: "mulembe-national-cultural-festival-2026",
      title: "Mulembe National Cultural Festival & Heritage Expo",
      description:
        "The grand annual gathering uniting Luhya sub-tribes across Kenya and the diaspora. Featuring traditional Isukuti drum competitions, oral poetry, indigenous culinary showcases (Ingokho, Tsisaka, Obusuma), elder council storytelling, and youth leadership forums.",
      category: "cultural",
      startTime: new Date("2026-12-15T09:00:00Z"),
      endTime: new Date("2026-12-17T18:00:00Z"),
      venueName: "Bukhungu Stadium",
      venueAddress: "Kakamega Town, Kakamega County",
      onlineUrl: "https://mulembe.org/live/festival",
      capacity: 5000,
      chapterId: "ch-037-kakamega",
      status: "published" as const,
    },
    {
      id: "ev-002-nairobi-gala",
      slug: "nairobi-luhya-professionals-gala-2026",
      title: "Nairobi Luhya Professionals & Corporate Leaders Dinner",
      description:
        "An exclusive high-level networking banquet connecting top executives, founders, civil servants, and young professionals. Keynote addresses on cooperative economic syndicates, SACCO funding, and diaspora trade corridors.",
      category: "youth",
      startTime: new Date("2026-11-28T18:00:00Z"),
      endTime: new Date("2026-11-28T22:30:00Z"),
      venueName: "Safari Park Hotel Ballroom",
      venueAddress: "Thika Superhighway, Nairobi",
      onlineUrl: null,
      capacity: 350,
      chapterId: "ch-047-nairobi",
      status: "published" as const,
    },
    {
      id: "ev-003-coastal-welfare-agm",
      slug: "mombasa-chapter-annual-general-assembly",
      title: "Coast Region Chapters Annual General Assembly & Benevolent Drive",
      description:
        "Reviewing the coastal community emergency assistance fund, approving the 2027 regional welfare budget, and electing new chapter sub-committee representatives.",
      category: "agm",
      startTime: new Date("2026-12-05T14:00:00Z"),
      endTime: new Date("2026-12-05T17:30:00Z"),
      venueName: "Mombasa Cultural Center Auditorium",
      venueAddress: "Mvita, Mombasa County",
      onlineUrl: null,
      capacity: 200,
      chapterId: "ch-001-mombasa",
      status: "published" as const,
    },
    {
      id: "ev-004-western-agri-expo",
      slug: "western-agri-enterprise-summit",
      title: "Western Kenya Agri-Enterprise & Cooperatives Summit",
      description:
        "Empowering smallholder sugarcane, maize, and dairy farmers with modern aggregation models, value addition machinery grants, and cooperative banking options.",
      category: "welfare",
      startTime: new Date("2026-12-20T08:30:00Z"),
      endTime: new Date("2026-12-21T16:00:00Z"),
      venueName: "Kanduyi Stadium Grounds",
      venueAddress: "Bungoma Town, Bungoma County",
      onlineUrl: null,
      capacity: 1200,
      chapterId: "ch-039-bungoma",
      status: "published" as const,
    },
  ];

  for (const ev of sampleEvents) {
    await db
      .insert(events)
      .values(ev)
      .onDuplicateKeyUpdate({
        set: {
          title: ev.title,
          description: ev.description,
          venueName: ev.venueName,
          venueAddress: ev.venueAddress,
          capacity: ev.capacity,
          startTime: ev.startTime,
          endTime: ev.endTime,
        },
      });
  }
  console.log("✓ Events seeded.");

  // 6. Seed Announcements
  console.log("➡️ Seeding Announcements...");
  const sampleAnnouncements = [
    {
      id: "an-001-constitution",
      title: "Promulgation of the Mulembe National Community Charter 2026",
      content:
        "The National Council of Elders in consultation with all 47 county steering desks has officially ratified the updated Mulembe Community Constitution. The charter establishes decentralized county coordination, transparent welfare pooling, and strict Kenya Data Protection Act compliance across all chapter registries.",
      priority: "important" as const,
      chapterId: null,
      countyCode: null,
      expiresAt: new Date("2027-01-01T00:00:00Z"),
    },
    {
      id: "an-002-bursary",
      title: "2027 Higher Education & Vocational Bursary Applications Open",
      content:
        "Underprivileged students from Kakamega, Bungoma, Busia, Vihiga, and diaspora branches can now submit verified academic scholarship requests through their respective sub-county chapter secretaries. Application window closes December 31st.",
      priority: "routine" as const,
      chapterId: null,
      countyCode: null,
      expiresAt: new Date("2026-12-31T23:59:59Z"),
    },
    {
      id: "an-003-flood-relief",
      title: "Emergency Welfare Alert: Western Region Flood Response",
      content:
        "The Disaster Relief Secretariat has mobilized emergency food rations and medical aid kits to affected households along the River Nzoia basin in Budalang'i and lower Mumias. Chapter coordinators are receiving donations through the verified national trust fund.",
      priority: "urgent" as const,
      chapterId: null,
      countyCode: "037",
      expiresAt: new Date("2026-11-30T23:59:59Z"),
    },
  ];

  for (const an of sampleAnnouncements) {
    await db
      .insert(announcements)
      .values(an)
      .onDuplicateKeyUpdate({
        set: {
          title: an.title,
          content: an.content,
          priority: an.priority,
          expiresAt: an.expiresAt,
        },
      });
  }
  console.log("✓ Announcements seeded.");

  console.log("🎉 Database seeding complete!");
  await connection.end();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
