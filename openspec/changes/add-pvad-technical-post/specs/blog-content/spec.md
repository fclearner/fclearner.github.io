## ADDED Requirements

### Requirement: Sanitized PVAD Technical Article
The blog SHALL publish a new technical article derived from the PVAD project context without disclosing personal or machine-specific information.

#### Scenario: Technical content is preserved
- **WHEN** the PVAD article is read
- **THEN** it explains the three-class PVAD task, model input/output shapes, speaker embedding integration, manifest schema, enrollment-less augmentation, label alignment risk, and experiment plan

#### Scenario: Public project link is included
- **WHEN** the PVAD article is read
- **THEN** it links to https://github.com/fclearner/Personal-vad-2.0

#### Scenario: Personal and environment details are excluded
- **WHEN** the source and generated PVAD article are inspected
- **THEN** they do not contain local paths, private repository URLs other than the explicitly requested public GitHub project link, remote host/provider details, ports, cache directories, or credentials-adjacent material

#### Scenario: Post count includes the new article
- **WHEN** the generated archive is inspected
- **THEN** it contains 8 posts