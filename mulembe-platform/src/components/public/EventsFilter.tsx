"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import EmptyState from "@/components/ui/EmptyState";

export interface EventListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  startTime: string | Date;
  endTime: string | Date;
  venueName: string;
  venueAddress: string | null;
  capacity: number | null;
  chapterId: string | null;
  status: string;
}

interface Props {
  initialEvents: EventListItem[];
}

const CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "cultural", label: "Cultural & Heritage" },
  { id: "youth", label: "Youth & Professional" },
  { id: "agm", label: "AGM & Assemblies" },
  { id: "welfare", label: "Welfare & Economic" },
  { id: "sports", label: "Sports & Recreation" },
];

export default function EventsFilter({ initialEvents }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      const matchesSearch =
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.venueName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || ev.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialEvents, searchTerm, selectedCategory]);

  function formatDate(d: string | Date) {
    const date = new Date(d);
    return date.toLocaleDateString("en-KE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(d: string | Date) {
    const date = new Date(d);
    return date.toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      {/* Category Pills & Search */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-5">
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
                aria-hidden="true"
              >
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control glass-input ps-5"
                placeholder="Search events by title or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search events"
              />
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="d-flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn btn-sm ${
                    selectedCategory === cat.id ? "btn-gold" : "btn-glass"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25 small text-secondary">
          <span>
            Displaying <strong className="text-light">{filteredEvents.length}</strong> upcoming events
          </span>
          {(searchTerm || selectedCategory !== "all") && (
            <button
              className="btn btn-sm btn-link text-warning p-0 text-decoration-none"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description={
            searchTerm || selectedCategory !== "all"
              ? "No events matched your search or category selection. Try selecting another category."
              : "No upcoming events are scheduled at the moment. Check back soon!"
          }
          actionLabel={searchTerm || selectedCategory !== "all" ? "Reset Filters" : undefined}
          onAction={
            searchTerm || selectedCategory !== "all"
              ? () => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }
              : undefined
          }
        />
      ) : (
        <div className="row g-4">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="col-12 col-md-6 col-lg-6">
              <GlassCard
                title={ev.title}
                badge={
                  <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase">
                    {ev.category}
                  </span>
                }
                interactive
                className="h-100 d-flex flex-column"
                footer={
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span className="small text-secondary d-flex align-items-center gap-1">
                      {ev.capacity ? (
                        <>
                          <Users size={14} /> Capacity: {ev.capacity}
                        </>
                      ) : (
                        "Open Attendance"
                      )}
                    </span>
                    <Link
                      href={`/events/${ev.slug}`}
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1"
                    >
                      Event Details & RSVP <ArrowRight size={14} />
                    </Link>
                  </div>
                }
              >
                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="small text-warning d-flex align-items-center gap-2">
                    <Calendar size={16} />
                    <strong>{formatDate(ev.startTime)}</strong>
                    <span className="text-secondary">|</span>
                    <Clock size={16} />
                    <span>{formatTime(ev.startTime)} EAT</span>
                  </div>

                  <div className="small text-secondary d-flex align-items-start gap-2">
                    <MapPin size={16} className="text-secondary flex-shrink-0 mt-1" />
                    <span>
                      {ev.venueName}
                      {ev.venueAddress ? ` — ${ev.venueAddress}` : ""}
                    </span>
                  </div>
                </div>

                <p className="text-secondary small mb-3 flex-grow-1">
                  {ev.description.length > 180
                    ? `${ev.description.slice(0, 180)}...`
                    : ev.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

