import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/projects/[id] - Fetch details of a single project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const projectRes = await query(
      `SELECT id, name, client_name as "clientName", notes, created_at as "createdAt" FROM projects WHERE id = $1`,
      [projectId]
    );

    if (projectRes.rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const imageRes = await query(
      `SELECT id, original_filename as "originalFilename", output_filename as "outputFilename", file_size as "fileSize", status, latitude, longitude, business_name as "businessName", keywords, created_at as "createdAt" 
       FROM images WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ 
      project: projectRes.rows[0],
      images: imageRes.rows
    });
  } catch (error: any) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project details" }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a project and all associated logs
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const res = await query(`DELETE FROM projects WHERE id = $1 RETURNING id`, [projectId]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
