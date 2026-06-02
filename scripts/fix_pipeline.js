const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

const pipelineStart = '<section id="pipeline" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623] text-[#171717]">';
const pipelineRegex = /(<section id="pipeline" className="[^"]*">)([\s\S]*?)(<\/section>)/;

const pipelineNew = `      <section id="pipeline" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623]">
        <div className="max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-white/30 border border-[#171717]/20 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
            Pipeline Sequence
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            The 5-Step Pin-Drop Pipeline
          </h2>
          <p className="text-[#171717] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
            How our geocentric system converts standard camera photos into ranking search engine listing assets.
          </p>
        </div>

        {/* Step Cards (Stacks elegantly on mobile and tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative text-left w-full">
          
          {/* Connector dashed line inside background for desktop */}
          <div className="hidden lg:block absolute top-[50px] left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-[#171717]/20 -z-10" />

          {/* Step 1 */}
          <div className="border border-[#171717] rounded-[24px] p-6 transition-all duration-300 relative bg-[#171717] w-full h-full flex flex-col shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 bg-[#4D4D4D] text-white">
              01
            </div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <ImageIcon className="w-3.5 h-3.5 text-[#F25623]" /> 1. Upload Assets
            </h4>
            <p className="text-[11px] text-[#DEDEDE] leading-relaxed font-medium">
              Drag in clinic/attorney raw camera uploads or enter target URL scraper presets.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-[#171717] rounded-[24px] p-6 transition-all duration-300 relative bg-[#171717] w-full h-full flex flex-col shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 bg-[#4D4D4D] text-white">
              02
            </div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#F25623]" /> 2. Preset Match
            </h4>
            <p className="text-[11px] text-[#DEDEDE] leading-relaxed font-medium">
              Geocode storefront coordinates using Mapbox or search manually using physical address.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-[#171717] rounded-[24px] p-6 transition-all duration-300 relative bg-[#171717] w-full h-full flex flex-col shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 bg-[#4D4D4D] text-white">
              03
            </div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <Compass className="w-3.5 h-3.5 text-[#F25623]" /> 3. GPS Scatter
            </h4>
            <p className="text-[11px] text-[#DEDEDE] leading-relaxed font-medium">
              Configure coordinates scattering offset parameters to avoid footprints.
            </p>
          </div>

          {/* Step 4 */}
          <div className="border border-[#171717] rounded-[24px] p-6 transition-all duration-300 relative bg-[#171717] w-full h-full flex flex-col shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 bg-[#4D4D4D] text-white">
              04
            </div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <Sliders className="w-3.5 h-3.5 text-[#F25623]" /> 4. Exif Compiler
            </h4>
            <p className="text-[11px] text-[#DEDEDE] leading-relaxed font-medium">
              Run ExifTool to inject coordinates, custom SEO ALT tags, and losslessly compress.
            </p>
          </div>

          {/* Step 5 */}
          <div className="border border-[#171717] rounded-[24px] p-6 transition-all duration-300 relative bg-[#171717] w-full h-full flex flex-col shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 bg-[#4D4D4D] text-white">
              05
            </div>
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F25623]" /> 5. Rank Sync
            </h4>
            <p className="text-[11px] text-[#DEDEDE] leading-relaxed font-medium">
              Download ZIP packages, publish to Map Packs, and track localized SEO metrics.
            </p>
          </div>

        </div>
        </div>
      </section>`;

content = content.replace(pipelineRegex, pipelineNew);

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Pipeline rewritten.");
