const fs = require('fs');
const path = require('path');
const dir = 'src/pages/backtracking';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(p, content);
}
console.log('Fixed syntax errors');
