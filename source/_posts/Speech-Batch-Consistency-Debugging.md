---
title: 音频模型 Batch 一致性排查：从有效输入区间到逐层 diff
date: 2026-06-10 18:20:00
tags: [ASR, Debugging, Inference, Open Source]
---

音频模型在 batch size 改变后输出不一致，是很常见但容易误判的问题。不要一开始就怀疑最后的解码结果。更稳的排查顺序是：先证明输入等价，再证明 mask 和有效长度等价，最后逐层定位数值差异从哪里开始放大。

这篇文章整理一套通用排查协议，适用于 ASR、VAD、speaker model 和其他时序音频模型。

<!--more-->

## 先定义什么叫一致

一致性可以分三层：

- 数值一致：有效区域 hidden states 差异在阈值内；
- 决策一致：分类标签、token 或分数排序不变；
- 指标一致：WER、F1、recall 等整体指标不随 batch policy 漂移。

很多线上系统真正需要的是决策一致，而不是逐位相同。先定义目标，才能避免把所有浮点差异都当成故障。

## 有效输入区间优先

排查时只比较有效输入区间，不要把 padding 区混进去。建议固定：

1. 输入样本顺序；
2. sampling rate 和 feature extraction；
3. padding value；
4. valid length；
5. attention mask 或 padding mask；
6. inference mode、dropout、random seed；
7. dtype 和 device。

如果这些条件没固定，batch=1 和 batch>1 的差异没有解释价值。

## 逐层 diff

最小复现可以这样做：

1. 同一条样本单独推理一次；
2. 把同一条样本放进混合 batch 再推理一次；
3. 对齐有效长度；
4. 保存每层输入输出的 max diff、mean diff、cosine similarity；
5. 找到差异第一次明显放大的层。

定位到层之后，再检查该层的 mask broadcast、normalization、cache、subsampling、kernel path 和 dtype 转换。

## 常见问题

几类问题最常见：

- padding 区参与了 attention 或 pooling；
- valid length 在 subsampling 后没有同步更新；
- mask 维度广播错误；
- batch normalization 或统计层在推理模式下状态不一致；
- mixed precision 在不同 batch shape 下走了不同 kernel；
- streaming cache 没有按样本隔离。

这些问题会在最终输出里表现得很混乱，但逐层 diff 通常能把范围缩小。

## 回归测试

修复后应保留 batch consistency regression：

- batch=1；
- batch=2；
- 长短混合；
- 全短样本；
- 全长样本；
- 不同 dtype；
- 不同设备或后端。

每组都只比较有效区域，并同时记录数值差异和决策差异。这样后续升级推理框架、kernel、量化策略或 batch policy 时，问题能被提前发现。

## 小结

Batch 一致性排查的关键是顺序。先证明输入和 mask 等价，再逐层找差异，不要直接从最终文本或最终分类结果反推原因。对时序模型来说，有效长度、padding、subsampling 和 dtype 往往比最后一层更早决定问题走向。
