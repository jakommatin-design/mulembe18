import {
  eventRepository,
  CreateEventInput,
  CreateRsvpInput,
} from "../repositories/event.repository";
import { AuthUser, assertScopeAccess } from "@/lib/auth/roles";
import { auditRepository } from "../repositories/audit.repository";

export class EventService {
  async listEvents(filters?: { chapterId?: string; status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const { items, total } = await eventRepository.list({
      chapterId: filters?.chapterId,
      status: filters?.status,
      limit,
      offset,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getEventBySlug(identifier: string) {
    const event =
      (await eventRepository.getBySlug(identifier)) ||
      (await eventRepository.getById(identifier));
    if (!event) return null;
    const stats = await eventRepository.getRsvpCounts(event.id);
    return { ...event, stats };
  }

  async createEvent(actor: AuthUser, input: CreateEventInput) {
    assertScopeAccess(actor, "create_chapter_event", {
      chapterId: input.chapterId ?? undefined,
      countyCode: actor.countyCode,
    });

    const event = await eventRepository.create(input);

    await auditRepository.log({
      actorId: actor.id,
      action: "event.created",
      targetEntity: "event",
      targetId: event.id,
      payloadAfter: { title: event.title, chapterId: event.chapterId, slug: event.slug },
    });

    return event;
  }

  async rsvp(actor: AuthUser, input: Omit<CreateRsvpInput, "userId">) {
    assertScopeAccess(actor, "rsvp_events");

    const event =
      (await eventRepository.getById(input.eventId)) ||
      (await eventRepository.getBySlug(input.eventId));
    if (!event) throw new Error("Event not found");

    return await eventRepository.setRsvp({
      ...input,
      eventId: event.id,
      userId: actor.id,
    });
  }
}

export const eventService = new EventService();

