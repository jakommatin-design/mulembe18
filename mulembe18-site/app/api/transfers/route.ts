import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET() {
  try {
    await initDatabaseSchema();
    const transfers = await query("SELECT * FROM chapter_transfers ORDER BY created_at DESC LIMIT 50");
    return NextResponse.json({ success: true, transfers });
  } catch (error: any) {
    console.error("[Transfers API] GET error:", error?.message || error);
    return NextResponse.json({ success: false, transfers: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, currentChapter, targetChapter, reason } = body;

    if (!fullName || !phone || !targetChapter) {
      return NextResponse.json(
        { success: false, message: "Full name, phone, and receiving chapter are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    await query(
      `INSERT INTO chapter_transfers (full_name, phone, current_chapter, target_chapter, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Pending Approval')`,
      [fullName, phone, currentChapter || "Mombasa Chapter", targetChapter, reason || "Relocation"]
    );

    return NextResponse.json({
      success: true,
      message: "Transfer request submitted to receiving chapter administrator.",
    });
  } catch (error: any) {
    console.error("[Transfers API] POST error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, approvedBy } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID and Status are required" }, { status: 400 });
    }

    await initDatabaseSchema();

    await query(
      "UPDATE chapter_transfers SET status = ?, approved_by = ? WHERE id = ?",
      [status, approvedBy || "Chapter Admin", id]
    );

    return NextResponse.json({ success: true, message: `Transfer request marked as ${status}` });
  } catch (error: any) {
    console.error("[Transfers API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

