import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET() {
  try {
    await initDatabaseSchema();
    const rows = await query("SELECT * FROM election_candidates WHERE status = 'Active' ORDER BY votes DESC");

    const candidates = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      clan: r.clan,
      position: r.position,
      chapter: r.chapter,
      manifesto: r.manifesto,
      votes: Number(r.votes) || 0,
    }));

    return NextResponse.json({ success: true, candidates });
  } catch (error: any) {
    console.error("[Elections API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, candidates: [], error: error?.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized — please sign in to vote" }, { status: 401 });
    }

    const body = await req.json();
    const { candidateId } = body;

    if (!candidateId) {
      return NextResponse.json({ success: false, message: "Candidate ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("UPDATE election_candidates SET votes = votes + 1 WHERE id = ?", [candidateId]);

    return NextResponse.json({ success: true, message: "Vote cast successfully" });
  } catch (error: any) {
    console.error("[Elections API] POST error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to vote" }, { status: 500 });
  }
}

