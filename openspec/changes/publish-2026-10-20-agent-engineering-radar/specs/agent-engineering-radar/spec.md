# Agent Engineering Radar Specification Delta

## ADDED Requirements

### Requirement: Publish a current public radar article

The site SHALL publish one concise Chinese Agent Engineering Radar article for the run date when at least three meaningful public, well-sourced signals exist in the observation window.

#### Scenario: Current sources meet the publication threshold

- **WHEN** the weekly scan finds at least three independently meaningful primary public sources
- **THEN** the post includes the established radar sections, source links, maturity, risk, and a practical next action for each relevant item

### Requirement: Keep the radar article public-safe

The article SHALL use public sources only and MUST NOT disclose private workspace context, secrets, internal business information, or unpublished project summaries.

#### Scenario: Source material is assessed for publication

- **WHEN** an item is selected for the article
- **THEN** it is attributable to an official or public project page and its claims are limited to that evidence
