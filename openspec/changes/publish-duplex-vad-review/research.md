# Research record

Search cutoff: 2026-09-28. Scope: representative 2025–2026 VAD/PVAD research relevant to full-duplex acoustic robustness, target selection, enrollment, deployment and onset timing. This is a structured narrative review, not an exhaustive systematic review or a reproduction study.

## Search and inclusion

Searched arXiv, ISCA, ICASSP program records and publisher pages using personalized voice activity detection, noise-robust target-speaker VAD, short enrollment, full duplex and onset latency. Excluded video anomaly detection (also abbreviated VAD), marketing-only performance claims, and diarization papers without a direct contribution to this article's argument. Followed references back to Personal VAD and Personal VAD 2.0. Blog sources informed structure, not scientific validation.

## Primary evidence inventory

| Source | Reading depth | Use and limitations |
| --- | --- | --- |
| https://arxiv.org/abs/1908.04284 | Abstract | Historical speaker-conditioned three-class task, 2019 preprint |
| https://arxiv.org/abs/2204.03793 | Abstract | Streaming, resource and enrollment-less requirements, 2022 |
| https://arxiv.org/abs/2210.13248 | Abstract | Background reading on joint VAD and acoustic-quality estimation |
| https://arxiv.org/html/2501.03184v1 | Full-text methods and Tables I/III–V | DN-APC; held-out café noise; -5 dB mAP gains of 2.63/2.48 percentage points averaged over conditioning methods; no claim of measured duplex benefit |
| https://www.isca-archive.org/interspeech_2025/lin25_interspeech.pdf | Proceedings abstract and PDF | Auxiliary decoder, embedding update, hard-sample simulation; avoid invented product test coverage |
| https://www.isca-archive.org/interspeech_2025/yu25_interspeech.pdf | Proceedings abstract and PDF | Detachable personalization and dynamic computation; avoid equating parameter ratio with power savings |
| https://arxiv.org/html/2601.12769v1 | Abstract and full-text method/results | Keyframe embedding augmentation, short enrollment; accepted ICASSP 2026 checked against conference program; no universal convergence guarantee |
| https://www.preprints.org/manuscript/202606.1411 | Preprint HTML | Method-level test-time adaptation summary only |
| https://doi.org/10.3390/electronics15143111 | Publisher search-index publication record | Published 2026-07-15; publisher full-page opening failed, so no final-version experimental numbers are reproduced |
| https://arxiv.org/html/2510.12947v3 | Full-text methods and Tables 3–5, deployment section | First submitted 2025-10-14, revised 2026-08-11, submitted to AAAI/IAAI 2027; not accepted-conference evidence. Table 5: 388 target-absent clips, >64 min, 3142/2793/310 false triggers; percentages relative to no-VAD count. Real-user event counts do not improve for every backbone |
| https://arxiv.org/html/2609.11110v1 | Full-text onset definition and comparison table | 2026-09-10 preprint; ordinary VAD and annotation-aware onset evaluation, not speaker-conditioned detection |

ICASSP acceptance cross-check: https://cmsworkshops.com/ICASSP2026/view_session.php?SessionID=1369

## Editorial references

- Existing local PVAD and turn-taking articles establish metadata, required headings, terminology and internal links.
- https://livekit.com/blog/solving-end-of-turn-detection : concrete conversational failure, mechanism, evaluation, deployment.
- https://www.daily.co/blog/announcing-smart-turn-v3-with-cpu-inference-in-just-12ms/ : explain model changes through runtime implications.
- https://github.com/pipecat-ai/docs/blob/main/api-reference/server/utilities/turn-detection/smart-turn-overview.mdx : explicitly separates VAD pause detection from turn completion.

## Editorial checks

The article explicitly distinguishes detection from waveform enhancement/extraction, speech noise from non-speech noise, AEC from identity filtering, and PVAD from interruption intent. Deployment advice and illustrative scenarios are labeled as engineering reasoning. No cross-paper ranking, universal best-model claim, or invented local benchmark is included.
# Survey-linked follow-up, 2026-09-28

- User supplied the title Speaking While Listening: A Survey and Empirical Audit of Full-Duplex Spoken Dialogue Systems after the Zhihu page returned HTTP 403.
- Official identity: https://github.com/MM-Speech/DuplexSurvey links arXiv:2606.19453. Accessible v1 has the earlier architectural hierarchy title. Section 4.3 explicitly identifies FireRedChat streaming pVAD; do not claim to have read the inaccessible Zhihu text.
- Primary source: https://arxiv.org/html/2509.06502v1, sections 2.1, 2.2.1 and 3.1, read in full for the amendment. Architecture: causal convolution, concatenated ECAPA-TDNN embedding, GRU, classifier; 10 ms output steps. Training: 2000 h clean Mandarin/English, 5 s mixtures, noise/interferer probability 50% each, 0–30 dB SNR.
- Table 2: LiveKit 140 ms / 33.4%; Ten 90 ms / 78.1%; FireRedChat 170 ms / 10.2%. T90 is minimum latency reaching 90% successful barge-in. Test: 1000 utterances per language, noise injection probability 50%, noise SNR 5 dB, secondary speaker at primary endpoint ±1 s, speaker SNR 20 dB.
- Limits: historical full-system configurations, not a controlled pVAD-only ablation; 10 ms is not stopping latency; original waveform is routed downstream using timestamps; target activity does not establish interruption intent. Derived difference vs LiveKit is +30 ms and −23.2 percentage points.
