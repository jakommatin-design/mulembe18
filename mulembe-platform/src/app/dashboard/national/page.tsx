import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Building,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { statsService } from "@/server/services/stats.service";
import { memberRepository } from "@/server/repositories/member.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { auditRepository } from "@/server/repositories/audit.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import MemberRosterTable from "@/components/dashboard/MemberRosterTable";
import EventManagerModal from "@/components/dashboard/EventManagerModal";
import AnnouncementPublisherModal from "@/components/dashboard/AnnouncementPublisherModal";
import ChapterManagerModal from "@/components/dashboard/ChapterManagerModal";
import AuditLogViewer from "@/components/dashboard/AuditLogViewer";

export const metadata: Metadata = {
  title: "National Governance Dashboard | Mulembe National Platform",
  description: "National oversight, 47-county registry, chapter charters, and audit log.",
};

export default async function NationalDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in?redirectUrl=/dashboard/national");
  }

  const isNational = user.role === "national_admin" || user.role === "super_admin";
  if (!isNational) {
    redirect("/profile");
  }

  const [stats, membersResult, chapters, auditLogs, counties] = await Promise.all([
    statsService.getPlatformStats(),
    memberRepository.listScoped({ limit: 150 }),
    chapterRepository.getAllActive(),
    auditRepository.getRecentLogs(100),
    geographyRepository.getAllCounties(),
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

  const formattedLogs = auditLogs.map((l) => ({
    id: l.id,
    actorId: l.actorId,
    action: l.action,
    targetEntity: l.targetEntity,
    targetId: l.targetId,
    payloadBefore: l.payloadBefore,
    payloadAfter: l.payloadAfter,
    ipAddress: l.ipAddress,
    userAgent: l.userAgent,
    createdAt: l.createdAt.toISOString(),
  }));

  const countyOptions = counties.map((c) => ({
    code: c.code,
    name: c.name,
  }));

  return (
    <DashboardLayout role={user.role}>
      {/* Top Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small mb-1">
            National Executive Secretariat
          </span>
          <h2 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Republic of Kenya & Global Diaspora Registry
          </h2>
          <span className="small text-secondary">
            Sovereign governance, chapter charters, national welfare fund, and audit compliance.
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <ChapterManagerModal counties={countyOptions} />
          <EventManagerModal />
          <AnnouncementPublisherModal />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="National Roll"
            value={stats.totalMembers}
            icon={<Users size={20} />}
            subtitle="Registered members across 47 counties"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Chapters"
            value={stats.activeChapters}
            icon={<Building size={20} />}
            subtitle="Chartered local fellowships"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Pending Approvals"
            value={stats.pendingMembers}
            icon={<Clock size={20} />}
            subtitle="Awaiting coordinator review"
            badge={
              stats.pendingMembers > 0
                ? { text: "Action Needed", variant: "warning" }
                : undefined
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Events"
            value={stats.publishedEvents}
            icon={<Calendar size={20} />}
            subtitle="Assemblies & festivals"
          />
        </div>
      </div>

      {/* Breakdown Row */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold text-light mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Top Member Concentrations by County
            </h5>
            <div className="d-flex flex-column gap-2">
              {stats.membersByCounty.length === 0 ? (
                <span className="small text-secondary">No county distribution data yet.</span>
              ) : (
                stats.membersByCounty.map((c) => (
                  <div
                    key={c.countyCode}
                    className="p-3 rounded glass-card d-flex justify-content-between align-items-center"
                  >
                    <span className="text-light small fw-semibold">
                      County {c.countyCode}
                    </span>
                    <span className="badge rounded-pill bg-warning text-dark font-monospace">
                      {c.count} members
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold text-light mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Top Active Chapters
            </h5>
            <div className="d-flex flex-column gap-2">
              {stats.membersByChapter.length === 0 ? (
                <span className="small text-secondary">No chapter membership records yet.</span>
              ) : (
                stats.membersByChapter.map((ch) => (
                  <div
                    key={ch.chapterName}
                    className="p-3 rounded glass-card d-flex justify-content-between align-items-center"
                  >
                    <span className="text-light small fw-semibold">{ch.chapterName}</span>
                    <span className="badge rounded-pill bg-success text-white font-monospace">
                      {ch.count} affiliated
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Hierarchy Section */}
      <div className="mb-5" id="chapters">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
              Chartered Chapters Registry ({chapters.length})
            </h4>
            <span className="small text-secondary">
              Official chapters accredited by the National Council.
            </span>
          </div>
        </div>

        <div className="row g-4">
          {chapters.map((ch) => (
            <div key={ch.id} className="col-12 col-md-4">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 small">
                      County {ch.countyCode}
                    </span>
                    <span className="badge rounded-pill bg-success bg-opacity-25 text-success small text-uppercase">
                      {ch.status}
                    </span>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{ch.name}</h5>
                  <p className="small text-secondary mb-3">
                    {ch.description || "Active community chapter."}
                  </p>
                  <div className="small text-secondary d-flex align-items-center gap-1 mb-1">
                    <MapPin size={14} className="text-warning" />
                    <span>{ch.meetingVenue || "Designated Hall"}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top border-white-10">
                  <Link href={`/chapters/${ch.slug}`} className="btn btn-sm btn-glass w-100">
                    Inspect Chapter Portal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* National Member Roster */}
      <div className="mb-5" id="roster">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
              National Membership Roll & Verifications
            </h4>
            <span className="small text-secondary">
              Search, filter, verify, and export the centralized national membership roll.
            </span>
          </div>
        </div>

        <MemberRosterTable initialMembers={formattedMembers} canApprove />
      </div>

      {/* Immutable Audit Log Section */}
      <div className="mb-5" id="audit">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
              Immutable Governance Audit Log
            </h4>
            <span className="small text-secondary">
              Cryptographically timestamped record of administrative events, role changes, and data requests.
            </span>
          </div>
        </div>

        <AuditLogViewer initialLogs={formattedLogs} />
      </div>
    </DashboardLayout>
  );
}

