import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clan = searchParams.get("clan");
    const search = searchParams.get("search");
    const residentialCounty = searchParams.get("residentialCounty");
    const birthCounty = searchParams.get("birthCounty");
    const clanGroupId = searchParams.get("clanGroupId");
    const duesStatus = searchParams.get("duesStatus");

    await initDatabaseSchema();

    let sql = `
      SELECT 
        m.*,
        rc.name AS residential_county_name,
        bc.name AS birth_county_name,
        cg.group_name AS clan_group_name,
        cg.monthly_dues AS clan_monthly_dues
      FROM members m
      LEFT JOIN counties rc ON m.residential_county_code = rc.code
      LEFT JOIN counties bc ON m.birth_county_code = bc.code
      LEFT JOIN clan_groups cg ON m.clan_group_id = cg.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (clan && clan !== "all") {
      sql += " AND m.sub_clan = ?";
      params.push(clan);
    }

    if (residentialCounty && residentialCounty !== "all") {
      sql += " AND m.residential_county_code = ?";
      params.push(residentialCounty);
    }

    if (birthCounty && birthCounty !== "all") {
      sql += " AND m.birth_county_code = ?";
      params.push(birthCounty);
    }

    if (clanGroupId && clanGroupId !== "all") {
      sql += " AND m.clan_group_id = ?";
      params.push(clanGroupId);
    }

    if (duesStatus && duesStatus !== "all") {
      sql += " AND m.dues_status = ?";
      params.push(duesStatus);
    }

    if (search) {
      sql += " AND (m.full_name LIKE ? OR m.profession LIKE ? OR m.residential_zone LIKE ? OR m.ancestral_village LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += " ORDER BY m.created_at DESC LIMIT 150";

    const members = await query(sql, params);
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("[Members API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, members: [], message: error?.message || "Database connecting" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      subClan,
      residentialZone,
      profession,
      field,
      clerkId,
      bio,
      residentialCountyCode,
      residentialSubCounty,
      residentialWard,
      birthCountyCode,
      birthSubCounty,
      ancestralVillage,
      clanGroupId,
    } = body;

    if (!fullName || !phone || !subClan) {
      return NextResponse.json(
        { success: false, message: "Full Name, Phone, and Sub-Clan are required" },
        { status: 400 }
      );
    }

    const membershipNo = `M18-${Math.floor(1000 + Math.random() * 9000)}`;

    await initDatabaseSchema();

    await query(
      `INSERT INTO members 
        (clerk_id, full_name, email, phone, sub_clan, residential_zone, profession, field, membership_no, bio,
         residential_county_code, residential_sub_county, residential_ward,
         birth_county_code, birth_sub_county, ancestral_village,
         clan_group_id, dues_status, dues_paid_through_month)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Up_To_Date', ?)`,
      [
        clerkId || null,
        fullName,
        email || null,
        phone,
        subClan,
        residentialZone || "Mombasa",
        profession || "Community Member",
        field || "General",
        membershipNo,
        bio || "",
        residentialCountyCode || "001",
        residentialSubCounty || "Nyali",
        residentialWard || residentialZone || "Bamburi",
        birthCountyCode || "037",
        birthSubCounty || "Lurambi",
        ancestralVillage || "Home Village",
        clanGroupId || 1,
        new Date().toISOString().substring(0, 7),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Member registered successfully with dual-origin tracing",
      membershipNo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, role, subClan, residentialZone, profession, duesStatus, clanGroupId } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    await query(
      `UPDATE members
       SET status = COALESCE(?, status),
           role = COALESCE(?, role),
           sub_clan = COALESCE(?, sub_clan),
           residential_zone = COALESCE(?, residential_zone),
           profession = COALESCE(?, profession),
           dues_status = COALESCE(?, dues_status),
           clan_group_id = COALESCE(?, clan_group_id)
       WHERE id = ?`,
      [status, role, subClan, residentialZone, profession, duesStatus, clanGroupId, id]
    );

    return NextResponse.json({ success: true, message: "Member updated successfully" });
  } catch (error: any) {
    console.error("[Members API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM members WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Member removed successfully" });
  } catch (error: any) {
    console.error("[Members API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete member" }, { status: 500 });
  }
}
