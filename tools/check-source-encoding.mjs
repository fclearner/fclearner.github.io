import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'source');
const suspiciousPatterns = [
  /\uFFFD/,
  /â€[^\s]*/,
  /å‰|å¤|æ•|æ|ç|è¨|è¯|éŸ|å›|ä¸/,
  /鍓嶈|澶氳|涓轰|绔|銆|锛/
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(md|yml|yaml)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const findings = [];
for (const file of walk(sourceDir)) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (suspiciousPatterns.some(pattern => pattern.test(line))) {
      findings.push(`${path.relative(root, file)}:${index + 1}: ${line.slice(0, 120)}`);
    }
  });
}

if (findings.length) {
  console.error(`Source encoding check found ${findings.length} suspicious line(s):`);
  for (const finding of findings.slice(0, 50)) console.error(`- ${finding}`);
  if (findings.length > 50) console.error(`- ... ${findings.length - 50} more`);
  process.exit(1);
}

console.log('Source encoding check passed.');
