"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Calendar, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import EmptyState from "@/components/ui/EmptyState";

interface ChapterItem {
  id: string;
  slug: string;
  name: string;
  countyCode: string;
  countyName?: string;
  description: string | null;
  meetingVenue: string | null;
  meetingSchedule: string | null;
  status: string;
}

interface CountyOption {
  code: string;
  name: string;
}

interface Props {
  initialChapters: ChapterItem[];
  counties: CountyOption[];
}

export default function ChaptersSearchFilter({ initialChapters, counties }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");

  const filteredChapters = useMemo(() => {
    return initialChapters.filter((ch) => {
      const matchesSearch =
        ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ch.description && ch.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ch.meetingVenue && ch.meetingVenue.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCounty = selectedCounty === "all" || ch.countyCode === selectedCounty;

      return matchesSearch && matchesCounty;
    });
  }, [initialChapters, searchTerm, selectedCounty]);

  return (
    <div>
      {/* Controls Bar */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-7">
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
                placeholder="Search chapters by name, town, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search chapters"
              />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <select
              className="form-select glass-input"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              aria-label="Filter by county"
            >
              <option value="all">All Counties ({counties.length})</option>
              {counties.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25 small text-secondary">
          <span>
            Showing <strong className="text-light">{filteredChapters.length}</strong> of{" "}
            {initialChapters.length} registered chapters
          </span>
          {(searchTerm || selectedCounty !== "all") && (
            <button
              className="btn btn-sm btn-link text-warning p-0 text-decoration-none"
              onClick={() => {
                setSearchTerm("");
                setSelectedCounty("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length === 0 ? (
        <EmptyState
          title="No Chapters Found"
          description={
            searchTerm || selectedCounty !== "all"
              ? "No chapters matched your search and filter criteria. Try resetting filters or searching another region."
              : "No chapters have been published yet."
          }
          actionLabel={searchTerm || selectedCounty !== "all" ? "Clear Filters" : undefined}
          onAction={
            searchTerm || selectedCounty !== "all"
              ? () => {
                  setSearchTerm("");
                  setSelectedCounty("all");
                }
              : undefined
          }
        />
      ) : (
        <div className="row g-4">
          {filteredChapters.map((ch) => (
            <div key={ch.id} className="col-12 col-md-6 col-lg-4">
              <GlassCard
                title={ch.name}
                badge={
                  <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                    County {ch.countyCode}
                  </span>
                }
                interactive
                className="h-100 d-flex flex-column"
                footer={
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span className="small text-secondary d-flex align-items-center gap-1">
                      <Users size={14} /> Open Chapter
                    </span>
                    <Link
                      href={`/chapters/${ch.slug}`}
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1"
                    >
                      View Chapter <ArrowRight size={14} />
                    </Link>
                  </div>
                }
              >
                <p className="text-secondary small mb-3 flex-grow-1">
                  {ch.description || "Active community chapter advancing cultural unity and local welfare."}
                </p>

                <div className="small text-secondary mb-2 d-flex align-items-start gap-2">
                  <MapPin size={16} className="text-warning flex-shrink-0 mt-1" />
                  <span>{ch.meetingVenue || "Designated Community Hall"}</span>
                </div>

                {ch.meetingSchedule && (
                  <div className="small text-secondary d-flex align-items-start gap-2">
                    <Calendar size={16} className="text-warning flex-shrink-0 mt-1" />
                    <span>{ch.meetingSchedule}</span>
                  </div>
                )}
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

