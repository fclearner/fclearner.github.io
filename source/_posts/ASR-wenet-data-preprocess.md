---
title: ASR-wenet-data_preprocess
date: 2022-05-06 12:53:51
tags: [ASR, data preprocess]
---
### 前言

&nbsp;&nbsp;&nbsp;&nbsp;wenet数据预处理
<!--more-->

## 数据准备

wenet是参考kaldi、Espnet等开源ASR项目开发的，因此继承了很多开源项目的优点。在数据准备阶段，WeNet 仅需要准备 kaldi 风格的 wav.scp 列表文件和text标注文件

# TODO wav.scp图

# TODO text图

wenet会把wav.scp及text整理成需要的data.list(参考run.sh)

# TODO data.list图

(也可以采用kaldi提取特征，可以参考librispeech及train_deprecated.py，这个似乎要弃用了)

对于data.list，在kaldi 进行训练之前，会把数据转为两种类型【shard, raw】的其中一种, 参考dataset.py及processor.py.

其中，

shard:

```text
a、url_opener:在线音频文件加载.

#TODO url_opener函数截图

b、tar_file_and_group:将文件打包成tar文件，tar文件流加载.
#TODO b、tar_file_and_group函数截图
```

raw: 原始的data.list

数据类型转换完成后，统一采用torchaudio进行数据处理。
