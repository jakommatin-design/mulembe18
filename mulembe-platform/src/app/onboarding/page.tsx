import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { memberRepository } from "@/server/repositories/member.repository";
import { geographyRepository } from "@/server/repositories/geography.repository";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import OnboardingWizard from "@/components/member/OnboardingWizard";

export const metadata: Metadata = {
  title: "Member Registration & Onboarding | Mulembe National Platform",
  description:
    "Complete your official membership registration for the Mulembe National Community Platform.",
};

export default async function OnboardingPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in?redirectUrl=/onboarding");
  }

  // If member already has a membershipId, they can jump to profile
  const userDb = await memberRepository.getById(user.id);
  if (userDb?.membershipId) {
    redirect("/profile");
  }

  const [counties, chapters] = await Promise.all([
    geographyRepository.getAllCounties(),
    chapterRepository.getAllActive(),
  ]);

  const formattedCounties = counties.map((c) => ({
    code: c.code,
    name: c.name,
  }));

  const formattedChapters = chapters.map((ch) => ({
    id: ch.id,
    name: ch.name,
    countyCode: ch.countyCode,
    meetingVenue: ch.meetingVenue,
  }));

  return (
    <main className="container py-5">
      <div className="row justify-content-center text-center mb-4">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-1 text-uppercase mb-2">
            National Membership Roll
          </span>
          <h1
            className="display-5 fw-bold text-light mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Mulembe Registration Wizard
          </h1>
          <p className="lead text-secondary">
            Join thousands of verified brothers and sisters across Kenya and the diaspora.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <OnboardingWizard
            initialCounties={formattedCounties}
            initialChapters={formattedChapters}
            defaultEmail={user.email}
            defaultName={user.fullName || ""}
          />
        </div>
      </div>
    </main>
  );
}

