---
title: Adaptive RAG（一）：何时检索比检索多少更重要
date: 2026-06-10 17:00:00
tags: [AI, RAG, LLM, Open Source]
---

RAG 最容易被讲成一个检索增强公式：切块、向量化、取 top-k、拼进 prompt、让模型回答。这个公式很实用，但它默认了一件事：系统在回答之前已经知道自己缺什么信息。

复杂任务里，这个假设经常不成立。问题可能在生成到一半才暴露，证据可能和当前结论冲突，召回内容也可能只是语义相似而不是事实支撑。于是 Adaptive RAG 真正要解决的不是“多检索一些”，而是：系统什么时候应该承认当前上下文不够，并把检索变成下一步可验证动作。

<!--more-->

## 要解决的问题

固定检索的失败通常不来自某一个 retriever 太弱，而来自检索时机和信息需求没有被显式建模。

一个简单 RAG 流程会在用户问题进入后立刻检索。这样做稳定、便宜、容易缓存，但它把不同问题压成同一个接口：不管是事实核验、多跳推理、摘要归纳还是工具调用后的验证，都先取一批相似片段。

这会带来三个工程问题。语义相关不等于证据支持；召回时机固定会浪费上下文窗口；失败原因不可分解，无法判断错误来自触发、query、召回、rerank 还是生成。

所以 Adaptive RAG 的第一性问题不是 top-k，而是 evidence gap detection：当前状态是否真的缺少外部证据。

## 最小抽象

一个更稳的抽象不是“某个 token 需要检索”，而是“当前状态暴露了一个证据缺口”：

```text
information_need = {
  state: 当前子问题、生成阶段或工作流节点,
  uncertainty: 不确定性来自模型分歧、槽位缺失还是证据冲突,
  evidence_gap: 需要什么外部证据才能继续,
  action: 是否检索、查什么、查哪里、如何验证
}
```

Self-RAG、FLARE、DRAGIN 这类方法的启发在于把检索放进生成过程，但落地时仍然要回答一个更朴素的问题：这次检索为什么发生。

GraphRAG 和 KG-RAG 则解决证据组织问题，把文本块升级为实体、关系、社区摘要和路径。它们适合跨文档、多跳、关系密集的场景，但不应该替代最基础的触发和验证机制。

## 工程闭环

第一版 Adaptive RAG 更适合先做显式 Retrieval Gate：

```text
State Snapshot
  -> Retrieval Gate(reason_code)
  -> Query Builder(query, assumptions)
  -> Hybrid Retriever(candidates)
  -> Reranker(ranked_candidates)
  -> Evidence Validator(supported / unsupported / conflict)
  -> Generate or Rollback
```

Gate 不能只输出 yes/no。它至少要输出 reason code，例如 `missing_fact`、`stale_context`、`entity_ambiguous`、`evidence_conflict`、`cost_guard`。这样后续评测才能分清是不该检索却检索了，还是该检索却没检索。

评测也要拆成触发质量、证据质量和系统质量。尤其要看 evidence support rate，把“召回到了相似内容”和“召回到了能支撑答案的证据”区分开。没有这个指标，Adaptive RAG 很容易退化成 expensive RAG。

## 直接结论

Adaptive RAG 的核心不是“多检索几次”，而是让检索成为可记录、可回放、可评估的动作。第一版系统最应该做的是显式 Retrieval Gate：说明为什么触发，构造了什么 query，召回了哪些候选，证据是否支持当前结论，以及这次检索带来了多少延迟和成本。

只要这条链路清楚，后面再替换成 Self-RAG、FLARE、DRAGIN 或 GraphRAG，都有比较基线。否则系统只是把更多上下文交给模型碰运气。

下一步阅读：[Adaptive RAG（二）：Retrieval Gate 怎么判断该不该检索](/2026/06/10/AI-Adaptive-RAG-Retrieval-Gate/)
