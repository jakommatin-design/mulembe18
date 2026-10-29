import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDatabaseSchema();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const county = searchParams.get("county");

    let sql = `
      SELECT 
        ch.id,
        ch.slug,
        ch.chapter_name AS name,
        ch.chapter_type AS type,
        ch.phase,
        CONCAT(c.name, ' (', c.code, ')') AS county,
        ch.county_code,
        COALESCE(ch.chairperson, 'Elder in Charge') AS chairperson,
        COALESCE(
          (SELECT COUNT(*) FROM members m WHERE m.residential_county_code = ch.county_code),
          ch.member_count
        ) AS membersCount,
        ch.events_quarterly AS eventsQuarterly,
        ch.ledger_balance AS ledgerBalance,
        COALESCE(ch.mpesa_paybill_till, '522522 (Acc: MULEMBE18)') AS mpesaPaybill,
        ch.charter_status AS status,
        ch.description,
        ch.wards_or_estates
      FROM chapters ch
      LEFT JOIN counties c ON ch.county_code = c.code
      WHERE 1=1
    `;
    const params: any[] = [];

    if (type && type !== "All") {
      sql += " AND ch.chapter_type = ?";
      params.push(type);
    }

    if (county && county !== "All") {
      sql += " AND ch.county_code = ?";
      params.push(county);
    }

    sql += " ORDER BY ch.phase ASC, ch.id ASC";

    const rows = await query(sql, params);

    const chapters = rows.map((r: any) => ({
      id: r.slug || String(r.id),
      dbId: r.id,
      name: r.name,
      type: r.type || "Core Expansion",
      phase: Number(r.phase) || 1,
      county: r.county || "Kenya",
      countyCode: r.county_code,
      chairperson: r.chairperson,
      membersCount: Number(r.membersCount) || 0,
      eventsQuarterly: Number(r.eventsQuarterly) || 4,
      ledgerBalance: r.ledgerBalance || "KES 1,200,000",
      mpesaPaybill: r.mpesaPaybill,
      status: r.status || "Active & Operating",
      description: r.description || "Active county chapter of the Mulembe18 national network.",
      wardsOrEstates: typeof r.wards_or_estates === "string" 
        ? r.wards_or_estates.split(",").map((w: string) => w.trim()).filter(Boolean)
        : ["Urban Core", "Rural Wards"],
    }));

    return NextResponse.json({ success: true, chapters });
  } catch (error: any) {
    console.error("[Chapters API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, chapters: [], error: error?.message || "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      countyCode,
      name,
      slug,
      type,
      phase,
      chairperson,
      contactPhone,
      contactEmail,
      mpesaPaybill,
      description,
      wardsOrEstates,
      ledgerBalance,
    } = body;

    if (!countyCode || !name) {
      return NextResponse.json(
        { success: false, message: "County Code and Chapter Name are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const chapterSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const wardsString = Array.isArray(wardsOrEstates) ? wardsOrEstates.join(", ") : wardsOrEstates || "";

    await query(
      `INSERT INTO chapters 
        (county_code, slug, chapter_name, chapter_type, phase, chairperson, contact_phone, contact_email, mpesa_paybill_till, description, wards_or_estates, ledger_balance, charter_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active & Operating')
       ON DUPLICATE KEY UPDATE
        chapter_name = VALUES(chapter_name),
        chairperson = VALUES(chairperson),
        contact_phone = VALUES(contact_phone),
        description = VALUES(description),
        wards_or_estates = VALUES(wards_or_estates),
        ledger_balance = VALUES(ledger_balance)`,
      [
        countyCode,
        chapterSlug,
        name,
        type || "Core Expansion",
        Number(phase) || 2,
        chairperson || "Elder in Charge",
        contactPhone || "+254 712 345 678",
        contactEmail || null,
        mpesaPaybill || `522522 (Acc: MULEMBE18-${countyCode})`,
        description || "",
        wardsString,
        ledgerBalance || "KES 500,000",
      ]
    );

    return NextResponse.json({ success: true, message: "Chapter recorded successfully" });
  } catch (error: any) {
    console.error("[Chapters API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create chapter" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, chairperson, ledgerBalance, charterStatus, eventsQuarterly, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Chapter ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    await query(
      `UPDATE chapters
       SET chairperson = COALESCE(?, chairperson),
           ledger_balance = COALESCE(?, ledger_balance),
           charter_status = COALESCE(?, charter_status),
           events_quarterly = COALESCE(?, events_quarterly),
           description = COALESCE(?, description)
       WHERE id = ? OR slug = ?`,
      [chairperson, ledgerBalance, charterStatus, eventsQuarterly, description, id, id]
    );

    return NextResponse.json({ success: true, message: "Chapter updated successfully" });
  } catch (error: any) {
    console.error("[Chapters API] PUT error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update chapter" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Chapter ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM chapters WHERE id = ? OR slug = ?", [id, id]);

    return NextResponse.json({ success: true, message: "Chapter removed" });
  } catch (error: any) {
    console.error("[Chapters API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete" }, { status: 500 });
  }
}

