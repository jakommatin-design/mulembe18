import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { query, initDatabaseSchema } from "@/lib/db";
import { normalizeImageUrl } from "@/lib/image-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    await initDatabaseSchema();

    let sql = "SELECT * FROM news_articles WHERE status = 'Published'";
    const params: any[] = [];

    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }

    sql += " ORDER BY created_at DESC LIMIT 50";

    const articles = await query(sql, params);
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error("[News API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, articles: [], error: error?.message || "Failed to fetch articles" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const adminCheck = await query("SELECT role FROM members WHERE clerk_id = ? LIMIT 1", [userId]);
    if (!adminCheck[0] || (adminCheck[0] as any).role !== "admin") return NextResponse.json({ success: false, message: "Forbidden — Admin only" }, { status: 403 });

    const body = await req.json();
    const { title, category, summary, content, date, readTime, imageUrl, author } = body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { success: false, message: "Title, Category, and Content are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const formattedDate = date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const cleanImageUrl = normalizeImageUrl(imageUrl, "/images/landing-hero.png");

    const result = await query(
      `INSERT INTO news_articles (title, category, summary, content, date, read_time, image_url, author)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        summary || content.slice(0, 160) + "...",
        content,
        formattedDate,
        readTime || "3 min read",
        cleanImageUrl,
        author || "Mulembe Secretariat",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Communiqué published successfully",
      result,
    });
  } catch (error: any) {
    console.error("[News API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to publish article" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const adminCheck = await query("SELECT role FROM members WHERE clerk_id = ? LIMIT 1", [userId]);
    if (!adminCheck[0] || (adminCheck[0] as any).role !== "admin") return NextResponse.json({ success: false, message: "Forbidden — Admin only" }, { status: 403 });

    const body = await req.json();
    const { id, title, category, summary, content, status, imageUrl, author } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Article ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    const cleanImageUrl = normalizeImageUrl(imageUrl, "/images/landing-hero.png");

    await query(
      `UPDATE news_articles
       SET title = ?,
           category = ?,
           summary = ?,
           content = ?,
           image_url = ?,
           author = ?,
           status = ?
       WHERE id = ?`,
      [
        title || "Mulembe18 Communiqué",
        category || "Announcements",
        summary || (content ? content.slice(0, 160) + "..." : ""),
        content || "",
        cleanImageUrl,
        author || "Mulembe Secretariat",
        status || "Published",
        id,
      ]
    );

    return NextResponse.json({ success: true, message: "Article updated successfully" });
  } catch (error: any) {
    console.error("[News API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const adminCheck = await query("SELECT role FROM members WHERE clerk_id = ? LIMIT 1", [userId]);
    if (!adminCheck[0] || (adminCheck[0] as any).role !== "admin") return NextResponse.json({ success: false, message: "Forbidden — Admin only" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Article ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM news_articles WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("[News API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete article" }, { status: 500 });
  }
}
