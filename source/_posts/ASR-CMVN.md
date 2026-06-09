---
title: ASR-CMVN
date: 2021-08-24 15:41:18
tags: [ASR, Feature-engineering]
---
## 前言

&nbsp;&nbsp;&nbsp;&nbsp;CMVN在语音识别中的作用
<!--more-->
## noun 翻译
&nbsp;&nbsp;&nbsp;&nbsp;CMN：Cepstral Mean Normalisation，倒谱均值归一化；
&nbsp;&nbsp;&nbsp;&nbsp;CMVN：Cepstral Mean Variance Normalisation，倒谱均值方差归一化；


## CMVN

&nbsp;&nbsp;&nbsp;&nbsp;CMVN与数据归一化相似，但CMVN的意义更偏向于对音频数据进行滤波，可提升识别精度。
&nbsp;&nbsp;&nbsp;&nbsp;在线的CMVN是基于滑动窗口进行的，会影响语音识别响应时间；feature norm是对所有训练数据进行统计，然后单帧计算
&nbsp;&nbsp;&nbsp;&nbsp;因CMVN占用识别响应时间，最新的端到端识别中未使用
&nbsp;&nbsp;&nbsp;&nbsp;CMVN详细原理可参考References中的论文[1]


### References

[1]<a href="http://www.apsipa.org/proceedings/2020/pdfs/0000532.pdf">《Significance of CMVN for Replay Spoof Detection》</a>

