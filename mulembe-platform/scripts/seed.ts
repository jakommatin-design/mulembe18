import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { counties, subCounties, wards, chapters } from "../src/lib/db/schema";
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

  console.log("🎉 Database seeding complete!");
  await connection.end();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
