---
title: Adaptive RAG（二）：Retrieval Gate 怎么判断该不该检索
date: 2026-06-10 17:10:00
tags: [AI, RAG, LLM, Open Source]
---

上一篇把 Adaptive RAG 的问题收束到一个工程动作：先做显式 retrieval gate。它不是为了替代 Self-RAG、FLARE 或 DRAGIN，而是先给系统建立一个可观测的判断层：当前状态到底该不该检索。

这篇继续往下走，讨论 retrieval gate 应该吃什么信号、输出什么结论，以及怎么评测它。

<!--more-->

## 要解决的问题

不要把低置信度直接等同于检索需求。低置信度可能来自语言表达困难、格式约束复杂、候选答案接近，也可能只是模型在一个不需要外部事实的问题上犹豫。

反过来，高置信度也不代表答案被证据支持。模型可以非常自信地复述一个错误事实。

所以 retrieval gate 的判断目标应该是 evidence gap，而不是 confidence gap。它要回答的是：继续生成前，当前结论是否缺少外部证据、是否需要查证、是否存在冲突材料，以及检索的收益是否超过成本。

## 最小抽象

一个可用的 retrieval gate 不应该只看最后一段 prompt。输入可以分成四层：

- 任务层：是否要求事实核验，是否有时间、版本、实体等易变信息；
- 状态层：当前子问题是什么，已有证据覆盖了哪些结论；
- 模型层：候选答案是否分歧，关键槽位是否缺失；
- 成本层：延迟预算、上下文窗口、检索次数和 rerank 成本。

输出也不能只是 yes/no：

```json
{
  "should_retrieve": true,
  "reason_code": "missing_fact",
  "query_intent": "verify-current-claim",
  "required_evidence": ["source", "version", "date"],
  "budget": {
    "max_candidates": 20,
    "max_context_tokens": 1800
  },
  "fallback": "answer_with_uncertainty"
}
```

这里的 `reason_code` 是优化入口。它能把失败分成不该检索却检索、该检索却没检索、query intent 错、证据要求过宽、成本预算过紧或 fallback 不合理。

## 工程闭环

Gate 之后通常接 query builder。这里要避免把模型尚未验证的猜测直接写进 query。模型猜出的实体应该标记成 assumption，而不是事实。

评测 gate 时，需要单独标注 `should_retrieve`、触发原因、实际决策、检索后证据是否支持答案，以及最终答案是否因检索改善。核心指标包括 trigger precision、trigger recall 和 support gain。

要警惕一个假阳性：检索发生了，答案也对了，但证据并没有支撑答案。这个样本不能算 retrieval gate 成功，因为系统只是多走了一步碰巧没有坏掉。

## 直接结论

retrieval gate 的价值不是让 Adaptive RAG 看起来更复杂，而是把检索从隐式 prompt 技巧变成显式责任边界。它负责判断何时查证、为什么查证、查什么、查到什么程度，以及失败时如何降级。

当 gate、query builder、retriever、reranker、evidence validator 都有日志和指标时，RAG 才能进入真正的工程迭代。否则每次效果波动都只能归因给“模型不稳定”。

下一步阅读：[Agentic Coding 工程治理：多模型协作先定义责任边界](/2026/06/10/Agentic-Coding-Governance/)
