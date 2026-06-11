# Design

## Public-Safe Selection
Use only generalized engineering patterns from the new context:

- schema-first generation;
- controlled oralization;
- ASR-like n-best and noise simulation;
- turn-level history handling;
- quality flags and audit reports.

Exclude domain examples, raw prompts, names, paths, provider-specific private setup, and business process details.

## Article Placement
Create a new post because synthetic speech-dialog data generation is adjacent to, but distinct from, the existing ASR data-quality and turn-taking posts. The existing posts focus on ASR corpus quality, structured extraction, and realtime endpoint evaluation; this post focuses on producing and auditing training/evaluation data before it enters those downstream systems.

## Verification
Update generated-site checks for the new post count and required public-safe terms. Build output must not contain known private paths or raw sensitive source phrases.
