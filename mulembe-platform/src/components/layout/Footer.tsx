import React from "react";
import Link from "next/link";
import { Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="glass-footer py-5 border-top border-white-10 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <h5
              className="fw-bold mb-3"
              style={{
                fontFamily: "var(--font-serif)",
                background: "linear-gradient(135deg, #f5e6b3 0%, #d4af37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mulembe National Platform
            </h5>
            <p className="text-secondary small mb-3">
              The unified digital congress for the Luhya community across 47 Kenyan
              counties and the global diaspora. Preserving heritage, empowering youth,
              and ensuring mutual welfare.
            </p>
            <div className="d-flex align-items-center gap-2 text-white-50 small">
              <Shield size={16} className="text-warning" />
              <span>KDPA Compliant Data Governance</span>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-white small text-uppercase mb-3">Portals</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li><Link href="/chapters" className="text-decoration-none text-secondary hover-text-white">Chapter Directory</Link></li>
              <li><Link href="/events" className="text-decoration-none text-secondary hover-text-white">Cultural Events</Link></li>
              <li><Link href="/news" className="text-decoration-none text-secondary hover-text-white">News & Notices</Link></li>
              <li><Link href="/design-system" className="text-decoration-none text-secondary hover-text-white">Design System</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-white small text-uppercase mb-3">Community</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li><Link href="/about" className="text-decoration-none text-secondary hover-text-white">About Mulembe</Link></li>
              <li><Link href="/sign-up" className="text-decoration-none text-secondary hover-text-white">Register Profile</Link></li>
              <li><Link href="/profile" className="text-decoration-none text-secondary hover-text-white">Member Portal</Link></li>
              <li><Link href="/contact" className="text-decoration-none text-secondary hover-text-white">Contact Elders</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-white small text-uppercase mb-3">County Coverage</h6>
            <p className="text-secondary small mb-2">
              Representing members from Kakamega (037), Vihiga (038), Bungoma (039), Busia (040), Nairobi (047), Mombasa (001), and all 47 counties of Kenya.
            </p>
            <div className="badge bg-warning text-dark rounded-pill px-3 py-2 small fw-semibold">
              47 Counties • 18 Sub-Tribes • 1 Nation
            </div>
          </div>
        </div>

        <hr className="border-white-10 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-white-50">
          <div>
            &copy; {new Date().getFullYear()} Mulembe National Platform. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger" /> for the Mulembe Nation
          </div>
        </div>
      </div>
    </footer>
  );
}

