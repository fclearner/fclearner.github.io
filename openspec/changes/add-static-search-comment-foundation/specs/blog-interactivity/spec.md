# blog-interactivity Delta

## ADDED Requirements

### Requirement: Static local search
The public blog SHALL provide site search without requiring a server-side database or API.

#### Scenario: Blog is generated
- **WHEN** the Hexo build completes
- **THEN** a static search index exists in the generated public output
- **AND** the theme configuration exposes a search trigger in the rendered site.

### Requirement: Comment provider decision boundary
The public blog SHALL document comment provider choices and SHALL NOT enable a live third-party or self-hosted comment service until the provider is configured.

#### Scenario: Comments are not yet provider-authorized
- **WHEN** the blog is generated
- **THEN** no third-party comment widget is loaded
- **AND** the repository documents which providers avoid a custom database and which providers require self-hosted service/storage.
