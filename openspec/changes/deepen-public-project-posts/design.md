# Design: Public-Safe Depth Pass

## Selection

Target the public posts that map to local project knowledge and are too short to be useful as standalone technical essays:

- Adaptive RAG and retrieval gate.
- Speech/LLM alignment and inference serving.
- ASR data quality, structured extraction, turn-taking, batch consistency, and synthetic dialogue data.
- PEFT, Personal VAD, and Agentic Coding governance.

## Public-Safe Extraction

Local materials may influence public content only after abstraction. Allowed public material includes:

- technical contradiction;
- system boundary;
- failure taxonomy;
- evaluation metrics;
- open-source implementation pattern;
- engineering checklist.

Disallowed material includes:

- local filesystem paths;
- private project names;
- private business context;
- raw dialogue records;
- service ports, internal deployment commands, or hidden implementation ideas.

## Depth Standard

Each targeted post should add one or more of:

- design tradeoff section;
- failure attribution section;
- evaluation matrix;
- minimal implementation contract;
- rollout or observability loop.
