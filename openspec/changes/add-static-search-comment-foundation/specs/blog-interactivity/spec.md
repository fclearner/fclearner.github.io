# blog-interactivity Delta

## ADDED Requirements

### Requirement: Static local search
The public blog SHALL provide site search without requiring a server-side database or API.

#### Scenario: Blog is generated
- **WHEN** the Hexo build completes
- **THEN** a static search index exists in the generated public output
- **AND** the theme configuration exposes a search trigger in the rendered site.

### Requirement: GitHub-backed comments
The public blog SHALL use a GitHub-backed comment provider without requiring a custom database or backend service.

#### Scenario: Blog is generated with comments enabled
- **WHEN** the blog is generated
- **THEN** post pages include an Utterances comment container
- **AND** the Utterances loader is configured for the public GitHub Pages repository
- **AND** the repository documents the GitHub App and Issues prerequisites.
