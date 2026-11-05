import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: unknown) {
    dbStatus = "disconnected";
    console.error("Health check DB probe failure:", err);
  }

  const isHealthy = dbStatus === "connected";
  const totalDurationMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      latencyMs: totalDurationMs,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

