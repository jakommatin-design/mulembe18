import { NextResponse } from "next/server";
import { notificationQueueService } from "@/server/services/notification-queue.service";

/**
 * Serverless Notification Queue Worker
 *
 * Designed to run on a scheduled interval (e.g. every 5 minutes via Vercel Cron)
 * or triggered on-demand via authorized webhook.
 */
async function handleWorker(req: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization");
    const secretHeader = req.headers.get("x-cron-secret");

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || secretHeader === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid cron secret",
        },
        { status: 401 }
      );
    }
  }

  const startTime = Date.now();
  const batchResult = await notificationQueueService.processBatch(50);
  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    telemetry: {
      ...batchResult,
      durationMs,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function GET(req: Request) {
  return handleWorker(req);
}

export async function POST(req: Request) {
  return handleWorker(req);
}

