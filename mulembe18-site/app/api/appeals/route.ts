import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { query, initDatabaseSchema } from "@/lib/db";

// GET — fetch all appeals (active ones first)
export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS welfare_appeals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        description TEXT NULL,
        goal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        family_name VARCHAR(191) NULL,
        location VARCHAR(191) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const appeals = await query(
      "SELECT * FROM welfare_appeals ORDER BY is_active DESC, created_at DESC LIMIT 20"
    );
    return NextResponse.json({ success: true, appeals });
  } catch (error: any) {
    console.error("[Appeals API] GET error:", error?.message);
    return NextResponse.json({ success: false, appeals: [] }, { status: 200 });
  }
}

// POST — admin creates a new appeal
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const adminCheck = await query("SELECT role FROM members WHERE clerk_id = ? LIMIT 1", [userId]);
    if (!adminCheck[0] || (adminCheck[0] as any).role !== "admin") return NextResponse.json({ success: false, message: "Forbidden — Admin only" }, { status: 403 });

    const body = await req.json();
    const { title, description, goalAmount, raisedAmount, familyName, location } = body;

    if (!title || !goalAmount) {
      return NextResponse.json(
        { success: false, message: "Title and Goal Amount are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();
    await query(
      `INSERT INTO welfare_appeals (title, description, goal_amount, raised_amount, family_name, location, is_active, status)
       VALUES (?, ?, ?, ?, ?, ?, TRUE, 'Active')`,
      [title, description || "", Number(goalAmount), Number(raisedAmount) || 0, familyName || "", location || ""]
    );

    return NextResponse.json({ success: true, message: "Appeal created successfully" });
  } catch (error: any) {
    console.error("[Appeals API] POST error:", error?.message);
    return NextResponse.json({ success: false, message: error?.message || "Failed to create appeal" }, { status: 500 });
  }
}

// PUT — update appeal (raised amount, status, close it)
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, raisedAmount, status, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    if (raisedAmount !== undefined) {
      await query("UPDATE welfare_appeals SET raised_amount = ? WHERE id = ?", [Number(raisedAmount), id]);
    }
    if (status !== undefined) {
      await query("UPDATE welfare_appeals SET status = ? WHERE id = ?", [status, id]);
    }
    if (isActive !== undefined) {
      await query("UPDATE welfare_appeals SET is_active = ? WHERE id = ?", [isActive ? 1 : 0, id]);
    }

    return NextResponse.json({ success: true, message: "Appeal updated successfully" });
  } catch (error: any) {
    console.error("[Appeals API] PUT error:", error?.message);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update" }, { status: 500 });
  }
}

// DELETE — remove an appeal
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const adminCheck = await query("SELECT role FROM members WHERE clerk_id = ? LIMIT 1", [userId]);
    if (!adminCheck[0] || (adminCheck[0] as any).role !== "admin") return NextResponse.json({ success: false, message: "Forbidden — Admin only" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM welfare_appeals WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Appeal deleted successfully" });
  } catch (error: any) {
    console.error("[Appeals API] DELETE error:", error?.message);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete" }, { status: 500 });
  }
}
