import React from "react";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "info" | "danger";
  };
}

export default function StatCard({ title, value, icon, subtitle, badge }: Props) {
  const badgeClasses = {
    success: "bg-success bg-opacity-25 text-success border-success border-opacity-50",
    warning: "bg-warning bg-opacity-25 text-warning border-warning border-opacity-50",
    info: "bg-info bg-opacity-25 text-info border-info border-opacity-50",
    danger: "bg-danger bg-opacity-25 text-danger border-danger border-opacity-50",
  };

  return (
    <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span className="small text-secondary fw-semibold text-uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-circle glass-badge text-warning">{icon}</div>
      </div>

      <div>
        <div className="d-flex align-items-baseline gap-2 mb-1">
          <span className="display-6 fw-bold text-light">{value}</span>
          {badge && (
            <span
              className={`badge rounded-pill border small ${badgeClasses[badge.variant]}`}
              style={{ fontSize: "0.75rem" }}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && <p className="small text-secondary mb-0">{subtitle}</p>}
      </div>
    </div>
  );
}

