---
title: ASR 噪声下的结构化抽取评测：从文本相似到实体归因
date: 2026-06-10 17:50:00
tags: [ASR, NER, Evaluation, Open Source]
---

ASR 结果用于结构化抽取时，评测不能只看整句文本相似度。真实系统关心的是关键实体有没有抽对、位置是否合理、错误来自识别还是 NER、以及噪声会不会把下游结构化结果带偏。

因此，ASR + NER 的评测要从“文本像不像”转到“实体是否可归因”。

<!--more-->

## 要解决的问题

同样的 WER 可能对应完全不同的下游影响。一个虚词错了可能无关紧要，一个地址、姓名、编号或时间错了会直接破坏结构化结果。

如果只看 ASR 文本 precision / recall 或整体 WER，无法解释实体错误来自哪里：是 ASR 没识别出来，还是 NER 没抽出来，还是文本规范化把实体改坏了。

## 最小抽象

评测样本至少要同时保留三层信息：

```text
reference_text
asr_text
reference_entities
predicted_entities
alignment
error_reason
```

`alignment` 用来把实体 span 对齐到 ASR 输出；`error_reason` 用来区分漏识别、替换、插入、边界错误、实体类型错误和规范化错误。

## 工程闭环

指标要拆成三组。

ASR 层看 WER/CER、关键词召回、实体词召回。

NER 层看 entity precision、entity recall、span F1、type accuracy。

归因层看实体错误中有多少来自 ASR，有多少来自抽取模型，有多少来自后处理规则。

这样才能决定下一步该做什么：补噪声数据、加热词、改 NER 训练集、调整规则，还是优化文本规范化。

## 直接结论

ASR 噪声下的结构化抽取评测，关键不是把所有错误合成一个分数，而是把错误分解到 ASR、NER、span 对齐和后处理。只有错误可归因，系统才知道下一轮应该改模型、改数据还是改规则。

下一步阅读：[语音对话合成数据工程：Schema、口语化与质量闸门](/2026/06/11/Speech-Dialog-Data-Synthesis-Quality-Gates/)
