import React from "react";
import { ShieldCheck, QrCode } from "lucide-react";

interface Props {
  membershipId: string | null;
  fullName: string;
  clan: string | null;
  ancestralCounty: string | null;
  currentCounty: string | null;
  role: string;
  status: string;
  joinedAt: Date | string | null;
}

export default function MemberIdCard({
  membershipId,
  fullName,
  clan,
  ancestralCounty,
  currentCounty,
  role,
  status,
  joinedAt,
}: Props) {
  const displayId = membershipId || "MLB-PENDING-00000";
  const formattedDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-KE", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div
      className="position-relative overflow-hidden rounded-4 p-4 p-md-5 text-white shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(8, 40, 26, 0.95) 0%, rgba(12, 59, 38, 0.85) 50%, rgba(212, 175, 55, 0.25) 100%)",
        border: "1.5px solid rgba(212, 175, 55, 0.45)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(212, 175, 55, 0.15)",
      }}
    >
      {/* Background Holographic Glow Orb */}
      <div
        className="position-absolute"
        style={{
          top: "-30%",
          right: "-15%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Card Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-warning border-opacity-25 pb-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 38,
              height: 38,
              background: "rgba(212, 175, 55, 0.2)",
              border: "1px solid rgba(212, 175, 55, 0.5)",
            }}
          >
            <ShieldCheck size={22} className="text-warning" />
          </div>
          <div>
            <span
              className="fw-bold tracking-wider text-warning d-block small text-uppercase"
              style={{ letterSpacing: "0.1em" }}
            >
              Mulembe National Platform
            </span>
            <span className="small text-white-50" style={{ fontSize: "0.75rem" }}>
              Republic of Kenya & Global Diaspora
            </span>
          </div>
        </div>

        <span className="badge rounded-pill bg-warning text-dark px-3 py-1 text-uppercase fw-bold small">
          {status}
        </span>
      </div>

      {/* Card Body */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-8">
          <span className="text-warning small text-uppercase fw-semibold d-block">
            Verified Member Name
          </span>
          <h3
            className="fw-bold text-light mb-1"
            style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.02em" }}
          >
            {fullName}
          </h3>
          <span className="badge bg-light bg-opacity-10 text-light border border-light border-opacity-25 text-uppercase small">
            {role.replace("_", " ")}
          </span>
        </div>

        <div className="col-4 text-end">
          <div className="d-inline-flex p-2 rounded bg-black bg-opacity-40 border border-white-10 text-warning">
            <QrCode size={48} />
          </div>
          <span className="small text-white-50 d-block mt-1" style={{ fontSize: "0.7rem" }}>
            ODPC Encrypted
          </span>
        </div>
      </div>

      {/* Card Footer / Metadata Grid */}
      <div className="row g-2 pt-3 border-top border-warning border-opacity-25 small">
        <div className="col-4">
          <span className="text-white-50 d-block" style={{ fontSize: "0.75rem" }}>
            National Member ID
          </span>
          <strong className="text-warning font-monospace fs-6">{displayId}</strong>
        </div>

        <div className="col-3">
          <span className="text-white-50 d-block" style={{ fontSize: "0.75rem" }}>
            Ancestral / Current
          </span>
          <span className="text-light fw-semibold">
            {ancestralCounty || "037"} / {currentCounty || "037"}
          </span>
        </div>

        <div className="col-3">
          <span className="text-white-50 d-block" style={{ fontSize: "0.75rem" }}>
            Clan / Sub-Tribe
          </span>
          <span className="text-light fw-semibold">{clan || "Luhya Heritage"}</span>
        </div>

        <div className="col-2 text-end">
          <span className="text-white-50 d-block" style={{ fontSize: "0.75rem" }}>
            Issued
          </span>
          <span className="text-light">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

