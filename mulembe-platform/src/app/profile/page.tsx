import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Shield, MapPin, Mail, ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link
            href="/"
            className="btn btn-glass d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <UserButton />
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="glass-panel p-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 64,
                    height: 64,
                    background:
                      "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(8, 40, 26, 0.6))",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                  }}
                >
                  <Shield size={32} className="text-warning" />
                </div>
                <div>
                  <h2
                    className="fw-bold mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {user.fullName}
                  </h2>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning text-dark text-uppercase px-2 py-1">
                      {user.role.replace("_", " ")}
                    </span>
                    <span className="badge bg-success-subtle text-success px-2 py-1">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-white-10 my-4" />

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="glass-card p-3">
                    <div className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                      <Mail size={14} /> Email Address
                    </div>
                    <div className="fw-semibold">{user.email}</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="glass-card p-3">
                    <div className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                      <MapPin size={14} /> Assigned County Scope
                    </div>
                    <div className="fw-semibold">
                      {user.countyCode
                        ? `County ${user.countyCode}`
                        : "Nationwide (All 47 Counties)"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 glass-card bg-opacity-10 border-warning-subtle">
                <h6 className="fw-bold text-warning mb-1">
                  Verified Membership Status
                </h6>
                <p className="small text-secondary mb-0">
                  Your identity is secured by Clerk and synced with the Mulembe
                  National Platform database. All data processing adheres to the
                  Kenya Data Protection Act (KDPA).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
