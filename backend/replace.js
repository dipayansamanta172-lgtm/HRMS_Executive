const fs = require('fs');
const path = require('path');

const excludeDirs = ['.git', 'node_modules', 'dist', 'build', '.gemini', 'tmp'];
const excludeFiles = ['replace.js', 'package-lock.json', 'yarn.lock'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkAndReplace(fullPath);
      }
    } else {
      if (!excludeFiles.includes(file) && !file.match(/\.(jpg|jpeg|png|gif|svg|ico|ttf|woff|woff2|eot|mp4|webm)$/i)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('StudentHub')) {
            const newContent = content.replace(/StudentHub/g, 'Executive');
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Replaced in ${fullPath}`);
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }
}

walkAndReplace(path.join(__dirname, '..'));
console.log('Search and replace complete.');
