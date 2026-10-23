import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";
import { normalizeImageUrl } from "@/lib/image-utils";

export async function GET() {
  try {
    await initDatabaseSchema();
    const leaders = await query(
      "SELECT * FROM leadership_members WHERE status = 'Active' ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json({ success: true, leaders });
  } catch (error: any) {
    console.error("[Leadership API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, leaders: [], error: error?.message || "Failed to fetch leadership" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, clan, phone, email, bio, avatarUrl, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Full Name is required for executive leader" },
        { status: 400 }
      );
    }

    const effectiveRole = role || "Executive Committee Member";
    const effectiveClan = clan || "Luhya Sub-Clan";
    const cleanAvatarUrl = avatarUrl ? normalizeImageUrl(avatarUrl, "") : null;

    await initDatabaseSchema();

    await query(
      `INSERT INTO leadership_members (name, role, clan, phone, email, bio, avatar_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        effectiveRole,
        effectiveClan,
        phone || null,
        email || null,
        bio || null,
        cleanAvatarUrl,
        Number(sortOrder) || 0,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Leader added successfully",
    });
  } catch (error: any) {
    console.error("[Leadership API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add leader" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, role, clan, phone, email, bio, avatarUrl, sortOrder, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Leader ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    const cleanAvatarUrl = avatarUrl ? normalizeImageUrl(avatarUrl, "") : null;

    await query(
      `UPDATE leadership_members
       SET name = ?,
           role = ?,
           clan = ?,
           phone = ?,
           email = ?,
           bio = ?,
           avatar_url = ?,
           sort_order = ?,
           status = ?
       WHERE id = ?`,
      [
        name || "Executive Committee Member",
        role || "Executive Committee Member",
        clan || "Luhya Sub-Clan",
        phone || null,
        email || null,
        bio || null,
        cleanAvatarUrl,
        Number(sortOrder) || 0,
        status || "Active",
        id,
      ]
    );

    return NextResponse.json({ success: true, message: "Leader updated successfully" });
  } catch (error: any) {
    console.error("[Leadership API] PUT error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update leader" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Leader ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM leadership_members WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Leader deleted successfully" });
  } catch (error: any) {
    console.error("[Leadership API] DELETE error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete leader" },
      { status: 500 }
    );
  }
}
