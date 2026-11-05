import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export default function Loading() {
  return (
    <div className="container py-5 min-vh-50 d-flex flex-column align-items-center justify-content-center">
      <div className="text-center mb-4">
        <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading Mulembe Nation...</span>
        </div>
        <h5 className="fw-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
          Loading Mulembe National Platform
        </h5>
      </div>
      <div className="w-100" style={{ maxWidth: 500 }}>
        <SkeletonLoader lines={3} />
      </div>
    </div>
  );
}

