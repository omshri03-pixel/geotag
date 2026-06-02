import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to download image" }, { status: response.status });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(blob as any, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400"
      }
    });

  } catch (err: any) {
    console.error("Proxy image route error:", err);
    return NextResponse.json({ error: err.message || "Failed to proxy image" }, { status: 500 });
  }
}
