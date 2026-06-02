# Buzz GeoTagger: Local SEO Image Optimizer

Buzz GeoTagger is a high-performance SaaS platform designed for local SEO agencies and businesses to optimize their images for Google Maps and Local Search.

## 🚀 Features

- **Bulk Geo-Tagging:** Inject precise GPS coordinates (Latitude, Longitude, Altitude) into image EXIF headers.
- **AI-Powered SEO:** Generate GBP-compliant captions, alt-text, and keywords using NVIDIA NIM AI.
- **Anti-Footprint Scattering:** Randomly disperse coordinates within a set radius to simulate organic customer uploads.
- **Next-Gen Compression:** Convert images to WebP/AVIF while preserving metadata, saving up to 90% in payload size.
- **Compliance Checker:** Automatically audit photos for GBP optimization standards.
- **Location Presets:** Save and manage multi-location client coordinates for rapid injection.
- **Interactive Workspace:** Real-time map preview with before/after metadata comparison.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion.
- **Backend:** Next.js API Routes, PostgreSQL (pg).
- **Imaging:** Sharp, Exiftool-vendored, ExifReader.
- **AI:** NVIDIA NIM (Llama 3 / Mistral).
- **Maps:** Leaflet & OpenStreetMap.

## 🏁 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd geo-tagger-buzz-e
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file based on `.env.example` (or the provided `.env`):
   ```env
   DATABASE_URL=postgresql://user:pass@localhost:5432/db
   NVIDIA_API_KEY=your_key
   ```

4. **Initialize Database:**
   Run the `scripts/schema.sql` in your PostgreSQL instance.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/app`: Next.js App Router (Pages & API).
- `src/components`: Reusable UI components.
    - `landing/`: Modular sections of the landing page.
- `src/lib`: Database and utility functions.
- `scripts/`: Maintenance and utility scripts.
- `public/`: Static assets and test images.

## 📄 License

Private - All rights reserved.
