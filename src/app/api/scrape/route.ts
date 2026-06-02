import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "URL query parameter is required" }, { status: 400 });
    }

    // Resolve a clean absolute URL format
    let cleanUrl = targetUrl;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL. HTTP status ${response.status}` }, { status: 400 });
    }

    const html = await response.text();
    const images: string[] = [];

    // Robust Regex to match image sources
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const parsedUrl = new URL(cleanUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    while ((match = imgRegex.exec(html)) !== null) {
      let imgSrc = match[1].trim();
      
      // Filter out base64 tracking pixels
      if (imgSrc.startsWith("data:image/")) continue;

      // Resolve relative pathings
      if (imgSrc.startsWith("//")) {
        imgSrc = parsedUrl.protocol + imgSrc;
      } else if (imgSrc.startsWith("/")) {
        imgSrc = baseUrl + imgSrc;
      } else if (!imgSrc.startsWith("http://") && !imgSrc.startsWith("https://")) {
        // Handle relative to active path
        const pathname = parsedUrl.pathname;
        const directory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        imgSrc = baseUrl + directory + imgSrc;
      }

      if (!images.includes(imgSrc)) {
        images.push(imgSrc);
      }
    }

    // fallback matching for background images or data-src
    const dataSrcRegex = /data-src=["']([^"']+)["']/g;
    while ((match = dataSrcRegex.exec(html)) !== null) {
      let imgSrc = match[1].trim();
      if (imgSrc.startsWith("data:image/")) continue;
      if (imgSrc.startsWith("//")) {
        imgSrc = parsedUrl.protocol + imgSrc;
      } else if (imgSrc.startsWith("/")) {
        imgSrc = baseUrl + imgSrc;
      } else if (!imgSrc.startsWith("http://") && !imgSrc.startsWith("https://")) {
        const pathname = parsedUrl.pathname;
        const directory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
        imgSrc = baseUrl + directory + imgSrc;
      }
      if (!images.includes(imgSrc)) {
        images.push(imgSrc);
      }
    }

    // Limit to top 50 images to avoid performance bottlenecks
    return NextResponse.json({ images: images.slice(0, 50) });

  } catch (err: any) {
    console.error("Scraper route error:", err);
    return NextResponse.json({ error: err.message || "Failed to parse website" }, { status: 500 });
  }
}
