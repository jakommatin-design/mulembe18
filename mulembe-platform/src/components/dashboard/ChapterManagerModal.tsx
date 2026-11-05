"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import GlassModal from "@/components/ui/GlassModal";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface CountyOption {
  code: string;
  name: string;
}

interface Props {
  counties: CountyOption[];
  onChapterCreated?: () => void;
}

export default function ChapterManagerModal({ counties, onChapterCreated }: Props) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    countyCode: "037",
    meetingVenue: "",
    meetingSchedule: "",
    description: "",
  });

  function autoSlug(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    setForm((prev) => ({ ...prev, name, slug }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/v1/chapters", {
        name: form.name,
        slug: form.slug || `chapter-${Date.now()}`,
        countyCode: form.countyCode,
        meetingVenue: form.meetingVenue || null,
        meetingSchedule: form.meetingSchedule || null,
        description: form.description || null,
        status: "active",
      });

      addToast("success", "Chapter Established", `${form.name} is now chartered.`);
      setIsOpen(false);
      setForm({
        name: "",
        slug: "",
        countyCode: "037",
        meetingVenue: "",
        meetingSchedule: "",
        description: "",
      });
      if (onChapterCreated) onChapterCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create chapter";
      addToast("danger", "Charter Failed", msg);
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
        <Plus size={16} /> Charter New Chapter
      </button>

      <GlassModal
        show={isOpen}
        onHide={() => !isSubmitting && setIsOpen(false)}
        title="Charter New Community Chapter"
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
              Charter Chapter
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <FormField
                label="Chapter Name"
                placeholder="e.g. Vihiga Central Chapter"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => autoSlug(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">County</label>
                <select
                  className="form-select glass-input"
                  value={form.countyCode}
                  onChange={(e) => setForm({ ...form, countyCode: e.target.value })}
                >
                  {counties.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Meeting Venue"
                placeholder="e.g. Mbale Social Hall"
                value={form.meetingVenue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, meetingVenue: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Meeting Schedule"
                placeholder="e.g. Second Saturday of every month at 2:00 PM"
                value={form.meetingSchedule}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, meetingSchedule: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Chapter Mandate & Geographic Scope
                </label>
                <textarea
                  className="form-control glass-input"
                  rows={3}
                  placeholder="Outline the chapter's objectives, community focus, and leadership structure..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>
      </GlassModal>
    </>
  );
}

