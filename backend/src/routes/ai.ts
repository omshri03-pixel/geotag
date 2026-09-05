import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter: Max 30 AI generations per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'AI request limit reached. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiLimiter);

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_BASE = process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

/**
 * Helper to safely extract and parse JSON from LLM output,
 * stripping markdown fences (```json ... ```) or conversational fluff.
 */
function cleanJsonParse(text: string, type: 'array' | 'object'): any {
  if (!text) return null;
  // Remove markdown code fences
  let cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

  // Find array or object boundaries
  const regex = type === 'array' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = cleaned.match(regex);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      // If trailing comma or minor format issue, try basic cleanup
      try {
        const sanitized = match[0].replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(sanitized);
      } catch {}
    }
  }
  return null;
}

// GET /api/ai/status - Health & connectivity check for AI
router.get('/status', async (req: Request, res: Response) => {
  if (!NVIDIA_API_KEY) {
    return res.status(200).json({
      active: false,
      model: NVIDIA_MODEL,
      error: 'NVIDIA_API_KEY is not set in environment variables',
    });
  }

  const t0 = Date.now();
  try {
    const response = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
        temperature: 0.1,
      }),
    });

    const latencyMs = Date.now() - t0;
    if (response.ok) {
      return res.json({
        active: true,
        model: NVIDIA_MODEL,
        latencyMs,
        provider: 'NVIDIA NIM',
      });
    } else {
      const errText = await response.text();
      return res.status(200).json({
        active: false,
        model: NVIDIA_MODEL,
        latencyMs,
        status: response.status,
        error: errText,
      });
    }
  } catch (err: any) {
    return res.status(200).json({
      active: false,
      model: NVIDIA_MODEL,
      error: err.message || 'Could not connect to NVIDIA API',
    });
  }
});

// POST /api/ai - General AI Generation Endpoint
router.post('/', async (req: Request, res: Response) => {
  try {
    const { action, data } = req.body;

    if (!NVIDIA_API_KEY) {
      return res.status(500).json({ error: 'NVIDIA API key not configured' });
    }

    let prompt = '';
    let systemPrompt = '';

    if (action === 'generate_alt_text') {
      const { businessName, location, keywords, imageCount, businessType } = data;
      systemPrompt = `You are an expert local SEO specialist. Generate concise, keyword-rich ALT text for business images that will improve Google Maps Pack and local search rankings. Each ALT text must be unique, natural-sounding, and between 8-15 words. Never repeat the same phrase twice. Return ONLY a valid JSON array of strings.`;
      prompt = `Generate ${imageCount || 5} unique SEO ALT text descriptions for a ${businessType || 'business'} called "${businessName}" located in ${location}. 
Focus keywords: ${keywords || businessName + ' ' + location}
Format: Return ONLY a JSON array of strings, nothing else. Example: ["ALT text 1", "ALT text 2"]`;
    }

    else if (action === 'generate_filenames') {
      const { businessName, location, keywords, count } = data;
      systemPrompt = `You are an SEO expert. Generate SEO-optimized file names for business images. Use hyphens between words, lowercase only, include location and business type keywords. Make each name unique. Return ONLY a valid JSON array of strings.`;
      prompt = `Generate ${count || 5} SEO-optimized image file names (without extension) for "${businessName}" in ${location}.
Keywords to include: ${keywords || businessName}
Format: Return ONLY a JSON array of strings. Example: ["dental-clinic-bandra-mumbai-interior-01", "dentist-office-reception-bandra-02"]`;
    }

    else if (action === 'generate_description') {
      const { businessName, location, businessType, keywords } = data;
      systemPrompt = `You are a Google Business Profile optimization expert. Write compelling, SEO-rich business descriptions that rank in local search.`;
      prompt = `Write a 150-word Google Business Profile description for:
Business: ${businessName}
Type: ${businessType || 'Business'}
Location: ${location}
Keywords: ${keywords || ''}
Make it natural, include local keywords, and end with a call-to-action. Return plain text only.`;
    }

    else if (action === 'keyword_research') {
      const { businessName, location, businessType } = data;
      systemPrompt = `You are a local SEO keyword research expert. Identify high-value, low-competition local search keywords. Return ONLY a valid JSON array of strings.`;
      prompt = `Generate 15 local SEO keywords for a ${businessType || 'business'} called "${businessName}" in ${location}.
Include: primary keywords, long-tail keywords, and "near me" variations.
Format: Return ONLY a JSON array of strings sorted by search intent importance.`;
    }

    else if (action === 'generate_copilot') {
      const { businessName, keywords, filename } = data;
      systemPrompt = `You are an expert Google Business Profile and local SEO copywriter. Always reply with raw JSON only. Do not include markdown codeblocks or extra text.`;
      prompt = `Generate a GBP update post, an Instagram caption, and 4 high-intent local SEO keywords based on:
Business: "${businessName}"
Keywords: "${keywords}"
Asset context: "${filename}"
Format: Return ONLY a valid JSON object:
{
  "gbpPost": "...",
  "instaCaption": "...",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;
    }

    else if (action === 'chat') {
      const { message } = data;
      const isJsonRequested = typeof message === 'string' && (message.includes('JSON') || message.includes('json'));
      systemPrompt = isJsonRequested
        ? `You are LocalLens AI Assistant — an expert local SEO automation engine. Return ONLY the requested valid JSON object without explanation or markdown backticks.`
        : `You are LocalLens AI Assistant — an expert in local SEO, Google Maps optimization, image geotagging, and Google Business Profile management. Be concise and actionable.`;
      prompt = message;
    }

    else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const response = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error:', errorText);
      return res.status(response.status).json({ error: `AI API error: ${response.status}`, details: errorText });
    }

    const result = await response.json() as any;
    const content = result.choices?.[0]?.message?.content || '';

    // Handle array-based results
    if (['generate_alt_text', 'generate_filenames', 'keyword_research'].includes(action)) {
      const parsedArray = cleanJsonParse(content, 'array');
      if (parsedArray && Array.isArray(parsedArray)) {
        return res.json({ success: true, data: parsedArray, action });
      }
    }

    // Handle object-based copilot results
    if (action === 'generate_copilot') {
      const parsedObj = cleanJsonParse(content, 'object');
      if (parsedObj) {
        return res.json({ success: true, data: parsedObj, action });
      }
    }

    // If chat action requested JSON, try parsing object
    if (action === 'chat' && (prompt.includes('JSON') || prompt.includes('json'))) {
      const parsedObj = cleanJsonParse(content, 'object');
      if (parsedObj) {
        return res.json({ success: true, data: JSON.stringify(parsedObj), action });
      }
    }

    return res.json({ success: true, data: content, action });

  } catch (err: any) {
    console.error('AI route error:', err);
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

export default router;
