import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDatabaseSchema();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const chapter = searchParams.get("chapter");

    let sql = "SELECT * FROM community_notices WHERE status = 'Approved'";
    const params: any[] = [];

    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }

    if (chapter && chapter !== "All") {
      sql += " AND chapter = ?";
      params.push(chapter);
    }

    sql += " ORDER BY created_at DESC LIMIT 60";

    const rows = await query(sql, params);

    const notices = rows.map((r: any) => {
      let parsedTags: string[] = [];
      try {
        if (typeof r.tags === "string" && r.tags.startsWith("[")) {
          parsedTags = JSON.parse(r.tags);
        } else if (typeof r.tags === "string") {
          parsedTags = r.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
        }
      } catch {
        parsedTags = [];
      }

      return {
        id: String(r.id),
        category: r.category,
        title: r.title,
        chapter: r.chapter,
        location: r.location,
        author: r.author,
        authorClan: r.author_clan,
        phone: r.phone,
        postedDate: r.posted_date || "Recently",
        details: r.details,
        priceOrSalary: r.price_or_salary,
        tags: parsedTags,
        status: r.status,
      };
    });

    return NextResponse.json({ success: true, notices });
  } catch (error: any) {
    console.error("[Notices API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, notices: [], error: error?.message || "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      category,
      title,
      chapter,
      location,
      author,
      authorClan,
      phone,
      details,
      priceOrSalary,
      tags,
    } = body;

    if (!title || !details || !phone) {
      return NextResponse.json(
        { success: false, message: "Title, Details, and Phone number are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : (tags ? [tags] : []));
    const postedDate = "Just now";

    const result = await query(
      `INSERT INTO community_notices 
        (category, title, chapter, location, author, author_clan, phone, posted_date, details, price_or_salary, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved')`,
      [
        category || "Business",
        title,
        chapter || "Mombasa Chapter",
        location || "Mombasa",
        author || "Verified Community Member",
        authorClan || "Luhya",
        phone,
        postedDate,
        details,
        priceOrSalary || "",
        tagsJson,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Notice posted successfully",
      result,
    });
  } catch (error: any) {
    console.error("[Notices API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to post notice" },
      { status: 500 }
    );
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
    await query("DELETE FROM community_notices WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Notice deleted" });
  } catch (error: any) {
    console.error("[Notices API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

