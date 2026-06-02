import { NextRequest, NextResponse } from "next/server";
import { exiftool } from "exiftool-vendored";
import JSZip from "jszip";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { query } from "@/lib/db";

// Disable Next.js body parser size limit for this route
export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;
    const businessName = formData.get("businessName") as string;
    const keywords = formData.get("keywords") as string;
    const altText = formData.get("altText") as string;
    const renamePattern = formData.get("renamePattern") as string;
    const projectName = formData.get("projectName") as string;
    const notes = formData.get("notes") as string;
    const projectIdStr = formData.get("projectId") as string;
    
    const scatterEnabled = formData.get("scatterEnabled") === "true";
    const scatterRadius = parseFloat(formData.get("scatterRadius") as string || "15");
    const outputFormat = formData.get("outputFormat") as string || "original";
    const aiAutopilot = formData.get("aiAutopilot") === "true";
    
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!lat || !lng) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return NextResponse.json({ error: "Latitude must be between -90 and 90" }, { status: 400 });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: "Longitude must be between -180 and 180" }, { status: 400 });
    }

    let projectId: number | null = projectIdStr ? parseInt(projectIdStr) : null;
    if (!projectId) {
      try {
        const projectRes = await query(
          `INSERT INTO projects (name, client_name, notes) VALUES ($1, $2, $3) RETURNING id`,
          [projectName || "Unnamed Project", businessName || "Direct Batch", notes || "Bulk geo-tagged batch"]
        );
        if (projectRes.rows && projectRes.rows.length > 0) {
          projectId = projectRes.rows[0].id;
        }
      } catch (dbErr) {
        console.error("Failed to insert project into PostgreSQL:", dbErr);
      }
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "geotagger-"));
    const zip = new JSZip();

    // AI Autopilot Mode batch generation using NVIDIA NIM
    let aiOptimizedData: Array<{ altText: string; fileName: string }> = [];
    if (aiAutopilot && process.env.NVIDIA_API_KEY) {
      try {
        const fileListString = files.map((f, idx) => `[Image ${idx + 1}] Original filename: "${f.name}"`).join("\n");
        const response = await fetch(`${process.env.NVIDIA_API_BASE || "https://integrate.api.nvidia.com/v1"}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [
              {
                role: "system",
                content: "You are an elite Local SEO image optimization specialist. Generate a custom descriptive ALT text and a custom search-optimized file name for a list of images. Always return a raw JSON array matching the exact structure."
              },
              {
                role: "user",
                content: `Generate unique SEO file names (without extension, lowercase, hyphenated) and ALT text descriptions for these ${files.length} images for a business named "${businessName || "Acme Brand"}" focusing on keywords: "${keywords || "local services"}".

Image list:
${fileListString}

Format: Return ONLY a raw JSON array of objects, with no styling or markdown wrappers, in this exact format:
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
          const resJson = await response.json();
          const content = resJson.choices?.[0]?.message?.content || "";
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            aiOptimizedData = JSON.parse(jsonMatch[0]);
            console.log("Successfully generated AI Autopilot metadata:", aiOptimizedData);
          }
        }
      } catch (aiErr) {
        console.error("AI Autopilot generation error:", aiErr);
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let imgBuffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name;
      const ext = path.extname(originalName);
      
      // Dynamic CSV override extraction
      const fileLatStr = formData.get(`lat_${i}`) as string || lat;
      const fileLngStr = formData.get(`lng_${i}`) as string || lng;
      const fileBiz = formData.get(`business_${i}`) as string || businessName;
      const fileKeys = formData.get(`keywords_${i}`) as string || keywords;

      const keywordList = fileKeys ? fileKeys.split(",").map(k => k.trim()).filter(Boolean) : [];
      const currentKeyword = keywordList.length > 0 ? keywordList[i % keywordList.length] : "";

      let fileLat = parseFloat(fileLatStr);
      let fileLng = parseFloat(fileLngStr);

      // Apply Auto GPS Scatter dispersion
      if (scatterEnabled && !isNaN(fileLat) && !isNaN(fileLng)) {
        const r_earth = 6378137;
        const pi = Math.PI;
        const randomRadius = Math.random() * scatterRadius;
        const randomAngle = Math.random() * 2 * pi;
        
        const latOffset = randomRadius * Math.cos(randomAngle) / r_earth * (180 / pi);
        const lngOffset = randomRadius * Math.sin(randomAngle) / (r_earth * Math.cos(fileLat * pi / 180)) * (180 / pi);
        
        fileLat += latOffset;
        fileLng += lngOffset;
      }

      // Handle WebP & AVIF conversions using sharp
      let outputExt = ext;
      if (outputFormat === "webp") {
        try {
          const sharp = require("sharp");
          imgBuffer = await sharp(imgBuffer).webp({ quality: 85 }).toBuffer();
          outputExt = ".webp";
        } catch (sharpErr) {
          console.error("Failed to convert image to WebP format:", sharpErr);
        }
      } else if (outputFormat === "avif") {
        try {
          const sharp = require("sharp");
          imgBuffer = await sharp(imgBuffer).avif({ quality: 80 }).toBuffer();
          outputExt = ".avif";
        } catch (sharpErr) {
          console.error("Failed to convert image to AVIF format:", sharpErr);
        }
      }

      // SEO Filename & Alt Text generation
      let newName = originalName;
      let desc = altText || "";

      // Look up AI autopilot optimized overrides if active
      const aiOverride = aiOptimizedData[i];

      if (aiAutopilot && aiOverride) {
        if (aiOverride.fileName) {
          let baseName = aiOverride.fileName.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, '-').replace(/^-|-$/g, '');
          newName = `${baseName}${outputExt}`;
        }
        if (aiOverride.altText) {
          desc = aiOverride.altText;
        }
      } else {
        if (renamePattern) {
          let baseName = renamePattern
            .replace(/{businessName}/g, fileBiz || "")
            .replace(/{business}/g, fileBiz || "")
            .replace(/{keyword}/g, currentKeyword || "")
            .replace(/{number}/g, String(i + 1).padStart(2, '0'));
            
          baseName = baseName.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
          // prevent double dashes
          baseName = baseName.replace(/-+/g, '-').replace(/^-|-$/g, '');
          
          if (baseName) {
            newName = `${baseName}${outputExt}`;
          }
        } else {
          const nameWithoutExt = path.basename(originalName, ext);
          newName = `${nameWithoutExt}${outputExt}`;
        }

        if (desc) {
          desc = desc.replace(/{businessName}/g, fileBiz || "").replace(/{keyword}/g, currentKeyword || "");
        }
      }

      const tempFilePath = path.join(tmpDir, newName);
      await fs.writeFile(tempFilePath, imgBuffer);

      // Prepare EXIF, IPTC & XMP dynamic data payload
      const exifData: any = {
        GPSLatitude: fileLat,
        GPSLatitudeRef: fileLat >= 0 ? "N" : "S",
        GPSLongitude: fileLng,
        GPSLongitudeRef: fileLng >= 0 ? "E" : "W",
        GPSVersionID: "2.3.0.0",
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
        exifData.Credit = "LocalLens AI Enterprise Suite";
      }

      if (fileKeys) {
        const keywordList = fileKeys.split(",").map(k => k.trim());
        exifData.Keywords = keywordList;
        exifData.Subject = keywordList;
        exifData.Title = `${fileBiz || "Local Brand"} - ${keywordList[0] || "SEO optimized photo"}`;
        exifData.XPTitle = exifData.Title;
      }

      // Write EXIF data
      await exiftool.write(tempFilePath, exifData);

      // Verify metadata
      const verifiedTags = await exiftool.read(tempFilePath);
      const isVerified = verifiedTags.GPSLatitude !== undefined && verifiedTags.GPSLongitude !== undefined;

      if (isVerified) {
        // Read back the updated file
        const updatedBuffer = await fs.readFile(tempFilePath);
        zip.file(newName, updatedBuffer);

        // Save image log to local pg database
        if (projectId) {
          try {
            await query(
              `INSERT INTO images (project_id, original_filename, output_filename, file_size, status, latitude, longitude, business_name, keywords) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [projectId, originalName, newName, file.size, 'success', fileLat, fileLng, fileBiz || null, fileKeys || null]
            );
          } catch (dbErr) {
            console.error(`Failed to insert image ${originalName} into PostgreSQL:`, dbErr);
          }
        }
      } else {
        console.warn(`Verification failed for ${originalName}`);
        if (projectId) {
          try {
            await query(
              `INSERT INTO images (project_id, original_filename, output_filename, file_size, status, latitude, longitude, business_name, keywords) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [projectId, originalName, newName, file.size, 'failed', fileLat, fileLng, fileBiz || null, fileKeys || null]
            );
          } catch (dbErr) {
            console.error(`Failed to insert image failure log for ${originalName} into PostgreSQL:`, dbErr);
          }
        }
      }
    }

    // Clean up temp dir
    await fs.rm(tmpDir, { recursive: true, force: true });

    // Generate ZIP
    const zipUint8Array = await zip.generateAsync({ type: "uint8array" });
    
    // Return ZIP file
    return new Response(zipUint8Array as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="optimized-images.zip"`
      }
    });

  } catch (error: any) {
    console.error("EXIF processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
