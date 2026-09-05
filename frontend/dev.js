const { spawn } = require('child_process');

const args = process.argv.slice(2);
const newArgs = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--host') {
    const nextArg = args[i + 1];
    if (nextArg && !nextArg.startsWith('-')) {
      newArgs.push('--hostname', nextArg);
      i++; // skip next arg as it was the value for host
    } else {
      newArgs.push('--hostname', '0.0.0.0');
    }
  } else if (arg.startsWith('--host=')) {
    const hostValue = arg.split('=')[1];
    newArgs.push(`--hostname=${hostValue}`);
  } else {
    newArgs.push(arg);
  }
}

// Add default port if not specified
const hasPort = newArgs.includes('--port') || newArgs.includes('-p');
const finalArgs = ['dev'];
if (!hasPort) {
  finalArgs.push('--port', '6969');
}
finalArgs.push(...newArgs);

console.log(`> geo-tagger-frontend@0.1.0 dev`);
console.log(`> next ${finalArgs.join(' ')}\n`);

const nextBin = require.resolve('next/dist/bin/next');
const child = spawn('node', [nextBin, ...finalArgs], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
