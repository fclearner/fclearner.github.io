---
title: 实时语音 Turn-taking 评测：从端点检测到可接话判断
date: 2026-06-10 18:05:00
tags: [ASR, Speech, Evaluation, Open Source]
---

实时语音系统里，判断用户“说完了”比看起来更难。静音不一定代表结束，短停顿可能只是思考；语义已经完整，也可能还会补充条件。Turn-taking 要解决的不是单纯端点检测，而是系统什么时候可以安全接话。

<!--more-->

## 要解决的问题

传统 VAD 或 endpointing 主要看声学静音。实时助手需要更复杂的判断：当前 partial 结果是否语义完整，用户是否可能继续说，系统现在接话是否会打断。

如果判断过早，系统会抢话；判断过晚，交互 latency 会变差。这个 tradeoff 不能只靠经验阈值。

## 最小抽象

一个 turn-taking 决策至少包含：

```text
audio_state
partial_transcript
semantic end score
silence_duration
rollback_risk
latency_budget
decision
```

`semantic end` 表示语义是否完成；`partial` 表示当前流式识别结果仍可能变化；`latency_budget` 控制系统为了更准愿意等多久。

## 工程闭环

评测要同时看三类指标。

第一类是交互延迟：用户停顿后多久系统响应，p95/p99 是否可接受。

第二类是打断率：系统是否在用户还没说完时抢答。

第三类是漏接或慢接：用户已经说完但系统迟迟不响应。

离线评测可以用标注的 turn boundary；在线评测还要记录 partial 变化、ASR 回滚、semantic end 分数和最终用户体验。

## 直接结论

Turn-taking 不是 VAD 的别名，而是声学、语义和延迟预算共同决定的接话策略。先把 partial、semantic end、silence 和 latency 分开记录，再调阈值或训练模型。

下一步阅读：[LLM 与语音模型推理服务：先把延迟拆成可观测链路](/2026/06/10/LLM-Speech-Inference-Serving-Observability/)
