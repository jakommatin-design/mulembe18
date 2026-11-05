"use client";

import { useState } from "react";
import { Send, Bell, Loader2 } from "lucide-react";
import GlassModal from "@/components/ui/GlassModal";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface Props {
  chapterId?: string | null;
  countyCode?: string | null;
  onPublished?: () => void;
}

export default function AnnouncementPublisherModal({
  chapterId,
  countyCode,
  onPublished,
}: Props) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "routine" as "routine" | "important" | "urgent",
    expiresAt: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/v1/announcements", {
        title: form.title,
        content: form.content,
        priority: form.priority,
        chapterId: chapterId || null,
        countyCode: countyCode || null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      });

      addToast("success", "Notice Published", "Announcement broadcast to the community.");
      setIsOpen(false);
      setForm({
        title: "",
        content: "",
        priority: "routine",
        expiresAt: "",
      });
      if (onPublished) onPublished();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish notice";
      addToast("danger", "Dispatch Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-gold d-inline-flex align-items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Bell size={16} /> Broadcast Notice
      </button>

      <GlassModal
        show={isOpen}
        onHide={() => !isSubmitting && setIsOpen(false)}
        title="Broadcast Community Dispatch"
        size="lg"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-glass"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={16} className="spinner-border spinner-border-sm" />}
              <Send size={14} /> Send Dispatch
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <FormField
                label="Announcement Title"
                placeholder="e.g. Western Region Emergency Bursary Window 2027"
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Priority Level</label>
                <select
                  className="form-select glass-input"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as "routine" | "important" | "urgent",
                    })
                  }
                >
                  <option value="routine">Routine Bulletin</option>
                  <option value="important">Important Action Notice</option>
                  <option value="urgent">Urgent / Emergency Alert</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Expiration Date (Optional)"
                type="date"
                value={form.expiresAt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                helperText="After this date, the notice will automatically archive"
              />
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Official Message Content
                </label>
                <textarea
                  className="form-control glass-input"
                  rows={5}
                  placeholder="State the formal circular or announcement text clearly..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </GlassModal>
    </>
  );
}

