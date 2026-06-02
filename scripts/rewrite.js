const fs = require('fs');

function makeLight(content, sectionRegex) {
  return content.replace(sectionRegex, (match, openTag, inner, closeTag) => {
    // Make wrapper light
    let newOpen = openTag
      .replace(/bg-\[\#171717\]/g, 'bg-white')
      .replace(/border-\[\#4D4D4D\]/g, 'border-[#E5E5E5]')
      .replace(/shadow-2xl/g, 'shadow-lg');
    
    // Invert text
    let newInner = inner
      .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
      .replace(/text-\[\#4D4D4D\]/g, 'text-[#666666]')
      // Invert card backgrounds
      .replace(/bg-\[\#171717\]/g, 'bg-[#F9F9F9]')
      .replace(/bg-\[\#0A0A10\]/g, 'bg-[#F0F0F0]')
      .replace(/border-\[\#4D4D4D\]/g, 'border-[#E5E5E5]')
      // Invert specific inner text that might be hardcoded
      .replace(/text-white/g, 'text-[#171717]');

    return `${newOpen}${newInner}${closeTag}`;
  });
}

function makeDark(content, sectionRegex) {
  return content.replace(sectionRegex, (match, openTag, inner, closeTag) => {
    // Ensure dark
    let newOpen = openTag
      .replace(/bg-white/g, 'bg-[#171717]')
      .replace(/bg-\[\#DEDEDE\]/g, 'bg-[#171717]')
      .replace(/border-\[\#E5E5E5\]/g, 'border-[#4D4D4D]')
      .replace(/shadow-lg/g, 'shadow-2xl');
    
    let newInner = inner
      .replace(/text-\[\#171717\]/g, 'text-[#DEDEDE]')
      .replace(/text-\[\#666666\]/g, 'text-[#4D4D4D]')
      .replace(/bg-\[\#F9F9F9\]/g, 'bg-[#171717]')
      .replace(/bg-\[\#F0F0F0\]/g, 'bg-[#0A0A10]')
      .replace(/border-\[\#E5E5E5\]/g, 'border-[#4D4D4D]');

    return `${newOpen}${newInner}${closeTag}`;
  });
}

let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

// The regexes need to exactly match the section open tags.
const pipelineRegex = /(<section id="pipeline" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = makeLight(content, pipelineRegex);

const deployRegex = /(<section id="deployments" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = makeLight(content, deployRegex);

const testRegex = /(<section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-\[\#F25623\]\/30 bg-\[\#171717\] rounded-\[40px\] w-full mb-16 shadow-2xl shadow-none">)([\s\S]*?)(<\/section>)/;
// Wait, Testimonials doesn't have an ID. It's the only one with this exact class and no ID?
// Let's just use string replace for Testimonials!
const testStart = '<section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#F25623]/30 bg-[#171717] rounded-[40px] w-full mb-16 shadow-2xl shadow-none">';
const testIndex = content.indexOf(testStart, content.indexOf('DON\'T TRUST OUR WORD FOR IT'));
if (testIndex !== -1) {
    const endSection = '</section>';
    const testEnd = content.indexOf(endSection, testIndex) + endSection.length;
    let testBlock = content.substring(testIndex, testEnd);
    
    // Convert Testimonials to Light
    testBlock = testBlock
      .replace(/bg-\[\#171717\]/g, 'bg-white')
      .replace(/border-\[\#4D4D4D\]/g, 'border-[#E5E5E5]')
      .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
      .replace(/text-\[\#4D4D4D\]/g, 'text-[#666666]');
      
    content = content.substring(0, testIndex) + testBlock + content.substring(testEnd);
}

// Fix Features (it's already light, but has bad contrast text)
const featRegex = /(<section id="features" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = content.replace(featRegex, (match, openTag, inner, closeTag) => {
    let newInner = inner
      .replace(/text-\[\#4D4D4D\]/g, 'text-[#666666]')
      .replace(/border-\[\#4D4D4D\]\/20/g, 'border-[#E5E5E5]');
    return `${openTag}${newInner}${closeTag}`;
});

// Re-invert Sandbox left column text (it's currently text-[#171717], which is fine, but maybe missed some?)
const sandboxRegex = /(<section id="sandbox" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = content.replace(sandboxRegex, (match, openTag, inner, closeTag) => {
    let newInner = inner
      .replace(/text-\[\#DEDEDE\]/g, 'text-[#171717]')
      .replace(/text-\[\#4D4D4D\]/g, 'text-[#666666]');
    // But keep map background dark!
    newInner = newInner.replace(/bg-white/g, 'bg-[#F9F9F9]'); // Soften the cards
    return `${openTag}${newInner}${closeTag}`;
});


fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Rewrite complete.");
