import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/settings - Fetch saved location presets
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Fetch locations matching current user OR global admin templates (user_id = 1)
    const res = await query(
      "SELECT id, name, lat::float, lng::float, city FROM saved_locations WHERE user_id = $1 OR user_id = 1 ORDER BY name ASC",
      [userId ? parseInt(userId) : 1]
    );

    return NextResponse.json({ locations: res.rows });
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch saved locations" }, { status: 500 });
  }
}

// POST /api/settings - Save a new coordinate preset shortcut
export async function POST(req: NextRequest) {
  try {
    const { name, lat, lng, city, userId } = await req.json();

    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Name, latitude, and longitude are required parameters" }, { status: 400 });
    }

    const res = await query(
      "INSERT INTO saved_locations (name, lat, lng, city, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, lat::float, lng::float, city",
      [name, parseFloat(lat), parseFloat(lng), city || "", userId ? parseInt(userId) : 1]
    );

    return NextResponse.json({ location: res.rows[0] });
  } catch (error: any) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Failed to save preset location" }, { status: 500 });
  }
}

// DELETE /api/settings - Remove a coordinate preset shortcut
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Preset ID parameter is required" }, { status: 400 });
    }

    await query("DELETE FROM saved_locations WHERE id = $1", [parseInt(id)]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/settings error:", error);
    return NextResponse.json({ error: "Failed to delete preset location" }, { status: 500 });
  }
}
