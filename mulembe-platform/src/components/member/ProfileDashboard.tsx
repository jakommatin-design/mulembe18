"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Building,
  Calendar,
  Shield,
  Download,
  Trash2,
  Edit3,
  LogOut,
  MapPin,
  Loader2,
} from "lucide-react";
import MemberIdCard from "./MemberIdCard";
import GlassModal from "@/components/ui/GlassModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";

interface UserProfile {
  id: string;
  membershipId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  nationalId: string | null;
  gender: string | null;
  clan: string | null;
  ancestralCountyCode: string | null;
  currentCountyCode: string | null;
  role: string;
  status: string;
  createdAt: string | Date;
}

interface ChapterAffiliation {
  id: string;
  chapterId: string;
  role: string;
  status: string;
  joinedAt: string | Date;
  chapterName: string;
  chapterSlug: string;
  chapterCounty: string;
  meetingVenue: string | null;
}

interface UserRsvp {
  id: string;
  eventId: string;
  status: string;
  guestsCount: number;
  eventTitle: string;
  eventSlug: string;
  eventCategory: string;
  startTime: string | Date;
  venueName: string;
}

interface ChapterOption {
  id: string;
  name: string;
  countyCode: string;
}

interface Props {
  initialUser: UserProfile;
  initialMembership: ChapterAffiliation | null;
  initialRsvps: UserRsvp[];
  availableChapters: ChapterOption[];
}

export default function ProfileDashboard({
  initialUser,
  initialMembership,
  initialRsvps,
  availableChapters,
}: Props) {
  const router = useRouter();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<"card" | "chapter" | "rsvps" | "privacy">("card");
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [membership, setMembership] = useState<ChapterAffiliation | null>(initialMembership);
  const [rsvps] = useState<UserRsvp[]>(initialRsvps);

  // Edit Profile State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    clan: user.clan || "",
    gender: (user.gender as "male" | "female" | "other") || "male",
    currentCountyCode: user.currentCountyCode || "047",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Chapter Join State
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(availableChapters[0]?.id || "");
  const [isJoining, setIsJoining] = useState(false);

  // Leave Chapter Dialog
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Delete Data Dialog (KDPA Right to Erasure)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export Data Loading State
  const [isExporting, setIsExporting] = useState(false);

  // Handle Edit Profile Submission
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await apiClient.put<UserProfile>("/api/v1/members/me", editForm);
      setUser(res.data);
      setIsEditOpen(false);
      addToast("success", "Profile Updated", "Your personal details have been updated.");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      addToast("danger", "Update Failed", msg);
    } finally {
      setIsUpdating(false);
    }
  }

  // Handle Join Chapter
  async function handleJoinChapter() {
    setIsJoining(true);
    try {
      const res = await apiClient.post<ChapterAffiliation>("/api/v1/members/chapters/join", {
        chapterId: selectedChapterId,
      });
      setMembership(res.data);
      setIsJoinOpen(false);
      addToast("success", "Chapter Affiliated", "You have joined the chapter!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to join chapter";
      addToast("danger", "Affiliation Failed", msg);
    } finally {
      setIsJoining(false);
    }
  }

  // Handle Leave Chapter
  async function handleLeaveChapter() {
    setIsLeaving(true);
    try {
      await apiClient.post("/api/v1/members/chapters/leave");
      setMembership(null);
      setIsLeaveOpen(false);
      addToast("info", "Left Chapter", "You have stepped down from this chapter.");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to leave chapter";
      addToast("danger", "Action Failed", msg);
    } finally {
      setIsLeaving(false);
    }
  }

  // Handle Export Personal Data (KDPA Right of Access)
  async function handleExportData() {
    setIsExporting(true);
    try {
      const res = await apiClient.get<Record<string, unknown>>("/api/v1/members/export");
      const jsonBlob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mulembe_member_dossier_${user.membershipId || user.id}.json`;
      a.click();
      URL.revokeObjectURL(url);

      addToast("success", "Dossier Downloaded", "Your full personal data archive has been exported.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export data";
      addToast("danger", "Export Failed", msg);
    } finally {
      setIsExporting(false);
    }
  }

  // Handle Delete Account (KDPA Right to Erasure)
  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await apiClient.delete("/api/v1/members/me");
      addToast("info", "Account Erased", "Your data has been removed in compliance with KDPA.");
      setIsDeleteOpen(false);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to erase account";
      addToast("danger", "Erasure Error", msg);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="d-flex gap-2 flex-wrap mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === "card" ? "btn-gold" : "btn-glass"}`}
          onClick={() => setActiveTab("card")}
        >
          <User size={16} className="me-1" /> Member Card & Profile
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === "chapter" ? "btn-gold" : "btn-glass"}`}
          onClick={() => setActiveTab("chapter")}
        >
          <Building size={16} className="me-1" /> Chapter Affiliation
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === "rsvps" ? "btn-gold" : "btn-glass"}`}
          onClick={() => setActiveTab("rsvps")}
        >
          <Calendar size={16} className="me-1" /> My Gatherings ({rsvps.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === "privacy" ? "btn-gold" : "btn-glass"}`}
          onClick={() => setActiveTab("privacy")}
        >
          <Shield size={16} className="me-1" /> KDPA Data Rights
        </button>
      </div>

      {/* Tab 1: Member Card & Identity */}
      {activeTab === "card" && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <MemberIdCard
              membershipId={user.membershipId}
              fullName={user.fullName}
              clan={user.clan}
              ancestralCounty={user.ancestralCountyCode}
              currentCounty={user.currentCountyCode}
              role={user.role}
              status={user.status}
              joinedAt={user.createdAt}
            />

            {!user.membershipId && (
              <div className="alert alert-warning mt-3 p-3 glass-card border-warning text-warning d-flex align-items-center justify-content-between">
                <span>Your registration is pending final onboarding confirmation.</span>
                <Link href="/onboarding" className="btn btn-sm btn-gold">
                  Complete Onboarding
                </Link>
              </div>
            )}
          </div>

          <div className="col-12 col-lg-5">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-light mb-0" style={{ fontFamily: "var(--font-serif)" }}>
                    Profile Attributes
                  </h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>

                <div className="d-flex flex-column gap-3 small text-secondary">
                  <div>
                    <span className="text-white-50 d-block">Full Legal Name</span>
                    <strong className="text-light fs-6">{user.fullName}</strong>
                  </div>

                  <div>
                    <span className="text-white-50 d-block">Phone Number</span>
                    <span className="text-light">{user.phone || "Not set"}</span>
                  </div>

                  <div>
                    <span className="text-white-50 d-block">Registered Email</span>
                    <span className="text-light">{user.email}</span>
                  </div>

                  <div>
                    <span className="text-white-50 d-block">Clan / Sub-Tribe</span>
                    <span className="text-light">{user.clan || "Unspecified"}</span>
                  </div>

                  <div>
                    <span className="text-white-50 d-block">Current County of Residence</span>
                    <span className="text-light">County {user.currentCountyCode || "047"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
                Protected by Clerk & synced to TiDB Cloud.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chapter Affiliation */}
      {activeTab === "chapter" && (
        <div className="glass-panel p-4 p-md-5">
          {membership ? (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1 mb-2">
                    Active Membership
                  </span>
                  <h3 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                    {membership.chapterName}
                  </h3>
                  <span className="small text-secondary">
                    County {membership.chapterCounty} &bull; Joined{" "}
                    {new Date(membership.joinedAt).toLocaleDateString("en-KE", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <Link href={`/chapters/${membership.chapterSlug}`} className="btn btn-sm btn-glass">
                    View Chapter Page
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                    onClick={() => setIsLeaveOpen(true)}
                  >
                    <LogOut size={14} /> Leave Chapter
                  </button>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="glass-card p-4">
                    <span className="small text-secondary d-block">Designated Meeting Venue</span>
                    <strong className="text-light fs-5 d-flex align-items-center gap-2 mt-1">
                      <MapPin size={18} className="text-warning" />
                      {membership.meetingVenue || "Chapter Designated Hall"}
                    </strong>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="glass-card p-4">
                    <span className="small text-secondary d-block">Member Privileges</span>
                    <span className="text-light d-block mt-1">
                      Voting Rights &bull; Monthly Assemblies &bull; Local Welfare Pooling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Building size={48} className="text-warning mb-3" />
              <h4 className="fw-bold text-light mb-2">Not Affiliated With a Chapter</h4>
              <p className="text-secondary small mx-auto mb-4" style={{ maxWidth: 460 }}>
                Joining a local chapter connects you directly to monthly community assemblies,
                bereavement benevolent aid, and leadership elections in your area.
              </p>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => setIsJoinOpen(true)}
              >
                Join a Community Chapter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Event RSVPs */}
      {activeTab === "rsvps" && (
        <div>
          {rsvps.length === 0 ? (
            <div className="glass-panel p-5 text-center">
              <Calendar size={48} className="text-secondary mb-3" />
              <h4 className="fw-bold text-light mb-2">No Event RSVPs Yet</h4>
              <p className="text-secondary small mb-4">
                You haven&apos;t reserved seats for any upcoming community gatherings yet.
              </p>
              <Link href="/events" className="btn btn-gold">
                Browse Community Calendar
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {rsvps.map((rsvp) => (
                <div key={rsvp.id} className="col-12 col-md-6">
                  <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small">
                          {rsvp.eventCategory}
                        </span>
                        <span className="badge bg-success bg-opacity-25 text-success small text-capitalize">
                          {rsvp.status}
                        </span>
                      </div>
                      <h5 className="fw-bold text-light mb-2">{rsvp.eventTitle}</h5>
                      <div className="small text-secondary d-flex flex-column gap-1 mb-3">
                        <span className="d-flex align-items-center gap-2">
                          <Calendar size={14} className="text-warning" />
                          {new Date(rsvp.startTime).toLocaleDateString("en-KE", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="d-flex align-items-center gap-2">
                          <MapPin size={14} className="text-warning" />
                          {rsvp.venueName}
                        </span>
                        {rsvp.guestsCount > 0 && (
                          <span>Additional Guests: +{rsvp.guestsCount}</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/events/${rsvp.eventSlug}`}
                      className="btn btn-sm btn-glass w-100 text-center"
                    >
                      View Event Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: KDPA Data Rights & Privacy */}
      {activeTab === "privacy" && (
        <div className="glass-panel p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <Shield size={32} className="text-success" />
            <div>
              <h4 className="fw-bold text-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                Kenya Data Protection Act (2019) Self-Service
              </h4>
              <p className="small text-secondary mb-0">
                You retain complete sovereign ownership of your data submitted to the platform.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Download size={20} className="text-warning" />
                    <h5 className="fw-bold text-light mb-0">Right of Access (Data Export)</h5>
                  </div>
                  <p className="small text-secondary mb-4">
                    Download an uncompressed, machine-readable JSON archive containing your full
                    personal profile, membership history, and event attendance records.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-gold d-inline-flex align-items-center justify-content-center gap-2 w-100"
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 size={16} className="spinner-border spinner-border-sm" />
                  ) : (
                    <Download size={16} />
                  )}
                  Export Personal Dossier
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between border-danger border-opacity-25">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Trash2 size={20} className="text-danger" />
                    <h5 className="fw-bold text-light mb-0">Right to Erasure (Data Deletion)</h5>
                  </div>
                  <p className="small text-secondary mb-4">
                    Permanently delete your profile, sever chapter memberships, and anonymize your
                    records across all Mulembe National databases.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger d-inline-flex align-items-center justify-content-center gap-2 w-100"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 size={16} /> Request Account Deletion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <GlassModal
        show={isEditOpen}
        onHide={() => !isUpdating && setIsEditOpen(false)}
        title="Edit Personal Information"
        size="lg"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-glass"
              onClick={() => setIsEditOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 size={16} className="spinner-border spinner-border-sm" />}
              Save Changes
            </button>
          </div>
        }
      >
        <form onSubmit={handleUpdateProfile}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <FormField
                label="Full Legal Name"
                value={editForm.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Primary Phone Number"
                value={editForm.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                helperText="Format: +254XXXXXXXXX"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormField
                label="Clan / Sub-Tribe"
                value={editForm.clan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditForm({ ...editForm, clan: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">Gender</label>
                <select
                  className="form-select glass-input"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      gender: e.target.value as "male" | "female" | "other",
                    })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </GlassModal>

      {/* Join Chapter Modal */}
      <GlassModal
        show={isJoinOpen}
        onHide={() => !isJoining && setIsJoinOpen(false)}
        title="Select Community Chapter"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-glass"
              onClick={() => setIsJoinOpen(false)}
              disabled={isJoining}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-gold d-inline-flex align-items-center gap-2"
              onClick={handleJoinChapter}
              disabled={isJoining}
            >
              {isJoining && <Loader2 size={16} className="spinner-border spinner-border-sm" />}
              Confirm Affiliation
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small text-secondary fw-semibold">
            Choose Your Local Chapter
          </label>
          <select
            className="form-select glass-input"
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
          >
            {availableChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name} (County {ch.countyCode})
              </option>
            ))}
          </select>
          <div className="form-text text-secondary small mt-2">
            You will receive chapter meeting notifications and can participate in elections.
          </div>
        </div>
      </GlassModal>

      {/* Leave Chapter Confirmation Dialog */}
      <ConfirmDialog
        show={isLeaveOpen}
        onHide={() => setIsLeaveOpen(false)}
        title="Leave Current Chapter?"
        message="Are you sure you want to step down from this chapter? You can re-affiliate with another chapter at any time."
        confirmLabel="Leave Chapter"
        confirmVariant="danger"
        onConfirm={handleLeaveChapter}
        isLoading={isLeaving}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        show={isDeleteOpen}
        onHide={() => setIsDeleteOpen(false)}
        title="Permanent Account & Data Erasure"
        message="Warning: This action is irreversible. In compliance with the Kenya Data Protection Act 2019, your identity and personal records will be completely scrubbed."
        confirmLabel="Erase My Account"
        confirmVariant="danger"
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </div>
  );
}

