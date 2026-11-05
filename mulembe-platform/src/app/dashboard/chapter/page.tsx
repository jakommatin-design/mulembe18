import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Users, Calendar, Bell, Clock } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { statsService } from "@/server/services/stats.service";
import { memberRepository } from "@/server/repositories/member.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import MemberRosterTable from "@/components/dashboard/MemberRosterTable";
import EventManagerModal from "@/components/dashboard/EventManagerModal";
import AnnouncementPublisherModal from "@/components/dashboard/AnnouncementPublisherModal";

export const metadata: Metadata = {
  title: "Chapter Executive Dashboard | Mulembe National Platform",
  description: "Manage chapter members, assemblies, and local bulletins.",
};

export default async function ChapterDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in?redirectUrl=/dashboard/chapter");
  }

  // Permission check: must be at least chapter leader or higher
  const allowedRoles = [
    "chapter_secretary",
    "chapter_chair",
    "county_coordinator",
    "national_admin",
    "super_admin",
  ];
  if (!allowedRoles.includes(user.role)) {
    redirect("/profile");
  }

  const [stats, membersResult, chapter] = await Promise.all([
    statsService.getPlatformStats({ chapterId: user.chapterId }),
    memberRepository.listScoped({
      chapterId: user.chapterId,
      countyCode: user.countyCode,
      limit: 100,
    }),
    user.chapterId ? chapterRepository.getById(user.chapterId) : Promise.resolve(null),
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
    <DashboardLayout role={user.role} countyCode={user.countyCode} chapterId={user.chapterId}>
      {/* Top Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small mb-1">
            Chapter Executive Desk
          </span>
          <h2 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            {chapter ? chapter.name : "Local Chapter Leadership"}
          </h2>
          <span className="small text-secondary">
            {chapter?.meetingVenue ? `Assembly Venue: ${chapter.meetingVenue}` : "Decentralized Administration"}
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <EventManagerModal chapterId={user.chapterId} />
          <AnnouncementPublisherModal chapterId={user.chapterId} countyCode={user.countyCode} />
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="row g-3 mb-5">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Roster"
            value={stats.totalMembers}
            icon={<Users size={20} />}
            subtitle="Registered chapter members"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Pending Verification"
            value={stats.pendingMembers}
            icon={<Clock size={20} />}
            subtitle="Awaiting secretary review"
            badge={
              stats.pendingMembers > 0
                ? { text: "Action Needed", variant: "warning" }
                : undefined
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Upcoming Events"
            value={stats.publishedEvents}
            icon={<Calendar size={20} />}
            subtitle="Scheduled assemblies"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Bulletins"
            value={stats.activeAnnouncements}
            icon={<Bell size={20} />}
            subtitle="Dispatches in circulation"
          />
        </div>
      </div>

      {/* Member Roster Section */}
      <div className="mb-5" id="roster">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
              Chapter Membership Roster
            </h4>
            <span className="small text-secondary">
              Review and verify pending membership applications under chapter jurisdiction.
            </span>
          </div>
        </div>

        <MemberRosterTable initialMembers={formattedMembers} canApprove />
      </div>
    </DashboardLayout>
  );
}

