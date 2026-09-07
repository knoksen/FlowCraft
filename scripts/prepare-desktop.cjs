const fs = require('node:fs');
const path = require('node:path');

const standalone = path.resolve('.next', 'standalone');
const staticSource = path.resolve('.next', 'static');
const staticTarget = path.join(standalone, '.next', 'static');
const publicSource = path.resolve('public');
const publicTarget = path.join(standalone, 'public');

if (!fs.existsSync(standalone)) {
  throw new Error('The Next.js standalone build was not found. Run npm run build first.');
}

fs.mkdirSync(path.dirname(staticTarget), { recursive: true });
fs.cpSync(staticSource, staticTarget, { recursive: true });

if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicTarget, { recursive: true });
}

console.log('Prepared the Next.js standalone output for Electron.');
