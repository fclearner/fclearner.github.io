---
title: PEFT 工程取舍：省参数只是入口，部署路径才是边界
date: 2026-06-10 17:30:00
tags: [LLM, PEFT, Fine-tuning, Open Source]
---

PEFT 常被理解成“少训练一些参数”。这句话没错，但它只说了训练成本，没有说清楚工程边界。真正的选择不是参数越少越好，而是训练显存、适配能力、推理开销、上下文占用、版本管理和回滚方式之间的取舍。

如果不把这些约束写清楚，LoRA、Prefix-Tuning、P-Tuning、QLoRA 很容易被比较成一张简单榜单，而不是可复用的工程组件。

<!--more-->

## 要解决的问题

全量微调成本高、版本重、回滚慢。PEFT 的目标是让模型在较低训练成本下适配新任务，同时尽量不破坏基础模型能力。

但“低成本”有不同含义。LoRA 省的是可训练参数和显存；Prefix-Tuning 省的是模型权重改动，但占用上下文或 attention 前缀；QLoRA 降低训练显存，但引入量化配置和稳定性问题。

所以 PEFT 选择的第一步不是问哪个方法更先进，而是问当前瓶颈在哪里：训练显存、数据规模、推理延迟、多任务切换，还是上线回滚。

## 最小抽象

可以把 PEFT 方法按“改哪里”来理解。

LoRA 在权重矩阵旁边加入低秩更新。它生态成熟、训练稳定、容易合并到基础模型，也适合多 adapter 管理。它的主要变量是 rank、target modules、alpha、dropout、学习率和数据规模。

Prefix-Tuning 和 P-Tuning 把可训练信息放到输入或注意力前缀里。它们和模型主体解耦更强，但会改变上下文窗口和缓存形态。如果任务本身已经依赖长上下文，前缀成本不能忽略。

QLoRA 把量化和 LoRA 结合，让较小显存也能训练大模型。它降低了进入门槛，但 dtype、量化方式、优化器状态和梯度检查点都会影响收敛稳定性。

## 工程闭环

PEFT 实验不能只记录最终指标。每个 adapter 都应该进入 registry：

```text
base_model
dataset_version
target_modules
rank / alpha / dropout
learning_rate
quantization_config
eval_set
merge_status
serving_runtime
rollback_path
```

这个 registry 的价值在部署阶段才会显现。多 adapter 是否动态加载，是否共享 batch，是否合并权重，合并后如何版本化，推理框架是否支持对应 dtype，都会影响线上复杂度。

如果没有 registry，团队很容易把 prompt 改动、数据变更和 adapter 行为混在一起，最后无法复现实验结果。

## 直接结论

PEFT 是一组工程组件，不是一个统一算法。LoRA、Prefix-Tuning、P-Tuning、QLoRA 的核心差异，不只是训练参数量，而是它们如何改变训练图、上下文窗口、推理路径和版本管理。

选型时先写清楚瓶颈，再做小规模对照实验；上线前先确认 adapter registry、评测集、合并策略和回滚路径。否则省下的训练成本会在部署和排障阶段还回去。

下一步阅读：[语音大模型工程：音频 token、LLM 主干与对齐契约](/2026/06/10/Speech-LLM-Audio-Token-Alignment/)
