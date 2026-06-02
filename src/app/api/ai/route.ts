import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_BASE = process.env.NVIDIA_API_BASE || "https://integrate.api.nvidia.com/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (!NVIDIA_API_KEY) {
      return NextResponse.json({ error: "NVIDIA API key not configured" }, { status: 500 });
    }

    let prompt = "";
    let systemPrompt = "";

    // ─── Action: Generate SEO ALT Text for images ───────────────────────
    if (action === "generate_alt_text") {
      const { businessName, location, keywords, imageCount, businessType } = data;
      systemPrompt = `You are an expert local SEO specialist. Generate concise, keyword-rich ALT text for business images that will improve Google Maps Pack and local search rankings. Each ALT text must be unique, natural-sounding, and between 8-15 words. Never repeat the same phrase twice.`;
      prompt = `Generate ${imageCount || 5} unique SEO ALT text descriptions for a ${businessType || "business"} called "${businessName}" located in ${location}. 
Focus keywords: ${keywords || businessName + " " + location}
Format: Return ONLY a JSON array of strings, nothing else. Example: ["ALT text 1", "ALT text 2"]`;
    }

    // ─── Action: Generate file rename pattern ────────────────────────────
    else if (action === "generate_filenames") {
      const { businessName, location, keywords, count } = data;
      systemPrompt = `You are an SEO expert. Generate SEO-optimized file names for business images. Use hyphens between words, lowercase only, include location and business type keywords. Make each name unique.`;
      prompt = `Generate ${count || 5} SEO-optimized image file names (without extension) for "${businessName}" in ${location}.
Keywords to include: ${keywords || businessName}
Format: Return ONLY a JSON array of strings. Example: ["dental-clinic-bandra-mumbai-interior-01", "dentist-office-reception-bandra-02"]`;
    }

    // ─── Action: Suggest business description ────────────────────────────
    else if (action === "generate_description") {
      const { businessName, location, businessType, keywords } = data;
      systemPrompt = `You are a Google Business Profile optimization expert. Write compelling, SEO-rich business descriptions that rank in local search.`;
      prompt = `Write a 150-word Google Business Profile description for:
Business: ${businessName}
Type: ${businessType || "Business"}
Location: ${location}
Keywords: ${keywords || ""}

Make it natural, include local keywords, and end with a call-to-action. Return plain text only.`;
    }

    // ─── Action: Keyword research ────────────────────────────────────────
    else if (action === "keyword_research") {
      const { businessName, location, businessType } = data;
      systemPrompt = `You are a local SEO keyword research expert. Identify high-value, low-competition local search keywords.`;
      prompt = `Generate 15 local SEO keywords for a ${businessType || "business"} called "${businessName}" in ${location}.
Include: primary keywords, long-tail keywords, and "near me" variations.
Format: Return ONLY a JSON array of strings sorted by search intent importance.`;
    }

    // ─── Action: Generate Local SEO Copilot details ──────────────────────
    else if (action === "generate_copilot") {
      const { businessName, keywords, filename } = data;
      systemPrompt = `You are an expert Google Business Profile and local SEO copywriter. You generate highly engaging, conversion-optimized GBP updates and Instagram captions. Always reply with raw JSON only.`;
      prompt = `Generate a Google Business Profile (GBP) update post, an Instagram caption, and 4 high-intent local SEO keywords based on:
Business: "${businessName}"
Primary Keywords: "${keywords}"
Asset context (filename): "${filename}"

Format: Return ONLY a valid JSON object matching this schema:
{
  "gbpPost": "GBP post content...",
  "instaCaption": "Instagram caption content...",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;
    }

    // ─── Action: Free-form chat ──────────────────────────────────────────
    else if (action === "chat") {
      const { message, context } = data;
      systemPrompt = `You are LocalLens AI Assistant — an expert in local SEO, Google Maps optimization, image geotagging, and Google Business Profile management. Help users maximize their local search visibility. Be concise and actionable.`;
      prompt = message;
    }

    else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Call NVIDIA NIM API (OpenAI-compatible)
    const response = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API error:", errorText);
      return NextResponse.json(
        { error: `AI API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Parse JSON responses for structured actions
    if (["generate_alt_text", "generate_filenames", "keyword_research"].includes(action)) {
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ success: true, data: parsed, action });
        }
      } catch {}
    }

    if (action === "generate_copilot") {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ success: true, data: parsed, action });
        }
      } catch {}
    }

    return NextResponse.json({ success: true, data: content, action });

  } catch (err: any) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: err.message || "AI request failed" }, { status: 500 });
  }
}
