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

## 直接结论

推理框架选型前，先把延迟链路拆开并落日志。vLLM、SGLang、Triton 都可以进入候选，但判断依据应该是分阶段延迟、吞吐、p99、资源利用和失败原因，而不是单次 demo 的响应速度。

下一步阅读：[音频模型 Batch 一致性排查：从有效输入区间到逐层 diff](/2026/06/10/Speech-Batch-Consistency-Debugging/)
