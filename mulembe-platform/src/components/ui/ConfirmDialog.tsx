"use client";

import React from "react";
import { GlassModal } from "./GlassModal";

export interface ConfirmDialogProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  confirmVariant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  confirmVariant,
  isLoading = false,
}: ConfirmDialogProps) {
  const effectiveVariant = confirmVariant || variant;
  const btnClass =
    effectiveVariant === "danger"
      ? "btn-danger"
      : effectiveVariant === "warning"
        ? "btn-warning text-dark"
        : "btn-gold";

  return (
    <GlassModal
      show={show}
      onHide={onHide}
      title={title}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <button
            type="button"
            className="btn btn-glass"
            onClick={onHide}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${btnClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-secondary mb-0">{message}</p>
    </GlassModal>
  );
}

export default ConfirmDialog;
