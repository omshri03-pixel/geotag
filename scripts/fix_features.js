const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

const featStartStr = '{/* ==================== GEOCENTRIC BENTO GRID (SECTION 2: FEATURES) ==================== */}';
const featStartIndex = content.indexOf(featStartStr);

if (featStartIndex !== -1) {
    const nextSectionStr = '{/* ==================== HOW IT WORKS (SECTION 3) ==================== */}';
    const nextSectionIndex = content.indexOf(nextSectionStr);
    
    const newFeat = `      {/* ==================== GEOCENTRIC BENTO GRID (SECTION 2: FEATURES) ==================== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-white border border-[#171717]/10 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
            Geographic Mapping System
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#171717] leading-tight font-sans">
            Discover the Local SEO Map Realm
          </h2>
          <p className="text-[#4D4D4D] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
            Deploy accurate pin drop coordinate parameters to guarantee footprint-free local search pack prominence.
          </p>
        </div>

        {/* Bento Grid (Stacks on Tablet/Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          
          {/* Card 1 */}
          <div className="col-span-1 md:col-span-2 border border-[#E5E5E5] bg-white rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-[#F25623]/40 transition-colors duration-300 text-left w-full h-full shadow-md hover:shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(242,86,35,0.08),transparent_70%)]" />
            <div className="flex flex-col h-full justify-between gap-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#F25623]/10 border border-[#F25623]/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#F25623]" />
              </div>
              <div className="space-y-3">
                <h4 className="font-extrabold text-lg sm:text-xl text-[#171717] flex items-center gap-2 font-sans">
                  <Map className="w-5 h-5 text-[#F25623]" /> Website Batch Gallery Scraper
                </h4>
                <p className="text-xs sm:text-sm text-[#4D4D4D] leading-relaxed font-medium">
                  Scan and crawl dental offices, legal consultation firms, or multi-location restaurant galleries bulk. Our backend crawls target URLs, parses attachments, and prepares files instantly for location preset injection.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 border border-[#E5E5E5] bg-white rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-[#171717]/20 transition-colors duration-300 text-left w-full h-full shadow-md hover:shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_top_right,rgba(23,23,23,0.05),transparent_70%)]" />
            <div className="flex flex-col h-full justify-between gap-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#171717]/5 border border-[#E5E5E5] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#171717]" />
              </div>
              <div className="space-y-3">
                <h4 className="font-extrabold text-lg sm:text-xl text-[#171717] flex items-center gap-2 font-sans">
                  <Navigation className="w-5 h-5 text-[#171717]" /> Anti-Footprint GPS Dispersal
                </h4>
                <p className="text-xs text-[#4D4D4D] leading-relaxed font-medium">
                  Avoid search listing algorithm flags. Scatter pin drops randomly within a configured meter radius around your main storefront coordinates, simulating real organic customer reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-1 border border-[#E5E5E5] bg-white rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-[#F25623]/40 transition-colors duration-300 text-left w-full h-full shadow-md hover:shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_top_right,rgba(242,86,35,0.08),transparent_70%)]" />
            <div className="flex flex-col h-full justify-between gap-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#F25623]/10 border border-[#F25623]/20 flex items-center justify-center">
                <Sliders className="w-6 h-6 text-[#F25623]" />
              </div>
              <div className="space-y-3">
                <h4 className="font-extrabold text-lg sm:text-xl text-[#171717] flex items-center gap-2 font-sans">
                  <Sliders className="w-5 h-5 text-[#F25623]" /> Next-Gen Map Compressors
                </h4>
                <p className="text-xs text-[#4D4D4D] leading-relaxed font-medium">
                  Convert camera JPEGs/PNGs into lightweight, high-performance WebP and AVIF files. Improve local page-speed indices by up to 90% while fully preserving EXIF coordinate structures.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-span-1 md:col-span-2 border border-[#E5E5E5] bg-white rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-[#171717]/20 transition-colors duration-300 text-left w-full h-full shadow-md hover:shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(23,23,23,0.05),transparent_70%)]" />
            <div className="flex flex-col h-full justify-between gap-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#171717]/5 border border-[#E5E5E5] flex items-center justify-center">
                <Database className="w-6 h-6 text-[#171717]" />
              </div>
              <div className="space-y-3">
                <h4 className="font-extrabold text-lg sm:text-xl text-[#171717] flex items-center gap-2 font-sans">
                  <Database className="w-5 h-5 text-[#171717]" /> PostgreSQL Presets History
                </h4>
                <p className="text-xs sm:text-sm text-[#4D4D4D] leading-relaxed font-medium">
                  Map and persist historical geocoded locations in a secure workspace grid. Re-download verified packages, audit coordinates, and manage multi-location client credentials smoothly.
                </p>
              </div>
            </div>
          </div>

        </div>
        
        </div>
      </section>
`;
    
    content = content.substring(0, featStartIndex) + newFeat + content.substring(nextSectionIndex);
}

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Features successfully hard-coded to perfect layout.");
