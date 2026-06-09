# Prune Low Quality Posts

## Summary
Remove empty or placeholder-quality posts so the blog is ready for new, higher-quality content.

## Motivation
The site currently includes recovered or skeletal posts that reduce overall quality. The user wants empty and low-quality posts removed before publishing new material.

## Scope
- Delete posts that are empty, dominated by TODO placeholders, or too skeletal to serve as durable blog content.
- Keep posts with substantive technical content, diagrams, or useful setup walkthroughs.
- Update generated-site quality checks to expect the new post count.
- Rebuild, publish, and verify the live site.

## Non-Goals
- Do not rewrite or summarize deleted posts.
- Do not delete post assets for retained articles.
- Do not change the visual theme.

## Deletion Criteria
- Empty body after front matter.
- Placeholder/TODO-heavy content.
- Very short skeletal article with no durable technical explanation.
