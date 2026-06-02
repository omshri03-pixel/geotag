const fs = require('fs');
const content = fs.readFileSync('./src/app/page.tsx', 'utf8');

const blocks = content.split('"use client";');
const block4 = '"use client";' + blocks[blocks.length - 1];

const block1 = '"use client";' + blocks[1]; 
const featStart = '{/* ==================== GEOCENTRIC BENTO GRID (SECTION 2: FEATURES) ==================== */}';
const featEnd = '{/* ==================== HOW IT WORKS (SECTION 3) ==================== */}';

const featIndex1 = block1.indexOf(featStart);
const featEnd1 = block1.indexOf(featEnd);
const fixedFeatures = block1.substring(featIndex1, featEnd1);

const featIndex4 = block4.indexOf(featStart);
const featEnd4 = block4.indexOf(featEnd);
const rebuiltContent = block4.substring(0, featIndex4) + fixedFeatures + block4.substring(featEnd4);

const pipeStart = '{/* ==================== WORKFLOW PIPELINE: "THE 5-STEP PIN DROP SEQUENCE" ==================== */}';
const pipeEnd = '{/* ==================== COMPASS MAP SANDBOX (SECTION 4) ==================== */}';
const pipeIndex1 = content.indexOf(pipeStart); 
const pipeEnd1 = content.indexOf(pipeEnd);
const fixedPipeline = content.substring(pipeIndex1, pipeEnd1);

const pipeIndex4 = rebuiltContent.lastIndexOf(pipeStart);
const pipeEnd4 = rebuiltContent.lastIndexOf(pipeEnd);
const finalContent = rebuiltContent.substring(0, pipeIndex4) + fixedPipeline + rebuiltContent.substring(pipeEnd4);

fs.writeFileSync('./src/app/page.tsx', finalContent, 'utf8');
console.log("File rebuilt successfully from blocks!");
