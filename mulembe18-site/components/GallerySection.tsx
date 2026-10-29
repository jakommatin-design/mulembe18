"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Maximize2,
  X,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  Music,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Calendar,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/image-utils";

export interface GalleryPhoto {
  id?: number | string;
  src: string;
  label: string;
  category: string;
  sub: string;
  large: boolean;
  album_url?: string;
}

const fallbackPhotos: GalleryPhoto[] = [
  {
    id: 1,
    src: "/images/isukuti.jpg",
    label: "Annual Isukuti Traditional Cultural Dance & Drumming",
    category: "Cultural Festival",
    sub: "Mombasa Sports Club Grounds",
    large: true,
  },
  {
    id: 2,
    src: "/images/luhya-bullfighting.jpg",
    label: "Ancestral Heritage Bullfighting Exhibition",
    category: "Heritage",
    sub: "Kakamega / Shinyalu Arena",
    large: false,
  },
  {
    id: 3,
    src: "/images/events-cultural.png",
    label: "Council of Elders Inter-Clan Cultural Dialogue",
    category: "Governance",
    sub: "Likoni Community Centre",
    large: false,
  },
  {
    id: 4,
    src: "/images/coastal-portal.png",
    label: "Youth Tech & Innovation Fellowship Graduation",
    category: "Youth & Career",
    sub: "Technical University of Mombasa",
    large: false,
  },
  {
    id: 5,
    src: "/images/isukuti-dancers.jpg",
    label: "Mulembe Solidarity Welfare Fund Annual Convention",
    category: "Solidarity",
    sub: "Bamburi Community Hall",
    large: false,
  },
];

export default function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackPhotos);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = [
    { label: "All", icon: Camera },
    { label: "Cultural Festival", icon: Music },
    { label: "Governance", icon: ShieldCheck },
    { label: "Heritage", icon: Camera },
    { label: "Youth & Career", icon: GraduationCap },
    { label: "Solidarity", icon: HeartHandshake },
  ];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
        const mapped: GalleryPhoto[] = data.photos.map((p: any) => ({
          id: p.id,
          src: normalizeImageUrl(p.image_url, "/images/events-cultural.png"),
          label: p.label,
          category: p.category,
          sub: p.sub_location || "Mombasa County",
          large: Boolean(p.is_large),
          album_url: p.album_url || "",
        }));
        setPhotos(mapped);
      }
    } catch {
      // Keep fallbacks on network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredPhotos =
    activeFilter === "All"
      ? photos
      : photos.filter((p) => p.category === activeFilter);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE7DF] text-[#121714]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header (Agnos Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E4DFD5] text-[#6B7280] text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs mb-4">
              <span>&gt;</span>
              <span className="font-bold text-[#374151]">CULTURAL HERITAGE ARCHIVE</span>
              <span>&lt;</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.12]"
              style={{ fontFamily: "var(--font-outfit), var(--font-heading), sans-serif" }}
            >
              Preserving 18 ancestral traditions for{" "}
              <span className="text-[#FF5500]">future generations</span>
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              Visual chronicles of Isukuti cultural drum performance, council barazas,
              food festivals, and milestone celebrations across the Coast and home counties.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6B7280] bg-white px-4 py-2 rounded-xl border border-[#E8E4DA] shrink-0">
            <Camera size={14} className="text-[#FF5500]" />
            <span>COMMUNITY MEDIA ARCHIVE</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = activeFilter === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setActiveFilter(c.label)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#111827] border-[#111827] text-white shadow-xs"
                    : "bg-white border-[#E8E4DA] text-[#4B5563] hover:border-[#111827]"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-[#FF5500]"} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mosaic Bento Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[240px]">
          {filteredPhotos.map((p) => (
            <div
              key={p.id || p.label}
              onClick={() => setSelectedPhoto(p)}
              className={`relative rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group cursor-pointer border border-[#E8E4DA] bg-gray-900 ${
                p.large ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/events-cultural.png";
                }}
              />

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono font-bold text-[#111827] border border-white/20 shadow-xs uppercase">
                  {p.category}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 inset-x-4 z-10 space-y-1">
                <h4 className="text-white font-bold text-sm leading-snug line-clamp-2">
                  {p.label}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                  <MapPin size={10} className="text-[#FF5500]" />
                  <span className="truncate">{p.sub}</span>
                </div>
              </div>

              {/* Corner Expand Icon */}
              <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={13} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8E4DA] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={18} />
            </button>

            <div className="h-[380px] sm:h-[460px] bg-black">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.label}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-white space-y-2">
              <span className="px-3 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E4DA] text-[10px] font-mono font-bold uppercase text-[#374151]">
                {selectedPhoto.category}
              </span>
              <h3 className="text-lg font-bold text-[#111827]">
                {selectedPhoto.label}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <MapPin size={12} className="text-[#FF5500]" />
                <span>{selectedPhoto.sub}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
