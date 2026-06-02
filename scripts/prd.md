# PRD: Geo Tagger Software

## 1. Product Name
**Buzz GeoTagger**

**Alternative names:**
- GeoTagger Pro
- Local Image Tagger
- PinMeta
- GMB Image Optimizer
- Local SEO GeoTagger

**Recommended name for your agency ecosystem:**
**Buzz GeoTagger — Local SEO Image Metadata Tool**

## 2. Product Objective
Build a web-based geo-tagging software where users can upload photos, select or search a location, add GPS metadata into the image EXIF data, verify the metadata, and download the geo-tagged image/images.

The software should work for:
- Digital marketing agencies
- Local SEO teams
- Google Business Profile optimization
- Real estate site photos
- Restaurants/cafés
- Clinics
- Travel agencies
- Field verification teams

*ExifTool is a strong backend choice because it supports reading and writing EXIF, GPS, IPTC, XMP, and other metadata across many file types.*
*For location search, Mapbox Geocoding can convert address/place text into coordinates and coordinates back into place names.*

## 3. Main Problem
Many users have photos but no proper location metadata inside them. Agencies and businesses often want to organize, optimize, verify, or prepare location-based images for local SEO and business documentation.

The current tools in the market are often:
- Too technical
- Old-looking
- Not bulk-friendly
- Not built for agencies
- Not beginner-friendly
- Not focused on local SEO workflows

## 4. Product Solution
A clean, premium, easy-to-use web app that allows users to:
- Upload photos.
- Select/search location.
- Add GPS coordinates into image metadata.
- Add optional SEO metadata.
- Preview before/after metadata.
- Bulk process many images.
- Download final geo-tagged images as single files or ZIP.

## 5. Important Disclaimer
The software should not claim that geo-tagging images guarantees Google ranking improvement. It should be positioned as:
**A local image metadata, organization, and optimization tool.**

Not as:
**Guaranteed GMB ranking booster.**

This protects the product legally and keeps positioning professional.

## 6. Product Scope
### MVP Scope — Version 1
The first version must include:
- User authentication
- Image upload
- Image preview
- Location search
- Manual coordinate entry
- Map pin selector
- EXIF metadata reader
- EXIF GPS metadata writer
- Bulk same-location tagging
- Metadata verification
- Download single image
- Download ZIP
- Basic dashboard
- Project history
- Error handling
- Privacy-safe file deletion system

## 7. Out of Scope for MVP
These should not be built in the first version:
- Google Business Profile direct integration
- AI location detection
- Mobile app
- Browser extension
- Direct posting to GMB
- Payment gateway
- Team management
- White label
- Advanced analytics
- CRM integration

*(These can come in Version 2 or Version 3.)*

## 8. Target Users
**User Type 1: Digital Marketing Agency**
- **Need:** Bulk geo-tag client images for local SEO workflow.
- **Example:** Agency uploads 100 restaurant photos, applies restaurant location, downloads optimized images.

**User Type 2: Local Business Owner**
- **Need:** Upload store/clinic/café photos and add accurate location metadata.
- **Example:** A dental clinic owner uploads clinic images and tags them with clinic address.

**User Type 3: Real Estate Team**
- **Need:** Add location data to property/site images.
- **Example:** A real estate company geo-tags site visit photos.

**User Type 4: Travel Agency**
- **Need:** Geo-tag travel destination photos.
- **Example:** Tour operator tags Dubai desert safari photos with destination coordinates.

**User Type 5: Field Team**
- **Need:** Verify where images were captured or organize photos by site.
- **Example:** Supervisor checks whether site work photos contain correct coordinates.

## 9. Core User Journey
**Journey 1: Single Image Geo-Tagging**
1. User logs in.
2. User clicks “New Project”.
3. User enters project name.
4. User uploads one image.
5. System reads existing metadata.
6. User searches location.
7. User selects map result.
8. System fills latitude and longitude.
9. User clicks “Apply Geo Tag”.
10. Backend writes GPS metadata.
11. System verifies updated metadata.
12. User downloads final image.

**Journey 2: Bulk Geo-Tagging**
1. User creates project.
2. User uploads multiple images.
3. User selects one location.
4. User clicks “Apply to All”.
5. System processes all images.
6. System shows success/failed count.
7. User downloads all images as ZIP.

**Journey 3: Manual Coordinates**
1. User uploads image.
2. User selects “Manual Coordinates”.
3. User enters latitude and longitude.
4. System validates coordinate format.
5. User applies metadata.
6. User downloads image.

**Journey 4: Metadata Viewer**
1. User uploads image.
2. System shows existing metadata: File name, File size, Camera info, Date taken, Existing GPS data, Image dimensions.
3. User can decide to update, remove, or keep metadata.

## 10. Main Screens
**Screen 1: Landing Page**
- **Purpose:** Explain what the tool does and convert visitor into user.
- **Sections:** Hero section, Upload demo preview, Features, Use cases, How it works, Pricing placeholder, FAQ, CTA.
- **Hero Copy:** "Geo-tag your images in seconds. Add accurate GPS metadata to photos for local SEO, business documentation, and location-based image organization."
- **CTA buttons:** Start Geo-Tagging, Try Demo

**Screen 2: Login / Signup**
- Required: Email login, Google login optional, Password reset, Basic validation.

**Screen 3: Dashboard**
- **Dashboard Cards:** Total projects, Images processed, Recent locations, Storage used, Last project.
- **Main Actions:** New Project, Upload Images, View History.

**Screen 4: New Project**
- **Fields:** Project name, Client/business name (optional), Default location (optional), Notes (optional).
- *Example: Project Name: Dr Joy Dental Clinic - BurJuman Photos.*

**Screen 5: Upload Workspace**
- **Features:** Drag and drop upload, File browser upload, Multiple image upload, Upload progress bar, File validation, Thumbnail grid.
- **File Card Shows:** Thumbnail, File name, File size, Current GPS status, Processing status, Error message if failed.

**Screen 6: Location Selector**
- **Methods:** Search location, Drop pin on map, Enter coordinates manually.
- **Location Details:** Place name, Full address, Latitude, Longitude, Country, State, City, Postal code if available.

**Screen 7: Metadata Editor**
- **GPS Metadata:** Latitude, Longitude, Altitude (optional), GPS date/time stamp.
- **SEO Metadata:** Title, Description, Keywords, Author, Copyright, Business name, City, Country.
- **File Rename:** User can rename files using patterns like `{business-name}-{city}-{keyword}-{number}.jpg`.

**Screen 8: Processing Screen**
- **Shows:** Total files, Processing files, Successful files, Failed files, Retry failed button, Cancel button.
- **Status Types:** Pending, Uploading, Reading Metadata, Applying Geo Tag, Verifying Metadata, Completed, Failed.

**Screen 9: Result / Download**
- **Shows:** Before metadata, After metadata, Success confirmation, Download image, Download ZIP, Start new project.

**Screen 10: Project History**
- **Shows:** Project name, Number of images, Location used, Created date, Download again button, Delete project button.

## 11. Functional Requirements
- **FR-001: User Signup**
- **FR-002: User Login**
- **FR-003: Create Project**
- **FR-004: Upload Images** (Max single file: 25 MB, Max files per batch: 100)
- **FR-005: Read Existing Metadata**
- **FR-006: Search Location**
- **FR-007: Manual Coordinate Entry**
- **FR-008: Map Pin Selector**
- **FR-009: Apply Geo Tag to Single Image**
- **FR-010: Apply Geo Tag to Multiple Images**
- **FR-011: Metadata Verification**
- **FR-012: File Rename**
- **FR-013: ZIP Download**
- **FR-014: Delete Project**
- **FR-015: Auto File Deletion** (Delete uploaded and processed files after 24 hours for free users).

## 12. Non-Functional Requirements
- **Performance:** Fast single image processing; background jobs for bulk processing.
- **Security:** User files must be private; URLs signed/private.
- **Privacy:** Auto-delete policy; avoid storing unnecessary personal data.
- **Reliability:** Failed images should not stop the entire batch; store processing logs.
- **Scalability:** Object storage for images, Queue system for bulk jobs.

## 13. Recommended Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion, Mapbox GL JS.
- **Backend:** Node.js, Next.js API routes, BullMQ + Redis for queues.
- **Metadata Engine:** ExifTool (Reliable, supports EXIF/GPS/IPTC/XMP).
- **Database:** PostgreSQL.
- **Storage:** Cloudflare R2 or local for MVP.
- **Authentication:** Supabase Auth or Clerk.

## 14. System Architecture
**Simple Architecture:**
Frontend -> Backend API -> Storage -> ExifTool Worker -> Database -> Download Service

## 15. Database Schema
*(Tables include: users, projects, images, locations, processing_jobs, download_logs)*

## 16. API Requirements
- **Auth APIs:** `/api/auth/signup`, `/api/auth/login`
- **Project APIs:** `/api/projects`
- **Upload APIs:** `/api/projects/:projectId/images/upload`
- **Metadata APIs:** `/api/images/:imageId/metadata`
- **Location APIs:** `/api/location/search`
- **Geo Tag APIs:** `/api/images/:imageId/geotag`, `/api/projects/:projectId/geotag-bulk`
- **Job Status API:** `/api/jobs/:jobId`
- **Download APIs:** `/api/images/:imageId/download`, `/api/projects/:projectId/download-zip`

## 17. EXIF Metadata Writing Requirements
**Must Write These Fields:**
- GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef
- GPSAltitude, GPSDateStamp, GPSTimeStamp (Optional)
- XMP Location fields, IPTC City, IPTC Country (Optional)
- Copyright, Artist/Author (Optional)

## 18. Processing Logic
*(Single Image Processing & Bulk Processing workflow defined with validation, copying, writing, and ZIP generation)*

## 19. UI/UX Design Direction
- **Visual Style:** Premium, Minimal, Fast, Smooth, Trustworthy.
- **Color Palette:** Dark charcoal (#111827), Soft off-white (#F8FAFC), Modern blue (#2563EB).

## 20. Main Workspace Layout
- **Left Side:** Image thumbnails list.
- **Center:** Image preview + map.
- **Right Side:** Metadata panel.

## 21. MVP Page Structure
- `/` (landing page)
- `/login`
- `/dashboard`
- `/projects/new`
- `/projects/:id`
- `/projects/:id/history`
- `/settings`

## 22-24. Validation, Errors & Edge Cases
*(Strict rules for rejecting invalid files, locations, empty project names. Edge cases cover existing GPS replacement, ZIP generation failures, location API failures.)*

## 25. Admin Panel
- **MVP admin panel:** View users, projects, images processed, failed jobs. Delete abusive users, clear old files.

## 26. Pricing Plan Structure
- **Free Plan:** 10 images/day
- **Pro Plan:** ₹999/month to ₹2,999/month (1,000 images)
- **Agency Plan:** ₹4,999/month to ₹14,999/month (10,000+ images)

## 27. MVP Must-Have Checklist
*(Checklist covering Upload, Metadata, Location, Geo Tagging, Download, Dashboard, Security prior to launch.)*

## 28. QA Test Cases
*(7 strict test cases covering single image, bulk images, invalid files/coordinates, missing location API, and security.)*

## 29. Launch Version Feature Set (Version 1.0)
*(End-to-end user experience features and basic admin monitoring.)*

## 30. Future Version Roadmap
- **Version 1.1:** PNG/HEIC support, Metadata removal.
- **Version 1.2:** Team members, Client folders.
- **Version 2.0:** GMB location auto-fetch, AI generators.
- **Version 3.0:** Full local SEO dashboard, White label portal.

## 31. Developer Instruction Summary
- The app must fully process images and write real GPS EXIF metadata into downloadable files.
- Verify output after every processing job.

## 32. Final Build Prompt
*(Detailed prompt defining the SaaS requirement: Next.js + Tailwind + Mapbox + ExifTool + Supabase.)*

## 33. Best MVP Strategy
Sabse pehle product ko simple but fully working banana hai.
First version mein only 3 things perfect honi chahiye:
1. Upload image
2. Geo-tag image
3. Download verified image

Baaki features baad mein add kar sakte hain.
Your MVP positioning should be:
**“Bulk Geo-Tagging Tool for Local SEO & Business Photos”**
This is clear, sellable, and agency-friendly.
