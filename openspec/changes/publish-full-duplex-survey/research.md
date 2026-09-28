# Research record — 2026-09-28

## Scope and method

- Requested output: publish a Chinese blog surveying the last two months of full-duplex speech interaction research.
- Inclusion window: first arXiv submission from 2026-07-28 to 2026-09-28, inclusive; not conference date, search crawl date, product launch, or revision date.
- Search families: full-duplex + speech/spoken dialogue + July/August/September 2026; turn-taking + August/September; streaming ASR and turn state; data synthesis; interruption recovery; implicit instruction following; asynchronous delegation.
- Discovery: web search, arXiv, ACL Anthology, author project pages, MM-Speech/DuplexSurvey and public research indexes. Aggregator claims were checked against primary sources before inclusion.
- This is a scoped survey, not an exhaustive systematic review. No PRISMA-style exhaustive retrieval count is claimed. No training runs, benchmark reproductions, model downloads, or dataset availability audits were performed.
- Source URLs and the complete public inventory are in the article. All numerical claims are attributed to paper authors.

## Included inventory and actual reading depth

“Sections” means relevant methods/results/limitations text was inspected, not that every appendix was read. “Abstract” means metadata and the primary abstract support only the short summary used in the post. Opening an HTML endpoint alone is not counted as detailed reading.

| ID/version | First submitted | Short name | Verification depth |
| --- | --- | --- | --- |
| 2607.26178v1 | 2026-07-28 | DuplexGen Adaptive Synthesis | Abstract and author project page; arXiv HTML conversion lacks body |
| 2608.10716v1 | 2026-08-11 | DuplexWorld | Abstract and metadata |
| 2608.10878v1 | 2026-08-11 | X2-Turn | Abstract and metadata |
| 2608.16053v1 | 2026-08-17 | DuplexGen Decoupling | Sections II-D, IV-D; relative timing transfer and rendering ablation |
| 2608.25218v1 | 2026-08-25 | TurnBench | Abstract and metadata; body endpoint inspected for availability |
| 2609.03423v1 | 2026-09-03 | DSB-IFEval | Abstract and metadata |
| 2609.05592v1 | 2026-09-04 | Self-Listening | Sections 1–3; playback-causal channel and anchoring/turn-management tradeoff |
| 2609.08147v1 | 2026-09-08 | ConversationalVoice | Abstract, including explicit lack of downstream training evaluation |
| 2609.08956v1 | 2026-09-08 | TASTE2 | Abstract, including hardware and deployment TTFA |
| 2609.12623v1 | 2026-09-11 | SteerDuplex | Abstract, including reward hacking and incomplete response limitation |
| 2609.12872v2 | 2026-09-11 | DuplexDrama | Metadata and abstract; v2 on 2026-09-24; future release wording retained |
| 2609.13076v1 | 2026-09-11 | MP-Bench | Abstract and metadata |
| 2609.13117v1 | 2026-09-11 | Duplex Cue | Methods, results, limitations; conditional denominator and annotation leakage |
| 2609.13814v1 | 2026-09-12 | Realtime-Venus | Abstract and metadata |
| 2609.17360v2 | 2026-09-15 | ECHO | Sections 1–2; v2 renamed title; fixed trajectories and nonmatched waveforms |
| 2609.19334v1 | 2026-09-16 | Frontend-backend tool calls | Primary abstract and metadata; do not equate recall with task success |
| 2609.19596v1 | 2026-09-17 | Take the Floor | Primary abstract and metadata |
| 2609.21967v1 | 2026-09-18 | NemotronLabs VoiceChat | Primary abstract and metadata; tool-selection F1 versus execution |
| 2609.27372v1 | 2026-09-23 | TACT | Primary abstract and metadata |
| 2609.28806v1 | 2026-09-23 | Synthesis Harness | Primary abstract and metadata |
| 2609.29217v1 | 2026-09-24 | AdaptDuplex | Methods, results, table notes and limitations; hardware mismatch and gold-prefix evaluation |

## Background and exclusions

- 2606.19453, Speaking While Listening: background only, first submitted before window; August acceptance does not make it an August paper.
- Full-Duplex-Bench versions and HumDial-FDBench: existing benchmarks mentioned only to contextualize reported results.
- 2608.22071 Real-TurnTurk and 2608.27988 gaze-based multiparty turn prediction: adjacent multimodal/corpus work, linked as related reading outside the 21 core items.
- ACL 2026 SIGDIAL “Rethinking Binary Evaluation…”: August proceedings metadata verified, but not counted under the first-arXiv-submission rule.
- 2608.28926 turn-transition entropy for multiparty intent recognition: adjacent intent-classification objective, not a central continuous speech interaction study for this article.
- Wireless full-duplex antennas/communications, standalone ASR/TTS without interaction evaluation, commercial launch news and out-of-window foundational models: excluded from the main inventory.

## Editorial references

- Existing Speech-LLM-Radar-2026-09-16 and Realtime-Speech-Turn-Taking-Evaluation: front matter, excerpt separator, problem-chain headings, linked follow-up reading.
- https://themadaiguy.github.io/blog/2026/08/09/full-duplex-explained/ : inspected terminology, architecture progression, and timeline-based explanation. Used for structure only; did not adopt its blanket claims about cascaded architectures.
- https://www.full-duplex.ai/ : digest organization and primary-source links. Product news is not evidence for the paper inventory.

## Claim review

- ECHO v2 title is “Same Words, Different Actions”; earlier search hits use its old ECHO title. The insertion text is matched, not the entire waveform. It is not a closed-loop evaluation.
- Duplex Cue's 68.2% and 34.8% use the 66 eligible collaboration pairs, not all 300 candidate trials. Single model, English, selection and annotation limitations are stated.
- DuplexGen August re-rendering preserves relative overlap placement rather than all original absolute timestamps. ASR effects are not conflated with conversational timing realism.
- AdaptDuplex's 72.9 is a paper-specific composite. Hardware is not matched across reported systems. Action prediction under gold prefixes is not free-running task success.
- TASTE2's 2.701 s is deployment mean TTFA under two RTX A6000 with TensorRT, not a universal model latency.
- Self-Listening's 7.8% to 73.0% is the matched anchoring comparison, not a general dialogue accuracy gain.
- No weights/data release status is inferred from a paper being public. DuplexDrama's planned subset remains explicitly future tense.

## Publication evidence

- Source encoding check passed; Hexo build generated 184 files; generated-site validation passed for 33 posts.
- Local production dependency audit reported 0 vulnerabilities.
- The combined `npm run verify` reached the OpenSpec step but could not write the default user npm cache. Retried only that step with project-local `.tmp/npm-cache`: `validate --all --strict` passed 17 changes, 0 failed. It reported an existing informational archive note for `switch-comments-to-giscus`.
- Generated article has the intended title, date-window text, seven HTML tables, no raw Markdown table separators, and no Unicode replacement characters. Browser preview confirmed the opening layout, readable comparison tables, and working table-of-contents navigation.
- Search index XML comparison: 32 existing entries preserved with identical content; 33 entries after addition. Ordinary generated tag ordering and global post/tag counts changed. Restored the previously published generated CSS to avoid NexT's unrelated randomized link-decoration color change.
- Authored Markdown was reviewed for scope, citations, consistency and whitespace. Generated NexT templates retain their pre-existing whitespace convention; no template formatting changes were made for this content publication.
- Pages commit: `09f8e80882181e26a63c4715e00213af2b9354ba`, pushed to `origin/master`, with `Codex-Authored: true`.
- Live verification on 2026-09-28: HTTP 200; title and 21-paper inventory text present; seven HTML tables present at https://alanfangblog.com/2026/09/28/Full-Duplex-Speech-Interaction-Survey-2026-09/ .
- The source publication commit includes only this article and this OpenSpec change. Unrelated untracked work, including another active publication change, is excluded.
