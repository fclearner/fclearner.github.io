---
title: Adaptive RAG（二）：Retrieval Gate 怎么判断该不该检索
date: 2026-06-10 17:10:00
tags: [AI, RAG, LLM, Open Source]
---

上一篇把 Adaptive RAG 的问题收束到一个工程动作：先做显式 retrieval gate。它不是为了替代 Self-RAG、FLARE 或 DRAGIN，而是先给系统建立一个可观测的判断层：当前状态到底该不该检索。

这篇继续往下走，讨论 retrieval gate 应该吃什么信号、输出什么结论，以及怎么评测它。

<!--more-->

## 一、不要把低置信度直接等同于检索需求

很多 Adaptive RAG 方案会从模型不确定性入手，这个方向有价值，但不能直接把“模型不确定”翻译成“必须检索”。

低置信度可能来自语言表达困难、格式约束复杂、候选答案接近，也可能只是模型在一个不需要外部事实的问题上犹豫。反过来，高置信度也不代表答案被证据支持。模型可以非常自信地复述一个错误事实。

所以 retrieval gate 的判断目标应该是 evidence gap，而不是 confidence gap。它要回答的是：继续生成前，当前结论是否缺少外部证据、是否需要查证、是否存在冲突材料，以及检索的收益是否超过成本。

## 二、输入信号要分层

一个可用的 retrieval gate 不应该只看最后一段 prompt。更合理的输入可以分成四层。

任务层：

- 问题是否要求事实核验；
- 是否存在时间、版本、地点、实体等容易过期或混淆的信息；
- 当前任务是生成、总结、归因、比较还是验证。

状态层：

- 当前子问题是什么；
- 已有证据覆盖了哪些结论；
- 是否有中间结论还没有证据；
- 是否进入了答案校验或回退阶段。

模型层：

- 候选答案是否分歧；
- 关键槽位是否缺失；
- 模型是否产生了需要查证的具体实体；
- 自我评估是否提示证据不足。

成本层：

- 当前延迟预算还剩多少；
- 上下文窗口是否足够；
- 检索和 rerank 的边际收益是否足够；
- 同一轮是否已经多次检索。

这些信号不需要一开始就全部建模。第一版可以先用规则和轻量分类器，把高风险触发点记录下来；等日志足够多，再考虑把 gate 学成模型。

## 三、输出不能只是 yes/no

retrieval gate 如果只输出 `true` 或 `false`，后面很难优化。更实用的输出应该包含动作、原因和约束。

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

这里的 `reason_code` 是后续评测的关键。它能把失败分成几类：不该检索却检索了、该检索却没检索、query intent 错了、证据要求写得太宽、成本预算过紧，或者 fallback 策略不合理。

这比单独调 top-k 更有效，因为很多 RAG 错误根本不在 top-k，而在触发前的判断。

## 四、query builder 要避免放大猜测

gate 之后通常会接 query builder。这里有一个容易忽略的风险：不要把模型尚未验证的猜测直接写进 query。

如果模型在中间推理里猜出了一个具体实体，query builder 应该把它标记成 assumption，而不是当成事实。对于事实核验，query 更应该围绕稳定约束构造；对于多跳问题，query 应该绑定当前子问题；对于冲突证据，query 应该主动寻找反证，而不是只找支持材料。

一个简单规则是：query 里可以有候选假设，但日志里必须区分它们来自用户输入、已有证据，还是模型推断。否则检索会变成确认偏误的放大器。

## 五、评测 gate，而不是只评测答案

retrieval gate 的评测要有自己的标注和指标。最小可行集可以这样设计：

- 对样本标注 `should_retrieve`；
- 标注触发原因，例如缺事实、实体歧义、证据冲突、上下文过期；
- 记录 gate 的实际决策；
- 记录检索后证据是否真的支持答案；
- 记录最终答案是否因检索改善。

对应指标可以分成三类：

- trigger precision：触发的检索有多少是真需要的；
- trigger recall：需要检索的场景有多少被覆盖；
- support gain：触发检索后，证据支持率和答案质量是否提升。

这里要特别警惕一个假阳性：检索发生了，答案也对了，但证据并没有支撑答案。这个样本不能算 retrieval gate 成功，因为系统只是多走了一步碰巧没有坏掉。

## 小结：gate 是检索系统的责任边界

retrieval gate 的价值不是让 Adaptive RAG 看起来更复杂，而是把检索从隐式 prompt 技巧变成显式责任边界。它负责判断何时查证、为什么查证、查什么、查到什么程度，以及失败时如何降级。

当 gate、query builder、retriever、reranker、evidence validator 都有日志和指标时，RAG 才能进入真正的工程迭代。否则每次效果波动都只能归因给“模型不稳定”。

上一篇：[Adaptive RAG（一）：何时检索比检索多少更重要](/2026/06/10/AI-Adaptive-RAG-Retrieval-Scheduling/)
