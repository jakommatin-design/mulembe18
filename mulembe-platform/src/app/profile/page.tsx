import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { memberRepository } from "@/server/repositories/member.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import ProfileDashboard from "@/components/member/ProfileDashboard";

export const metadata: Metadata = {
  title: "Member Profile & ID Card | Mulembe National Platform",
  description: "View your verified Mulembe member card, chapter affiliation, and data rights.",
};

export default async function ProfilePage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in?redirectUrl=/profile");
  }

  // Fetch full user record from database
  const user = await memberRepository.getById(sessionUser.id);
  if (!user) {
    redirect("/sign-in");
  }

  const [membership, rsvps, activeChapters] = await Promise.all([
    memberRepository.getUserMembership(user.id),
    memberRepository.getUserRsvps(user.id),
    chapterRepository.getAllActive(),
  ]);

  const formattedUser = {
    id: user.id,
    membershipId: user.membershipId,
    fullName: user.fullName || "Mulembe Member",
    email: user.email,
    phone: user.phone,
    nationalId: user.nationalId,
    gender: user.gender,
    clan: user.clan,
    ancestralCountyCode: user.ancestralCountyCode,
    currentCountyCode: user.currentCountyCode,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };

  const formattedMembership = membership
    ? {
        id: membership.id,
        chapterId: membership.chapterId,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt.toISOString(),
        chapterName: membership.chapterName,
        chapterSlug: membership.chapterSlug,
        chapterCounty: membership.chapterCounty,
        meetingVenue: membership.meetingVenue,
      }
    : null;

  const formattedRsvps = rsvps.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    status: r.status,
    guestsCount: r.guestsCount,
    eventTitle: r.eventTitle,
    eventSlug: r.eventSlug,
    eventCategory: r.eventCategory,
    startTime: r.startTime.toISOString(),
    venueName: r.venueName,
  }));

  const availableChapters = activeChapters.map((ch) => ({
    id: ch.id,
    name: ch.name,
    countyCode: ch.countyCode,
  }));

  return (
    <main className="container py-5">
      {/* Top Header Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link
          href="/"
          className="btn btn-sm btn-glass d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="d-flex align-items-center gap-3">
          <span className="small text-secondary d-none d-md-inline">
            Signed in as <strong>{sessionUser.email}</strong>
          </span>
          <UserButton />
        </div>
      </div>

      <ProfileDashboard
        initialUser={formattedUser}
        initialMembership={formattedMembership}
        initialRsvps={formattedRsvps}
        availableChapters={availableChapters}
      />
    </main>
  );
}
