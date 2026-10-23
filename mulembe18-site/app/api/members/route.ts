import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clan = searchParams.get("clan");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM members WHERE 1=1";
    const params: any[] = [];

    if (clan && clan !== "all") {
      sql += " AND sub_clan = ?";
      params.push(clan);
    }

    if (search) {
      sql += " AND (full_name LIKE ? OR profession LIKE ? OR residential_zone LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += " ORDER BY created_at DESC LIMIT 100";

    const members = await query(sql, params);
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    // If database table is not initialized yet, attempt init
    await initDatabaseSchema();
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
      `INSERT INTO members (clerk_id, full_name, email, phone, sub_clan, residential_zone, profession, field, membership_no, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Member registered successfully",
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
    const { id, status, role, subClan, residentialZone, profession } = body;

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
           profession = COALESCE(?, profession)
       WHERE id = ?`,
      [status, role, subClan, residentialZone, profession, id]
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
