"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import GlassModal from "@/components/ui/GlassModal";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface Props {
  chapterId?: string | null;
  onEventCreated?: () => void;
}

export default function EventManagerModal({ chapterId, onEventCreated }: Props) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "cultural",
    startTime: "",
    endTime: "",
    venueName: "",
    venueAddress: "",
    capacity: 100,
    description: "",
  });

  function autoSlug(title: string) {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    setForm((prev) => ({ ...prev, title, slug }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/v1/events", {
        title: form.title,
        slug: form.slug || `event-${Date.now()}`,
        category: form.category,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        venueName: form.venueName,
        venueAddress: form.venueAddress || null,
        capacity: Number(form.capacity) || 100,
        description: form.description,
        chapterId: chapterId || null,
      });

      addToast("success", "Event Published", "New community gathering has been scheduled.");
      setIsOpen(false);
      setForm({
        title: "",
        slug: "",
        category: "cultural",
        startTime: "",
        endTime: "",
        venueName: "",
        venueAddress: "",
        capacity: 100,
        description: "",
      });
      if (onEventCreated) onEventCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish event";
      addToast("danger", "Publication Failed", msg);
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
        <Plus size={16} /> Schedule Community Event
      </button>

      <GlassModal
        show={isOpen}
        onHide={() => !isSubmitting && setIsOpen(false)}
        title="Schedule Official Gathering"
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
              Publish Event
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <FormField
                label="Event Title"
                placeholder="e.g. Kakamega Youth Agricultural Forum"
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => autoSlug(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Category</label>
                <select
                  className="form-select glass-input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="cultural">Cultural & Heritage</option>
                  <option value="youth">Youth & Mentorship</option>
                  <option value="agm">AGM & General Assembly</option>
                  <option value="welfare">Welfare & Economic Aid</option>
                  <option value="sports">Sports & Tournaments</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Start Date & Time"
                type="datetime-local"
                value={form.startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="End Date & Time"
                type="datetime-local"
                value={form.endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, endTime: e.target.value })
                }
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Venue Name"
                placeholder="e.g. Bukhungu Social Hall"
                value={form.venueName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, venueName: e.target.value })
                }
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <FormField
                label="Address / Town"
                placeholder="e.g. Kakamega Town"
                value={form.venueAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, venueAddress: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-3">
              <FormField
                label="Seating Capacity"
                type="number"
                value={form.capacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Event Brief & Itinerary
                </label>
                <textarea
                  className="form-control glass-input"
                  rows={4}
                  placeholder="Provide an overview of key speakers, topics, and attendance requirements..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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

