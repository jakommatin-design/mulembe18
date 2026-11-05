import { db } from "@/lib/db";
import { users, memberships, chapters, rsvps, events } from "@/lib/db/schema";
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

  async getUserMembership(userId: string) {
    const result = await db
      .select({
        id: memberships.id,
        userId: memberships.userId,
        chapterId: memberships.chapterId,
        role: memberships.role,
        status: memberships.status,
        joinedAt: memberships.joinedAt,
        chapterName: chapters.name,
        chapterSlug: chapters.slug,
        chapterCounty: chapters.countyCode,
        meetingVenue: chapters.meetingVenue,
      })
      .from(memberships)
      .innerJoin(chapters, eq(memberships.chapterId, chapters.id))
      .where(and(eq(memberships.userId, userId), isNull(chapters.deletedAt)));

    return result[0] || null;
  }

  async joinChapter(userId: string, chapterId: string) {
    const id = `mem_${crypto.randomUUID()}`;
    await db
      .insert(memberships)
      .values({
        id,
        userId,
        chapterId,
        role: "member",
        status: "active",
      })
      .onDuplicateKeyUpdate({
        set: {
          chapterId,
          status: "active",
        },
      });

    return await this.getUserMembership(userId);
  }

  async leaveChapter(userId: string) {
    await db
      .delete(memberships)
      .where(eq(memberships.userId, userId));
    return true;
  }

  async getUserRsvps(userId: string) {
    return await db
      .select({
        id: rsvps.id,
        eventId: rsvps.eventId,
        status: rsvps.status,
        guestsCount: rsvps.guestsCount,
        createdAt: rsvps.createdAt,
        eventTitle: events.title,
        eventSlug: events.slug,
        eventCategory: events.category,
        startTime: events.startTime,
        endTime: events.endTime,
        venueName: events.venueName,
      })
      .from(rsvps)
      .innerJoin(events, eq(rsvps.eventId, events.id))
      .where(and(eq(rsvps.userId, userId), isNull(events.deletedAt)))
      .orderBy(events.startTime);
  }

  async exportUserData(userId: string) {
    const user = await this.getById(userId);
    if (!user) return null;

    const membership = await this.getUserMembership(userId);
    const userRsvps = await this.getUserRsvps(userId);

    return {
      exportedAt: new Date().toISOString(),
      compliance: "Kenya Data Protection Act 2019 (ODPC)",
      personalProfile: {
        id: user.id,
        membershipId: user.membershipId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        nationalId: user.nationalId,
        gender: user.gender,
        clan: user.clan,
        ancestralCountyCode: user.ancestralCountyCode,
        currentCountyCode: user.currentCountyCode,
        role: user.role,
        status: user.status,
        kdpaConsentAt: user.kdpaConsentAt,
        registeredAt: user.createdAt,
      },
      chapterAffiliation: membership,
      eventRsvps: userRsvps,
    };
  }

  async deleteUserData(userId: string) {
    // Anonymize personal info and soft-delete user (KDPA Right to Erasure)
    await db
      .update(users)
      .set({
        fullName: "Anonymized Member",
        email: `deleted_${crypto.randomUUID()}@anonymized.invalid`,
        phone: "+000000000000",
        nationalId: null,
        clan: null,
        status: "deleted",
        deletedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Clear active memberships
    await db.delete(memberships).where(eq(memberships.userId, userId));

    // Clear RSVPs
    await db.delete(rsvps).where(eq(rsvps.userId, userId));

    return true;
  }
}

export const memberRepository = new MemberRepository();
