"use client";

import { useState, useMemo } from "react";
import { Search, Download, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

export interface RosterMember {
  id: string;
  membershipId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  clan: string | null;
  currentCountyCode: string | null;
  ancestralCountyCode: string | null;
  status: string;
  createdAt: string | Date;
}

interface Props {
  initialMembers: RosterMember[];
  canApprove?: boolean;
}

export default function MemberRosterTable({ initialMembers, canApprove = true }: Props) {
  const { addToast } = useToast();
  const [members, setMembers] = useState<RosterMember[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filter members
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone && m.phone.includes(searchTerm)) ||
        (m.membershipId && m.membershipId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.clan && m.clan.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === "all" || m.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // Export to CSV
  function handleExportCsv() {
    if (filtered.length === 0) {
      addToast("warning", "Export Empty", "No members match the current filter.");
      return;
    }

    const headers = [
      "Membership ID",
      "Full Name",
      "Email",
      "Phone",
      "Role",
      "Clan",
      "County Code",
      "Status",
      "Registered Date",
    ];

    const rows = filtered.map((m) => [
      `"${m.membershipId || ""}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.phone || ""}"`,
      `"${m.role}"`,
      `"${m.clan || ""}"`,
      `"${m.currentCountyCode || ""}"`,
      `"${m.status}"`,
      `"${new Date(m.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mulembe_roster_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    addToast("success", "Export Complete", `Exported ${filtered.length} member records to CSV.`);
  }

  // Verify / Suspend Member
  async function handleStatusChange(memberId: string, newStatus: "active" | "suspended") {
    setActionLoadingId(memberId);
    try {
      await apiClient.post(`/api/v1/members/${memberId}/verify`, {
        status: newStatus,
      });

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
      );

      addToast(
        "success",
        "Status Updated",
        `Member has been marked as ${newStatus}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update member status";
      addToast("danger", "Action Failed", msg);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="glass-panel p-4">
      {/* Controls Bar */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="position-relative">
            <span
              className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
              aria-hidden="true"
            >
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control glass-input ps-5"
              placeholder="Search by name, phone, or Member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-6 col-md-3 col-lg-3">
          <select
            className="form-select glass-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active Members</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="col-6 col-md-3 col-lg-4 text-end">
          <button
            type="button"
            className="btn btn-gold d-inline-flex align-items-center gap-2"
            onClick={handleExportCsv}
          >
            <Download size={16} /> Export to CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Glass Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
          <thead>
            <tr className="border-bottom border-white-10 text-secondary small text-uppercase">
              <th>Member ID</th>
              <th>Full Legal Name</th>
              <th>Contact Details</th>
              <th>Clan / County</th>
              <th>Status</th>
              {canApprove && <th className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canApprove ? 6 : 5} className="text-center py-5 text-secondary">
                  No members matched the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="border-bottom border-white-10">
                  <td>
                    <span className="font-monospace text-warning small fw-semibold">
                      {m.membershipId || "PENDING"}
                    </span>
                  </td>
                  <td>
                    <strong className="text-light d-block">{m.fullName}</strong>
                    <span className="small text-secondary text-uppercase" style={{ fontSize: "0.75rem" }}>
                      {m.role.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="small text-light d-block">{m.phone || "No phone"}</span>
                    <span className="small text-secondary">{m.email}</span>
                  </td>
                  <td>
                    <span className="small text-light d-block">{m.clan || "Unspecified"}</span>
                    <span className="small text-secondary">
                      County {m.currentCountyCode || m.ancestralCountyCode || "—"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill small ${
                        m.status === "active"
                          ? "bg-success bg-opacity-25 text-success border border-success border-opacity-50"
                          : m.status === "pending"
                            ? "bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50"
                            : "bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="text-end">
                      {actionLoadingId === m.id ? (
                        <Loader2 size={16} className="spinner-border spinner-border-sm text-warning" />
                      ) : (
                        <div className="d-inline-flex gap-1">
                          {m.status !== "active" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 py-1 px-2"
                              onClick={() => handleStatusChange(m.id, "active")}
                              title="Approve Member"
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                          )}
                          {m.status === "active" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1 px-2"
                              onClick={() => handleStatusChange(m.id, "suspended")}
                              title="Suspend Member"
                            >
                              <XCircle size={14} /> Suspend
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

