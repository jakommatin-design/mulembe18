/**
 * Privacy & Data Protection Masking Utilities
 *
 * Implements KDPA (2019) data minimization and unauthorized scraping protection.
 */

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  if (cleaned.length >= 10) {
    const prefix = cleaned.slice(0, 6); // e.g. +25471
    const suffix = cleaned.slice(-2);   // e.g. 78
    return `${prefix}****${suffix}`;
  }
  return "****";
}

export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
}

export function maskNationalId(id: string | null | undefined): string {
  if (!id) return "";
  const cleaned = id.trim();
  if (cleaned.length >= 4) {
    return `***${cleaned.slice(-4)}`;
  }
  return "****";
}

