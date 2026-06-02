const fs = require('fs');

let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

// Convert Sandbox back to Dark
const sandboxRegex = /(<section id="sandbox" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = content.replace(sandboxRegex, (match, openTag, inner, closeTag) => {
    // Open tag should be just normal dark section
    let newOpen = `<section id="sandbox" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#F25623]/30 bg-[#171717] rounded-[40px] w-full mb-16 shadow-2xl shadow-none">\n`;
    
    // Remove the wrapper div we added for light mode full-width
    let newInner = inner.replace(/^<div className="max-w-7xl mx-auto w-full">\n/, '');
    newInner = newInner.replace(/<\/div>$/, '');

    // Invert text colors back to Dark Theme
    newInner = newInner
      .replace(/text-\[\#171717\]/g, 'text-[#DEDEDE]')
      .replace(/text-\[\#666666\]/g, 'text-[#DEDEDE]') // Soft gray back to primary
      .replace(/bg-\[\#F9F9F9\]/g, 'bg-[#171717]') // Left panel backgrounds
      .replace(/bg-\[\#F0F0F0\]/g, 'bg-[#0A0A10]') // Map inner panels
      .replace(/bg-white/g, 'bg-[#171717]') // Catch-all for white backgrounds
      .replace(/border-\[\#E5E5E5\]/g, 'border-[#4D4D4D]');
      
    // Fix buttons in sandbox which were text-white or something
    // Sandbox button originally was bg-[#F25623] text-[#171717]
    newInner = newInner.replace(/text-\[\#DEDEDE\] text-xs font-black/g, 'text-[#171717] text-xs font-black');

    return `${newOpen}${newInner}${closeTag}`;
});

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Sandbox converted to Dark.");
