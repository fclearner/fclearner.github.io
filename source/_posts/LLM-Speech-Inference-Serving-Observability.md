---
title: LLM 与语音模型推理服务：先把延迟拆成可观测链路
date: 2026-06-10 17:40:00
tags: [LLM, Speech, Inference, Engineering]
---

推理服务的问题经常被简化成“换更快的框架”。vLLM、SGLang、Triton 都很重要，但如果系统不能解释一次请求的延迟来自排队、预填充、解码、音频前端、网络还是后处理，换框架只是碰运气。

语音和 LLM 结合后，延迟问题更复杂：音频切片、流式 partial、模型队列、token 生成和系统超时会叠在一起。

<!--more-->

## 要解决的问题

线上推理关注的不是平均速度，而是尾延迟和稳定性。一个服务平均很快，但 p99 经常超时，用户体验仍然不可接受。

语音模型还多了几个阶段：音频读取、重采样、特征提取、chunk 组织、ASR 或 speech encoder 推理、LLM 解码、流式输出。任何一层都可能放大延迟。

## 最小抽象

可以把请求生命周期拆成：

```text
ingress
  -> queue
  -> preprocess
  -> prefill / encode
  -> decode / stream
  -> postprocess
  -> response
```

vLLM 和 SGLang 主要优化 LLM serving 的调度、KV cache、batch 和解码吞吐；Triton 更适合做模型服务编排和算子级部署。它们解决的是不同层次的问题，不能用单一 benchmark 直接替代系统观测。

## 工程闭环

服务必须记录分阶段指标：

- queue wait；
- preprocess time；
- prefill 或 encoder time；
- first token / first partial latency；
- tokens per second；
- p50 / p95 / p99；
- timeout reason；
- batch size、dtype、KV cache 命中情况。

对流式语音系统，还要单独看 partial 的稳定性：早出结果是否经常回滚，回滚是否影响下游，semantic end 或 turn-taking 判断是否被延迟拖垮。

没有这些指标，优化就会变成只看 GPU 利用率。GPU 忙不代表服务健康，GPU 不忙也可能是队列、网络或调度策略出了问题。

## 设计取舍

服务优化要先区分吞吐问题和交互问题。离线批处理希望 GPU 尽可能满，允许更长队列和更大 batch。实时交互更关心首包延迟、partial 稳定性和取消响应速度，不能为了吞吐无限等待合批。两类目标放在同一套队列策略里，通常会互相伤害。

队列也不能只设置一个全局超时。更好的方式是分阶段设置预算：排队预算、预处理预算、预填充或编码预算、首 token 预算、流式输出预算。这样超时时能知道是哪一段失败，而不是只看到请求慢。

对于语音系统，还要把 tokenizer、detokenizer、音频前端和后处理纳入观测。很多尾延迟并不在主模型里，而是在同步 CPU 步骤、线程争用或异常重试里。

## 可观测闭环

一条可操作的可观测链路应该把 request id 贯穿到底。同一个 request id 下，日志要能看到进入时间、排队时间、输入长度、音频时长、编码时间、首个 partial 时间、首 token 时间、总输出 token、取消或超时原因。监控面板则按模型、输入长度、batch、时间段和错误原因分桶。

这样做的价值在于定位。p99 变差时，可以直接判断是长音频集中进入、队列积压、预处理变慢、解码吞吐下降，还是下游消费不及时。没有 request 级链路，所有优化都会回到经验猜测。

## 失败归因

推理服务最常见的误判是把所有慢都归给模型。如果 GPU 利用率低但排队时间高，可能是调度或并发限制。若首 token 慢但后续 token 快，问题可能在 prefill、编码或输入长度。若首包快但总耗时长，问题可能在解码吞吐或下游消费。若只有 p99 变差，重点看长输入、异常重试、锁竞争和资源抖动。

把这些归因写清楚，框架选型才有依据。否则 vLLM、SGLang、Triton 之间的比较会退化成谁在单次 demo 中看起来快。
## 落地检查

一开始可以只做三张面板。第一张是端到端延迟分解，展示 queue、preprocess、encode、first token、decode、postprocess。第二张是输入分桶，按音频时长、文本长度、batch size 和输出 token 数看 p95/p99。第三张是失败原因，区分排队超时、编码超时、解码超时、取消请求和后处理异常。

这三张面板足够回答大部分初期问题：是请求太长、队列太深、模型慢、后处理慢，还是超时预算不合理。等这些基础链路稳定后，再讨论更细的框架替换和 kernel 优化，结论会可靠得多。

## 直接结论

推理框架选型前，先把延迟链路拆开并落日志。vLLM、SGLang、Triton 都可以进入候选，但判断依据应该是分阶段延迟、吞吐、p99、资源利用和失败原因，而不是单次 demo 的响应速度。

下一步阅读：[音频模型 Batch 一致性排查：从有效输入区间到逐层 diff](/2026/06/10/Speech-Batch-Consistency-Debugging/)
