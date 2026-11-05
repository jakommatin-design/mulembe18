"use client";

import { useState } from "react";
import { Search, Clock, Info } from "lucide-react";
import GlassModal from "@/components/ui/GlassModal";

export interface AuditLogItem {
  id: string;
  actorId: string;
  action: string;
  targetEntity: string;
  targetId: string;
  payloadBefore: unknown;
  payloadAfter: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string | Date;
}

interface Props {
  initialLogs: AuditLogItem[];
}

export default function AuditLogViewer({ initialLogs }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filtered = initialLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="glass-panel p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="position-relative" style={{ maxWidth: 360, width: "100%" }}>
          <span
            className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
            aria-hidden="true"
          >
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control glass-input ps-5"
            placeholder="Search action or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <span className="small text-secondary">
          Displaying <strong className="text-light">{filtered.length}</strong> immutable audit events
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
          <thead>
            <tr className="border-bottom border-white-10 text-secondary small text-uppercase">
              <th>Timestamp (EAT)</th>
              <th>Action Verb</th>
              <th>Actor ID</th>
              <th>Target Entity</th>
              <th className="text-end">Payload</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-secondary">
                  No audit log entries found.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="border-bottom border-white-10">
                  <td className="small text-secondary">
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={12} className="text-warning" />
                      {new Date(log.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td>
                    <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 font-monospace small">
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="small font-monospace text-light">{log.actorId.slice(0, 16)}...</span>
                  </td>
                  <td>
                    <span className="small text-light">
                      {log.targetEntity}: <span className="text-secondary">{log.targetId.slice(0, 12)}</span>
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-glass text-light py-0 px-2"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Info size={14} className="me-1" /> Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      <GlassModal
        show={!!selectedLog}
        onHide={() => setSelectedLog(null)}
        title="Audit Log Event Dossier"
        size="lg"
        footer={
          <button
            type="button"
            className="btn btn-glass"
            onClick={() => setSelectedLog(null)}
          >
            Close
          </button>
        }
      >
        {selectedLog && (
          <div className="small">
            <div className="row g-2 mb-3">
              <div className="col-6">
                <span className="text-secondary d-block">Action Verb</span>
                <strong className="text-warning font-monospace">{selectedLog.action}</strong>
              </div>
              <div className="col-6">
                <span className="text-secondary d-block">Event ID</span>
                <span className="text-light font-monospace">{selectedLog.id}</span>
              </div>
              <div className="col-6">
                <span className="text-secondary d-block">Actor ID</span>
                <span className="text-light font-monospace">{selectedLog.actorId}</span>
              </div>
              <div className="col-6">
                <span className="text-secondary d-block">Target</span>
                <span className="text-light">
                  {selectedLog.targetEntity} ({selectedLog.targetId})
                </span>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-secondary d-block mb-1">State Payload Diff (After)</span>
              <pre
                className="p-3 rounded glass-card text-success font-monospace"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                {JSON.stringify(selectedLog.payloadAfter, null, 2) || "None"}
              </pre>
            </div>

            {Boolean(selectedLog.payloadBefore) && (
              <div>
                <span className="text-secondary d-block mb-1">State Payload Diff (Before)</span>
                <pre
                  className="p-3 rounded glass-card text-danger font-monospace"
                  style={{ maxHeight: 200, overflowY: "auto" }}
                >
                  {JSON.stringify(selectedLog.payloadBefore, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </GlassModal>
    </div>
  );
}

