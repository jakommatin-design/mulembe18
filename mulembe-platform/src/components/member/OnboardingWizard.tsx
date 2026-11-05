"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface County {
  code: string;
  name: string;
}

interface SubCounty {
  id: string;
  name: string;
}

interface Ward {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  countyCode: string;
  meetingVenue: string | null;
}

interface Props {
  initialCounties: County[];
  initialChapters: Chapter[];
  defaultEmail?: string;
  defaultName?: string;
}

const STORAGE_KEY = "mulembe_onboarding_draft";

export default function OnboardingWizard({
  initialCounties,
  initialChapters,
  defaultEmail = "",
  defaultName = "",
}: Props) {
  const router = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState(() => {
    const defaultData = {
      fullName: defaultName,
      email: defaultEmail,
      phone: "",
      nationalId: "",
      gender: "male" as "male" | "female" | "other",
      clan: "",
      ancestralCountyCode: "037",
      currentCountyCode: "037",
      subCountyId: "",
      wardId: "",
      chapterId: initialChapters[0]?.id || "",
      kdpaConsent: false,
    };
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...defaultData, ...JSON.parse(saved) };
        }
      } catch {
        // Ignore
      }
    }
    return defaultData;
  });

  // Persist draft to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // Ignore quota errors
    }
  }, [formData]);

  // Load Sub-Counties when current county changes
  useEffect(() => {
    if (!formData.currentCountyCode) return;
    let isMounted = true;

    async function fetchSubCounties() {
      setIsLoadingGeo(true);
      try {
        const res = await fetch(`/api/v1/geo/counties/${formData.currentCountyCode}/sub-counties`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setSubCounties(data.data);
        }
      } catch {
        // Ignore
      } finally {
        if (isMounted) setIsLoadingGeo(false);
      }
    }

    void fetchSubCounties();

    return () => {
      isMounted = false;
    };
  }, [formData.currentCountyCode]);

  // Load Wards when subCountyId changes
  useEffect(() => {
    let isMounted = true;

    if (formData.subCountyId) {
      fetch(`/api/v1/geo/sub-counties/${formData.subCountyId}/wards`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success && Array.isArray(data.data)) {
            setWards(data.data);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [formData.subCountyId]);

  // Step 1 Validation
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errs.fullName = "Full name must be at least 2 characters";
    }
    if (!/^\+254\d{9}$/.test(formData.phone)) {
      errs.phone = "Phone must be in valid format: +254XXXXXXXXX";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Step 2 Validation
  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.ancestralCountyCode) {
      errs.ancestralCountyCode = "Ancestral county is required";
    }
    if (!formData.currentCountyCode) {
      errs.currentCountyCode = "Current county is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Step 3 Validation
  function validateStep3(): boolean {
    return true; // Chapter is optional or selected
  }

  // Final Submit
  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.kdpaConsent) {
      setErrors({ kdpaConsent: "Explicit consent is mandatory under the Kenya Data Protection Act" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await apiClient.post("/api/v1/members/register", {
        fullName: formData.fullName,
        phone: formData.phone,
        nationalId: formData.nationalId || null,
        gender: formData.gender,
        clan: formData.clan || null,
        ancestralCountyCode: formData.ancestralCountyCode,
        currentCountyCode: formData.currentCountyCode,
        chapterId: formData.chapterId || null,
        kdpaConsent: true,
      });

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);

      addToast("success", "Registration Complete", "Welcome to the Mulembe National Platform!");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please check inputs.";
      addToast("danger", "Registration Error", msg);
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps = [
    { num: 1, title: "Personal Details", icon: <User size={18} /> },
    { num: 2, title: "Location & Heritage", icon: <MapPin size={18} /> },
    { num: 3, title: "Chapter Choice", icon: <Building size={18} /> },
    { num: 4, title: "Consent & Review", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="glass-panel p-4 p-md-5">
      {/* Step Indicator Tracker */}
      <div className="d-flex justify-content-between align-items-center mb-5 position-relative">
        {steps.map((s) => (
          <div key={s.num} className="d-flex flex-column align-items-center position-relative z-1">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mb-2 fw-bold transition-all ${
                step === s.num
                  ? "bg-warning text-dark shadow-lg"
                  : step > s.num
                    ? "bg-success text-white"
                    : "glass-card text-secondary border-secondary"
              }`}
              style={{ width: 42, height: 42 }}
            >
              {step > s.num ? <CheckCircle2 size={20} /> : s.icon}
            </div>
            <span
              className={`small text-center d-none d-md-block ${
                step === s.num ? "text-light fw-bold" : "text-secondary"
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {errors.form && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div>
          <h4 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Step 1: Personal Identification
          </h4>
          <p className="small text-secondary mb-4">
            Enter your official details for the national Luhya registry.
          </p>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <FormField
                label="Full Legal Name"
                name="fullName"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                error={errors.fullName}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Primary Phone Number"
                name="phone"
                placeholder="+2547XXXXXXXX"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                helperText="Must be format +254XXXXXXXXX for SMS notices"
                error={errors.phone}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <FormField
                label="National ID / Passport (Optional)"
                name="nationalId"
                placeholder="e.g. 12345678"
                value={formData.nationalId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, nationalId: e.target.value })
                }
                helperText="Used for electoral eligibility verification"
              />
            </div>

            <div className="col-12 col-md-4">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Gender</label>
                <select
                  className="form-select glass-input"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as "male" | "female" | "other",
                    })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <FormField
                label="Clan / Sub-Tribe (Optional)"
                name="clan"
                placeholder="e.g. Abashitsetse, Bayemba, Tachoni"
                value={formData.clan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, clan: e.target.value })
                }
                helperText="Helps map cultural genealogy"
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4 pt-3 border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
            >
              Continue to Location <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location & Heritage */}
      {step === 2 && (
        <div>
          <h4 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Step 2: Geographic & Ancestral Roots
          </h4>
          <p className="small text-secondary mb-4">
            Specify your ancestral county for ID prefix generation, and your current county for
            local chapter allocation.
          </p>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Ancestral County (Western Kenya Roots)
                </label>
                <select
                  className="form-select glass-input"
                  value={formData.ancestralCountyCode}
                  onChange={(e) =>
                    setFormData({ ...formData, ancestralCountyCode: e.target.value })
                  }
                >
                  {initialCounties.map((c) => (
                    <option key={`anc_${c.code}`} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <div className="form-text text-secondary small">
                  Your Membership ID will carry this county prefix (e.g. MLB-{formData.ancestralCountyCode}-XXXXX)
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Current County of Residence
                </label>
                <select
                  className="form-select glass-input"
                  value={formData.currentCountyCode}
                  onChange={(e) =>
                    setFormData({ ...formData, currentCountyCode: e.target.value })
                  }
                >
                  {initialCounties.map((c) => (
                    <option key={`curr_${c.code}`} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cascading Sub-County & Ward */}
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold d-flex align-items-center justify-content-between">
                  <span>Sub-County / Constituency</span>
                  {isLoadingGeo && <Loader2 size={14} className="spinner-border spinner-border-sm" />}
                </label>
                <select
                  className="form-select glass-input"
                  value={formData.subCountyId}
                  onChange={(e) => setFormData({ ...formData, subCountyId: e.target.value })}
                  disabled={subCounties.length === 0}
                >
                  {subCounties.length === 0 ? (
                    <option value="">County Central / General</option>
                  ) : (
                    subCounties.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Electoral Ward (Optional)
                </label>
                <select
                  className="form-select glass-input"
                  value={formData.wardId}
                  onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                  disabled={wards.length === 0}
                >
                  {wards.length === 0 ? (
                    <option value="">Ward General</option>
                  ) : (
                    wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4 pt-3 border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="btn btn-glass d-inline-flex align-items-center gap-2"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={() => {
                if (validateStep2()) setStep(3);
              }}
            >
              Continue to Chapter <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Chapter Choice */}
      {step === 3 && (
        <div>
          <h4 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Step 3: Chapter Affiliation
          </h4>
          <p className="small text-secondary mb-4">
            Select your preferred chapter fellowship. You can participate in monthly gatherings and
            local welfare drives.
          </p>

          <div className="row g-3">
            {initialChapters.map((ch) => (
              <div key={ch.id} className="col-12 col-md-6">
                <label
                  className={`p-4 glass-card rounded d-flex align-items-start gap-3 cursor-pointer h-100 ${
                    formData.chapterId === ch.id ? "border-warning bg-warning bg-opacity-10" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="chapterSelection"
                    value={ch.id}
                    checked={formData.chapterId === ch.id}
                    onChange={() => setFormData({ ...formData, chapterId: ch.id })}
                    className="form-check-input mt-1"
                  />
                  <div>
                    <strong className="text-light d-block mb-1">{ch.name}</strong>
                    <span className="small text-warning d-block mb-1">
                      County {ch.countyCode}
                    </span>
                    <span className="small text-secondary d-block">
                      {ch.meetingVenue ? `Meets at: ${ch.meetingVenue}` : "Designated Community Hall"}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between mt-4 pt-3 border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="btn btn-glass d-inline-flex align-items-center gap-2"
              onClick={() => setStep(2)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={() => {
                if (validateStep3()) setStep(4);
              }}
            >
              Review & Consent <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Consent & Review */}
      {step === 4 && (
        <form onSubmit={handleFinalSubmit}>
          <h4 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Step 4: Review Details & KDPA Consent
          </h4>
          <p className="small text-secondary mb-4">
            Review your registration summary before finalizing your official membership card.
          </p>

          {/* Summary Box */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold text-light mb-3">Registration Dossier Summary</h5>
            <div className="row g-3 small">
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Full Legal Name:</span>
                <strong className="text-light">{formData.fullName}</strong>
              </div>
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Contact Phone:</span>
                <strong className="text-light">{formData.phone}</strong>
              </div>
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Gender & Clan:</span>
                <strong className="text-light">
                  {formData.gender} {formData.clan ? `(${formData.clan})` : ""}
                </strong>
              </div>
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Ancestral Roots:</span>
                <strong className="text-warning">County {formData.ancestralCountyCode}</strong>
              </div>
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Current Residence:</span>
                <strong className="text-light">County {formData.currentCountyCode}</strong>
              </div>
              <div className="col-6 col-md-4">
                <span className="text-secondary d-block">Selected Chapter:</span>
                <strong className="text-light">
                  {initialChapters.find((c) => c.id === formData.chapterId)?.name || "Not Specified"}
                </strong>
              </div>
            </div>
          </div>

          {/* Legal Consent Box */}
          <div className="p-4 rounded glass-panel mb-4 border border-warning border-opacity-25">
            <div className="form-check">
              <input
                type="checkbox"
                id="kdpaCheckbox"
                checked={formData.kdpaConsent}
                onChange={(e) => setFormData({ ...formData, kdpaConsent: e.target.checked })}
                className="form-check-input"
                required
              />
              <label htmlFor="kdpaCheckbox" className="form-check-label small text-light ps-2">
                <strong>Kenya Data Protection Act (KDPA 2019) Explicit Consent:</strong>
                <p className="text-secondary mt-1 mb-0">
                  I hereby grant explicit consent to the Mulembe National Platform Secretariat to
                  process, store, and utilize my submitted personal information exclusively for
                  community roll verification, emergency mutual aid allocation, and chapter
                  governance notices. I understand that my data will never be commercialized and
                  that I reserve the right to access, export, or delete my data at any time via my
                  profile dashboard.
                </p>
              </label>
            </div>
            {errors.kdpaConsent && (
              <div className="text-danger small mt-2">{errors.kdpaConsent}</div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4 pt-3 border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="btn btn-glass d-inline-flex align-items-center gap-2"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="submit"
              className="btn btn-gold btn-lg d-inline-flex align-items-center gap-2 shadow-lg"
              disabled={isSubmitting || !formData.kdpaConsent}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner-border spinner-border-sm" />
                  Generating Membership ID...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Complete National Registration
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

