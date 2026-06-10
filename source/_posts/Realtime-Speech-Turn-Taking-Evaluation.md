---
title: 实时语音 Turn-taking 评测：从端点检测到可接话判断
date: 2026-06-10 18:10:00
tags: [Speech, ASR, Evaluation, Open Source]
---

实时语音交互里，端点检测只能回答“声音是否停止”，不能直接回答“系统现在是否应该接话”。更有用的建模目标是 turn-taking：判断当前轮次是否完整、是否需要继续等待、是否允许系统响应，以及错误响应会带来什么交互代价。

这类问题适合公开讨论，因为它不依赖具体场景。核心是标签定义、输入噪声、延迟预算和评测切分。

<!--more-->

## 标签不是一个 end

一个可用的标签体系至少要区分几类状态：

- continue listening：用户大概率还会继续说；
- semantic end：语义上已经形成完整表达；
- response-ready：系统可以开始响应；
- hold：语义可能完整，但仍建议等待；
- interruption risk：系统现在响应可能造成打断。

如果所有状态都压成一个 end 标签，模型会把声学停顿、语义完成和可接话动作混在一起。离线 F1 可能不错，在线体验仍然不稳定。

## 输入要按噪声分层

Turn-taking 评测不应该只用干净文本。建议至少准备三组输入：

1. clean transcript，用来测语义判断上限；
2. final ASR transcript，用来测真实识别误差下的判断；
3. partial ASR transcript，用来测流式中间态。

三组结果的差异可以回答一个关键问题：错误来自语义判断本身，还是来自 ASR 插入、删除、替换和 partial 不稳定。

## 评测指标

常规 precision、recall、F1 仍然有用，但不够。实时交互还需要动作级指标：

- false response：过早接话；
- late response：等待过久；
- missed response：该接话时没有接；
- interruption recovery：误打断后能否恢复；
- first-action latency：第一次动作延迟；
- final-decision stability：partial 更新后决策是否频繁反复。

这些指标比单一 end accuracy 更接近真实系统质量。

## 一个最小评测闭环

可以从一个小闭环开始：

1. 收集短句、长句、停顿、修正、重复、半句话等样本；
2. 标注 semantic end、response-ready 和 hold；
3. 用 clean transcript 训练或评估上限；
4. 加入 final ASR text，测识别噪声损失；
5. 加入 partial text，测流式稳定性；
6. 把错误分成过早、过晚、误打断、未恢复。

这个闭环能把“模型是否理解语义”和“系统是否适合实时交互”分开看。

## 工程注意点

线上系统需要保留 event log：partial 输入、时间戳、模型判断、动作、取消、恢复和最终输出。没有这些日志，就很难解释一次错误响应是由文本变化、模型阈值、状态机还是服务延迟造成的。

Turn-taking 的目标不是追求最早响应，而是在低延迟和低打断之间找到可控平衡。
