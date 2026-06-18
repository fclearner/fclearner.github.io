---
title: Adaptive RAG（一）：何时检索比检索多少更重要
date: 2026-06-10 17:00:00
tags: [AI, RAG, LLM, Open Source]
---

RAG 最容易被讲成一个检索增强公式：切块、向量化、取 top-k、拼进 prompt、让模型回答。这个公式很实用，但它默认了一件事：系统在回答之前已经知道自己缺什么信息。

复杂任务里，这个假设经常不成立。问题可能在生成到一半才暴露，证据可能和当前结论冲突，召回内容也可能只是语义相似而不是事实支撑。于是 Adaptive RAG 真正要解决的不是“多检索一些”，而是：**系统什么时候应该承认当前上下文不够，并把检索变成下一步可验证动作**。

<!--more-->

## 一、问题不是召回器不够强

固定检索的失败通常不来自某一个 retriever 太弱，而来自检索时机和信息需求没有被显式建模。

一个简单 RAG 流程会在用户问题进入后立刻检索。这样做稳定、便宜、容易缓存，但它把不同问题压成同一个接口：不管是事实核验、多跳推理、摘要归纳还是工具调用后的验证，都先取一批相似片段。

这会带来三个工程问题。

第一，语义相关不等于证据支持。向量检索很容易取回同主题材料，但同主题材料未必能支持当前结论。模型看到这些材料后，反而可能更自信地说错。

第二，召回时机固定。很多缺口只有在中间结论出现后才清楚，提前检索会浪费上下文窗口，也会把不稳定材料提前注入 prompt。

第三，失败原因不可分解。答案错了，到底是没有触发检索、query 写错、召回不足、rerank 失败，还是生成阶段没有忠实使用证据？如果系统没有阶段日志，只能靠感觉调参数。

所以 Adaptive RAG 的第一性问题不是 top-k，而是 evidence gap detection：当前状态是否真的缺少外部证据。

## 二、把“信息需求”看成状态

一个更稳的抽象不是“某个 token 需要检索”，而是“当前状态暴露了一个证据缺口”。可以把它写成一个最小状态对象：

```text
information_need = {
  state: 当前子问题、生成阶段或工作流节点,
  uncertainty: 不确定性来自模型分歧、槽位缺失还是证据冲突,
  evidence_gap: 需要什么外部证据才能继续,
  action: 是否检索、查什么、查哪里、如何验证
}
```

这个抽象比单纯看 token 置信度更贴近工程。低置信度不一定代表需要检索，高置信度也不代表事实可靠。Self-RAG、FLARE、DRAGIN 这类方法的启发在于把检索放进生成过程，但落地时仍然要回答一个更朴素的问题：这次检索为什么发生。

## 三、先做显式 retrieval gate

第一版 Adaptive RAG 不必一开始就把触发权完全交给模型。更可控的做法是先加一个显式 retrieval gate，让它在每个关键状态点判断是否检索。

一个可落地的流程是：

```text
State Snapshot
  -> Retrieval Gate(reason_code)
  -> Query Builder(query, assumptions)
  -> Hybrid Retriever(candidates)
  -> Reranker(ranked_candidates)
  -> Evidence Validator(supported / unsupported / conflict)
  -> Generate or Rollback
```

这里的 gate 不能只输出 yes/no。它至少要输出 reason code，例如：

- `missing_fact`: 当前结论缺少外部事实；
- `stale_context`: 当前上下文可能过期；
- `entity_ambiguous`: 实体或术语有歧义；
- `evidence_conflict`: 已有证据互相冲突；
- `cost_guard`: 检索收益不足以覆盖延迟和 token 成本。

这样做的价值不是让规则看起来复杂，而是让后续评测能分清错误来源。没有 reason code，检索只是 prompt 里的隐性副作用；有了 reason code，检索才变成可以审计的策略。

## 四、GraphRAG 不是第一步默认答案

GraphRAG 和 KG-RAG 解决的是证据组织问题：把文本块升级为实体、关系、社区摘要和路径。它适合跨文档、多跳、关系密集的场景，也能缓解单段 chunk 无法表达全局结构的问题。

但图不是免费的。实体抽取、关系归并、增量更新、图召回和摘要压缩都会引入新误差。很多系统在第一阶段更应该先把 retrieval gate、query builder 和 evidence validator 做清楚，再决定是否把某些证据集合图谱化。

换句话说，图检索不是 Adaptive RAG 的起点，而是证据组织层的一个增强选项。没有可观测的检索触发和证据验证，GraphRAG 也可能只是更昂贵的上下文注入。

## 五、评测要拆到触发和证据

只看最终答案准确率，无法判断 Adaptive RAG 是否真的变好。一个可用的评测面板至少要拆成三组。

触发质量：

- retrieval trigger precision；
- retrieval trigger recall；
- 不必要检索率；
- 应检索未检索率；
- 平均每轮检索次数。

证据质量：

- Recall@K；
- MRR / nDCG；
- evidence support rate；
- conflict evidence rate；
- rerank 后关键证据进入上下文窗口的比例。

系统质量：

- 答案准确率；
- hallucination rate；
- P95 延迟；
- token 和检索成本；
- 无证据时的拒答或降级比例。

其中最关键的是 evidence support rate。它把“召回到了相似内容”和“召回到了能支撑答案的证据”区分开。没有这个指标，Adaptive RAG 很容易退化成 expensive RAG。

## 小结：先把检索变成可验证动作

Adaptive RAG 的核心不是“多检索几次”，而是让检索成为可记录、可回放、可评估的动作。第一版系统最应该做的是显式 retrieval gate：说明为什么触发，构造了什么 query，召回了哪些候选，证据是否支持当前结论，以及这次检索带来了多少延迟和成本。

只要这条链路清楚，后面再替换成 Self-RAG、FLARE、DRAGIN 或 GraphRAG，都有比较基线。否则系统只是把更多上下文交给模型碰运气。

下一篇：[Adaptive RAG（二）：Retrieval Gate 怎么判断该不该检索](/2026/06/10/AI-Adaptive-RAG-Retrieval-Gate/)
