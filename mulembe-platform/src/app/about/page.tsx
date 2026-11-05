import { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  ShieldCheck,
  Scale,
  Users,
  HeartHandshake,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "About Us | Mulembe National Platform",
  description:
    "Learn about the history, heritage, governance structure, and constitutional values of the Mulembe National Community Platform uniting the Luhya nation.",
  openGraph: {
    title: "About Us | Mulembe National Platform",
    description:
      "Preserving heritage, safeguarding member welfare, and fostering generational economic empowerment across 47 counties.",
  },
};

export default function AboutPage() {
  const values = [
    {
      title: "Mulembe (Peace & Goodwill)",
      desc: "The sacred ancestral greeting and bedrock of community coexistence, mutual respect, and non-violent conflict resolution.",
      icon: <HeartHandshake size={24} className="text-warning" />,
    },
    {
      title: "Obulala (Unity & Solidarity)",
      desc: "Collective solidarity ensuring that no sub-tribe, county chapter, or diaspora family stands isolated in adversity or joy.",
      icon: <Users size={24} className="text-warning" />,
    },
    {
      title: "Obufumu (Wisdom & Integrity)",
      desc: "Ethical governance rooted in elder counsel, financial transparency, and honest stewardship of community welfare resources.",
      icon: <Scale size={24} className="text-warning" />,
    },
    {
      title: "Obulungji (Diligence & Heritage)",
      desc: "Celebration of agrarian enterprise, educational scholarship, and active preservation of native dialects and rites.",
      icon: <BookOpen size={24} className="text-warning" />,
    },
  ];

  const subTribes = [
    "Bukusu", "Maragoli", "Wanga", "Banyala", "Idakho", "Isukha",
    "Tiriki", "Kabras", "Kisa", "Marama", "Tsotso", "Samia",
    "Nyore", "Tachoni", "Khayo", "Marachi", "Batura", "Banyore",
  ];

  return (
    <main className="container py-5">
      {/* Page Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-9">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 text-uppercase mb-3">
            Heritage, Governance & Vision
          </span>
          <h1
            className="display-4 fw-bold text-light mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Soul of the Luhya Nation
          </h1>
          <p className="lead text-secondary">
            Organised under a modern digital charter to preserve ancestral culture, formalise
            welfare solidarity, and empower millions of members nationwide.
          </p>
        </div>
      </div>

      {/* Origin & Narrative Section */}
      <section className="mb-5">
        <div className="glass-panel p-4 p-md-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <span className="text-warning small text-uppercase fw-bold tracking-wider">
                Historical Heritage
              </span>
              <h2
                className="h2 fw-bold text-light mt-1 mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                From Ancient Kingdoms to Modern Digital Fellowship
              </h2>
              <p className="text-secondary mb-3">
                The Luhya community embodies a vibrant federation of culturally intertwined
                sub-tribes sharing deep Bantu linguistic roots, agrarian traditions, and revered
                institutions of elder leadership dating back to the Kingdom of Wanga (Nabongo) and
                beyond.
              </p>
              <p className="text-secondary mb-4">
                Today, our people thrive across Kakamega, Bungoma, Busia, Vihiga, the major
                metropolises of Nairobi and Mombasa, and globally across Europe, North America,
                and the Middle East. The Mulembe National Platform bridges generational and
                geographic distance with a unified digital registry.
              </p>

              <div className="p-3 rounded glass-card">
                <h6 className="fw-bold text-light mb-2">Our Ancestral Sub-Tribes:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {subTribes.map((tribe) => (
                    <span
                      key={tribe}
                      className="badge rounded-pill bg-light bg-opacity-10 text-light border border-light border-opacity-25 py-2 px-3 small"
                    >
                      {tribe}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="glass-card p-4 text-center">
                <Landmark size={48} className="text-warning mb-3" />
                <h4 className="fw-bold text-light mb-2">National Charter</h4>
                <p className="small text-secondary mb-4">
                  Ratified by community delegates and legally structured to uphold constitutional
                  transparency, non-partisan unity, and certified welfare accountability.
                </p>
                <div className="d-flex flex-column gap-2 text-start small">
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>Independent Council of Elders Advisory</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>Decentralized 47-County Steering Desks</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>Full Kenya Data Protection Act 2019 Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <span className="text-warning small text-uppercase fw-bold tracking-wider">
            Our Tenets
          </span>
          <h2
            className="h2 fw-bold text-light mt-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Core Cultural Pillars
          </h2>
        </div>

        <div className="row g-4">
          {values.map((v) => (
            <div key={v.title} className="col-12 col-md-6">
              <GlassCard
                title={v.title}
                className="h-100"
                badge={<span className="p-2 rounded-circle glass-badge">{v.icon}</span>}
              >
                <p className="text-secondary small mb-0">{v.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>

      {/* Governance Hierarchy */}
      <section className="mb-5">
        <div className="glass-panel p-4 p-md-5">
          <div className="text-center mb-5">
            <span className="text-warning small text-uppercase fw-bold tracking-wider">
              Leadership Framework
            </span>
            <h2
              className="h2 fw-bold text-light mt-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Structured Accountability at Every Tier
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <span className="badge bg-warning text-dark mb-2">Tier 1</span>
                <h5 className="fw-bold text-light mb-2">Council of Elders</h5>
                <p className="small text-secondary mb-0">
                  Respected senior custodians of customs, conflict mediation, and cultural
                  safeguarding who offer non-partisan ethical counsel to platform executives.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <span className="badge bg-warning text-dark mb-2">Tier 2</span>
                <h5 className="fw-bold text-light mb-2">County Steering Desks</h5>
                <p className="small text-secondary mb-0">
                  Elected County Coordinators presiding across Kenya&apos;s 47 counties to verify
                  grassroots chapter applications and oversee mutual aid disbursement.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <span className="badge bg-warning text-dark mb-2">Tier 3</span>
                <h5 className="fw-bold text-light mb-2">Ward & Sub-County Chapters</h5>
                <p className="small text-secondary mb-0">
                  Local chapter executives (Chairperson, Secretary, Treasurer) conducting monthly
                  gatherings, vetting new members, and planning benevolent initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Data Protection Banner */}
      <section className="text-center py-4">
        <div className="glass-panel p-4 p-md-5">
          <ShieldCheck size={48} className="text-success mb-3" />
          <h3 className="fw-bold text-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Our Oath of Data Privacy & Integrity
          </h3>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: "680px" }}>
            The Mulembe National Platform is registered as a data controller under the Office of the
            Data Protection Commissioner (ODPC) of Kenya. Member data is never monetised, shared
            with commercial third parties, or accessed without explicit cryptographic consent.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/sign-up" className="btn btn-gold">
              Join as a Verified Member
            </Link>
            <Link href="/contact" className="btn btn-glass">
              Speak with the Secretariat
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

