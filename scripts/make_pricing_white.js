const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

function makeFullWidthWhite(content, sectionRegex) {
  return content.replace(sectionRegex, (match, openTag, inner, closeTag) => {
    let newOpen = `<section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-white text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`;
    
    // Invert text
    let newInner = inner
      .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
      .replace(/text-\[\#4D4D4D\]/g, 'text-[#666666]')
      .replace(/bg-\[\#171717\]/g, 'bg-[#F9F9F9]')
      .replace(/bg-\[\#0A0A10\]/g, 'bg-[#F0F0F0]')
      .replace(/border-\[\#4D4D4D\]/g, 'border-[#E5E5E5]');

    // Strip previous wrappers if they exist
    let finalInner = newInner.replace(/^<div className="max-w-7xl mx-auto w-full">\n/, '');
    finalInner = finalInner.replace(/<\/div>\n?$/, '');
    
    return `${newOpen}${finalInner}\n</div>\n${closeTag}`;
  });
}

const priceRegex = /(<section id="pricing" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = makeFullWidthWhite(content, priceRegex);

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Pricing converted to White Theme.");
