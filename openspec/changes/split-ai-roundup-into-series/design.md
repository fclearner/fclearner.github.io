# Design

## Series Structure
Use one article per public-safe technical direction:
- Adaptive RAG and retrieval triggering
- Speech LLM alignment contracts
- ASR data quality pipeline
- PEFT engineering tradeoffs
- Inference serving observability
- Structured extraction under ASR noise
- Agentic coding governance

## Public Boundary
The articles discuss reusable open-source engineering concepts and avoid project-specific private implementation logic. They may name public ecosystems such as Self-RAG, GraphRAG, WeNet, Qwen, LoRA, vLLM, SGLang, Triton, and MCP, but must not expose local paths, internal notes, customer/company terms, private service ports, raw prompts, datasets, or removed LMDeploy duplex details.

## Verification
The generated-site verifier scans all new source posts and generated HTML pages for forbidden disclosure markers. It also marks the old roundup URL as stale so the broad article is not linked or kept in current generated output.