import Link from "next/link";
import { Compass, Home, MapPin, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container min-vh-75 d-flex align-items-center justify-content-center py-5">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="glass-panel p-5 border-warning border-opacity-30 shadow-lg">
            <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-4">
              <Compass size={48} />
            </div>

            <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-1 text-uppercase mb-3 d-inline-block">
              Page Not Found • 404
            </span>

            <h1
              className="display-5 fw-bold text-light mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Lost on the Trail
            </h1>

            <p className="lead text-secondary mb-4">
              The pathway you were looking for cannot be located. It may have been archived, moved,
              or never charted.
            </p>

            <div className="d-flex justify-content-center flex-wrap gap-2 pt-2">
              <Link href="/" className="btn btn-gold d-inline-flex align-items-center gap-2">
                <Home size={16} /> Return to Hearth
              </Link>
              <Link
                href="/chapters"
                className="btn btn-glass d-inline-flex align-items-center gap-2 text-light"
              >
                <MapPin size={16} /> Regional Chapters
              </Link>
              <Link
                href="/events"
                className="btn btn-glass d-inline-flex align-items-center gap-2 text-light"
              >
                <Calendar size={16} /> Gatherings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

