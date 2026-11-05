import { LegacyMember, CleanedMember, MigrationConflict } from "./types";

// Standard Kenyan 47 county lookup dictionary
export const COUNTY_NAME_TO_CODE: Record<string, string> = {
  mombasa: "001",
  kwale: "002",
  kilifi: "003",
  "tana river": "004",
  lamu: "005",
  "taita taveta": "006",
  garissa: "007",
  wajir: "008",
  mandera: "009",
  marsabit: "010",
  isiolo: "011",
  meru: "012",
  "tharaka-nithi": "013",
  embu: "014",
  kitui: "015",
  machakos: "016",
  makueni: "017",
  nyandarua: "018",
  nyeri: "019",
  kirinyaga: "020",
  "murang'a": "021",
  kiambu: "022",
  turkana: "023",
  "west pokot": "024",
  samburu: "025",
  "trans nzoia": "026",
  "trans-nzoia": "026",
  "uasin gishu": "027",
  "elgeyo marakwet": "028",
  nandi: "029",
  baringo: "030",
  laikipia: "031",
  nakuru: "032",
  narok: "033",
  kajiado: "034",
  kericho: "035",
  bomet: "036",
  kakamega: "037",
  vihiga: "038",
  bungoma: "039",
  busia: "040",
  siaya: "041",
  kisumu: "042",
  homa_bay: "043",
  "homa bay": "043",
  migori: "044",
  kisii: "045",
  nyamira: "046",
  nairobi: "047",
};

/**
 * Sanitizes and normalizes phone numbers to standard E.164 (+254XXXXXXXXX).
 * Accepts formats: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +254XXXXXXXXX, etc.
 */
export function sanitizeKenyanPhone(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;

  // Strip spaces, dashes, parentheses
  let cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, "").trim();

  // If starts with +, check if Kenyan
  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith("254")) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // Must now be 9 digits starting with 7 or 1 (e.g. 712345678 or 112345678)
  if (!/^[17]\d{8}$/.test(cleaned)) {
    return null;
  }

  return `+254${cleaned}`;
}

/**
 * Normalizes email address to lowercase and trimmed string.
 */
export function sanitizeEmail(rawEmail: string | null | undefined): string | null {
  if (!rawEmail) return null;
  const cleaned = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Resolves a county string (name or number) to official 3-digit code (001 to 047).
 */
export function resolveCountyCode(rawCounty: string | null | undefined, fallback = "037"): string {
  if (!rawCounty) return fallback;

  const trimmed = rawCounty.trim().toLowerCase();

  // If already 3 digits (e.g. "037")
  if (/^\d{3}$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (num >= 1 && num <= 47) return trimmed;
  }

  // If 1 or 2 digits (e.g. "37" -> "037")
  if (/^\d{1,2}$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (num >= 1 && num <= 47) {
      return num.toString().padStart(3, "0");
    }
  }

  // Name match
  if (COUNTY_NAME_TO_CODE[trimmed]) {
    return COUNTY_NAME_TO_CODE[trimmed];
  }

  return fallback;
}

/**
 * Maps legacy role names to new 7-role system.
 */
export function mapLegacyRole(rawRole: string | null | undefined): CleanedMember["role"] {
  if (!rawRole) return "member";
  const lower = rawRole.trim().toLowerCase();

  if (["superadmin", "super_admin", "developer"].includes(lower)) {
    return "super_admin";
  }
  if (["admin", "national_admin", "national_executive"].includes(lower)) {
    return "national_admin";
  }
  if (["coordinator", "county_coordinator"].includes(lower)) {
    return "county_coordinator";
  }
  if (["chair", "chairperson", "leader", "chapter_chair"].includes(lower)) {
    return "chapter_chair";
  }
  if (["secretary", "chapter_secretary"].includes(lower)) {
    return "chapter_secretary";
  }

  return "member";
}

/**
 * Cleans and deduplicates a batch of legacy member records.
 */
export function cleanAndDeduplicateMembers(legacyMembers: LegacyMember[]): {
  cleanedMembers: CleanedMember[];
  conflicts: MigrationConflict[];
} {
  const cleanedMembers: CleanedMember[] = [];
  const conflicts: MigrationConflict[] = [];

  const seenEmails = new Map<string, CleanedMember>();
  const seenPhones = new Map<string, CleanedMember>();

  for (const m of legacyMembers) {
    const fullName = m.full_name?.trim();
    if (!fullName || fullName.length < 2) {
      conflicts.push({
        type: "missing_name",
        legacyId: m.id,
        identifier: String(m.id),
        reason: "Member record has no valid full name",
        data: m,
      });
      continue;
    }

    const email = sanitizeEmail(m.email);
    if (!email) {
      conflicts.push({
        type: "invalid_email",
        legacyId: m.id,
        identifier: m.email || "empty",
        reason: `Invalid or missing email: "${m.email}"`,
        data: m,
      });
      continue;
    }

    const phone = sanitizeKenyanPhone(m.phone);
    if (!phone) {
      conflicts.push({
        type: "invalid_phone",
        legacyId: m.id,
        identifier: m.phone || "empty",
        reason: `Invalid Kenyan phone number format: "${m.phone}" (requires +254 7XX/1XX format)`,
        data: m,
      });
      continue;
    }

    // Check for email collision
    if (seenEmails.has(email)) {
      conflicts.push({
        type: "duplicate_email",
        legacyId: m.id,
        identifier: email,
        reason: `Email already imported from legacy record ${seenEmails.get(email)!.id}`,
        data: m,
      });
      continue;
    }

    // Check for phone collision
    if (seenPhones.has(phone)) {
      conflicts.push({
        type: "duplicate_phone",
        legacyId: m.id,
        identifier: phone,
        reason: `Phone already imported from legacy record ${seenPhones.get(phone)!.id}`,
        data: m,
      });
      continue;
    }

    const currentCounty = resolveCountyCode(
      m.residential_county_code || m.residential_county,
      "047" // default Nairobi
    );

    const ancestralCounty = resolveCountyCode(
      m.birth_county_code || m.birth_county,
      "037" // default Kakamega
    );

    const cleaned: CleanedMember = {
      id: String(m.id),
      clerkId: m.clerk_id || `legacy_user_${m.id}`,
      fullName,
      email,
      phone,
      clan: m.sub_clan?.trim() || m.clan?.trim() || null,
      currentCountyCode: currentCounty,
      ancestralCountyCode: ancestralCounty,
      role: mapLegacyRole(m.role),
      status: m.status?.toLowerCase() === "suspended" ? "suspended" : "active",
      chapterSlug: m.chapter_name ? m.chapter_name.toLowerCase().replace(/\s+/g, "-") : undefined,
      createdAt: m.created_at ? new Date(m.created_at) : new Date(),
    };

    seenEmails.set(email, cleaned);
    seenPhones.set(phone, cleaned);
    cleanedMembers.push(cleaned);
  }

  return { cleanedMembers, conflicts };
}

