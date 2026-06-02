const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

// Helper to replace wrapper and inner text
function rewriteSection(content, sectionRegex, theme) {
  return content.replace(sectionRegex, (match, openTag, inner, closeTag) => {
    
    // First, normalize everything to a baseline (pretend it's all dark)
    // Actually, it's easier to just blindly replace common colors based on the theme.
    
    let newInner = inner;
    let newOpen = openTag;
    
    if (theme === 'WHITE') {
        newOpen = `<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-white text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`;
        newInner = newInner
            .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
            .replace(/text-\[\#171717\]/g, 'text-[#171717]') // normalize
            .replace(/text-\[\#666666\]/g, 'text-[#4D4D4D]')
            .replace(/bg-\[\#171717\]/g, 'bg-[#F9F9F9]')
            .replace(/bg-\[\#0A0A10\]/g, 'bg-[#F0F0F0]')
            .replace(/bg-\[\#4D4D4D\]/g, 'bg-[#E5E5E5]')
            .replace(/border-\[\#4D4D4D\]/g, 'border-[#E5E5E5]')
            .replace(/border-\[\#E5E5E5\]/g, 'border-[#E5E5E5]')
            .replace(/text-white/g, 'text-[#171717]');
    } 
    else if (theme === 'LIGHT_GRAY') {
        newOpen = `<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`;
        newInner = newInner
            .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
            .replace(/text-\[\#171717\]/g, 'text-[#171717]')
            .replace(/text-\[\#666666\]/g, 'text-[#4D4D4D]')
            .replace(/bg-\[\#171717\]/g, 'bg-white')
            .replace(/bg-\[\#0A0A10\]/g, 'bg-[#F9F9F9]')
            .replace(/bg-\[\#4D4D4D\]/g, 'bg-[#E5E5E5]')
            .replace(/border-\[\#4D4D4D\]/g, 'border-[#171717]/10')
            .replace(/border-\[\#E5E5E5\]/g, 'border-[#171717]/10')
            .replace(/text-white/g, 'text-[#171717]');
    }
    else if (theme === 'ORANGE') {
        newOpen = `<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623] text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`;
        // On orange background, we want white/dark gray cards and black text
        newInner = newInner
            .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
            .replace(/text-\[\#171717\]/g, 'text-[#171717]')
            .replace(/text-\[\#666666\]/g, 'text-[#171717]/80')
            .replace(/text-\[\#4D4D4D\]/g, 'text-[#171717]/80')
            .replace(/bg-\[\#171717\]/g, 'bg-white/90')
            .replace(/bg-\[\#F9F9F9\]/g, 'bg-white/90')
            .replace(/bg-white/g, 'bg-white/90')
            .replace(/bg-\[\#0A0A10\]/g, 'bg-white/60')
            .replace(/bg-\[\#4D4D4D\]/g, 'bg-[#171717]/10')
            .replace(/border-\[\#4D4D4D\]/g, 'border-[#171717]/20')
            .replace(/border-\[\#E5E5E5\]/g, 'border-[#171717]/20')
            // Any specific orange text should become black to contrast with the orange background!
            .replace(/text-\[\#F25623\]/g, 'text-[#171717]')
            .replace(/bg-\[\#F25623\]/g, 'bg-[#171717]');
    }
    else if (theme === 'BLACK') {
        newOpen = `<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#171717] text-[#DEDEDE]">\n<div className="max-w-7xl mx-auto w-full">\n`;
        newInner = newInner
            .replace(/text-\[\#171717\]/g, 'text-[#DEDEDE]')
            .replace(/text-\[\#666666\]/g, 'text-[#DEDEDE]')
            .replace(/bg-\[\#F9F9F9\]/g, 'bg-[#171717]')
            .replace(/bg-white\/90/g, 'bg-[#171717]')
            .replace(/bg-white/g, 'bg-[#171717]')
            .replace(/bg-\[\#F0F0F0\]/g, 'bg-[#0A0A10]')
            .replace(/bg-\[\#E5E5E5\]/g, 'bg-[#4D4D4D]')
            .replace(/border-\[\#E5E5E5\]/g, 'border-[#4D4D4D]')
            .replace(/border-\[\#171717\]\/20/g, 'border-[#4D4D4D]')
            .replace(/border-\[\#171717\]\/10/g, 'border-[#4D4D4D]');
    }

    // Clean up wrapping (ensure we don't double wrap if it was already wrapped)
    let finalInner = inner.replace(/^<div className="max-w-7xl mx-auto w-full">\n/, '');
    finalInner = finalInner.replace(/<\/div>\n?$/, '');
    
    // apply the theme replacements to the clean inner
    let transformedInner = finalInner;
    if (theme === 'WHITE') transformedInner = newInner;
    if (theme === 'LIGHT_GRAY') transformedInner = newInner;
    if (theme === 'ORANGE') transformedInner = newInner;
    if (theme === 'BLACK') transformedInner = newInner;

    return `${newOpen}${transformedInner}\n</div>\n${closeTag}`;
  });
}

// 1. Features -> WHITE
const featRegex = /(<section id="features" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = rewriteSection(content, featRegex, 'WHITE');

// 2. Pipeline -> ORANGE
const pipeRegex = /(<section id="pipeline" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = rewriteSection(content, pipeRegex, 'ORANGE');

// 3. Deployments -> LIGHT_GRAY
const depRegex = /(<section id="deployments" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = rewriteSection(content, depRegex, 'LIGHT_GRAY');

// 4. Testimonials -> ORANGE
const testStart = '<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]">';
// Wait, my previous script made it this class! Let's just use indexOf for Testimonials block
const testTitle = 'DON\'T TRUST OUR WORD FOR IT';
const testTitleIndex = content.indexOf(testTitle);
if (testTitleIndex !== -1) {
    // find previous <section
    const secIndex = content.lastIndexOf('<section', testTitleIndex);
    const secEnd = content.indexOf('</section>', testTitleIndex) + 10;
    
    let testBlock = content.substring(secIndex, secEnd);
    
    // Convert this block to ORANGE
    testBlock = rewriteSection(testBlock, /(<section[^>]*>)([\s\S]*?)(<\/section>)/, 'ORANGE');
    
    content = content.substring(0, secIndex) + testBlock + content.substring(secEnd);
}

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Ultimate Multi-Color Rewrite Complete!");
