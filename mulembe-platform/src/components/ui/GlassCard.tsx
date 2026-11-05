import React from "react";

export interface GlassCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  elevation?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function GlassCard({
  children,
  header,
  footer,
  className = "",
  elevation = "md",
  onClick,
}: GlassCardProps) {
  const elevationStyles = {
    sm: { padding: "1rem" },
    md: { padding: "1.5rem" },
    lg: { padding: "2rem" },
  };

  return (
    <div
      className={`glass-card ${className}`}
      style={{
        ...elevationStyles[elevation],
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      {header && <div className="border-bottom border-white-10 pb-3 mb-3">{header}</div>}
      <div className="card-content">{children}</div>
      {footer && <div className="border-top border-white-10 pt-3 mt-3">{footer}</div>}
    </div>
  );
}

