# Publish Open-Source AI Engineering Roundup

## Why
The project notes under the AI research workspace contain several reusable technical themes that can be shared publicly as open-source engineering discussion. The public article must avoid exposing private paths, raw project context, application-specific details, or implementation logic that could reveal sensitive work.

## What Changes
- Add one sanitized Hexo post that summarizes public technical routes across RAG, ASR, speech foundation models, PEFT, structured extraction, inference serving, and agentic engineering loops.
- Add generated-site checks that fail on private paths, internal document names, sensitive scenario terms, old LMDeploy-duplex identifiers, and other disclosure markers in the new post.
- Update repository documentation and post-count checks from 8 to 9 posts.

## Non-Goals
- Do not publish per-project handoff notes.
- Do not publish raw prompts, datasets, local paths, machine details, ports, credentials, company/customer names, or application-specific logic.
- Do not republish the removed LMDeploy duplex article or its implementation details.
