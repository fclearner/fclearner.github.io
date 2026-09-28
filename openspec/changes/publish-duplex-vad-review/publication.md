# Publication evidence

- Source article commit: `6c164f9`, pushed to `source`.
- Generated Pages commit: `7a490c6`, pushed to `master`.
- Both commits include `Codex-Authored: true`.
- Public URL: https://alanfangblog.com/2026/09/28/Full-Duplex-VAD-Noise-Robustness-Target-Speaker/
- Live verification: HTTP 200; expected Chinese title and pinned HyWA v3 reference present in the returned HTML.

## Validation

- Source encoding passed.
- Isolated Hexo build and generated-site verification passed with 34 posts.
- Production dependency audit reported zero vulnerabilities locally. GitHub separately reported two existing moderate default-branch alerts during pushes; dependencies were not changed.
- `openspec validate --all --strict`: 17 passed, zero failed. Existing informational warning concerns an unrelated comments delta.
- Source diff whitespace check passed. Generated NexT HTML retains existing template whitespace; no unrelated theme formatting was introduced.
- Generated article checks verified six tables, the expected title, pinned paper version, numeric-denominator explanation and internal reading links.

## Isolation and preservation

Built from a tracked-source snapshot plus this article. After discovering that the separate full-duplex survey had already been published, included its source in the release snapshot and verified its rendered diff contained only site counts and adjacent-post navigation. Published from an isolated Pages clone based on remote `09f8e80`, leaving the shared deployment clone undisturbed. No existing published files were deleted.

The initial combined verify command stopped at an inaccessible default npm cache after completing the build, site check and audit. OpenSpec was rerun successfully using a workspace cache. Git writes and credential-dependent push/live checks used the approved host execution path.

## FireRedChat supplement

- Added survey identity, original-paper model path, training conditions, original-audio routing, Table 2 protocol and results, and limitations of causal attribution.
- Isolated tracked-source release passed `npm run verify`: encoding, Hexo generation, site check (34 posts), production audit (zero vulnerabilities), strict OpenSpec (14 tracked changes passed, zero failed; existing comments-spec informational warning remains).
- Generated article contains the new survey title, ECAPA-TDNN, original-paper link and numeric comparison. Source whitespace checks passed.
- Published generated commit `7ebdee3` to `master`, rebased without conflict over concurrent publication `fbcd9ca`. Only the VAD page and its search entry changed. Existing navigation and other search entries were preserved; snapshot timestamp and equal-date sorting changes were excluded.
- Live verification after Pages propagation: HTTP 200, with ECAPA-TDNN, Speaking While Listening and the 23.2-point comparison present. Parsed published search XML contains exactly one updated VAD entry.

## Corrected FVAD paper supplement

- The user corrected the intended paper to arXiv:2609.19856. Replaced the inferred survey/FireRedChat section with FVAD task definition, training recipe, architecture, metric definition, controlled ablation and limitations. Updated the research map, paradigm table, scenario walkthrough and deployment conclusions. FireRedChat remains only a separate context example.
- Isolated `npm run verify` passed: source encoding, Hexo build, generated-site check (34 posts), dependency audit (zero vulnerabilities), strict OpenSpec (14 passed, zero failed; existing unrelated comments-spec warning).
- Source whitespace check passed. Generated HTML verified the exact arXiv version, Mamba-FVAD, BG-FAR, 32 ms frame size and Table II values. Removed the old survey-to-FireRedChat identification. Search XML parsed successfully with exactly one updated VAD entry.
- Generated commit `3909480` pushed to `master`, touching only the VAD page and its search entry. Existing navigation and other published content were preserved.
