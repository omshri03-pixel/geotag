import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE() {
  try {
    const res = await query(`DELETE FROM images RETURNING id`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Cleared ${res.rowCount} processed image logs successfully.` 
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/clean error:", error);
    return NextResponse.json({ error: "Failed to clear database logs" }, { status: 500 });
  }
}
