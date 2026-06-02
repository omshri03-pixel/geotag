const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

const testTitle = '{/* ==================== TESTIMONIALS SECTION ("DON\'T TRUST OUR WORD FOR IT") ==================== */}';
const testStartIndex = content.indexOf(testTitle);

if (testStartIndex !== -1) {
    const nextSectionStr = '{/* ==================== COMMONLY ASKED QUESTIONS (SECTION 7: FAQ) ==================== */}';
    const nextSectionIndex = content.indexOf(nextSectionStr);
    
    const newTestimonials = `      {/* ==================== TESTIMONIALS SECTION ("DON'T TRUST OUR WORD FOR IT") ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623]">
        <div className="max-w-7xl mx-auto w-full">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-white/20 border border-[#171717]/20 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            Don't Trust Our Word For It
          </h2>
          <p className="text-[#171717] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
            See what leading local SEO agencies and freelance marketers have to say about scaling with LocalLens.
          </p>
        </div>

        {/* 3 Column Grid for Testimonials (Stacks nicely on tablet/mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          
          {/* Testimonial 1 */}
          <div className="border border-[#171717] bg-[#171717] p-6 sm:p-8 rounded-[24px] space-y-6 relative hover:border-[#171717]/40 transition-colors duration-300 text-left w-full shadow-2xl opacity-90 hover:opacity-100">
            <div className="text-[#F25623] flex gap-1">
              <Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" />
            </div>
            <p className="text-sm text-[#DEDEDE] leading-relaxed font-medium">
              "We manage 15 multi-location dental clinics. Manually geotagging images was a nightmare. This system cut our operations time by 90%. The distance matrix presets are absolutely genius."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[#4D4D4D]">
              <div className="w-10 h-10 rounded-full bg-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs border border-[#4D4D4D]">MR</div>
              <div>
                <p className="text-xs font-black text-white">Mike R.</p>
                <p className="text-[10px] text-[#DEDEDE] font-mono tracking-wider">SEO Agency Owner</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="border border-[#171717] bg-[#171717] p-6 sm:p-8 rounded-[24px] space-y-6 relative hover:border-[#171717]/40 transition-colors duration-300 text-left w-full shadow-2xl opacity-90 hover:opacity-100">
            <div className="text-[#F25623] flex gap-1">
              <Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" />
            </div>
            <p className="text-sm text-[#DEDEDE] leading-relaxed font-medium">
              "The EXIF compiler lossless compression is the real secret weapon here. I'm injecting coordinates and generating keyword-rich ALT tags while making the images load 3x faster on Shopify."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[#4D4D4D]">
              <div className="w-10 h-10 rounded-full bg-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs border border-[#4D4D4D]">SJ</div>
              <div>
                <p className="text-xs font-black text-white">Sarah J.</p>
                <p className="text-[10px] text-[#DEDEDE] font-mono tracking-wider">Freelance Consultant</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="border border-[#171717] bg-[#171717] p-6 sm:p-8 rounded-[24px] space-y-6 relative hover:border-[#171717]/40 transition-colors duration-300 text-left w-full shadow-2xl opacity-90 hover:opacity-100">
            <div className="text-[#F25623] flex gap-1">
              <Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" /><Star className="w-4 h-4 fill-[#F25623]" />
            </div>
            <p className="text-sm text-[#DEDEDE] leading-relaxed font-medium">
              "The URL batch image scraper paid for itself on day one. I just dropped in my client's messy Squarespace gallery URL, and it instantly ripped, compressed, and tagged 140 images in seconds."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[#4D4D4D]">
              <div className="w-10 h-10 rounded-full bg-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs border border-[#4D4D4D]">DK</div>
              <div>
                <p className="text-xs font-black text-white">David K.</p>
                <p className="text-[10px] text-[#DEDEDE] font-mono tracking-wider">Local Rank Expert</p>
              </div>
            </div>
          </div>
          
        </div>
        
        </div>
      </section>
`;
    
    content = content.substring(0, testStartIndex) + newTestimonials + content.substring(nextSectionIndex);
}

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Testimonials successfully hard-coded to perfect Orange layout.");
