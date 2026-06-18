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
