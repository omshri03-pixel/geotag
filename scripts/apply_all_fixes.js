/**
 * MASTER APPLY: Applies all section theme fixes and then prunes to a single component.
 * Run this script any time you need to reapply the full theme.
 * Usage: node apply_all_fixes.js
 */

const { execSync } = require('child_process');

const steps = [
    'node fix_features.js',
    'node fix_pipeline.js',
    'node fix_deployments.js',
    'node fix_pricing.js',
    'node fix_testimonials.js',
    'node prune.js',
];

for (const step of steps) {
    console.log(`\n▶ Running: ${step}`);
    try {
        const out = execSync(step, { cwd: __dirname }).toString();
        console.log(out.trim());
    } catch (e) {
        console.error(`✗ FAILED: ${step}\n${e.message}`);
        process.exit(1);
    }
}

console.log('\n✅ All fixes applied and file pruned successfully!');
