# Add Static Search And Comment Foundation

## Problem
The public blog is still a static Hexo site without site search or a documented comment path. Readers cannot search technical posts, and comment requirements are unclear: static search does not need a backend, but comments require an external provider or a self-hosted service.

## Goal
Enable no-backend local search for the public blog and enable GitHub-backed comments through Utterances. Document the external GitHub App requirement so the site remains static and does not need a custom database or backend service.

## Non-goals
- Do not introduce a custom database or server for the public blog.
- Do not introduce a self-hosted comment service or custom comment database.
- Do not add secrets, OAuth client secrets, tokens, or private repository identifiers.
- Do not change public article content.
