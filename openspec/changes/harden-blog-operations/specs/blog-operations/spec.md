## ADDED Requirements

### Requirement: Source History
The blog source project SHALL have a local Git history that excludes generated and dependency output.

#### Scenario: Generated output is ignored
- **WHEN** source Git status is inspected
- **THEN** `node_modules/`, `public/`, `.deploy_git/`, `.deploy_publish/`, and `db.json` are not tracked

#### Scenario: Maintained source is committed
- **WHEN** the hardening work is complete
- **THEN** the local source repository has a commit containing the Hexo source, OpenSpec files, scripts, and documentation

### Requirement: Generated Site Quality Gate
The blog project SHALL provide a repeatable quality check for generated output.

#### Scenario: Generated output is checked
- **WHEN** the quality check script runs after `npm run build`
- **THEN** it verifies post count, CNAME, canonical domain hygiene, and local asset/link resolution

### Requirement: Content Encoding Maintenance
The blog source SHALL reject suspicious mojibake and repair recoverable mojibake while preserving existing post URLs and assets.

#### Scenario: Repaired posts still generate
- **WHEN** repaired Markdown is built
- **THEN** the generated site still contains the same 11 post URLs

### Requirement: Static Pages Hygiene
The published GitHub Pages repository SHALL contain only static site output needed to serve the blog.

#### Scenario: Dependency files are absent
- **WHEN** the published Pages tree is inspected
- **THEN** dependency directories and dependency lockfiles are absent
