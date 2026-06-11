# Switch Comments To Giscus

## Problem
The blog currently uses Utterances, which stores comments in GitHub Issues. The preferred model is GitHub Discussions through Giscus so public article comments live in discussion threads instead of issue threads.

## Goal
Replace the public comment provider with Giscus while keeping the site fully static. The implementation must not add a custom database, backend service, OAuth secret, token, or private repository identifier.

## Non-goals
- Do not self-host a comment service.
- Do not add a database or API server.
- Do not change article content.
- Do not fake a working Giscus iframe when GitHub Discussions or category configuration is missing.

## External requirements
`fclearner/fclearner.github.io` must have Discussions enabled, the Giscus GitHub App installed or configured, and a discussion category id copied into `_config.next.yml`.
