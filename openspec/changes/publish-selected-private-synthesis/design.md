# Design

## Selection Rules
Content is eligible for public posts only when it is phrased as a general technical method, evaluation framework, diagnostic checklist, or open-source engineering tradeoff. Content is excluded when it depends on private context, administrative writing, sensitive scenarios, local infrastructure, raw dialogue text, or unreleased plans.

## Publication Shape
Existing public series articles are extended with short sections that add the reusable method:
- retrieval decision logs for Adaptive RAG
- input-contract tests for Speech-LLM
- data cards and reason codes for ASR data quality
- adapter registry discipline for PEFT
- request tracing for inference serving
- alignment-aware scoring for noisy structured extraction
- role-state handoff for agentic coding
- speaker-conditioned ablations for PVAD

Two new articles are added for non-duplicate themes:
- realtime speech turn-taking evaluation
- batch-size consistency debugging for audio models

## Verification
The generated public site must pass the existing Hexo quality gate and must scan source and generated HTML for forbidden private disclosures.
