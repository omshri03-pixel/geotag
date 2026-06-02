import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import JSZip from 'jszip';
import { exiftool } from 'exiftool-vendored';
import { query } from '../lib/db';

const router = Router();

// Use memory storage — files are processed in-memory then written to temp dir
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// POST /api/process
router.post('/', upload.array('files'), async (req: Request, res: Response) => {
  try {
    const {
      lat, lng, businessName, keywords, altText,
      renamePattern, projectName, notes, projectId: projectIdStr,
      scatterEnabled, scatterRadius: scatterRadiusStr,
      outputFormat, aiAutopilot
    } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }

    const isScatterEnabled = scatterEnabled === 'true';
    const scatterRadius = parseFloat(scatterRadiusStr || '15');
    const format = outputFormat || 'original';
    const isAiAutopilot = aiAutopilot === 'true';

    let projectId: number | null = projectIdStr ? parseInt(projectIdStr) : null;
    if (!projectId) {
      try {
        const projectRes = await query(
          `INSERT INTO projects (name, client_name, notes) VALUES ($1, $2, $3) RETURNING id`,
          [projectName || 'Unnamed Project', businessName || 'Direct Batch', notes || 'Bulk geo-tagged batch']
        );
        if (projectRes.rows.length > 0) {
          projectId = projectRes.rows[0].id;
        }
      } catch (dbErr) {
        console.error('Failed to insert project:', dbErr);
      }
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'geotagger-'));
    const zip = new JSZip();

    // AI Autopilot batch generation
    let aiOptimizedData: Array<{ altText: string; fileName: string }> = [];
    if (isAiAutopilot && process.env.NVIDIA_API_KEY) {
      try {
        const fileListString = files.map((f, idx) => `[Image ${idx + 1}] Original filename: "${f.originalname}"`).join('\n');
        const response = await fetch(`${process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1'}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'meta/llama-3.3-70b-instruct',
            messages: [
              { role: 'system', content: 'You are an elite Local SEO image optimization specialist. Return a raw JSON array only.' },
              {
                role: 'user',
                content: `Generate unique SEO file names and ALT text for these ${files.length} images for "${businessName || 'Acme Brand'}" focusing on: "${keywords || 'local services'}".

Image list:
${fileListString}

Format: Return ONLY a raw JSON array:
[
  { "altText": "custom descriptive SEO ALT text...", "fileName": "custom-seo-filename" },
  ...
]`
              }
            ],
            temperature: 0.5,
            max_tokens: 1500,
            stream: false,
          }),
        });

        if (response.ok) {
          const resJson = await response.json() as any;
          const content = resJson.choices?.[0]?.message?.content || '';
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            aiOptimizedData = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (aiErr) {
        console.error('AI Autopilot generation error:', aiErr);
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let imgBuffer = file.buffer;
      const originalName = file.originalname;
      const ext = path.extname(originalName);

      const fileLatStr = req.body[`lat_${i}`] || lat;
      const fileLngStr = req.body[`lng_${i}`] || lng;
      const fileBiz = req.body[`business_${i}`] || businessName;
      const fileKeys = req.body[`keywords_${i}`] || keywords;

      const keywordList = fileKeys ? fileKeys.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
      const currentKeyword = keywordList.length > 0 ? keywordList[i % keywordList.length] : '';

      let fileLat = parseFloat(fileLatStr);
      let fileLng = parseFloat(fileLngStr);

      if (isScatterEnabled && !isNaN(fileLat) && !isNaN(fileLng)) {
        const r_earth = 6378137;
        const pi = Math.PI;
        const randomRadius = Math.random() * scatterRadius;
        const randomAngle = Math.random() * 2 * pi;
        fileLat += randomRadius * Math.cos(randomAngle) / r_earth * (180 / pi);
        fileLng += randomRadius * Math.sin(randomAngle) / (r_earth * Math.cos(fileLat * pi / 180)) * (180 / pi);
      }

      // Format conversion
      let outputExt = ext;
      if (format === 'webp') {
        try {
          const sharp = require('sharp');
          imgBuffer = await sharp(imgBuffer).webp({ quality: 85 }).toBuffer();
          outputExt = '.webp';
        } catch (sharpErr) {
          console.error('Failed to convert to WebP:', sharpErr);
        }
      } else if (format === 'avif') {
        try {
          const sharp = require('sharp');
          imgBuffer = await sharp(imgBuffer).avif({ quality: 80 }).toBuffer();
          outputExt = '.avif';
        } catch (sharpErr) {
          console.error('Failed to convert to AVIF:', sharpErr);
        }
      }

      let newName = originalName;
      let desc = altText || '';

      const aiOverride = aiOptimizedData[i];
      if (isAiAutopilot && aiOverride) {
        if (aiOverride.fileName) {
          const baseName = aiOverride.fileName.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          newName = `${baseName}${outputExt}`;
        }
        if (aiOverride.altText) desc = aiOverride.altText;
      } else {
        if (renamePattern) {
          let baseName = renamePattern
            .replace(/{businessName}/g, fileBiz || '')
            .replace(/{business}/g, fileBiz || '')
            .replace(/{keyword}/g, currentKeyword || '')
            .replace(/{number}/g, String(i + 1).padStart(2, '0'));
          baseName = baseName.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          if (baseName) newName = `${baseName}${outputExt}`;
        } else {
          newName = `${path.basename(originalName, ext)}${outputExt}`;
        }
        if (desc) {
          desc = desc.replace(/{businessName}/g, fileBiz || '').replace(/{keyword}/g, currentKeyword || '');
        }
      }

      const tempFilePath = path.join(tmpDir, newName);
      await fs.writeFile(tempFilePath, imgBuffer);

      const exifData: any = {
        GPSLatitude: fileLat,
        GPSLatitudeRef: fileLat >= 0 ? 'N' : 'S',
        GPSLongitude: fileLng,
        GPSLongitudeRef: fileLng >= 0 ? 'E' : 'W',
        GPSVersionID: '2.3.0.0',
      };

      if (desc) {
        exifData.ImageDescription = desc;
        exifData.XPComment = desc;
        exifData.Description = desc;
      }
      if (fileBiz) {
        exifData.Artist = fileBiz;
        exifData.Creator = fileBiz;
        exifData.Copyright = fileBiz;
        exifData.CopyrightNotice = `Copyright (c) ${new Date().getFullYear()} ${fileBiz}. All rights reserved.`;
        exifData.Source = fileBiz;
        exifData.Credit = 'LocalLens AI Enterprise Suite';
      }
      if (fileKeys) {
        const kwList = fileKeys.split(',').map((k: string) => k.trim());
        exifData.Keywords = kwList;
        exifData.Subject = kwList;
        exifData.Title = `${fileBiz || 'Local Brand'} - ${kwList[0] || 'SEO optimized photo'}`;
        exifData.XPTitle = exifData.Title;
      }

      await exiftool.write(tempFilePath, exifData);
      const verifiedTags = await exiftool.read(tempFilePath);
      const isVerified = verifiedTags.GPSLatitude !== undefined && verifiedTags.GPSLongitude !== undefined;

      if (isVerified) {
        const updatedBuffer = await fs.readFile(tempFilePath);
        zip.file(newName, updatedBuffer);

        if (projectId) {
          try {
            await query(
              `INSERT INTO images (project_id, original_filename, output_filename, file_size, status, latitude, longitude, business_name, keywords) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [projectId, originalName, newName, file.size, 'success', fileLat, fileLng, fileBiz || null, fileKeys || null]
            );
          } catch (dbErr) {
            console.error(`Failed to log image ${originalName}:`, dbErr);
          }
        }
      } else {
        console.warn(`Verification failed for ${originalName}`);
        if (projectId) {
          try {
            await query(
              `INSERT INTO images (project_id, original_filename, output_filename, file_size, status, latitude, longitude, business_name, keywords) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [projectId, originalName, newName, file.size, 'failed', fileLat, fileLng, fileBiz || null, fileKeys || null]
            );
          } catch (dbErr) {
            console.error(`Failed to log failure for ${originalName}:`, dbErr);
          }
        }
      }
    }

    await fs.rm(tmpDir, { recursive: true, force: true });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="optimized-images.zip"',
    });

    return res.send(zipBuffer);

  } catch (error: any) {
    console.error('EXIF processing error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
