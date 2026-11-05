import { db } from "@/lib/db";
import { events, rsvps } from "@/lib/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import crypto from "crypto";

export interface CreateEventInput {
  title: string;
  slug: string;
  description: string;
  category?: string;
  startTime: Date;
  endTime: Date;
  venueName: string;
  venueAddress?: string | null;
  onlineUrl?: string | null;
  capacity?: number;
  chapterId?: string | null;
  status?: "draft" | "published" | "cancelled" | "completed";
}

export interface CreateRsvpInput {
  eventId: string;
  userId: string;
  status: "attending" | "tentative" | "declined";
  guestsCount?: number;
}

export class EventRepository {
  async list(filters?: { chapterId?: string; status?: string; limit?: number; offset?: number }) {
    const conditions = [isNull(events.deletedAt)];

    if (filters?.chapterId) {
      conditions.push(eq(events.chapterId, filters.chapterId));
    }
    if (filters?.status) {
      conditions.push(eq(events.status, filters.status));
    }

    const query = db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(events.startTime);

    if (filters?.limit) query.limit(filters.limit);
    if (filters?.offset) query.offset(filters.offset);

    const items = await query;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(and(...conditions));

    return {
      items,
      total: Number(countResult?.count || 0),
    };
  }

  async getById(id: string) {
    const result = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id), isNull(events.deletedAt)));
    return result[0] || null;
  }

  async getBySlug(slug: string) {
    const result = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), isNull(events.deletedAt)));
    return result[0] || null;
  }

  async findBySlug(slug: string) {
    return this.getBySlug(slug);
  }

  async create(data: CreateEventInput) {
    const id = `evt_${crypto.randomUUID()}`;
    await db.insert(events).values({
      id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category || "cultural",
      startTime: data.startTime,
      endTime: data.endTime,
      venueName: data.venueName,
      venueAddress: data.venueAddress ?? null,
      onlineUrl: data.onlineUrl ?? null,
      capacity: data.capacity || 0,
      chapterId: data.chapterId ?? null,
      status: data.status || "published",
    });
    return (await this.getById(id))!;
  }

  async setRsvp(data: CreateRsvpInput) {
    const id = `rsvp_${crypto.randomUUID()}`;
    await db
      .insert(rsvps)
      .values({
        id,
        eventId: data.eventId,
        userId: data.userId,
        status: data.status,
        guestsCount: data.guestsCount || 0,
      })
      .onDuplicateKeyUpdate({
        set: {
          status: data.status,
          guestsCount: data.guestsCount || 0,
        },
      });

    return {
      eventId: data.eventId,
      userId: data.userId,
      status: data.status,
      guestsCount: data.guestsCount || 0,
    };
  }

  async getRsvpCounts(eventId: string) {
    const [attending] = await db
      .select({ count: sql<number>`count(*)` })
      .from(rsvps)
      .where(and(eq(rsvps.eventId, eventId), eq(rsvps.status, "attending")));

    return {
      attending: Number(attending?.count || 0),
    };
  }

  async getRsvpStats(eventId: string) {
    return this.getRsvpCounts(eventId);
  }
}

export const eventRepository = new EventRepository();

