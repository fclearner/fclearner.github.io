# Editorial Design

Use a noisy full-duplex conversation as the opening example, followed by historical context, a research inventory, mechanisms, and an actionable evaluation matrix. Follow existing post metadata and problem-chain headings. Reference the explanatory structure of LiveKit and Daily engineering blogs while grounding scientific claims in primary papers.

Distinguish speech detection, noise suppression, target-speaker activity, waveform extraction, and turn-taking. Label preprints and pin versions when revised claims matter. Do not compare numbers across incompatible evaluation protocols. In particular, HyWA's target-absent false-interruption counts are normalized against a no-VAD baseline, not all user turns.

# Publication

## Survey-linked revision

The official DuplexSurvey repository identifies Speaking While Listening with arXiv:2606.19453; the accessible v1 retains the earlier title. Cite both and identify FireRedChat pVAD from section 4.3. Ground implementation and results in FireRedChat v1 sections 2.1, 2.2.1 and 3.1. Explain causal convolution, ECAPA-TDNN conditioning, GRU, 10 ms output steps and mixture training. Preserve the distinction between timestamp gating and waveform extraction, and between T90 and model runtime. Treat framework comparisons as historical system configurations, not controlled pVAD ablations or current product rankings.

Use existing verification commands and the clean Pages clone. Inspect generated output and publication changes before pushing. Attribute commits with `Codex-Authored: true`. Verify the live permalink; leave unrelated working files untouched.
