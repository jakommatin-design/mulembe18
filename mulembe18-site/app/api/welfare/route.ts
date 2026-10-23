import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await initDatabaseSchema();

    let sql = "SELECT * FROM welfare_claims WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "All") {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC LIMIT 50";

    const claims = await query(sql, params);
    return NextResponse.json({ success: true, claims });
  } catch (error: any) {
    console.error("[Welfare API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, claims: [], error: error?.message || "Failed to fetch claims" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claimantName, subClan, residentialZone, claimType, amount, description } = body;

    if (!claimantName || !claimType || !amount) {
      return NextResponse.json(
        { success: false, message: "Claimant Name, Claim Type, and Amount are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const claimNo = `CLM-${Math.floor(100 + Math.random() * 900)}`;

    const result = await query(
      `INSERT INTO welfare_claims (claim_no, claimant_name, sub_clan, residential_zone, claim_type, amount, status, description)
       VALUES (?, ?, ?, ?, ?, ?, 'Under Review', ?)`,
      [
        claimNo,
        claimantName,
        subClan || "Unspecified",
        residentialZone || "Mombasa",
        claimType,
        Number(amount) || 0,
        description || "",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Emergency welfare claim submitted successfully",
      claimNo,
      result,
    });
  } catch (error: any) {
    console.error("[Welfare API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to submit claim" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Claim ID and Status are required" }, { status: 400 });
    }

    await initDatabaseSchema();

    await query("UPDATE welfare_claims SET status = ? WHERE id = ? OR claim_no = ?", [status, id, id]);

    return NextResponse.json({ success: true, message: `Claim status updated to ${status}` });
  } catch (error: any) {
    console.error("[Welfare API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update claim" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Claim ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM welfare_claims WHERE id = ? OR claim_no = ?", [id, id]);

    return NextResponse.json({ success: true, message: "Claim deleted successfully" });
  } catch (error: any) {
    console.error("[Welfare API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete claim" }, { status: 500 });
  }
}
