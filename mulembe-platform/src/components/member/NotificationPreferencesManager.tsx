"use client";

import { useState } from "react";
import { Mail, MessageSquare, AlertCircle, Calendar, Megaphone, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { NotificationPreferences } from "@/lib/schemas/notification";

interface Props {
  initialPreferences?: NotificationPreferences;
  onSave?: (saved: NotificationPreferences) => void;
}

export default function NotificationPreferencesManager({
  initialPreferences = {
    emailEnabled: true,
    smsEnabled: true,
    urgentOnly: false,
    eventReminders: true,
    announcements: true,
  },
  onSave,
}: Props) {
  const { addToast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPreferences);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  function handleToggle(key: keyof NotificationPreferences) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setDirty(true);
      return next;
    });
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/members/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save preferences");
      }

      setDirty(false);
      addToast("success", "Preferences Saved", "Your notification channels have been updated.");
      if (onSave) onSave(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving preferences";
      addToast("danger", "Update Failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-light mb-1">Communication Preferences</h4>
          <p className="text-secondary small mb-0">
            Control which channels and topics we use to contact you, fully governed under KDPA 2019.
          </p>
        </div>
        {dirty && (
          <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="d-flex flex-column gap-3 mb-4">
        {/* Email Toggle */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark bg-opacity-40 border border-light border-opacity-10">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded bg-success bg-opacity-20 text-success">
              <Mail size={20} />
            </div>
            <div>
              <div className="fw-semibold text-light">Email Notifications (Resend)</div>
              <div className="small text-secondary">
                Receive official dispatches, event invites, and AGM reports directly to your inbox.
              </div>
            </div>
          </div>
          <div className="form-check form-switch fs-4 mb-0">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              checked={prefs.emailEnabled}
              onChange={() => handleToggle("emailEnabled")}
              disabled={loading}
            />
          </div>
        </div>

        {/* SMS Toggle */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark bg-opacity-40 border border-light border-opacity-10">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded bg-primary bg-opacity-20 text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="fw-semibold text-light">SMS Text Alerts (Africa&apos;s Talking)</div>
              <div className="small text-secondary">
                Direct SMS delivery to your verified Kenyan mobile number for time-sensitive notices.
              </div>
            </div>
          </div>
          <div className="form-check form-switch fs-4 mb-0">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              checked={prefs.smsEnabled}
              onChange={() => handleToggle("smsEnabled")}
              disabled={loading}
            />
          </div>
        </div>

        {/* Urgent Only Filter */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark bg-opacity-40 border border-light border-opacity-10">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded bg-danger bg-opacity-20 text-danger">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="fw-semibold text-light">Urgent Priority Only</div>
              <div className="small text-secondary">
                Filter out routine notices; only alert for emergency welfare, funerals, or national announcements.
              </div>
            </div>
          </div>
          <div className="form-check form-switch fs-4 mb-0">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              checked={prefs.urgentOnly}
              onChange={() => handleToggle("urgentOnly")}
              disabled={loading}
            />
          </div>
        </div>

        {/* Event Reminders */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark bg-opacity-40 border border-light border-opacity-10">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded bg-warning bg-opacity-20 text-warning">
              <Calendar size={20} />
            </div>
            <div>
              <div className="fw-semibold text-light">Event & Gathering Reminders</div>
              <div className="small text-secondary">
                Get reminders 24 hours before events you have RSVP&apos;d to or meetings in your chapter.
              </div>
            </div>
          </div>
          <div className="form-check form-switch fs-4 mb-0">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              checked={prefs.eventReminders}
              onChange={() => handleToggle("eventReminders")}
              disabled={loading}
            />
          </div>
        </div>

        {/* General Announcements */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark bg-opacity-40 border border-light border-opacity-10">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded bg-info bg-opacity-20 text-info">
              <Megaphone size={20} />
            </div>
            <div>
              <div className="fw-semibold text-light">Community Bulletins</div>
              <div className="small text-secondary">
                Receive weekly bulletins, cultural features, and youth mentorship notices.
              </div>
            </div>
          </div>
          <div className="form-check form-switch fs-4 mb-0">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              checked={prefs.announcements}
              onChange={() => handleToggle("announcements")}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-gold d-inline-flex align-items-center gap-2"
          onClick={handleSave}
          disabled={loading || !dirty}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spinner-border spinner-border-sm" /> Saving...
            </>
          ) : (
            <>
              <Check size={16} /> Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}

