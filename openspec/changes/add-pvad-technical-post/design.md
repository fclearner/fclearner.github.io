# Design

## Source Material
Use the project context document at `E:/workspace/ai_projects/personal-vad-2.0/PROJECT_CONTEXT.md` as internal source material only.

## Redaction Boundary
The public article must omit:
- Local filesystem paths.
- Private repository URLs and repository-owner identifiers except when they are part of the explicitly requested public GitHub project link.
- Remote host/provider details, ports, credentials, cache directories, and machine-specific commands.
- Raw `git status` output or local commit identifiers.

It may include the explicitly requested public GitHub project link: https://github.com/fclearner/Personal-vad-2.0.

It may keep reusable technical details:
- PVAD three-class frame classification semantics.
- Feature, label, and speaker embedding shapes.
- External speaker embedding integration strategy.
- Training manifest schema and enrollment-less augmentation.
- Subsampling and label-alignment risks.
- Experiment and evaluation plan.

## Post
Create one Hexo post at `source/_posts/PVAD2-engineering-loop.md`.