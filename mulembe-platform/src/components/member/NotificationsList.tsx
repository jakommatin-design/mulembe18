"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Info, Check, Filter, Settings, Megaphone } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import NotificationPreferencesManager from "./NotificationPreferencesManager";
import { NotificationPreferences } from "@/lib/schemas/notification";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  priority: string;
  countyCode: string | null;
  createdAt: string | Date;
  isRead?: boolean;
}

interface Props {
  initialNotifications: NotificationItem[];
  initialPreferences?: NotificationPreferences;
}

export default function NotificationsList({
  initialNotifications,
  initialPreferences,
}: Props) {
  const { addToast } = useToast();
  const [activeView, setActiveView] = useState<"feed" | "preferences">("feed");
  const [filter, setFilter] = useState<string>("all");
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    initialNotifications.forEach((n) => {
      if (n.isRead) set.add(n.id);
    });
    return set;
  });

  const filtered = initialNotifications.filter((n) => {
    if (filter === "all") return true;
    return n.priority === filter;
  });

  async function markAsRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    addToast("info", "Marked as Read", "Notification acknowledged.");

    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: "PUT" });
    } catch {
      // Local state already updated
    }
  }

  async function markAllAsRead() {
    setReadIds(new Set(initialNotifications.map((n) => n.id)));
    addToast("success", "All Read", "All active dispatches marked as read.");

    try {
      await fetch("/api/v1/notifications/read-all", { method: "PUT" });
    } catch {
      // Local state already updated
    }
  }

  return (
    <div>
      {/* Top View Toggle */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group p-1 glass-panel rounded-pill">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 ${
              activeView === "feed" ? "btn-gold" : "btn-glass border-0 text-light"
            }`}
            onClick={() => setActiveView("feed")}
          >
            <Megaphone size={16} className="me-2" /> Dispatches & Alerts
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 ${
              activeView === "preferences" ? "btn-gold" : "btn-glass border-0 text-light"
            }`}
            onClick={() => setActiveView("preferences")}
          >
            <Settings size={16} className="me-2" /> Notification Channels
          </button>
        </div>
      </div>

      {activeView === "preferences" ? (
        <NotificationPreferencesManager initialPreferences={initialPreferences} />
      ) : (
        <>
          {/* Controls Bar */}
          <div className="glass-panel p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={16} className="text-secondary" />
              <span className="small text-secondary fw-semibold">Filter Priority:</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn btn-sm ${filter === "all" ? "btn-gold" : "btn-glass"}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filter === "urgent" ? "btn-gold" : "btn-glass"}`}
                  onClick={() => setFilter("urgent")}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filter === "important" ? "btn-gold" : "btn-glass"}`}
                  onClick={() => setFilter("important")}
                >
                  Important
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filter === "routine" ? "btn-gold" : "btn-glass"}`}
                  onClick={() => setFilter("routine")}
                >
                  Routine
                </button>
              </div>
            </div>

            {initialNotifications.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-glass text-warning"
                onClick={markAllAsRead}
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Notifications Feed */}
          {filtered.length === 0 ? (
            <EmptyState
              title="No Notifications"
              description="You are completely up to date. No new bulletins or urgent dispatches."
            />
          ) : (
            <div className="d-flex flex-column gap-3">
              {filtered.map((item) => {
                const isRead = readIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`glass-panel p-4 transition-all ${
                      isRead ? "opacity-75" : "border-warning border-opacity-50 shadow-sm"
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`p-2 rounded-circle mt-1 ${
                            item.priority === "urgent"
                              ? "bg-danger bg-opacity-25 text-danger"
                              : item.priority === "important"
                                ? "bg-warning bg-opacity-25 text-warning"
                                : "bg-info bg-opacity-25 text-info"
                          }`}
                        >
                          {item.priority === "urgent" ? (
                            <AlertTriangle size={18} />
                          ) : item.priority === "important" ? (
                            <Bell size={18} />
                          ) : (
                            <Info size={18} />
                          )}
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span
                              className="badge rounded-pill bg-light bg-opacity-10 text-light text-uppercase small"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {item.priority}
                            </span>
                            {item.countyCode && (
                              <span
                                className="badge rounded-pill bg-success bg-opacity-25 text-success small"
                                style={{ fontSize: "0.7rem" }}
                              >
                                County {item.countyCode}
                              </span>
                            )}
                            <span className="text-secondary small" style={{ fontSize: "0.75rem" }}>
                              {new Date(item.createdAt).toLocaleDateString("en-KE", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <h5 className="fw-bold text-light mb-1">{item.title}</h5>
                          <p className="text-secondary small mb-0">{item.content}</p>
                        </div>
                      </div>

                      {!isRead && (
                        <button
                          type="button"
                          className="btn btn-sm btn-glass text-light d-inline-flex align-items-center gap-1 text-nowrap"
                          onClick={() => markAsRead(item.id)}
                        >
                          <Check size={14} /> Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
