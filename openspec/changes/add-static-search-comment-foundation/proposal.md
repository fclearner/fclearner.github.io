# Add Static Search And Comment Foundation

## Problem
The public blog is still a static Hexo site without site search or a documented comment path. Readers cannot search technical posts, and comment requirements are unclear: static search does not need a backend, but comments require an external provider or a self-hosted service.

## Goal
Enable no-backend local search for the public blog and document the comment architecture choices. Add a disabled, provider-ready comment configuration so comments can be enabled after the user chooses and authorizes a provider.

## Non-goals
- Do not introduce a custom database or server for the public blog.
- Do not enable a third-party comment widget without provider setup.
- Do not add secrets, OAuth client secrets, tokens, or private repository identifiers.
- Do not change public article content.
