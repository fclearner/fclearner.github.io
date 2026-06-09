## ADDED Requirements

### Requirement: Low Quality Post Pruning
The blog source SHALL exclude empty, placeholder-heavy, or skeletal posts from the published site.

#### Scenario: Empty and placeholder posts are removed
- **WHEN** the source post directory is inspected
- **THEN** `VAD-marblenet`, `ASR-wenet-data-preprocess`, `ASR-wenet`, and `wechat-AI` are absent

#### Scenario: Post count reflects retained content
- **WHEN** the generated archive is inspected
- **THEN** it contains 8 posts in this publish batch: 7 retained posts plus the new PVAD technical article

#### Scenario: Deleted posts are not published
- **WHEN** the generated site is published
- **THEN** deleted post URLs are not present in the home page, archives, or tag pages
