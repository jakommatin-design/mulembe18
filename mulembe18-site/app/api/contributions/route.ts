import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET() {
  try {
    await initDatabaseSchema();

    const contributions = await query(
      "SELECT * FROM contributions ORDER BY created_at DESC LIMIT 50"
    );

    const [totalRow]: any = await query(
      "SELECT COALESCE(SUM(amount), 0) AS totalReserve FROM contributions WHERE status = 'Completed'"
    );

    const [monthlyRow]: any = await query(
      "SELECT COALESCE(SUM(amount), 0) AS monthlyTotal FROM contributions WHERE status = 'Completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );

    // Return only actual DB totals — no fake baseline
    const dbTotal = Number(totalRow?.totalReserve) || 0;
    const dbMonthly = Number(monthlyRow?.monthlyTotal) || 0;

    return NextResponse.json({
      success: true,
      contributions,
      totalReserve: dbTotal,
      monthlyCollection: dbMonthly,
    });
  } catch (error: any) {
    console.error("[Contributions API] GET error:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        contributions: [],
        totalReserve: 0,
        monthlyCollection: 0,
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memberName, phone, amount, purpose } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and Amount are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const mpesaCode = `MLMB${Math.floor(100000 + Math.random() * 900000)}`;
    const receiptNo = `RCT-${Math.floor(10000 + Math.random() * 90000)}`;

    await query(
      `INSERT INTO contributions (receipt_no, mpesa_code, member_name, phone, amount, purpose, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Completed')`,
      [
        receiptNo,
        mpesaCode,
        memberName || "Anonymous Member",
        phone,
        Number(amount) || 0,
        purpose || "General Welfare",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Contribution recorded successfully",
      mpesaCode,
      receiptNo,
    });
  } catch (error: any) {
    console.error("[Contributions API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to record contribution" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID and status are required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("UPDATE contributions SET status = ? WHERE id = ?", [status, id]);

    return NextResponse.json({ success: true, message: `Contribution status updated to ${status}` });
  } catch (error: any) {
    console.error("[Contributions API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM contributions WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Contribution deleted successfully" });
  } catch (error: any) {
    console.error("[Contributions API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete" }, { status: 500 });
  }
}
