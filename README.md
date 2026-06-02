# Buzz GeoTagger: Local SEO Image Optimizer

Buzz GeoTagger is a high-performance SaaS platform designed for local SEO agencies and businesses to optimize their images for Google Maps and Local Search.

The application has been restructured into a clean split-stack repository consisting of a frontend (Next.js) and a backend (Express.js).

## 🚀 Features

- **Bulk Geo-Tagging:** Inject precise GPS coordinates (Latitude, Longitude, Altitude) into image EXIF headers.
- **AI-Powered SEO:** Generate GBP-compliant captions, alt-text, and keywords using NVIDIA NIM AI.
- **Anti-Footprint Scattering:** Randomly disperse coordinates within a set radius to simulate organic customer uploads.
- **Next-Gen Compression:** Convert images to WebP/AVIF while preserving metadata, saving up to 90% in payload size.
- **Compliance Checker:** Automatically audit photos for GBP optimization standards.
- **Location Presets:** Save and manage multi-location client coordinates for rapid injection.
- **Interactive Workspace:** Real-time map preview with before/after metadata comparison.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide icons, Leaflet maps.
- **Backend:** Node.js, Express, TypeScript, PostgreSQL (pg), Multer (file uploads), Sharp & ExifTool.
- **AI:** NVIDIA NIM (Llama 3 / Mistral).

## 📂 Project Structure

```
GEO Tagger Buzz E/
├── frontend/          ← Next.js Web App (runs on port 3000)
│   ├── src/app/       ← Page components & layouts
│   ├── src/components/← Reusable UI elements
│   ├── src/lib/utils.ts← UI utility helpers
│   ├── .env.local     ← Frontend environment variables
│   └── package.json   
│
└── backend/           ← Express.js API Server (runs on port 4000)
    ├── src/index.ts   ← Main entry point & routers
    ├── src/routes/    ← Express endpoint routes
    ├── src/lib/db.ts  ← PostgreSQL connection pool
    ├── database/      ← SQL schemas & DB utility scripts
    ├── .env           ← Backend environment variables
    └── package.json
```

## 🏁 Getting Started

### 1. Set Up the Database
Import the schema into your PostgreSQL database:
- For standard PostgreSQL: Run the SQL in [schema.sql](file:///c:/Users/raico/Downloads/GEO%20Tagger%20Buzz%20E/backend/database/schema.sql).
- For Supabase: Run the SQL in [supabase_schema.sql](file:///c:/Users/raico/Downloads/GEO%20Tagger%20Buzz%20E/backend/database/supabase_schema.sql).

### 2. Set Up Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file based on `.env.example`:
   ```env
   PORT=4000
   DATABASE_URL=postgresql://user:password@localhost:5432/geotagger
   NVIDIA_API_KEY=nvapi-your-key-here
   FRONTEND_URL=http://localhost:3000
   ```
3. Run the backend development server:
   ```bash
   npm run dev
   ```

To seed location presets or test database connection:
```bash
node database/create_saved_locations.js
node database/test_db.js
```

### 3. Set Up Frontend
1. Go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Create your `.env.local` file based on `.env.example`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
3. Run the frontend development server:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📄 License

Private - All rights reserved.
