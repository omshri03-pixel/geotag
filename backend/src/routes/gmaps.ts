import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/gmaps/resolve
router.post('/resolve', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Google Maps URL is required' });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Follow redirects to get final expanded URL
    let finalUrl = targetUrl;
    let htmlContent = '';
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      finalUrl = response.url;
      htmlContent = await response.text();
    } catch (fetchErr: any) {
      console.warn('Redirect expansion warning:', fetchErr.message);
    }

    let lat: number | null = null;
    let lng: number | null = null;
    let businessName: string | null = null;
    let address: string | null = null;

    // 1. Try parsing @lat,lng from URL
    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      lat = parseFloat(atMatch[1]);
      lng = parseFloat(atMatch[2]);
    }

    // 2. Try parsing !3dlat!4dlng from protobuf URL params
    if (!lat || !lng) {
      const protoMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (protoMatch) {
        lat = parseFloat(protoMatch[1]);
        lng = parseFloat(protoMatch[2]);
      }
    }

    // 3. Try parsing query=lat,lng or q=lat,lng
    if (!lat || !lng) {
      const qMatch = finalUrl.match(/[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        lat = parseFloat(qMatch[1]);
        lng = parseFloat(qMatch[2]);
      }
    }

    // 4. Extract business name from URL path: /maps/place/Business+Name/
    const placeMatch = finalUrl.match(/\/maps\/place\/([^/@?]+)/);
    if (placeMatch) {
      businessName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // 5. Extract name from HTML title if available: <title>Business Name - Google Maps</title>
    if (htmlContent) {
      const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        const fullTitle = titleMatch[1];
        const cleaned = fullTitle
          .replace(/ - Google (?:Maps|Search)/i, '')
          .replace(/ \/ Google Maps/i, '')
          .trim();
        if (cleaned && cleaned !== 'Google Maps') {
          if (!businessName || businessName.length < 3) {
            businessName = cleaned;
          }
        }
      }

      // Check meta description or JSON-LD for address
      const descMatch = htmlContent.match(/<meta[^>]*itemprop="name"[^>]*content="([^"]+)"/i) ||
                        htmlContent.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
      if (descMatch && (!businessName || businessName === 'Google Maps')) {
        businessName = descMatch[1].replace(/ - Google (?:Maps|Search)/i, '').trim();
      }

      // If lat/lng still not found, check window.APP_INITIALIZATION_STATE or coordinates in HTML
      if (!lat || !lng) {
        const htmlCoordMatch = htmlContent.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/);
        if (htmlCoordMatch) {
          const parts = htmlCoordMatch[0].split(',');
          lat = parseFloat(parts[0].trim());
          lng = parseFloat(parts[1].trim());
        }
      }
    }

    // If coordinates found, reverse geocode to get clean address
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      try {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=geotaggerpro@example.com`);
        if (nomRes.ok) {
          const nomData = await nomRes.json() as any;
          if (nomData && nomData.display_name) {
            address = nomData.display_name;
            if (!businessName && nomData.address) {
              businessName = nomData.address.shop || nomData.address.amenity || nomData.address.office || nomData.address.building || null;
            }
          }
        }
      } catch {}

      return res.json({
        success: true,
        lat,
        lng,
        businessName: businessName || 'Local Business',
        address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        resolvedUrl: finalUrl
      });
    }

    // If only name was found, try forward geocoding with Nominatim
    if (businessName && businessName !== 'Google Maps') {
      try {
        const searchRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(businessName)}&email=geotaggerpro@example.com`);
        if (searchRes.ok) {
          const searchData = await searchRes.json() as any;
          if (searchData && searchData.length > 0) {
            return res.json({
              success: true,
              lat: parseFloat(searchData[0].lat),
              lng: parseFloat(searchData[0].lon),
              businessName,
              address: searchData[0].display_name,
              resolvedUrl: finalUrl
            });
          }
        }
      } catch {}
    }

    return res.status(400).json({
      error: 'Could not extract coordinates from this Google Maps link. Please verify the URL or enter location manually.'
    });

  } catch (err: any) {
    console.error('Google Maps resolve error:', err);
    return res.status(500).json({ error: err.message || 'Failed to resolve Google Maps URL' });
  }
});

export default router;
