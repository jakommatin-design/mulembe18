import React from "react";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="glass-card text-center p-5 my-4">
      <div className="d-inline-flex p-3 rounded-circle bg-white-5 text-warning mb-3">
        {icon || <FolderOpen size={36} />}
      </div>
      <h5 className="fw-bold mb-2 text-white" style={{ fontFamily: "var(--font-serif)" }}>
        {title}
      </h5>
      <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: 420 }}>
        {description}
      </p>
      {action ? (
        <div>{action}</div>
      ) : actionLabel && onAction ? (
        <button type="button" className="btn btn-sm btn-gold" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
