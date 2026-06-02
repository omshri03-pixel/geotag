const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\raico\\Downloads\\GEO Tagger Buzz E\\src\\app\\page.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('<section')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});
