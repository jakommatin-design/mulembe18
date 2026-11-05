"use client";

import React from "react";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  as?: "input" | "select" | "textarea";
  options?: Array<{ label: string; value: string }>;
  rows?: number;
}

export function FormField({
  label,
  error,
  helpText,
  as = "input",
  options,
  id,
  className = "",
  rows = 3,
  ...props
}: FormFieldProps) {
  const fieldId = id || `field_${label.toLowerCase().replace(/\s+/g, "_")}`;

  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className="form-label small fw-semibold text-white-50">
        {label}
      </label>

      {as === "select" ? (
        <select
          id={fieldId}
          className={`form-select ${error ? "is-invalid" : ""} ${className}`}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            borderColor: error ? "var(--bs-danger)" : "rgba(255, 255, 255, 0.15)",
            color: "white",
          }}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark text-white">
              {opt.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={fieldId}
          rows={rows}
          className={`form-control ${error ? "is-invalid" : ""} ${className}`}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            borderColor: error ? "var(--bs-danger)" : "rgba(255, 255, 255, 0.15)",
            color: "white",
          }}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={`form-control ${error ? "is-invalid" : ""} ${className}`}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            borderColor: error ? "var(--bs-danger)" : "rgba(255, 255, 255, 0.15)",
            color: "white",
          }}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {helpText && !error && (
        <div className="form-text text-white-50 small mt-1">{helpText}</div>
      )}

      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
}

