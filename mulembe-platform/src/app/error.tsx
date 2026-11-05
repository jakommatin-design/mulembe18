"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="container py-5 min-vh-75 d-flex align-items-center justify-content-center">
      <div className="glass-panel text-center p-5 border-danger-subtle" style={{ maxWidth: 540 }}>
        <div className="d-inline-flex p-3 rounded-circle bg-danger-subtle text-danger mb-3">
          <AlertTriangle size={36} />
        </div>
        <h3 className="fw-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Something went wrong
        </h3>
        <p className="text-secondary small mb-4">
          An unexpected error occurred while rendering this page. Our technical team has been notified.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button type="button" className="btn btn-gold d-inline-flex align-items-center gap-2" onClick={() => reset()}>
            <RotateCcw size={16} /> Try Again
          </button>
          <Link href="/" className="btn btn-glass">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

