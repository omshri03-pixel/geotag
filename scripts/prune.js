const fs = require('fs');
const content = fs.readFileSync('./src/app/page.tsx', 'utf8');

// The file has 4 duplicated "export default function LandingPage()" blocks.
// We need to extract ONLY the last (most up-to-date) one.
const marker = 'export default function LandingPage() {';
const lastExportIndex = content.lastIndexOf(marker);

if (lastExportIndex === -1) {
    console.error("Could not find export default! Aborting.");
    process.exit(1);
}

const componentBody = content.substring(lastExportIndex);

// Verify we actually got only one copy
const copies = componentBody.split(marker).length - 1;
console.log("Component copies found in extracted body:", copies);

const cleanFile = `"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, CheckCircle2, Zap, Compass, Globe, Sliders, Database, 
  ChevronRight, Sparkles, ImageIcon, Layers, Server, Code2, 
  AlertCircle, ArrowRight, Award, Navigation, Map, Shield, Maximize2, RotateCcw, Eye, Info, Star
} from "lucide-react";

${componentBody}`;

fs.writeFileSync('./src/app/page.tsx', cleanFile, 'utf8');
console.log("Pruned to single component. Total chars:", cleanFile.length);

// Verify
const verify = fs.readFileSync('./src/app/page.tsx', 'utf8');
const exportCount = (verify.match(/export default function LandingPage/g) || []).length;
console.log("Export count after prune:", exportCount);
