const fs = require('fs');
const path = './src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The Sandbox Section: <section id="sandbox" className="..."> ... </section>
const sandboxRegex = /(<section id="sandbox" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-\[#F25623\]\/30 bg-\[#171717\] rounded-\[40px\] w-full mb-16 shadow-2xl shadow-none">)([\s\S]*?)(<\/section>)/;
content = content.replace(sandboxRegex, (match, openTag, innerContent, closeTag) => {
    // Replace text inside the left column to be dark
    let newInner = innerContent.replace(/text-\[#DEDEDE\]/g, 'text-[#171717]');
    newInner = newInner.replace(/bg-\[#171717\]/g, 'bg-white'); // Right panel backgrounds
    newInner = newInner.replace(/bg-\[#0A0A10\]/g, 'bg-[#F5F5F5]'); // Input backgrounds
    newInner = newInner.replace(/text-\[#171717\]/g, 'text-white'); // Fix buttons
    
    // We want the right side (Sandbox Map itself) to remain dark. Let's just wrap the section, and let the left text be dark.
    return `<section id="sandbox" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]"><div className="max-w-7xl mx-auto w-full">\n${innerContent.replace(/text-\\[#DEDEDE\\]/g, 'text-[#171717]')}\n</div></section>`;
});

// Pricing Section
const pricingRegex = /(<section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-\[#4D4D4D\] bg-\[#171717\] rounded-\[40px\] w-full mb-16 shadow-2xl shadow-none">)([\s\S]*?)(<\/section>)/;
content = content.replace(pricingRegex, (match, openTag, innerContent, closeTag) => {
    let newInner = innerContent.replace(/text-\[#DEDEDE\]/g, 'text-[#171717]');
    newInner = newInner.replace(/bg-\[#171717\]/g, 'bg-white');
    return `<section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]"><div className="max-w-7xl mx-auto w-full">\n${newInner}\n</div></section>`;
});

// FAQ Section
const faqRegex = /(<section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-\[#4D4D4D\] bg-\[#171717\] rounded-\[40px\] w-full mb-16 shadow-2xl shadow-none">)([\s\S]*?)(<\/section>)/;
content = content.replace(faqRegex, (match, openTag, innerContent, closeTag) => {
    let newInner = innerContent.replace(/text-\[#DEDEDE\]/g, 'text-[#171717]');
    newInner = newInner.replace(/bg-\[#171717\]/g, 'bg-white');
    return `<section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE] text-[#171717]"><div className="max-w-7xl mx-auto w-full">\n${newInner}\n</div></section>`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Sections converted to Light Theme.");
