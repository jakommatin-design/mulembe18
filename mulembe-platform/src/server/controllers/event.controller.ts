import { eventService } from "../services/event.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  CreateEventSchema,
  RsvpSchema,
  EventQuerySchema,
} from "@/lib/schemas/event";
import { AuthUser, AuthorizationError } from "@/lib/auth/roles";
import { checkRateLimit } from "@/lib/api/rate-limit";

export class EventController {
  async listEvents(url: URL) {
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parse = EventQuerySchema.safeParse(queryParams);

    if (!parse.success) {
      return apiError(
        "INVALID_QUERY",
        "Invalid query parameters",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await eventService.listEvents(parse.data);
      return apiSuccess(result.items, result.meta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to list events";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async getEventBySlug(slug: string) {
    try {
      const event = await eventService.getEventBySlug(slug);
      if (!event) {
        return apiError("NOT_FOUND", `Event with slug '${slug}' not found`, 404);
      }
      return apiSuccess(event);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve event";
      return apiError("INTERNAL_ERROR", msg, 500);
    }
  }

  async createEvent(actor: AuthUser | null, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const rate = checkRateLimit(`rate_evt_${actor.id}`, 20);
    if (!rate.success) {
      return apiError("RATE_LIMITED", "Too many requests. Please wait.", 429);
    }

    const parse = CreateEventSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid event data",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await eventService.createEvent(actor, parse.data);
      return apiSuccess(result, undefined, 201);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to create event";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }

  async rsvp(actor: AuthUser | null, eventId: string, body: unknown) {
    if (!actor) return apiError("UNAUTHENTICATED", "Authentication required", 401);

    const parse = RsvpSchema.safeParse(body);
    if (!parse.success) {
      return apiError(
        "VALIDATION_FAILED",
        "Invalid RSVP details",
        400,
        parse.error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
      );
    }

    try {
      const result = await eventService.rsvp(actor, {
        eventId,
        status: parse.data.status,
        guestsCount: parse.data.guestsCount,
      });
      return apiSuccess(result);
    } catch (err: unknown) {
      if (err instanceof AuthorizationError) {
        return apiError("FORBIDDEN", err.message, err.status);
      }
      const msg = err instanceof Error ? err.message : "Failed to process RSVP";
      return apiError("BAD_REQUEST", msg, 400);
    }
  }
}

export const eventController = new EventController();

