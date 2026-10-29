import { NextResponse } from "next/server";
import { query, initDatabaseSchema } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const scope = searchParams.get("scope");
    const clan = searchParams.get("clan");
    const county = searchParams.get("county");
    const ward = searchParams.get("ward");

    await initDatabaseSchema();

    let sql = "SELECT * FROM events WHERE status != 'Cancelled'";
    const params: any[] = [];

    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }

    if (scope && scope !== "All") {
      sql += " AND scope = ?";
      params.push(scope);
    }

    if (clan && clan !== "All") {
      sql += " AND (target_clan = ? OR target_clan = 'All')";
      params.push(clan);
    }

    if (county && county !== "All") {
      sql += " AND (county_code = ? OR scope = 'National')";
      params.push(county);
    }

    if (ward) {
      sql += " AND (ward_estate LIKE ? OR ward_estate IS NULL)";
      params.push(`%${ward}%`);
    }

    sql += " ORDER BY is_featured DESC, created_at DESC LIMIT 50";

    const events = await query(sql, params);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error("[Events API] GET error:", error?.message || error);
    return NextResponse.json(
      { success: false, events: [], error: error?.message || "Failed to fetch events" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      eventDate,
      day,
      dow,
      month,
      time,
      venue,
      category,
      entryFee,
      description,
      imageUrl,
      isFeatured,
      scope,
      targetClan,
      targetGroup,
      countyCode,
      subCounty,
      wardEstate,
      clanGroupId,
    } = body;

    if (!title || !venue || !category) {
      return NextResponse.json(
        { success: false, message: "Title, Venue, and Category are required" },
        { status: 400 }
      );
    }

    await initDatabaseSchema();

    const result = await query(
      `INSERT INTO events 
        (title, event_date, day, dow, month, time, venue, category, entryFee, description, image_url, is_featured, scope, target_clan, target_group, county_code, sub_county, ward_estate, clan_group_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        eventDate || `${month || "APR"} ${day || "26"}`,
        day || "",
        dow || "",
        month || "",
        time || "10:00 AM – 5:00 PM",
        venue,
        category,
        entryFee || "Free",
        description || "",
        imageUrl || "/images/events-cultural.png",
        isFeatured ? 1 : 0,
        scope || "County",
        targetClan || "All",
        targetGroup || "All",
        countyCode || "001",
        subCounty || null,
        wardEstate || null,
        clanGroupId || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      result,
    });
  } catch (error: any) {
    console.error("[Events API] POST error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, venue, time, category, day, dow, month, description, attendees, isFeatured, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();

    // If just an RSVP count update
    if (attendees !== undefined && !title) {
      await query("UPDATE events SET attendees = attendees + 1 WHERE id = ?", [id]);
      return NextResponse.json({ success: true, message: "RSVP registered successfully" });
    }

    await query(
      `UPDATE events
       SET title = COALESCE(?, title),
           venue = COALESCE(?, venue),
           time = COALESCE(?, time),
           category = COALESCE(?, category),
           day = COALESCE(?, day),
           dow = COALESCE(?, dow),
           month = COALESCE(?, month),
           description = COALESCE(?, description),
           is_featured = COALESCE(?, is_featured),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title, venue, time, category, day, dow, month, description, isFeatured !== undefined ? (isFeatured ? 1 : 0) : null, status, id]
    );

    return NextResponse.json({ success: true, message: "Event updated successfully" });
  } catch (error: any) {
    console.error("[Events API] PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
    }

    await initDatabaseSchema();
    await query("DELETE FROM events WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("[Events API] DELETE error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete event" }, { status: 500 });
  }
}
