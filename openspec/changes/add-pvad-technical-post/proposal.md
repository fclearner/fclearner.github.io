# Add PVAD Technical Post

## Summary
Turn the Personal VAD 2.0 project context into a public technical blog post while excluding personal, local, and infrastructure-specific information.

## Motivation
The blog needs a new substantive article after pruning empty and low-quality posts. The project context contains useful engineering lessons, but it also includes local workspace, repository, host, and environment details that should not be published.

## Scope
- Write one technical article about PVAD engineering.
- Preserve reusable model, data, training, and validation details.
- Include the explicitly requested public GitHub project link.
- Remove local paths, private repository details other than that public link, host details, and credentials-adjacent information.
- Update the generated-site quality gate for the new post count and redaction checks.

## Non-Goals
- Do not publish the raw project context.
- Do not claim real PVAD benchmark results that have not been validated.
- Do not add diagrams or visual theme changes in this change.