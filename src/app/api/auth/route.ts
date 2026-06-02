import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, name, action } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check if user already exists
    const checkRes = await query("SELECT * FROM users WHERE email = $1", [trimmedEmail]);
    const existingUser = checkRes.rows[0];

    if (action === "signup") {
      if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists. Please login instead." }, { status: 400 });
      }

      // Automatically assign role
      let role = "user";
      let plan = "Free";

      if (trimmedEmail === "admin@buzzagency.com" || trimmedEmail.startsWith("admin@")) {
        role = "superadmin";
        plan = "Agency";
      }

      // Insert new user
      const insertRes = await query(
        "INSERT INTO users (name, email, plan, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name || trimmedEmail.split("@")[0], trimmedEmail, plan, role]
      );
      
      const newUser = insertRes.rows[0];
      return NextResponse.json({ user: newUser });
    } 
    
    else if (action === "login") {
      if (!existingUser) {
        return NextResponse.json({ 
          error: "No account registered under this email. Please register/signup first." 
        }, { status: 404 });
      }

      return NextResponse.json({ user: existingUser });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });

  } catch (error: any) {
    console.error("Authentication API error:", error);
    return NextResponse.json({ error: "Server authentication failure" }, { status: 500 });
  }
}
