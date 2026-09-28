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
