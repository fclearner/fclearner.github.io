## ADDED Requirements

### Requirement: Public-safe local insight extraction

Public posts SHALL use updated local project context only after abstracting it into non-sensitive technical lessons.

#### Scenario: Local insight becomes public engineering guidance

- **WHEN** a public post uses local project context as inspiration
- **THEN** it SHALL publish only the generalized technical problem, design tradeoff, failure mode, metric, or open-source pattern
- **AND** it SHALL omit private paths, private project names, raw dialogue, internal scenarios, ports, credentials, and unreleased ideas.

### Requirement: Targeted project posts have depth

Targeted project-derived public posts SHALL contain more than the base four-section outline and include at least one deeper technical layer such as design tradeoffs, failure attribution, evaluation matrix, implementation contract, or observability loop.

#### Scenario: Project post is not just a short summary

- **WHEN** a targeted public project post is built
- **THEN** the post SHALL include a deeper public-safe technical section beyond `要解决的问题`, `最小抽象`, `工程闭环`, and `直接结论`.

### Requirement: Non-Adaptive project posts have a coherent thesis

Non-Adaptive project-derived public posts SHALL present a single coherent technical thesis instead of only adding checklist-style sections.

#### Scenario: Non-Adaptive post is revised to match the Adaptive RAG standard

- **WHEN** a non-Adaptive project-derived post is updated for public publication
- **THEN** it SHALL include a public-safe thesis or main-line judgment
- **AND** it SHALL connect failure modes, diagnostic path, and engineering conclusion to that thesis.


### Requirement: All public technical posts have an argument and example

Public technical posts SHALL include both a central thesis and a concrete small-sample reasoning path, not only a four-section outline.

#### Scenario: Foundation and operational posts are reviewed against the same readability bar

- **WHEN** any public Markdown post under `source/_posts` is published
- **THEN** it SHALL include a thesis or main-line judgment section
- **AND** it SHALL include a concrete small-sample walkthrough, diagnostic example, or operational rehearsal
- **AND** generated-site checks SHALL fail if a public post lacks these markers.
