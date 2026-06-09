# Harden Blog Operations

## Summary
Finish the blog maintenance work by making the source project versioned, adding repeatable quality gates, repairing recoverable content issues, and keeping the GitHub Pages output safe to publish.

## Motivation
The framework upgrade is live, but the project still has operational risks: the source tree is not under Git, release checks are manual, old content contains mojibake, and deploy safety depends on ad hoc commands. These risks make the blog fragile for future edits.

## Scope
- Initialize and commit the Hexo source project as a local Git repository with generated files excluded.
- Add scripts that verify article count, canonical URLs, broken local links, image assets, and expected generated output.
- Repair recoverable mojibake in source Markdown while preserving existing URLs, front matter, assets, and publication dates.
- Document the source-to-Pages deployment flow and the current limits around remote source hosting.
- Confirm the published Pages repository contains static output only and no dependency files that should trigger dependency alerts.
- Rebuild, deploy, and verify the live site after the fixes.

## Non-Goals
- Do not create a new GitHub repository without explicit repository ownership/name confirmation.
- Do not rewrite article ideas or technical claims beyond encoding restoration and minimal metadata cleanup.
- Do not change the visual theme again unless required to fix a regression.
- Do not force-push or rewrite GitHub Pages history.

## Risks
- Mojibake repair can corrupt text if applied to clean Unicode; the repair must be targeted and validated.
- GitHub Pages CDN can lag behind pushes, so live verification may require retrying.
- A local source Git repository protects history on this machine but is not a remote backup until a remote is configured.
