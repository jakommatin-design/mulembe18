import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { authService } from "@/server/services/auth.service";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auditRepository } from "@/server/repositories/audit.repository";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    // If webhook secret isn't configured in development, log warning and return 200
    console.warn("⚠️ CLERK_WEBHOOK_SECRET is not configured in .env.local");
    return new Response("Webhook secret unconfigured", { status: 200 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying Clerk webhook signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses[0]?.email_address || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "Mulembe Member";
    const phone = phone_numbers?.[0]?.phone_number || "+254700000000";

    await authService.syncClerkUser({
      id,
      email,
      fullName,
      phone,
    });
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses[0]?.email_address || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "Mulembe Member";
    const phone = phone_numbers?.[0]?.phone_number;

    await db
      .update(users)
      .set({
        email,
        fullName,
        ...(phone ? { phone } : {}),
      })
      .where(eq(users.id, id));

    await auditRepository.log({
      actorId: id,
      action: "user.updated_via_webhook",
      targetEntity: "user",
      targetId: id,
      payloadAfter: { email, fullName },
    });
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db
        .update(users)
        .set({
          status: "deleted",
          deletedAt: new Date(),
        })
        .where(eq(users.id, id));

      await auditRepository.log({
        actorId: id,
        action: "user.deleted_via_webhook",
        targetEntity: "user",
        targetId: id,
      });
    }
  }

  return new Response("Webhook handled", { status: 200 });
}
