---
title: LAS 模型：把语音识别改写成听、对齐、拼写
date: 2021-08-24 15:29:20
tags: [ASR, ASR-Classic, Deep-learning, Attention]
---

传统 ASR 通常把声学模型、发音词典和语言模型拆成多个模块。LAS（Listen, Attend and Spell）提出的是另一种问题表述：能不能让模型先听完整段语音，再通过 attention 找到相关声学片段，最后像拼写一样输出字符序列。

这篇文章不把 LAS 当成历史模型罗列，而是把它看成端到端 ASR 的一个关键抽象：**对齐不必显式写死，可以由 decoder 在生成时学习**。

<!--more-->

## 要解决的问题

语音识别最难的部分之一是对齐。音频帧很多，文字标签较短，而且两者长度比例不固定。传统系统通过 HMM、词典和语言模型显式管理这个问题，工程上可控，但模块多、训练链路长。

LAS 试图把问题压成一个序列到序列任务：输入是声学特征序列，输出是字符或子词序列。模型需要自己学习什么时候关注哪段音频。

## 主线判断

LAS 的主线不是把 ASR 改成 seq2seq，而是把对齐从显式规则交给生成过程学习。

这个转变带来更强的条件生成能力，也带来 attention 漂移、长音频不稳定和流式部署困难。理解 LAS 的价值，重点不在复现一个历史结构，而在看清端到端 ASR 如何把声学、对齐和语言建模揉进同一条解码链路。

## 最小抽象

LAS 可以拆成两个部分。

Listener 是编码器，通常使用 pyramidal BiLSTM 压缩时间维度，把长音频帧变成更短的高层表示。时间下采样很重要，否则 decoder 每一步都要在过长的帧序列上做 attention。

Speller 是带 attention 的 decoder。它在每个输出步根据历史字符和 attention context 预测下一个字符。

![](ASR-LAS-model/LAS_flow.png)

这个结构的本质是：

```text
audio frames -> listener states -> attention context -> next character
```

CTC 假设时间步相对独立，LAS 则把输出历史纳入 decoder。它更像翻译模型，因此语言建模能力更强，但训练和解码也更依赖数据规模与搜索策略。

## 工程闭环

评估 LAS 这类 attention ASR，不能只看最终 WER。至少要看四件事。

- 对齐是否稳定：长音频、重复词、静音段是否导致 attention 漂移；
- 解码是否可控：beam size、长度惩罚和外部语言模型如何影响结果；
- 延迟是否可接受：完整 attention 更适合离线，流式化需要额外结构；
- 错误是否可解释：插入、删除、重复和漏识别分别来自 encoder、attention 还是 decoder。

LAS 的历史价值在于证明端到端 ASR 可以直接学习声学到文本的映射。但在实时和长音频场景里，attention 漂移、解码成本和流式约束会变成主要工程问题。

## 小样本推演

可以用三条样本观察 LAS 的风险：短命令、包含重复词的句子、超过训练平均长度的长句。短命令看 decoder 是否过度依赖语言先验，重复词看 attention 是否跳过或重复，长句看注意力是否从声学尾部漂移。

如果短命令输出很流畅但和音频不符，这不是语言模型“强”的好事，而是声学约束不够；如果长句后半段开始幻觉，说明 attention 和长度控制需要单独评估。

## 直接结论

LAS 适合用来理解端到端 ASR 的基本范式：encoder 压缩语音，attention 做软对齐，decoder 负责条件生成。它不是现代 ASR 的终点，但很多后来的 AED、Transducer 和 Speech-LLM 结构都能从这里看出影子。

下一步阅读：[语音大模型工程：音频 token、LLM 主干与对齐契约](/2026/06/10/Speech-LLM-Audio-Token-Alignment/)

### References

[1] [Listen, Attend and Spell](https://arxiv.org/abs/1508.01211)
[2] [Listen-Attend-and-Spell-Pytorch](https://github.com/AzizCode92/Listen-Attend-and-Spell-Pytorch)
