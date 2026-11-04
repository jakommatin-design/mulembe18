import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-5 my-4">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3">
              Mulembe National Platform
            </span>
            <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              A Nationwide Community Built on Trust, Heritage & Unity
            </h1>
            <p className="lead text-secondary mb-4">
              Connecting Luhya community members across all 47 counties of Kenya and the global diaspora.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link href="/design-system" className="btn btn-gold">
                View Living Design System
              </Link>
              <a href="#about" className="btn btn-glass">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100">
            <h4 className="fw-bold mb-2">47 Counties Unified</h4>
            <p className="text-secondary small mb-0">
              Structured geographic hierarchy spanning national leadership, county coordinators, and sub-county chapters.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100">
            <h4 className="fw-bold mb-2">Verified Identity</h4>
            <p className="text-secondary small mb-0">
              Cryptographically verified membership IDs and compliant personal data handling under the Kenya Data Protection Act.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100">
            <h4 className="fw-bold mb-2">Empowerment & Welfare</h4>
            <p className="text-secondary small mb-0">
              Transparent mutual aid administration, community event planning, and decentralized leadership accountability.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
