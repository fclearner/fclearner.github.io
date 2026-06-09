# Design

## Posts To Remove
- `VAD-marblenet.md`: empty body.
- `ASR-wenet-data-preprocess.md`: recovered placeholder article with TODO markers.
- `ASR-wenet.md`: skeletal note without durable technical body.
- `wechat-AI.md`: short temporary note and reference link rather than a maintainable blog article.

## Post Count
Pruning leaves 7 retained posts. The same publish batch adds one sanitized PVAD technical post, so the final source and generated archive should contain 8 posts.

## Verification
Run the normal verification chain after deletion:
- `npm run check:encoding`
- `npm run build`
- `npm run check:site`
- `openspec validate --all --strict`

Then publish the generated Pages output and verify the live home/archive pages.
