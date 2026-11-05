import React from "react";

export interface GlassCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  badge?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  elevation?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  title,
  badge,
  header,
  footer,
  className = "",
  elevation = "md",
  interactive,
  onClick,
}: GlassCardProps) {
  const elevationStyles = {
    sm: { padding: "1rem" },
    md: { padding: "1.5rem" },
    lg: { padding: "2rem" },
  };

  const computedHeader =
    header ||
    (title ? (
      <div className="d-flex justify-content-between align-items-center gap-2">
        <h5 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
          {title}
        </h5>
        {badge}
      </div>
    ) : null);

  return (
    <div
      className={`glass-card ${interactive ? "glass-card-interactive" : ""} ${className}`}
      style={{
        ...elevationStyles[elevation],
        cursor: onClick || interactive ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      {computedHeader && (
        <div className="border-bottom border-white-10 pb-3 mb-3">{computedHeader}</div>
      )}
      <div className="card-content">{children}</div>
      {footer && <div className="border-top border-white-10 pt-3 mt-3">{footer}</div>}
    </div>
  );
}

export default GlassCard;
