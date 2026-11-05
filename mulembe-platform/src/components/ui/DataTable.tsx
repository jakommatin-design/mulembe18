"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  page = 1,
  totalPages = 1,
  total,
  onPageChange,
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="glass-card p-0 overflow-hidden shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-white" style={{ background: "transparent" }}>
          <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-white-50 small fw-bold text-uppercase border-bottom border-white-10">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-white-50">
                  <div className="spinner-border spinner-border-sm text-warning me-2" role="status" />
                  Loading records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-white-50">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="border-bottom border-white-10">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-white small">
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {(totalPages > 1 || total !== undefined) && (
        <div className="d-flex justify-content-between align-items-center p-3 border-top border-white-10">
          <div className="small text-white-50">
            {total !== undefined ? `Showing ${data.length} of ${total} entries` : `Page ${page} of ${totalPages}`}
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-glass px-2 py-1 text-white"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="small text-white px-2 py-1">
              {page} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-glass px-2 py-1 text-white"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange?.(page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

