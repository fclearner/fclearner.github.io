---
title: 语音大模型工程：音频 token、LLM 主干与对齐契约
date: 2026-06-10 17:20:00
tags: [ASR, LLM, Speech, Open Source]
---

语音大模型不是把 ASR encoder 接到 LLM 上就结束了。真正困难的是接口契约：音频如何被压成 token，token 如何进入 LLM，文本监督如何约束语音表示，流式场景又如何保证延迟和上下文一致。

如果这个契约不清楚，Qwen3-ASR、Qwen-Omni、WeNet、CTC、AED、speech encoder 和 LLM 主干会变成一堆名词，而不是可排障的系统。

<!--more-->

## 要解决的问题

传统 ASR 输出文本，LLM 处理文本。Speech-LLM 想把语音直接纳入语言模型能力，但语音和文本的粒度差异很大：音频帧密集、长度长、噪声多；文本 token 稀疏、语义压缩强。

工程上的关键问题是：语音侧的信息压缩到什么粒度，才能既保留识别所需细节，又不把 LLM 上下文窗口耗尽。

## 最小抽象

可以把 Speech-LLM 拆成四层。

第一层是音频前端和 speech encoder。WeNet、Qwen3-ASR 这类系统会把声学特征压成更高层的语音表示，常见监督包括 CTC、AED 或混合目标。

第二层是 projector 或 adapter。它负责把 speech encoder 输出映射到 LLM 可消费的向量空间。这里不是简单维度对齐，还包括时间下采样、位置编码和模态边界。

第三层是 LLM 主干。Qwen-Omni 这类多模态系统需要同时处理语音、文本甚至其他模态，因此输入序列必须标记清楚模态、时间和角色。

第四层是输出协议。系统到底输出转写、语义回答、结构化字段，还是边听边生成，会决定训练样本和解码策略。

## 工程闭环

对齐问题必须可观测。至少要记录：

- 音频时长到 speech token 数量的压缩比；
- CTC 或 ASR 辅助目标是否稳定；
- projector 输出是否导致 LLM 上下文过长；
- 流式场景下 partial 结果是否可回滚；
- 错误来自声学识别、模态对齐还是语言生成。

一个实用排查顺序是先看 ASR 能力，再看对齐层，再看 LLM 生成。如果基础转写已经不稳定，直接调 prompt 或扩大 LLM 很难解决问题。

## 直接结论

Speech-LLM 的工程边界在音频 token 契约，而不是模型名字。先定义清楚音频如何压缩、如何接入 LLM、如何监督、如何流式输出，再比较 Qwen3-ASR、Qwen-Omni、WeNet 或其他方案。

下一步阅读：[LLM 与语音模型推理服务：队列、流式与可观测性](/2026/06/10/LLM-Speech-Inference-Serving-Observability/)
