import fs from 'fs';
import path from 'path';

// Create a valid 1x1 minimal transparent PNG
const minimalPNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
fs.writeFileSync('test.png', minimalPNG);

// Create a minimal 1x1 valid JPG
const minimalJPG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64"
);
fs.writeFileSync('test.jpg', minimalJPG);

async function runTest() {
  const fd = new FormData();
  fd.append("lat", "40.7128");
  fd.append("lng", "-74.0060");
  fd.append("businessName", "Test Business");
  fd.append("keywords", "test, seo");
  fd.append("altText", "{businessName} {keyword}");
  
  const fileBuffer = fs.readFileSync('test.jpg');
  const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
  fd.append("files", fileBlob, "test.jpg");
  
  try {
    const res = await fetch("http://localhost:3000/api/process", {
      method: "POST",
      body: fd,
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text length/preview:", text.length, text.substring(0, 100));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

runTest();
