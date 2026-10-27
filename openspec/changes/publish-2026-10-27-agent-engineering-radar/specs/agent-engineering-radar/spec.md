## ADDED Requirements

### Requirement: Publish a source-backed weekly radar

The site SHALL include one Agent Engineering Radar post dated 2026-10-27 when at
least three meaningful public signals are available from the preceding two weeks.

#### Scenario: Readers inspect the new radar

- **WHEN** a reader opens the 2026-10-27 radar post
- **THEN** its title begins with `【Agent Engineering Radar】`
- **AND** it includes source links, maturity, risk, and a next action for each
  radar item

### Requirement: Preserve public-source boundaries

The weekly radar SHALL use only public source material and SHALL NOT disclose
local paths, private project context, credentials, or unpublished notes.

#### Scenario: Readers inspect article references

- **WHEN** a reader reviews the post
- **THEN** every factual signal is traceable to a public official project release
  or announcement
