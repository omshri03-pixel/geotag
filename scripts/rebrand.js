const fs = require('fs');
const path = './src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The User's Palette:
// #171717 (Black)
// #F25623 (Orange)
// #4D4D4D (Dark Gray)
// #DEDEDE (Light Gray)

// 1. Strip out all arbitrary color tints from Section backgrounds and replace with #171717 or #4D4D4D
content = content.replace(/bg-\[#000A0F\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#0F0500\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#08000F\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#000F05\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#00050F\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#0F0800\]\/80/g, 'bg-[#171717]');
content = content.replace(/bg-\[#0A0400\]/g, 'bg-[#171717]');
content = content.replace(/bg-\[#05050A\]/g, 'bg-[#171717]');
content = content.replace(/bg-\[#030307\]/g, 'bg-[#171717]');
content = content.replace(/bg-\[#000000\]/g, 'bg-[#171717]');
content = content.replace(/bg-black/g, 'bg-[#171717]');

// 2. Replace arbitrary borders with #4D4D4D
content = content.replace(/border-cyan-[a-zA-Z0-9\/]+/g, 'border-[#4D4D4D]');
content = content.replace(/border-violet-[a-zA-Z0-9\/]+/g, 'border-[#4D4D4D]');
content = content.replace(/border-emerald-[a-zA-Z0-9\/]+/g, 'border-[#4D4D4D]');
content = content.replace(/border-amber-[a-zA-Z0-9\/]+/g, 'border-[#4D4D4D]');
content = content.replace(/border-white\/\[[0-9.]+\]/g, 'border-[#4D4D4D]');

// 3. Replace arbitrary hover borders with #F25623
content = content.replace(/hover:border-cyan-[a-zA-Z0-9\/]+/g, 'hover:border-[#F25623]');
content = content.replace(/hover:border-violet-[a-zA-Z0-9\/]+/g, 'hover:border-[#F25623]');
content = content.replace(/hover:border-emerald-[a-zA-Z0-9\/]+/g, 'hover:border-[#F25623]');
content = content.replace(/hover:border-amber-[a-zA-Z0-9\/]+/g, 'hover:border-[#F25623]');
content = content.replace(/hover:border-white\/\[[0-9.]+\]/g, 'hover:border-[#F25623]');

// 4. Replace texts with #DEDEDE
content = content.replace(/text-cyan-[0-9]+/g, 'text-[#DEDEDE]');
content = content.replace(/text-violet-[0-9]+/g, 'text-[#DEDEDE]');
content = content.replace(/text-amber-[0-9]+/g, 'text-[#DEDEDE]');
content = content.replace(/text-emerald-[0-9]+/g, 'text-[#DEDEDE]');
content = content.replace(/text-white/g, 'text-[#DEDEDE]');
content = content.replace(/text-zinc-[0-9]+/g, 'text-[#DEDEDE]');
content = content.replace(/text-\[#00E5FF\]/g, 'text-[#DEDEDE]');
content = content.replace(/text-black/g, 'text-[#171717]');

// 5. Replace arbitrary bg colors with #4D4D4D or #171717
content = content.replace(/bg-cyan-[0-9]+\/[0-9]+/g, 'bg-[#4D4D4D]');
content = content.replace(/bg-violet-[0-9]+\/[0-9]+/g, 'bg-[#4D4D4D]');
content = content.replace(/bg-amber-[0-9]+\/[0-9]+/g, 'bg-[#4D4D4D]');
content = content.replace(/bg-emerald-[0-9]+\/[0-9]+/g, 'bg-[#4D4D4D]');
content = content.replace(/bg-white\/\[[0-9.]+\]/g, 'bg-[#4D4D4D]');

// 6. Ensure brand is explicitly #F25623
content = content.replace(/bg-brand\/[0-9]+/g, 'bg-[#F25623]/20');
content = content.replace(/bg-brand/g, 'bg-[#F25623]');
content = content.replace(/text-brand/g, 'text-[#F25623]');
content = content.replace(/from-brand/g, 'from-[#F25623]');
content = content.replace(/to-brand/g, 'to-[#F25623]');
content = content.replace(/border-brand\/[0-9]+/g, 'border-[#F25623]/30');
content = content.replace(/border-brand/g, 'border-[#F25623]');
content = content.replace(/shadow-brand\/[0-9]+/g, 'shadow-none');

// 7. Gradients should be just solid #F25623 or #171717 to avoid unapproved colors
content = content.replace(/bg-gradient-to-[a-z]+ from-\[#[A-Z0-9]+\] to-\[#[A-Z0-9]+\]/g, 'bg-[#F25623]');
content = content.replace(/bg-gradient-to-[a-z]+ from-\[#[A-Z0-9]+\] via-\[#[A-Z0-9]+\] to-\[#[A-Z0-9]+\]/g, 'bg-[#F25623]');

// Replace remaining stray hexes
content = content.replace(/#FF8533/g, '#F25623');
content = content.replace(/#FFA366/g, '#F25623');
content = content.replace(/#FFC299/g, '#F25623');
content = content.replace(/#101018/g, '#171717');
content = content.replace(/#1C1C28/g, '#4D4D4D');

fs.writeFileSync(path, content, 'utf8');
console.log("Success");
