import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import crypto from "crypto";

export interface CreateAuditLogInput {
  actorId: string;
  action: string;
  targetEntity: string;
  targetId: string;
  payloadBefore?: Record<string, unknown> | null;
  payloadAfter?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class AuditRepository {
  async log(entry: CreateAuditLogInput) {
    const id = `aud_${crypto.randomUUID()}`;
    await db.insert(auditLogs).values({
      id,
      actorId: entry.actorId,
      action: entry.action,
      targetEntity: entry.targetEntity,
      targetId: entry.targetId,
      payloadBefore: entry.payloadBefore ?? null,
      payloadAfter: entry.payloadAfter ?? null,
      ipAddress: entry.ipAddress ?? null,
      userAgent: entry.userAgent ?? null,
    });
    return id;
  }

  async getRecentLogs(limit = 100) {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  async getLogsByActor(actorId: string, limit = 50) {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.actorId, actorId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  async getLogsByTarget(targetEntity: string, targetId: string) {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.targetId, targetId))
      .orderBy(desc(auditLogs.createdAt));
  }
}

export const auditRepository = new AuditRepository();

