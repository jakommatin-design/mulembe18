import React from "react";

export interface SkeletonProps {
  lines?: number;
  height?: number | string;
  className?: string;
  type?: "text" | "card" | "avatar";
}

export function SkeletonLoader({
  lines = 3,
  height,
  className = "",
  type = "text",
}: SkeletonProps) {
  if (type === "avatar") {
    return (
      <div
        className={`rounded-circle skeleton-shimmer ${className}`}
        style={{
          width: height || 48,
          height: height || 48,
          background: "rgba(255, 255, 255, 0.08)",
        }}
      />
    );
  }

  if (type === "card") {
    return (
      <div
        className={`glass-card p-4 skeleton-shimmer ${className}`}
        style={{ height: height || 180, background: "rgba(255, 255, 255, 0.05)" }}
      >
        <div
          className="mb-3 rounded"
          style={{ width: "40%", height: 20, background: "rgba(255, 255, 255, 0.1)" }}
        />
        <div
          className="mb-2 rounded"
          style={{ width: "100%", height: 14, background: "rgba(255, 255, 255, 0.08)" }}
        />
        <div
          className="rounded"
          style={{ width: "70%", height: 14, background: "rgba(255, 255, 255, 0.08)" }}
        />
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="rounded skeleton-shimmer"
          style={{
            height: height || 16,
            width: idx === lines - 1 && lines > 1 ? "60%" : "100%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
      ))}
    </div>
  );
}

