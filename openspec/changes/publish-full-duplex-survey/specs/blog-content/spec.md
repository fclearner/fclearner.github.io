## ADDED Requirements

### Requirement: Traceable full-duplex literature review
The blog SHALL publish a Chinese full-duplex speech review with an explicit date window, primary-source citations, comparative synthesis, and practical evaluation guidance.

#### Scenario: Reader distinguishes evidence and interpretation
- **WHEN** a reader examines a paper summary or quantitative result
- **THEN** its primary reference and evaluation context SHALL be identifiable
- **AND** author-reported results SHALL be distinguished from editorial recommendations and independently reproduced results.

#### Scenario: Reader checks recency
- **WHEN** a paper is counted in the recent-paper inventory
- **THEN** its first submission date SHALL fall between 2026-07-28 and 2026-09-28 inclusive
- **AND** older background work and relevant excluded work SHALL be identified separately.

### Requirement: Verified content publication
The new post SHALL follow existing front matter and problem-chain conventions and be published using the maintained Pages checkout.

#### Scenario: Publication is complete
- **WHEN** the article is reported as published
- **THEN** source encoding, site generation, local links, and OpenSpec validation SHALL have been checked
- **AND** publication status SHALL distinguish a pushed commit from a verified live article.
