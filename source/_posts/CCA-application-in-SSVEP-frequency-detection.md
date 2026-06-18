---
title: CCA 与 SSVEP 频率识别：为什么线性相关仍然有效
date: 2019-07-15 17:03:18
tags: [CCA, EEG]
mathjax: true
---

脑机接口里的 SSVEP 频率识别有一个很实际的问题：训练数据少、个体差异大、信号噪声高，但系统仍然需要快速判断用户注视的是哪个闪烁频率。

CCA（Canonical Correlation Analysis）看起来是一个传统线性统计方法，却长期在 SSVEP 中有效。原因不在于它复杂，而在于它抓住了任务里最稳定的结构：刺激频率和脑电响应之间的相关性。

<!--more-->

## 要解决的问题

SSVEP 是由周期性视觉刺激诱发的脑电响应。不同频率的闪烁刺激会在 EEG 中产生对应频率及其谐波成分。系统要做的事情，就是从多通道脑电信号里判断当前响应最接近哪个候选频率。

采集示意如下：

![](CCA-application-in-SSVEP-frequency-detection/SSVEP_collect.jpg)

频域上可以看到刺激频率及谐波处的能量峰：

![](CCA-application-in-SSVEP-frequency-detection/SSVEP_signal.png)

如果训练数据充足，可以训练复杂模型；但 BCI 场景常常数据有限、校准时间短。CCA 的优势就是不强依赖大量训练数据。

## 最小抽象

CCA 比较的是两组变量的最大线性相关。放到 SSVEP 里，一组变量是多通道 EEG，另一组是候选频率构造出的参考信号：

$$\sin 2\pi ft,\cos 2\pi ft,\sin 4\pi ft,\cos 4\pi ft,...$$

对每个候选频率，CCA 都计算 EEG 与参考信号之间的最大相关系数，相关性最高的频率就是预测结果。

![](CCA-application-in-SSVEP-frequency-detection/CCA.png)

公式展开较长，核心可以理解成一个约束优化问题：寻找 EEG 通道加权和参考信号加权，使两者相关性最大。

![](CCA-application-in-SSVEP-frequency-detection/CCAFormula.png)

## 工程闭环

CCA 的局限也很清楚。

第一，相位漂移。不同受试者对同一刺激的响应时滞不同，固定参考信号可能无法对齐所有人。

第二，线性假设。真实 EEG 包含噪声、伪迹和非线性成分，CCA 默认响应可以由参考频率线性解释。

第三，短窗性能。长时间窗里频率特征更稳定，短时间窗里信噪比下降，识别更难。

因此后续方法通常沿着两条路改进：要么增强相关分析本身，要么引入少量训练数据学习个体化空间滤波。DCCA 用深度网络表达非线性相关，但需要更多训练数据：

![](CCA-application-in-SSVEP-frequency-detection/DCCA.png)

TRCA 则从任务相关成分出发，用训练数据学习更适合当前受试者的空间滤波：

<img src="CCA-application-in-SSVEP-frequency-detection/TRCA.png" width=256 height=256/>

## 直接结论

CCA 在 SSVEP 中有效，是因为它用很低的数据成本抓住了刺激频率和脑电响应之间的稳定相关结构。它不是所有 EEG 问题的通用答案，但在候选频率明确、训练数据有限、需要快速部署的 BCI 任务里仍然是很强的基线。

后续优化不应只问“能不能换成深度学习”，而要问：短窗、相位漂移、个体差异和校准成本哪个才是当前系统的主要瓶颈。

下一步阅读：[ASR 特征前端：从原始波形到可训练的声学表示](/2021/08/24/ASR-preprocess/)

### References

[1] Frequency Recognition Based on Canonical Correlation Analysis for SSVEP-Based BCIs
[2] Deep Canonical Correlation Analysis
[3] Enhancing detection of SSVEPs for a high-speed brain speller using task-related component analysis
