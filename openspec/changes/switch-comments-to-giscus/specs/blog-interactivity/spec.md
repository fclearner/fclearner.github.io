## MODIFIED Requirements

### Requirement: GitHub-backed comments
Post pages SHALL use GitHub Discussions through Giscus for public comments without requiring a custom database or backend service.

#### Scenario: Giscus configuration is complete
- **WHEN** the Hexo site is generated with `giscus.enable` enabled and `repo`, `repo_id`, `category`, and `category_id` configured
- **THEN** generated post pages include a Giscus comment container and `https://giscus.app/client.js`
- **AND** the Giscus script is configured for `fclearner/fclearner.github.io`
- **AND** generated post pages do not mark Utterances as the active provider

#### Scenario: Giscus category configuration is incomplete
- **WHEN** the Hexo site is generated before GitHub Discussions category id configuration is available
- **THEN** generated post pages include a `giscus-config-pending` marker
- **AND** generated post pages do not load an invalid Giscus iframe
- **AND** generated post pages do not mark Utterances as the active provider
