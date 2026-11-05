import { Metadata } from "next";
import { eventRepository } from "@/server/repositories/event.repository";
import EventsFilter, { EventListItem } from "@/components/public/EventsFilter";

export const metadata: Metadata = {
  title: "Events & Gatherings | Mulembe National Platform",
  description:
    "Explore upcoming Luhya cultural festivals, chapter annual general assemblies, youth mentorship forums, and community welfare meetings.",
  openGraph: {
    title: "Events & Gatherings | Mulembe National Platform",
    description:
      "Join upcoming cultural festivals, business galas, and community assemblies nationwide.",
  },
};

export default async function EventsPage() {
  const { items: rawEvents } = await eventRepository.list({
    status: "published",
    limit: 100,
  });

  const formattedEvents: EventListItem[] = rawEvents.map((ev) => ({
    id: ev.id,
    slug: ev.slug,
    title: ev.title,
    description: ev.description,
    category: ev.category,
    startTime: ev.startTime.toISOString(),
    endTime: ev.endTime.toISOString(),
    venueName: ev.venueName,
    venueAddress: ev.venueAddress,
    capacity: ev.capacity,
    chapterId: ev.chapterId,
    status: ev.status,
  }));

  return (
    <main className="container py-5">
      {/* Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 text-uppercase mb-3">
            National Calendar
          </span>
          <h1
            className="display-4 fw-bold text-light mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Community Gatherings & Events
          </h1>
          <p className="lead text-secondary">
            From the grand annual Mulembe Cultural Festival to regional welfare AGMs and youth
            business galas. Reserve your seat and celebrate our shared heritage.
          </p>
        </div>
      </div>

      {/* Interactive Events Filter & Search */}
      <EventsFilter initialEvents={formattedEvents} />
    </main>
  );
}

