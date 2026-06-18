import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourcePostsDir = path.join(root, 'source', '_posts');
const expectedPostCount = 20;
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

  const problemDrivenMarkers = [
    '## 要解决的问题',
    '## 最小抽象',
    '## 工程闭环',
    '## 直接结论',
    '下一步阅读：'
  ];
  for (const sourcePost of sourcePosts) {
    const sourcePath = path.join(sourcePostsDir, sourcePost);
    const sourceContent = read(sourcePath);
    for (const marker of problemDrivenMarkers) {
      if (!sourceContent.includes(marker)) {
        fail(`Public post ${sourcePost} is missing problem-driven marker ${JSON.stringify(marker)}.`);
      }
    }
  }

  const deepenedPublicPosts = [
    'AI-Adaptive-RAG-Retrieval-Scheduling.md',
    'AI-Adaptive-RAG-Retrieval-Gate.md',
    'ASR-Data-Quality-Pipeline-Open-Source.md',
    'ASR-Noise-Structured-Extraction-Evaluation.md',
    'Speech-Dialog-Data-Synthesis-Quality-Gates.md',
    'Realtime-Speech-Turn-Taking-Evaluation.md',
    'Speech-Batch-Consistency-Debugging.md',
    'Speech-LLM-Audio-Token-Alignment.md',
    'LLM-Speech-Inference-Serving-Observability.md',
    'PVAD2-engineering-loop.md',
    'PEFT-Engineering-Tradeoffs.md',
    'Agentic-Coding-Governance.md'
  ];
  const narrativeProjectPosts = [
    'ASR-Data-Quality-Pipeline-Open-Source.md',
    'ASR-Noise-Structured-Extraction-Evaluation.md',
    'Speech-Dialog-Data-Synthesis-Quality-Gates.md',
    'Realtime-Speech-Turn-Taking-Evaluation.md',
    'Speech-Batch-Consistency-Debugging.md',
    'Speech-LLM-Audio-Token-Alignment.md',
    'LLM-Speech-Inference-Serving-Observability.md',
    'PVAD2-engineering-loop.md',
    'PEFT-Engineering-Tradeoffs.md',
    'Agentic-Coding-Governance.md'
  ];
  const advancedAnalysisMarkers = [
    '## 主线判断',
    '## 设计取舍',
    '## 失败归因',
    '## 评测矩阵',
    '## 实现契约',
    '## 可观测闭环',
    '## 反直觉点',
    '## 排障路径',
    '## 评测设计',
    '## 实验设计',
    '## 小样本推演'
  ];
  for (const sourcePost of deepenedPublicPosts) {
    const sourcePath = path.join(sourcePostsDir, sourcePost);
    if (!exists(sourcePath)) {
      fail('Deepened public post is missing: ' + sourcePost + '.');
      continue;
    }
    const sourceContent = read(sourcePath);
    if (sourceContent.length < 1800) {
      fail('Deepened public post ' + sourcePost + ' is too short: ' + sourceContent.length + ' chars.');
    }
    const markerCount = advancedAnalysisMarkers.filter(marker => sourceContent.includes(marker)).length;
    if (markerCount < 2) {
      fail('Deepened public post ' + sourcePost + ' needs at least two advanced analysis sections.');
    }
  }

  for (const sourcePost of narrativeProjectPosts) {
    const sourcePath = path.join(sourcePostsDir, sourcePost);
    const sourceContent = read(sourcePath);
    if (sourceContent.length < 2100) {
      fail('Narrative project post ' + sourcePost + ' is too short: ' + sourceContent.length + ' chars.');
    }
    if (!sourceContent.includes('## 主线判断')) {
      fail('Narrative project post ' + sourcePost + ' is missing 主线判断.');
    }
    if (!sourceContent.includes('## 小样本推演')) {
      fail('Narrative project post ' + sourcePost + ' is missing 小样本推演.');
    }
  }

  const cnamePath = path.join(publicDir, 'CNAME');
  if (!exists(cnamePath)) fail('public/CNAME is missing.');
  else if (read(cnamePath).trim() !== 'alanfangblog.com') {
    fail(`public/CNAME should be alanfangblog.com, got ${JSON.stringify(read(cnamePath).trim())}.`);
  }

  const criticalFiles = [
    'index.html',
    'search.xml',
    'about/index.html',
    'about/index/Mydraw1.jpg',
    'archives/index.html',
    '2021/08/24/ASR-LAS-model/LAS_flow.png',
    '2026/06/09/PVAD2-engineering-loop/index.html',
    '2026/06/10/AI-Adaptive-RAG-Retrieval-Scheduling/index.html',
    '2026/06/10/AI-Adaptive-RAG-Retrieval-Gate/index.html',
    '2026/06/10/Speech-LLM-Audio-Token-Alignment/index.html',
    '2026/06/10/ASR-Data-Quality-Pipeline-Open-Source/index.html',
    '2026/06/10/PEFT-Engineering-Tradeoffs/index.html',
    '2026/06/10/LLM-Speech-Inference-Serving-Observability/index.html',
    '2026/06/10/ASR-Noise-Structured-Extraction-Evaluation/index.html',
    '2026/06/10/Agentic-Coding-Governance/index.html',
    '2026/06/10/Realtime-Speech-Turn-Taking-Evaluation/index.html',
    '2026/06/10/Speech-Batch-Consistency-Debugging/index.html',
    '2026/06/11/Speech-Dialog-Data-Synthesis-Quality-Gates/index.html',
    '2026/06/16/Agent-Engineering-Radar-2026-06-16/index.html'
  ];
  for (const rel of criticalFiles) {
    if (!exists(path.join(publicDir, rel))) fail(`Missing generated file: public/${rel}`);
  }

  const searchXmlPath = path.join(publicDir, 'search.xml');
  if (exists(searchXmlPath)) {
    const searchXml = read(searchXmlPath);
    const requiredSearchTerms = [
      'Adaptive RAG',
      'Personal VAD',
      'Turn-taking',
      'Batch'
    ];
    for (const term of requiredSearchTerms) {
      if (!searchXml.includes(term)) fail(`public/search.xml is missing search term ${JSON.stringify(term)}.`);
    }
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
  let searchTriggerFound = false;
  for (const file of htmlFiles) {
    const html = read(file);
    if (html.includes('menu-item-search') || html.includes('popup-trigger')) {
      searchTriggerFound = true;
    }
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
  if (!searchTriggerFound) fail('Generated HTML does not contain the NexT local-search trigger.');

  const representativeCommentPage = path.join(publicDir, '2026', '06', '10', 'AI-Adaptive-RAG-Retrieval-Scheduling', 'index.html');
  if (exists(representativeCommentPage)) {
    const commentHtml = read(representativeCommentPage);
    const forbiddenCommentSnippets = [
      'utterances-container',
      '/js/third-party/comments/utterances.js',
      '"active":"utterances"'
    ];
    for (const snippet of forbiddenCommentSnippets) {
      if (commentHtml.includes(snippet)) {
        fail(`Found stale Utterances comment snippet ${JSON.stringify(snippet)} in ${path.relative(root, representativeCommentPage)}.`);
      }
    }

    const requiredCommentSnippets = [
      'giscus-container',
      '"active":"giscus"'
    ];
    for (const snippet of requiredCommentSnippets) {
      if (!commentHtml.includes(snippet)) {
        fail(`Missing Giscus comment snippet ${JSON.stringify(snippet)} in ${path.relative(root, representativeCommentPage)}.`);
      }
    }

    if (commentHtml.includes('giscus-config-pending')) {
      if (!commentHtml.includes('data-missing="category_id"')) {
        fail(`Giscus pending marker must identify the missing category_id in ${path.relative(root, representativeCommentPage)}.`);
      }
      if (commentHtml.includes('https://giscus.app/client.js')) {
        fail(`Giscus pending page must not load the client script in ${path.relative(root, representativeCommentPage)}.`);
      }
    } else {
      const requiredGiscusEmbedSnippets = [
        'https://giscus.app/client.js',
        'data-repo="fclearner/fclearner.github.io"',
        'data-repo-id="MDEwOlJlcG9zaXRvcnkxOTQwMTgyMjk="',
        'data-category="Announcements"',
        'data-category-id='
      ];
      for (const snippet of requiredGiscusEmbedSnippets) {
        if (!commentHtml.includes(snippet)) {
          fail(`Missing Giscus embed snippet ${JSON.stringify(snippet)} in ${path.relative(root, representativeCommentPage)}.`);
        }
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
      required: ['Adaptive RAG', 'Self-RAG', 'GraphRAG', 'retriever', 'Retrieval Gate']
    },
    {
      source: 'AI-Adaptive-RAG-Retrieval-Gate.md',
      html: ['2026', '06', '10', 'AI-Adaptive-RAG-Retrieval-Gate', 'index.html'],
      required: ['Adaptive RAG', 'retrieval gate', 'Self-RAG', 'FLARE']
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
    },
    {
      source: 'Speech-Dialog-Data-Synthesis-Quality-Gates.md',
      html: ['2026', '06', '11', 'Speech-Dialog-Data-Synthesis-Quality-Gates', 'index.html'],
      required: ['schema', 'quality_flags', 'n-best', 'reason code']
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
