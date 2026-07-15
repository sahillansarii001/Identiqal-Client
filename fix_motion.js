const fs = require('fs');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src/components').concat(walk('./src/app'));
files.forEach(file => {
  if (!file.endsWith('.jsx') && !file.endsWith('.js')) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('useReducedMotion')) {
    content = content.replace(/,\s*useReducedMotion/g, '')
                     .replace(/useReducedMotion,\s*/g, '')
                     .replace(/{\s*useReducedMotion\s*}/g, '{}');
    content = content.replace(/import\s*{\s*}\s*from\s*['"]framer-motion['"];?\n?/g, '');
    
    if (!content.includes('useSafeReducedMotion')) {
      const importSafe = "import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion.js';\n";
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLine = content.indexOf('\n', lastImportIndex) + 1;
        content = content.slice(0, nextLine) + importSafe + content.slice(nextLine);
      } else {
        content = importSafe + content;
      }
    }
    content = content.replace(/useReducedMotion\(\)/g, 'useSafeReducedMotion()');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
