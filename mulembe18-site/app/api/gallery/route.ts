import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { query, initDatabaseSchema } from "@/lib/db";
import { normalizeImageUrl } from "@/lib/image-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    await initDatabaseSchema();

    let sql = "SELECT * FROM gallery_items WHERE status = 'Published'";
    const params: any[] = [];

    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }

    sql += " ORDER BY sort_order ASC, created_at DESC LIMIT 50";

    const photos = await query(sql, params);
    return NextResponse.json({ success: true, photos });
  } catch (error: any) {
    console.error("[Gallery API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, photos: [], error: error?.message || "Failed to fetch gallery" },
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
    const { imageUrl, albumUrl, label, category, subLocation, isLarge, sortOrder } = body;

    if (!imageUrl && !albumUrl) {
      return NextResponse.json(
        { success: false, message: "Please provide either an image URL or a Google Photos Album link" },
        { status: 400 }
      );
    }

    const effectiveImageUrl = normalizeImageUrl(imageUrl, "/images/events-cultural.png");
    const effectiveLabel = label || "Mulembe18 Gallery Moment";
    const effectiveCategory = category || "Cultural Festival";

    await initDatabaseSchema();

    await query(
      `INSERT INTO gallery_items (image_url, album_url, label, category, sub_location, is_large, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        effectiveImageUrl,
        albumUrl || null,
        effectiveLabel,
        effectiveCategory,
        subLocation || "Mama Ngina Waterfront, Mombasa",
        Boolean(isLarge),
        Number(sortOrder) || 0,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Gallery photo added successfully",
    });
  } catch (error: any) {
    console.error("[Gallery API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add photo" },
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
    const { id, imageUrl, albumUrl, label, category, subLocation, isLarge, sortOrder, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Photo ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    const effectiveImageUrl = normalizeImageUrl(imageUrl, "/images/events-cultural.png");

    await query(
      `UPDATE gallery_items
       SET image_url = ?,
           album_url = ?,
           label = ?,
           category = ?,
           sub_location = ?,
           is_large = ?,
           sort_order = ?,
           status = ?
       WHERE id = ?`,
      [
        effectiveImageUrl,
        albumUrl || null,
        label || "Mulembe18 Gallery Moment",
        category || "Cultural Festival",
        subLocation || "Mama Ngina Waterfront, Mombasa",
        Boolean(isLarge) ? 1 : 0,
        Number(sortOrder) || 0,
        status || "Published",
        id,
      ]
    );

    return NextResponse.json({ success: true, message: "Gallery photo updated successfully" });
  } catch (error: any) {
    console.error("[Gallery API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update photo" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Photo ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM gallery_items WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Gallery photo deleted successfully" });
  } catch (error: any) {
    console.error("[Gallery API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete photo" }, { status: 500 });
  }
}
