## ADDED Requirements

### Requirement: Evidence-grounded full-duplex VAD article
The blog SHALL publish a Chinese article explaining the role of VAD in acoustic noise robustness and target-speaker focus during full-duplex interaction.

#### Scenario: Reader compares detection paradigms
- **WHEN** the article is generated
- **THEN** it SHALL compare traditional and neural acoustic VAD with speaker-conditioned VAD and turn detection
- **AND** distinguish activity decisions from waveform denoising and speaker extraction
- **AND** include dated primary references, evidence limitations, concrete failure cases, and evaluation recommendations.

#### Scenario: Article is published
- **WHEN** publication completes
- **THEN** encoding, build, generated-site and strict OpenSpec checks SHALL have been run
- **AND** the article SHALL be accessible at its public permalink or a publication limitation SHALL be recorded.

#### Scenario: Reader compares enrollment-free foreground detection
- **WHEN** the reader consults the supplement for arXiv:2609.19856
- **THEN** it SHALL distinguish FVAD's inferred foreground from pVAD's externally specified identity
- **AND** explain supervision, acoustic augmentation, model structure, BG-FAR, controlled ablations and failure conditions
- **AND** avoid treating frame false alarms or compute time as measured end-to-end interruption outcomes.
