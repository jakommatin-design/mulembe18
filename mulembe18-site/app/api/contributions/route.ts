import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDatabaseSchema();
    const { searchParams } = new URL(req.url);
    const clanGroupId = searchParams.get("clanGroupId");
    const county = searchParams.get("county");
    const type = searchParams.get("type");

    let sql = `
      SELECT 
        cb.*,
        cg.group_name AS clan_group_name,
        cg.clan_name,
        c.name AS county_name
      FROM contributions cb
      LEFT JOIN clan_groups cg ON cb.clan_group_id = cg.id
      LEFT JOIN counties c ON cb.county_code = c.code
      WHERE 1=1
    `;
    const params: any[] = [];

    if (clanGroupId && clanGroupId !== "all") {
      sql += " AND cb.clan_group_id = ?";
      params.push(clanGroupId);
    }

    if (county && county !== "all") {
      sql += " AND cb.county_code = ?";
      params.push(county);
    }

    if (type && type !== "all") {
      sql += " AND cb.contribution_type = ?";
      params.push(type);
    }

    sql += " ORDER BY cb.created_at DESC LIMIT 100";

    const contributions = await query(sql, params);

    const [totalRow]: any = await query(
      "SELECT COALESCE(SUM(amount), 0) AS totalReserve FROM contributions WHERE status = 'Completed'"
    );

    const [monthlyRow]: any = await query(
      "SELECT COALESCE(SUM(amount), 0) AS monthlyTotal FROM contributions WHERE status = 'Completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );

    return NextResponse.json({
      success: true,
      contributions,
      totalReserve: Number(totalRow?.totalReserve) || 0,
      monthlyCollection: Number(monthlyRow?.monthlyTotal) || 0,
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
    const {
      memberName,
      phone,
      amount,
      purpose,
      memberId,
      clanGroupId,
      countyCode,
      contributionType,
      cadence,
      forPeriod,
    } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and Amount are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const mpesaCode = `MLMB${Math.floor(100000 + Math.random() * 900000)}`;
    const receiptNo = `RCT-${Math.floor(10000 + Math.random() * 90000)}`;
    const parsedAmount = Number(amount) || 0;
    const resolvedType = contributionType || (purpose?.toLowerCase().includes("month") ? "Monthly_Dues" : "Annual_Subscription");
    const resolvedPeriod = forPeriod || new Date().toISOString().substring(0, 7); // '2026-10'

    await query(
      `INSERT INTO contributions 
        (receipt_no, mpesa_code, member_name, phone, amount, purpose, status, member_id, clan_group_id, county_code, contribution_type, cadence, for_period, destination_ledger)
       VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiptNo,
        mpesaCode,
        memberName || "Anonymous Member",
        phone,
        parsedAmount,
        purpose || "Monthly Clan Welfare Dues",
        memberId || null,
        clanGroupId || 1,
        countyCode || "001",
        resolvedType,
        cadence || "Monthly",
        resolvedPeriod,
        clanGroupId ? "Clan_Cell" : "County_Welfare",
      ]
    );

    // If linked to a clan group, increment clan cell balance
    if (clanGroupId) {
      try {
        await query(
          "UPDATE clan_groups SET current_balance = current_balance + ? WHERE id = ?",
          [parsedAmount, clanGroupId]
        );
      } catch (err) {
        console.warn("[Contributions API] Clan balance update deferred:", err);
      }
    }

    // If linked to a member and paying monthly or annual dues, update member's dues status
    if (memberId || phone) {
      try {
        const updateSql = memberId
          ? "UPDATE members SET dues_status = 'Up_To_Date', dues_paid_through_month = ? WHERE id = ?"
          : "UPDATE members SET dues_status = 'Up_To_Date', dues_paid_through_month = ? WHERE phone = ?";
        const updateParams = memberId ? [resolvedPeriod, memberId] : [resolvedPeriod, phone];
        await query(updateSql, updateParams);
      } catch (err) {
        console.warn("[Contributions API] Member dues status update deferred:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Contribution recorded and credited to clan ledger successfully",
      mpesaCode,
      receiptNo,
      forPeriod: resolvedPeriod,
    });
  } catch (error: any) {
    console.error("[Contributions API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to record contribution" },
      { status: 500 }
    );
  }
}
