---
title: 音频模型 Batch 一致性排查：从有效输入区间到逐层 diff
date: 2026-06-10 18:10:00
tags: [ASR, Debugging, Engineering, Open Source]
---

同一个音频，batch size 不同却输出不同，这是音频模型排障里很典型的问题。它通常不是“模型随机性”一句话能解释的，而是 padding、mask、dtype、subsampling、归一化或缓存边界出了问题。

排查这类问题，关键是把有效输入区间和逐层差异记录下来。

<!--more-->

## 要解决的问题

批量推理会把不同长度音频 pad 到同一形状。理论上，mask 应该保证 padding 不影响有效区域。但实际实现里，卷积、subsampling、attention、归一化和 dtype 转换都可能让 padding 泄漏进有效输出。

如果只比较最终文本，很难定位问题。需要比较中间层。

## 最小抽象

排查对象可以写成：

```text
single_sample_output
batched_output
valid_frame_range
mask
dtype
layer_diffs
```

先确认输入波形、特征、长度和 mask 是否一致，再逐层比较 hidden states。只要找到第一个 divergence 层，排查范围就会大幅缩小。

## 工程闭环

建议按顺序检查：

1. 音频读取和重采样是否一致；
2. feature extraction 是否受 batch 影响；
3. padding 后 valid length 是否正确；
4. mask 是否覆盖 attention 和 convolution；
5. subsampling 后长度是否同步更新；
6. dtype、autocast、dropout 和随机种子是否固定；
7. cache 或 streaming state 是否被错误复用。

最终报告不要只写“batch 不一致”，而要记录最早出现差异的层、差异量级、影响的有效区间和修复后的回归样本。

## 直接结论

Batch 一致性问题的核心是边界控制。只要 batch 推理引入 padding，就必须验证 mask、subsampling、dtype 和缓存不会污染有效帧。逐层 diff 比反复猜参数更可靠。

下一步阅读：[LLM 与语音模型推理服务：先把延迟拆成可观测链路](/2026/06/10/LLM-Speech-Inference-Serving-Observability/)
