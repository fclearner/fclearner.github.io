## ADDED Requirements

### Requirement: Focused public AI engineering series
The blog SHALL publish the AI projects public content as multiple focused technical articles rather than a single broad roundup.

#### Scenario: Reader opens the public AI engineering content
- **WHEN** the generated site is built
- **THEN** each public-safe direction has its own article
- **AND** the old broad roundup URL is not part of the current generated site navigation

### Requirement: Series disclosure scanning
The generated-site verifier SHALL scan each new public AI series article source and generated HTML for private disclosure markers.

#### Scenario: A private marker appears in a series article
- **WHEN** a local path, internal document marker, company/customer scenario term, service host/port, or removed LMDeploy duplex marker appears in a new series article
- **THEN** the generated-site quality check fails with a clear error message