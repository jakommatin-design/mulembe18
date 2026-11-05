import { db } from "@/lib/db";
import { users, memberships } from "@/lib/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import crypto from "crypto";

export interface RegisterMemberInput {
  userId: string;
  fullName: string;
  phone: string;
  nationalId?: string | null;
  gender?: string | null;
  clan?: string | null;
  ancestralCountyCode: string;
  currentCountyCode: string;
  chapterId?: string | null;
  kdpaConsent: boolean;
}

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  gender?: string | null;
  clan?: string | null;
  currentCountyCode?: string | null;
}

export class MemberRepository {
  async getById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async getByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async getByPhone(phone: string) {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async registerMember(input: RegisterMemberInput) {
    // Generate Membership ID: MLB-<ancestralCountyCode>-<random 5 digits>
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const membershipId = `MLB-${input.ancestralCountyCode}-${randomSeq}`;

    await db
      .update(users)
      .set({
        membershipId,
        fullName: input.fullName,
        phone: input.phone,
        nationalId: input.nationalId ?? null,
        gender: input.gender ?? null,
        clan: input.clan ?? null,
        ancestralCountyCode: input.ancestralCountyCode,
        currentCountyCode: input.currentCountyCode,
        status: "active",
        kdpaConsentAt: input.kdpaConsent ? new Date() : null,
      })
      .where(eq(users.id, input.userId));

    // If chapter chosen, create membership
    if (input.chapterId) {
      const membershipRecordId = `mem_${crypto.randomUUID()}`;
      await db
        .insert(memberships)
        .values({
          id: membershipRecordId,
          userId: input.userId,
          chapterId: input.chapterId,
          role: "member",
          status: "pending",
        })
        .onDuplicateKeyUpdate({
          set: { chapterId: input.chapterId, status: "pending" },
        });
    }

    return await this.getById(input.userId);
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    await db
      .update(users)
      .set({
        ...(input.fullName ? { fullName: input.fullName } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.gender !== undefined ? { gender: input.gender } : {}),
        ...(input.clan !== undefined ? { clan: input.clan } : {}),
        ...(input.currentCountyCode !== undefined ? { currentCountyCode: input.currentCountyCode } : {}),
      })
      .where(eq(users.id, userId));
    return await this.getById(userId);
  }

  async verifyMember(userId: string, status: "active" | "suspended") {
    await db
      .update(users)
      .set({ status })
      .where(eq(users.id, userId));
    return await this.getById(userId);
  }

  async listScoped(filters: {
    countyCode?: string | null;
    chapterId?: string | null;
    status?: string;
    clan?: string;
    limit?: number;
    offset?: number;
  }) {
    const conditions = [isNull(users.deletedAt)];

    if (filters.countyCode) {
      conditions.push(eq(users.currentCountyCode, filters.countyCode));
    }
    if (filters.status) {
      conditions.push(eq(users.status, filters.status));
    }
    if (filters.clan) {
      conditions.push(eq(users.clan, filters.clan));
    }

    const query = db
      .select({
        id: users.id,
        membershipId: users.membershipId,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        role: users.role,
        clan: users.clan,
        currentCountyCode: users.currentCountyCode,
        ancestralCountyCode: users.ancestralCountyCode,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .orderBy(users.fullName);

    if (filters.limit) query.limit(filters.limit);
    if (filters.offset) query.offset(filters.offset);

    const items = await query;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));

    return {
      items,
      total: Number(countResult?.count || 0),
    };
  }
}

export const memberRepository = new MemberRepository();
