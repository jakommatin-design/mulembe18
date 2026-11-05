import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { LegacyExport } from "./types";

// Explicitly load .env.local before importing DB modules
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function runCli() {
  const { migrateLegacyData } = await import("./migrator");
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  const fileArgIdx = args.indexOf("--file");
  const filePath =
    fileArgIdx !== -1 && args[fileArgIdx + 1]
      ? args[fileArgIdx + 1]
      : path.join(__dirname, "sample-legacy-export.json");

  const outArgIdx = args.indexOf("--out");
  const outPath =
    outArgIdx !== -1 && args[outArgIdx + 1]
      ? args[outArgIdx + 1]
      : path.join(process.cwd(), "migration-report.json");

  console.log("=================================================");
  console.log(" 🚀 Mulembe National Platform: Legacy Data Migration");
  console.log("=================================================");
  console.log(` Mode:        ${dryRun ? "🔍 DRY RUN (Simulation)" : "⚡ LIVE IMPORT"}`);
  console.log(` Input File:  ${filePath}`);
  console.log(` Report File: ${outPath}`);
  console.log("-------------------------------------------------");

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Input export file not found at: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const exportData: LegacyExport = JSON.parse(fileContent);

  console.log(`Read ${exportData.members?.length || 0} members and ${exportData.events?.length || 0} events.`);
  console.log("Executing migration pipeline...");

  const report = await migrateLegacyData(exportData, { dryRun });

  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");

  console.log("\n--- Migration Summary ---");
  console.log(`Total Legacy Records:   ${report.totalLegacyMembersRead}`);
  console.log(`Valid Members Cleaned:  ${report.validMembersCleaned}`);
  console.log(`Duplicates Detected:    ${report.duplicateCount}`);
  console.log(`Skipped / Conflicts:    ${report.skippedCount}`);
  if (!dryRun) {
    console.log(`Inserted Users:         ${report.insertedUsers}`);
    console.log(`Updated Users:          ${report.updatedUsers}`);
    console.log(`Memberships Linked:     ${report.membershipsCreated}`);
  }
  console.log("-------------------------------------------------");

  if (report.conflicts.length > 0) {
    console.log("\n⚠️ Identified Conflicts / Discrepancies:");
    report.conflicts.slice(0, 10).forEach((c, idx) => {
      console.log(`  ${idx + 1}. [${c.type}] ID ${c.legacyId} (${c.identifier}): ${c.reason}`);
    });
    if (report.conflicts.length > 10) {
      console.log(`  ... and ${report.conflicts.length - 10} more in report file.`);
    }
  }

  console.log(`\n✅ Migration report written to ${outPath}\n`);
  process.exit(0);
}

runCli().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

