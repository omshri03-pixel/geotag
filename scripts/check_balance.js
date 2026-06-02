const fs = require('fs');
const content = fs.readFileSync('./src/app/page.tsx', 'utf8');

const lines = content.split('\n');
let divCount = 0;
let sectionCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Basic naive counting
  const openDivs = (line.match(/<div(\s|>)/g) || []).length;
  const closeDivs = (line.match(/<\/div>/g) || []).length;
  const openSections = (line.match(/<section(\s|>)/g) || []).length;
  const closeSections = (line.match(/<\/section>/g) || []).length;
  
  divCount += openDivs - closeDivs;
  sectionCount += openSections - closeSections;
}

console.log(`Final div balance: ${divCount}`);
console.log(`Final section balance: ${sectionCount}`);
