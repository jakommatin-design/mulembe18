"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";

interface CountyOption {
  code: string;
  name: string;
}

interface Props {
  counties: CountyOption[];
}

export default function ContactForm({ counties }: Props) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    countyCode: "047",
    category: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate submission network handshake
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSuccess(true);
      addToast(
        "success",
        "Enquiry Received",
        "Thank you. Your message has been dispatched to the National Secretariat desk."
      );
    } catch {
      addToast("danger", "Submission Failed", "Could not send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="glass-panel p-5 text-center">
        <CheckCircle2 size={56} className="text-success mb-3" />
        <h3 className="fw-bold mb-2">Message Dispatched</h3>
        <p className="text-secondary mb-4">
          The Mulembe National Secretariat or respective County Coordinator will review your
          inquiry and respond within 24 to 48 business hours.
        </p>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              fullName: "",
              phone: "",
              email: "",
              countyCode: "047",
              category: "general",
              message: "",
            });
          }}
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-4 p-md-5">
      <h3 className="fw-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>
        Send an Official Communication
      </h3>
      <p className="text-secondary small mb-4">
        Direct your questions, chapter formation requests, or welfare assistance petitions to the
        governance desk.
      </p>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <FormField
            label="Full Legal Name"
            name="fullName"
            placeholder="e.g. Wycliffe Wafula"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <FormField
            label="Contact Phone (Kenyan MSISDN)"
            name="phone"
            placeholder="+254712345678"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            helperText="e.g. +254XXXXXXXXX"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="wafula@example.com"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <div className="mb-3">
            <label className="form-label small text-secondary fw-semibold">
              Relevant County
            </label>
            <select
              className="form-select glass-input"
              value={formData.countyCode}
              onChange={(e) => setFormData({ ...formData, countyCode: e.target.value })}
            >
              {counties.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label small text-secondary fw-semibold">
              Inquiry Nature
            </label>
            <select
              className="form-select glass-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="general">General Membership & Identification Inquiry</option>
              <option value="chapter">New Chapter Inception / Charter Application</option>
              <option value="welfare">Emergency Welfare & Mutual Aid Consultation</option>
              <option value="cultural">Elder Council & Cultural Preservation Advisory</option>
              <option value="press">Media & Press Relations</option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="mb-3">
            <label className="form-label small text-secondary fw-semibold">
              Message or Petition Summary
            </label>
            <textarea
              className="form-control glass-input"
              rows={4}
              placeholder="State your details clearly, including chapter or location references..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
        <span className="small text-secondary">
          Protected under Kenya Data Protection Act 2019
        </span>
        <button
          type="submit"
          className="btn btn-gold d-inline-flex align-items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spinner-border spinner-border-sm" />
              Transmitting...
            </>
          ) : (
            <>
              <Send size={16} /> Submit Communication
            </>
          )}
        </button>
      </div>
    </form>
  );
}

