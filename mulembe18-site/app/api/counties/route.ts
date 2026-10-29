import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDatabaseSchema();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");

    let sql = `
      SELECT 
        c.code, 
        c.name, 
        c.region_zone, 
        c.is_active,
        ch.slug,
        ch.chapter_name,
        ch.charter_status,
        ch.patron_name,
        ch.contact_phone,
        ch.mpesa_paybill_till,
        (SELECT COUNT(*) FROM members m WHERE m.residential_county_code = c.code) AS resident_members_count,
        (SELECT COUNT(*) FROM members m WHERE m.birth_county_code = c.code) AS native_birth_members_count,
        (SELECT COUNT(*) FROM clan_groups cg WHERE cg.county_code = c.code) AS active_clan_cells_count
      FROM counties c
      LEFT JOIN chapters ch ON c.code = ch.county_code
      WHERE 1=1
    `;
    const params: any[] = [];

    if (region && region !== "all") {
      sql += " AND c.region_zone = ?";
      params.push(region);
    }

    sql += " ORDER BY c.code ASC";

    const counties = await query(sql, params);

    return NextResponse.json({
      success: true,
      counties,
    });
  } catch (error: any) {
    console.error("[Counties API] Error:", error?.message || error);
    return NextResponse.json(
      { success: false, counties: [], message: error?.message || "Failed to fetch counties" },
      { status: 500 }
    );
  }
}
