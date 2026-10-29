import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDatabaseSchema();
    const { searchParams } = new URL(req.url);
    const county = searchParams.get("county");
    const clan = searchParams.get("clan");
    const search = searchParams.get("search");

    let sql = `
      SELECT 
        cg.*,
        c.name AS county_name,
        c.region_zone,
        (SELECT COUNT(*) FROM members m WHERE m.clan_group_id = cg.id) AS member_count,
        (SELECT COUNT(*) FROM members m WHERE m.clan_group_id = cg.id AND m.dues_status = 'Up_To_Date') AS paid_up_members_count,
        (SELECT COALESCE(SUM(cb.amount), 0) FROM contributions cb WHERE cb.clan_group_id = cg.id AND cb.status = 'Completed') AS total_funds_collected
      FROM clan_groups cg
      LEFT JOIN counties c ON cg.county_code = c.code
      WHERE 1=1
    `;
    const params: any[] = [];

    if (county && county !== "all") {
      sql += " AND cg.county_code = ?";
      params.push(county);
    }

    if (clan && clan !== "all") {
      sql += " AND cg.clan_name = ?";
      params.push(clan);
    }

    if (search) {
      sql += " AND (cg.group_name LIKE ? OR cg.sub_county LIKE ? OR cg.ward_estate LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += " ORDER BY cg.county_code ASC, cg.group_name ASC";

    const clanGroups = await query(sql, params);

    return NextResponse.json({
      success: true,
      clanGroups,
    });
  } catch (error: any) {
    console.error("[Clan Groups API] GET Error:", error?.message || error);
    return NextResponse.json(
      { success: false, clanGroups: [], message: error?.message || "Failed to fetch clan groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await initDatabaseSchema();
    const body = await req.json();
    const {
      groupName,
      clanName,
      countyCode,
      subCounty,
      wardEstate,
      monthlyDues,
      annualDues,
    } = body;

    if (!groupName || !clanName || !countyCode) {
      return NextResponse.json(
        { success: false, message: "Group Name, Clan Name, and County Code are required" },
        { status: 400 }
      );
    }

    const groupCode = `${countyCode}-${clanName.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const result: any = await query(
      `INSERT INTO clan_groups 
        (group_code, group_name, clan_name, county_code, sub_county, ward_estate, monthly_dues, annual_dues, current_balance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0.00)`,
      [
        groupCode,
        groupName,
        clanName,
        countyCode,
        subCounty || null,
        wardEstate || null,
        Number(monthlyDues) || 200.00,
        Number(annualDues) || 1200.00,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Clan welfare group registered successfully",
      groupId: result.insertId,
      groupCode,
    });
  } catch (error: any) {
    console.error("[Clan Groups API] POST Error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create clan group" },
      { status: 500 }
    );
  }
}
