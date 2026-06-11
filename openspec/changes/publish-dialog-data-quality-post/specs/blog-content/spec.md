## ADDED Requirements

### Requirement: Public-safe synthetic dialog data article
The blog SHALL include a public-safe article about synthetic speech-dialog data engineering derived from newly reviewed local project context.

#### Scenario: Article is generated
- **WHEN** the site is built
- **THEN** the generated site includes a post about speech-dialog data generation, schema control, oralization, ASR-like noise, and quality gates
- **AND** the post does not include private local paths, raw Monica dialogue ids, personal information, brand names, or business-specific workflows
- **AND** the generated-site quality check expects the updated post count
