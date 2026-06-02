const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf8');

function makeFullWidthLight(content, sectionRegex, idAttr = '') {
  return content.replace(sectionRegex, (match, openTag, inner, closeTag) => {
    // Replace opening tag with full-width light background
    let newOpen = `<section ${idAttr} className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`;
    
    // Check if inner content is already wrapped with max-w-7xl (from my bad previous attempt)
    // Actually we just append </div> before </section>
    let newClose = `\n</div>\n${closeTag}`;
    
    return `${newOpen}${inner}${newClose}`;
  });
}

// 1. Pipeline
const pipelineRegex = /(<section id="pipeline" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = makeFullWidthLight(content, pipelineRegex, 'id="pipeline"');

// 2. Deployments
const deployRegex = /(<section id="deployments" className="[^"]*">)([\s\S]*?)(<\/section>)/;
content = makeFullWidthLight(content, deployRegex, 'id="deployments"');

// 3. Testimonials
// Wait, testimonials doesn't have an ID, it has a specific comment before it.
const testStart = '<section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#F25623]/30 bg-white rounded-[40px] w-full mb-16 shadow-2xl shadow-none">';
const testIndex = content.indexOf(testStart);
if (testIndex !== -1) {
    const testEnd = content.indexOf('</section>', testIndex) + 10;
    let testBlock = content.substring(testIndex, testEnd);
    
    testBlock = testBlock.replace(testStart, `<section className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]">\n<div className="max-w-7xl mx-auto w-full">\n`);
    testBlock = testBlock.replace(/<\/section>$/, `\n</div>\n</section>`);
    
    content = content.substring(0, testIndex) + testBlock + content.substring(testEnd);
}

fs.writeFileSync('./src/app/page.tsx', content, 'utf8');
console.log("Light sections made full width.");
