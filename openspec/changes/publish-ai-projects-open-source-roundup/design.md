# Design

## Public Content Boundary
The article is a technical synthesis, not a project log. It may discuss public and open-source technology categories such as Adaptive RAG, GraphRAG, Qwen-style speech models, WeNet, PEFT, vLLM, SGLang, Triton-style serving, and evaluation methodology.

It must not include:
- workspace paths or filenames from private notes;
- raw conversation excerpts, prompts, examples, or data schemas tied to a specific application;
- company names, customer-facing scenario names, or deployment host details;
- implementation details from the previously removed LMDeploy duplex write-up.

## Shape
Use one roundup post rather than many project-specific posts. This reduces disclosure risk and gives the blog a coherent technical article that points readers toward reusable open-source engineering decisions.

## Verification
Extend the generated-site quality check so the source markdown and generated HTML for the new post are both scanned for disclosure markers and required public-technical keywords.
