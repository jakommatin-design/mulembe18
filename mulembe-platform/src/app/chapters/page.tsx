import { Metadata } from "next";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import ChaptersSearchFilter from "@/components/public/ChaptersSearchFilter";

export const metadata: Metadata = {
  title: "Chapters Directory | Mulembe National Platform",
  description:
    "Find and connect with local Luhya community chapters across all 47 counties of Kenya and international diaspora branches.",
  openGraph: {
    title: "Chapters Directory | Mulembe National Platform",
    description:
      "Explore verified chapters, meeting venues, and local leadership contacts nationwide.",
  },
};

export default async function ChaptersPage() {
  const [chapters, counties] = await Promise.all([
    chapterRepository.getAllActive(),
    geographyRepository.getAllCounties(),
  ]);

  const countyMap = new Map(counties.map((c) => [c.code, c.name]));

  const chaptersWithCountyName = chapters.map((ch) => ({
    id: ch.id,
    slug: ch.slug,
    name: ch.name,
    countyCode: ch.countyCode,
    countyName: countyMap.get(ch.countyCode) || `County ${ch.countyCode}`,
    description: ch.description,
    meetingVenue: ch.meetingVenue,
    meetingSchedule: ch.meetingSchedule,
    status: ch.status,
  }));

  const countyOptions = counties.map((c) => ({
    code: c.code,
    name: c.name,
  }));

  return (
    <main className="container py-5">
      {/* Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 text-uppercase mb-3">
            National Network
          </span>
          <h1
            className="display-4 fw-bold text-light mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Grassroots Chapters Directory
          </h1>
          <p className="lead text-secondary">
            Locate your local fellowship, attend monthly assemblies, and take part in community
            initiatives wherever you live in Kenya or abroad.
          </p>
        </div>
      </div>

      {/* Interactive Search & Filter Client Component */}
      <ChaptersSearchFilter
        initialChapters={chaptersWithCountyName}
        counties={countyOptions}
      />
    </main>
  );
}

