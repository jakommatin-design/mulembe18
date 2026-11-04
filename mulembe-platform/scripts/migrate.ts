import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  console.log("🔗 Connecting to TiDB Cloud...");
  const connection = await mysql.createConnection({
    uri: connectionString,
    ssl: { rejectUnauthorized: true },
    multipleStatements: true,
  });

  const db = drizzle(connection);

  console.log("🚀 Running migrations...");
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "../src/lib/db/migrations"),
  });

  console.log("✅ Migrations complete!");
  await connection.end();
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

