import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Glass Navbar */}
      <nav className="glass-navbar py-3 px-4 sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Link
            href="/"
            className="text-decoration-none fw-bold fs-5 text-white d-flex align-items-center gap-2"
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                background: "linear-gradient(135deg, #f5e6b3 0%, #d4af37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mulembe Nation
            </span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Link
              href="/design-system"
              className="text-white-50 text-decoration-none small d-none d-md-inline"
            >
              Design System
            </Link>

            {userId ? (
              <div className="d-flex align-items-center gap-2">
                <Link href="/profile" className="btn btn-sm btn-glass px-3 me-2">
                  My Profile
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "border border-warning shadow-sm",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link href="/sign-in" className="btn btn-sm btn-glass text-white px-3">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-sm btn-gold px-3">
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Hero Container */}
      <main className="container py-5 flex-grow-1">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-lg-8">
            <div className="glass-panel p-5 my-4">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3">
                Mulembe National Platform
              </span>
              <h1
                className="display-4 fw-bold mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                A Nationwide Community Built on Trust, Heritage & Unity
              </h1>
              <p className="lead text-secondary mb-4">
                Connecting Luhya community members across all 47 counties of
                Kenya and the global diaspora.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {userId ? (
                  <Link href="/profile" className="btn btn-gold">
                    View Membership Profile
                  </Link>
                ) : (
                  <Link href="/sign-up" className="btn btn-gold">
                    Register as Member
                  </Link>
                )}
                <Link href="/design-system" className="btn btn-glass">
                  Explore Design System
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-12 col-md-4">
            <div className="glass-card p-4 h-100">
              <h4 className="fw-bold mb-2">47 Counties Unified</h4>
              <p className="text-secondary small mb-0">
                Structured geographic hierarchy spanning national leadership,
                county coordinators, and sub-county chapters.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="glass-card p-4 h-100">
              <h4 className="fw-bold mb-2">Verified Identity</h4>
              <p className="text-secondary small mb-0">
                Cryptographically verified membership IDs and compliant personal
                data handling under the Kenya Data Protection Act.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="glass-card p-4 h-100">
              <h4 className="fw-bold mb-2">Empowerment & Welfare</h4>
              <p className="text-secondary small mb-0">
                Transparent mutual aid administration, community event planning,
                and decentralized leadership accountability.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-footer py-4 text-center text-secondary small border-top border-white-10">
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Mulembe National Platform. All
            rights reserved. Built with pride for the Mulembe Nation.
          </p>
        </div>
      </footer>
    </div>
  );
}
