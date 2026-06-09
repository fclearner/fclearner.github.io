import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourcePostsDir = path.join(root, 'source', '_posts');
const expectedPostCount = 11;
const errors = [];
const warnings = [];

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, predicate = () => true) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function localTargetToFile(rawTarget, fromFile) {
  if (!rawTarget) return null;
  if (/^(https?:)?\/\//i.test(rawTarget)) return null;
  if (/^(mailto|tel|javascript|data):/i.test(rawTarget)) return null;

  const noHash = rawTarget.split('#')[0];
  const noQuery = noHash.split('?')[0];
  if (!noQuery) return null;

  let relativeTarget = noQuery;
  try {
    relativeTarget = decodeURI(relativeTarget);
  } catch {
    warn(`Could not decode URI ${rawTarget} in ${path.relative(root, fromFile)}`);
  }

  const baseDir = path.dirname(fromFile);
  let resolved;
  if (relativeTarget.startsWith('/')) {
    resolved = path.join(publicDir, relativeTarget);
  } else {
    resolved = path.resolve(baseDir, relativeTarget);
  }

  if (rawTarget.endsWith('/') || !path.extname(resolved)) {
    resolved = path.join(resolved, 'index.html');
  }
  return resolved;
}

function collectAttributes(html) {
  const attrs = [];
  const pattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html))) attrs.push(match[1]);
  return attrs;
}

if (!exists(publicDir)) fail('public/ does not exist. Run npm run build first.');
if (!exists(sourcePostsDir)) fail('source/_posts does not exist.');

if (!errors.length) {
  const sourcePosts = fs.readdirSync(sourcePostsDir).filter(name => name.endsWith('.md'));
  if (sourcePosts.length !== expectedPostCount) {
    fail(`Expected ${expectedPostCount} source posts, found ${sourcePosts.length}.`);
  }

  const cnamePath = path.join(publicDir, 'CNAME');
  if (!exists(cnamePath)) fail('public/CNAME is missing.');
  else if (read(cnamePath).trim() !== 'alanfangblog.com') {
    fail(`public/CNAME should be alanfangblog.com, got ${JSON.stringify(read(cnamePath).trim())}.`);
  }

  const criticalFiles = [
    'index.html',
    'about/index.html',
    'about/index/Mydraw1.jpg',
    'archives/index.html',
    'archives/page/2/index.html',
    '2022/06/13/VAD-marblenet/index.html',
    '2022/05/06/ASR-wenet-data-preprocess/index.html',
    '2021/08/24/ASR-LAS-model/LAS_flow.png'
  ];
  for (const rel of criticalFiles) {
    if (!exists(path.join(publicDir, rel))) fail(`Missing generated file: public/${rel}`);
  }

  const htmlFiles = walk(publicDir, file => file.endsWith('.html'));
  const stalePatterns = [
    'http://yoursite.com',
    '/about/index.html/Mydraw1.jpg',
    'Deep learing',
    '/tags/Deep-learing/',
    'template not found',
    'Cannot GET /ASR-LAS-model'
  ];

  const postUrls = new Set();
  for (const file of htmlFiles) {
    const html = read(file);
    for (const pattern of stalePatterns) {
      if (html.includes(pattern)) fail(`Found stale pattern ${JSON.stringify(pattern)} in ${path.relative(root, file)}`);
    }

    for (const match of html.matchAll(/href=["'](\/\d{4}\/\d{2}\/\d{2}\/[^#"']+\/)["']/g)) {
      postUrls.add(match[1]);
    }

    for (const target of collectAttributes(html)) {
      const resolved = localTargetToFile(target, file);
      if (resolved && !exists(resolved)) {
        fail(`Broken local reference in ${path.relative(root, file)}: ${target} -> ${path.relative(root, resolved)}`);
      }
    }
  }

  if (postUrls.size !== expectedPostCount) {
    fail(`Expected ${expectedPostCount} generated post URLs, found ${postUrls.size}.`);
  }
}

for (const message of warnings) console.warn(`WARN ${message}`);

if (errors.length) {
  console.error(`Generated site quality check failed with ${errors.length} issue(s):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`Generated site quality check passed (${expectedPostCount} posts).`);
