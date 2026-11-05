import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Building, Bell, MapPin, ChevronRight, Clock } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { statsService } from "@/server/services/stats.service";
import { memberRepository } from "@/server/repositories/member.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import MemberRosterTable from "@/components/dashboard/MemberRosterTable";
import EventManagerModal from "@/components/dashboard/EventManagerModal";
import AnnouncementPublisherModal from "@/components/dashboard/AnnouncementPublisherModal";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "County Coordinator Dashboard | Mulembe National Platform",
  description: "Supervise county-wide chapters, member rosters, and welfare coordination.",
};

export default async function CountyDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in?redirectUrl=/dashboard/county");
  }

  const allowedRoles = ["county_coordinator", "national_admin", "super_admin"];
  if (!allowedRoles.includes(user.role)) {
    redirect("/profile");
  }

  const countyCode = user.countyCode || "037";

  const [stats, membersResult, countyChapters, county] = await Promise.all([
    statsService.getPlatformStats({ countyCode }),
    memberRepository.listScoped({ countyCode, limit: 100 }),
    chapterRepository.list({ countyCode, limit: 50 }),
    geographyRepository.getCountyByCode(countyCode),
  ]);

  const formattedMembers = membersResult.items.map((m) => ({
    id: m.id,
    membershipId: m.membershipId,
    fullName: m.fullName,
    email: m.email,
    phone: m.phone,
    role: m.role,
    clan: m.clan,
    currentCountyCode: m.currentCountyCode,
    ancestralCountyCode: m.ancestralCountyCode,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <DashboardLayout role={user.role} countyCode={countyCode}>
      {/* Top Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small mb-1">
            County Steering Desk
          </span>
          <h2 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            {county ? `${county.name} County Desk (${countyCode})` : `County Desk (${countyCode})`}
          </h2>
          <span className="small text-secondary">
            Regional coordination of sub-county chapters and mutual aid funds.
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <EventManagerModal />
          <AnnouncementPublisherModal countyCode={countyCode} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="County Roster"
            value={stats.totalMembers}
            icon={<Users size={20} />}
            subtitle={`Members in ${county?.name || "County"}`}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Chapters"
            value={countyChapters.items.length}
            icon={<Building size={20} />}
            subtitle="Local chartered fellowships"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Pending Approvals"
            value={stats.pendingMembers}
            icon={<Clock size={20} />}
            subtitle="Applications in county"
            badge={
              stats.pendingMembers > 0
                ? { text: "Review", variant: "warning" }
                : undefined
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="County Dispatches"
            value={stats.activeAnnouncements}
            icon={<Bell size={20} />}
            subtitle="Broadcast notices"
          />
        </div>
      </div>

      {/* Chapters in County Grid */}
      <div className="mb-5" id="chapters">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
            Constituent Chapters ({countyChapters.items.length})
          </h4>
        </div>

        <div className="row g-4">
          {countyChapters.items.map((ch) => (
            <div key={ch.id} className="col-12 col-md-4">
              <GlassCard
                title={ch.name}
                badge={
                  <span className="badge rounded-pill bg-success bg-opacity-25 text-success small">
                    {ch.status}
                  </span>
                }
                footer={
                  <Link
                    href={`/chapters/${ch.slug}`}
                    className="btn btn-sm btn-gold w-100 justify-content-center d-inline-flex align-items-center gap-1"
                  >
                    View Chapter Dossier <ChevronRight size={14} />
                  </Link>
                }
              >
                <p className="small text-secondary mb-2">
                  {ch.description || "Active community chapter."}
                </p>
                <div className="small text-secondary d-flex align-items-center gap-1">
                  <MapPin size={14} className="text-warning" />
                  <span>{ch.meetingVenue || "Community Hall"}</span>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* County Roster */}
      <div className="mb-5" id="roster">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
              County Member Roster & Applications
            </h4>
            <span className="small text-secondary">
              Search and verify member identities across all sub-counties in {county?.name || "County"}.
            </span>
          </div>
        </div>

        <MemberRosterTable initialMembers={formattedMembers} canApprove />
      </div>
    </DashboardLayout>
  );
}

