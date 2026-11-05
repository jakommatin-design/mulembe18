"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
}

interface ToastContextValue {
  showToast: (title: string, message: string, variant?: ToastMessage["variant"]) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, message: string, variant: ToastMessage["variant"] = "info") => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, variant }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            delay={5000}
            autohide
            className="glass-panel text-white border-white-10 mb-2"
          >
            <Toast.Header closeButton closeVariant="white" className="bg-transparent border-bottom border-white-10 text-white">
              <strong className="me-auto text-warning">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body className="small text-white-50">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

