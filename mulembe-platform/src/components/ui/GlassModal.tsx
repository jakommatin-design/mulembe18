"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";

export interface GlassModalProps {
  show: boolean;
  onHide: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "lg" | "xl";
}

export function GlassModal({
  show,
  onHide,
  title,
  children,
  footer,
  size,
}: GlassModalProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered
      contentClassName="glass-panel text-white border-white-10"
    >
      {title && (
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white-10">
          <Modal.Title style={{ fontFamily: "var(--font-serif)" }}>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
      {footer && (
        <Modal.Footer className="border-top border-white-10">{footer}</Modal.Footer>
      )}
    </Modal>
  );
}

