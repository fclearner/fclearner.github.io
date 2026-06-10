import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourcePostsDir = path.join(root, 'source', '_posts');
const expectedPostCount = 17;
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
    '2021/08/24/ASR-LAS-model/LAS_flow.png',
    '2026/06/09/PVAD2-engineering-loop/index.html',
    '2026/06/10/AI-Adaptive-RAG-Retrieval-Scheduling/index.html',
    '2026/06/10/Speech-LLM-Audio-Token-Alignment/index.html',
    '2026/06/10/ASR-Data-Quality-Pipeline-Open-Source/index.html',
    '2026/06/10/PEFT-Engineering-Tradeoffs/index.html',
    '2026/06/10/LLM-Speech-Inference-Serving-Observability/index.html',
    '2026/06/10/ASR-Noise-Structured-Extraction-Evaluation/index.html',
    '2026/06/10/Agentic-Coding-Governance/index.html',
    '2026/06/10/Realtime-Speech-Turn-Taking-Evaluation/index.html',
    '2026/06/10/Speech-Batch-Consistency-Debugging/index.html'
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
    '/2022/06/13/VAD-marblenet/',
    '/2022/05/06/ASR-wenet-data-preprocess/',
    '/2022/04/30/ASR-wenet/',
    '/2021/08/30/wechat-AI/',
    '/2026/06/10/OpenSource-AI-Engineering-Roundup/',
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
  const pvadArticleFiles = [
    path.join(sourcePostsDir, 'PVAD2-engineering-loop.md'),
    path.join(publicDir, '2026', '06', '09', 'PVAD2-engineering-loop', 'index.html')
  ];
  const forbiddenPvadDisclosures = [
    'E:\\workspace',
    'E:/workspace',
    '/mnt/e/workspace',
    'C:\\Users',
    '/root/',
    'SeetaCloud',
    'connect.westd',
    '10515',
    'personal_vad2',
    'Personal-vad-2.0.git',
    'RTX 5090'
  ];
  const requiredPvadReferences = [
    'https://github.com/fclearner/Personal-vad-2.0'
  ];

  for (const file of pvadArticleFiles) {
    if (!exists(file)) continue;
    const content = read(file);
    for (const pattern of forbiddenPvadDisclosures) {
      if (content.includes(pattern)) fail(`Found forbidden PVAD disclosure ${JSON.stringify(pattern)} in ${path.relative(root, file)}`);
    }
    for (const pattern of requiredPvadReferences) {
      if (!content.includes(pattern)) fail(`Missing required PVAD reference ${JSON.stringify(pattern)} in ${path.relative(root, file)}`);
    }
  }


  const seriesArticles = [
    {
      source: 'AI-Adaptive-RAG-Retrieval-Scheduling.md',
      html: ['2026', '06', '10', 'AI-Adaptive-RAG-Retrieval-Scheduling', 'index.html'],
      required: ['Adaptive RAG', 'Self-RAG', 'GraphRAG', 'retriever']
    },
    {
      source: 'Speech-LLM-Audio-Token-Alignment.md',
      html: ['2026', '06', '10', 'Speech-LLM-Audio-Token-Alignment', 'index.html'],
      required: ['Qwen3-ASR', 'Qwen-Omni', 'WeNet', 'CTC']
    },
    {
      source: 'ASR-Data-Quality-Pipeline-Open-Source.md',
      html: ['2026', '06', '10', 'ASR-Data-Quality-Pipeline-Open-Source', 'index.html'],
      required: ['ASR', 'pseudo-label', 'WER', 'reason code']
    },
    {
      source: 'PEFT-Engineering-Tradeoffs.md',
      html: ['2026', '06', '10', 'PEFT-Engineering-Tradeoffs', 'index.html'],
      required: ['PEFT', 'LoRA', 'Prefix-Tuning', 'QLoRA']
    },
    {
      source: 'LLM-Speech-Inference-Serving-Observability.md',
      html: ['2026', '06', '10', 'LLM-Speech-Inference-Serving-Observability', 'index.html'],
      required: ['vLLM', 'SGLang', 'Triton', 'p99']
    },
    {
      source: 'ASR-Noise-Structured-Extraction-Evaluation.md',
      html: ['2026', '06', '10', 'ASR-Noise-Structured-Extraction-Evaluation', 'index.html'],
      required: ['ASR', 'NER', 'precision', 'recall']
    },
    {
      source: 'Agentic-Coding-Governance.md',
      html: ['2026', '06', '10', 'Agentic-Coding-Governance', 'index.html'],
      required: ['Agentic Coding', 'MCP', 'reviewer', 'integrator']
    },
    {
      source: 'Realtime-Speech-Turn-Taking-Evaluation.md',
      html: ['2026', '06', '10', 'Realtime-Speech-Turn-Taking-Evaluation', 'index.html'],
      required: ['Turn-taking', 'semantic end', 'partial', 'latency']
    },
    {
      source: 'Speech-Batch-Consistency-Debugging.md',
      html: ['2026', '06', '10', 'Speech-Batch-Consistency-Debugging', 'index.html'],
      required: ['batch', 'mask', 'dtype', 'subsampling']
    }
  ];
  const forbiddenSeriesDisclosures = [
    'E:\\workspace',
    'E:/workspace',
    '/mnt/e/workspace',
    'C:\\Users',
    '/root/',
    'PROJECT_CONTEXT',
    'MONICA_',
    'PingAn',
    '\u5e73\u5b89',
    '\u4fdd\u9669',
    '\u5ba2\u6237',
    '\u5ba2\u670d',
    '\u8f66\u9669',
    '\u62a5\u6848',
    '\u836f\u54c1',
    '\u533b\u7597',
    'full-duplex',
    'duplex',
    'LMDeploy',
    'lmdeploy-cpp-logits-duplex',
    'fclearner_cpp_logits',
    'connect.westd',
    'SeetaCloud',
    '10515',
    '50051',
    '18080',
    '\u4e1a\u52a1',
    'idea'
  ];

  for (const article of seriesArticles) {
    const articleFiles = [
      path.join(sourcePostsDir, article.source),
      path.join(publicDir, ...article.html)
    ];
    for (const file of articleFiles) {
      if (!exists(file)) continue;
      const content = read(file);
      for (const pattern of forbiddenSeriesDisclosures) {
        if (content.includes(pattern)) fail(`Found forbidden AI series disclosure ${JSON.stringify(pattern)} in ${path.relative(root, file)}`);
      }
      for (const pattern of article.required) {
        if (!content.includes(pattern)) fail(`Missing required AI series reference ${JSON.stringify(pattern)} in ${path.relative(root, file)}`);
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
