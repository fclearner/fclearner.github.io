## ADDED Requirements

### Requirement: Publish sanitized AI projects roundup
The blog SHALL include a public technical roundup article derived from AI project notes that discusses open-source AI engineering routes without exposing private project context.

#### Scenario: Article is generated from public-safe themes
- **WHEN** the article is read from the source post or generated HTML
- **THEN** it includes public technical themes such as Adaptive RAG, ASR, PEFT, Qwen, WeNet, vLLM, and open-source engineering
- **AND** it does not include private workspace paths, internal document names, scenario-specific terms, host details, ports, credentials, or the removed LMDeploy duplex topic

### Requirement: Generated site verifier guards the new post
The generated-site verifier SHALL scan both source markdown and generated HTML for the AI projects roundup disclosure boundary.

#### Scenario: Disclosure marker appears in the roundup
- **WHEN** a forbidden disclosure marker appears in the roundup source or generated page
- **THEN** the generated-site quality check fails with a clear error message
