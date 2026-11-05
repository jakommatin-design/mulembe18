"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, UserCheck, Loader2 } from "lucide-react";
import GlassModal from "@/components/ui/GlassModal";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface Props {
  eventId: string;
  eventTitle: string;
}

export default function EventRsvpButton({ eventId, eventTitle }: Props) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { addToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"attending" | "tentative" | "declined">("attending");
  const [guestsCount, setGuestsCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleOpen() {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push(`/sign-in?redirectUrl=/events`);
      return;
    }
    setIsOpen(true);
  }

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post(`/api/v1/events/${eventId}/rsvp`, {
        status,
        guestsCount: Number(guestsCount) || 0,
      });

      setIsSuccess(true);
      addToast(
        "success",
        "RSVP Confirmed",
        `Your RSVP (${status}) for "${eventTitle}" has been saved.`
      );
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to record RSVP.";
      addToast("danger", "RSVP Error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn btn-gold btn-lg w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
      >
        <UserCheck size={20} />
        RSVP for this Event
      </button>

      <GlassModal
        show={isOpen}
        onHide={() => !isSubmitting && setIsOpen(false)}
        title="Event RSVP Confirmation"
        size="md"
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
              onClick={handleRsvpSubmit}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting && <Loader2 size={16} className="spinner-border spinner-border-sm" />}
              {isSuccess ? "Confirmed!" : "Submit RSVP"}
            </button>
          </div>
        }
      >
        {isSuccess ? (
          <div className="text-center py-4">
            <CheckCircle2 size={48} className="text-success mb-3" />
            <h5 className="fw-bold">RSVP Recorded</h5>
            <p className="text-secondary small mb-0">
              We look forward to hosting you at {eventTitle}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit}>
            <div className="mb-3">
              <label className="form-label small text-secondary fw-semibold">
                Will you attend this gathering?
              </label>
              <div className="d-flex flex-column gap-2">
                <label className="p-3 glass-card rounded d-flex align-items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rsvpStatus"
                    value="attending"
                    checked={status === "attending"}
                    onChange={() => setStatus("attending")}
                    className="form-check-input"
                  />
                  <div>
                    <strong className="d-block text-light">Yes, I will attend</strong>
                    <span className="small text-secondary">
                      Reserve my seat and send me meeting reminders.
                    </span>
                  </div>
                </label>

                <label className="p-3 glass-card rounded d-flex align-items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rsvpStatus"
                    value="tentative"
                    checked={status === "tentative"}
                    onChange={() => setStatus("tentative")}
                    className="form-check-input"
                  />
                  <div>
                    <strong className="d-block text-light">Maybe / Tentative</strong>
                    <span className="small text-secondary">
                      I hope to attend depending on schedule.
                    </span>
                  </div>
                </label>

                <label className="p-3 glass-card rounded d-flex align-items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rsvpStatus"
                    value="declined"
                    checked={status === "declined"}
                    onChange={() => setStatus("declined")}
                    className="form-check-input"
                  />
                  <div>
                    <strong className="d-block text-light">Unable to attend</strong>
                    <span className="small text-secondary">
                      Regretfully convey apologies for this date.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {status === "attending" && (
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Accompanying Family or Guests (Optional)
                </label>
                <select
                  className="form-select glass-input"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                >
                  <option value={0}>Just myself (0 additional guests)</option>
                  <option value={1}>1 additional guest</option>
                  <option value={2}>2 additional guests</option>
                  <option value={3}>3 additional guests</option>
                  <option value={4}>4 additional guests</option>
                </select>
                <div className="form-text text-secondary small">
                  Assists chapter organizers in arranging catering and seating capacity.
                </div>
              </div>
            )}
          </form>
        )}
      </GlassModal>
    </>
  );
}

