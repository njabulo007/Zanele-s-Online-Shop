const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const src = path.join(repoRoot, 'dist', 'client');
    const dest = path.join(repoRoot, '.vercel', 'output', 'static');
    await copyDir(src, dest);
    console.log(`Copied client assets from ${src} to ${dest}`);
  } catch (err) {
    console.error('Failed to copy client assets:', err);
    process.exit(1);
  }
})();
