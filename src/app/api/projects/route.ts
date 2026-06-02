import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/projects - Fetch all projects (or user specific projects)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    let res;
    if (role === "superadmin") {
      res = await query(`
        SELECT 
          p.id, 
          p.name, 
          p.client_name as "clientName", 
          p.notes, 
          p.created_at as "createdAt",
          COUNT(i.id)::int as "imageCount",
          COUNT(CASE WHEN i.status = 'success' THEN 1 END)::int as "successCount"
        FROM projects p
        LEFT JOIN images i ON p.id = i.project_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);
    } else {
      res = await query(`
        SELECT 
          p.id, 
          p.name, 
          p.client_name as "clientName", 
          p.notes, 
          p.created_at as "createdAt",
          COUNT(i.id)::int as "imageCount",
          COUNT(CASE WHEN i.status = 'success' THEN 1 END)::int as "successCount"
        FROM projects p
        LEFT JOIN images i ON p.id = i.project_id
        WHERE p.user_id = $1
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `, [userId ? parseInt(userId) : 0]);
    }
    
    return NextResponse.json({ projects: res.rows });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const { name, clientName, notes, userId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO projects (name, client_name, notes, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, client_name as "clientName", notes, created_at as "createdAt"`,
      [name, clientName || "", notes || "", userId ? parseInt(userId) : 1]
    );

    const project = res.rows[0];
    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
