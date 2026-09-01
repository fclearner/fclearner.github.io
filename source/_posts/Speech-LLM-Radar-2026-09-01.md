---
title: 【Speech LLM Radar】2026-09-01 语音大模型技术雷达
date: 2026-09-01 10:30:00
tags: [AI, LLM, Speech, ASR, TTS, Realtime, Evaluation, China AI]
---

过去一个月，语音大模型最重要的变化不是合成声音又自然了一点，而是产品边界正在分叉：一条路线用专用 ASR 强化时间戳、说话人、热词和流式稳定性；另一条路线让原生语音模型持续监听、生成、插话和调用工具。两者解决的问题不同，不应该被一个“语音模型总分”混在一起比较。

<!--more-->

## This Week’s Signal

- **Google 将专用语音识别重新做成独立生产模型（2026-08-26）**：Gemini 3.5 Transcribe GA 分为非流式与 Live 两条路径。非流式版本支持 85+ 语言、说话人分离、词级时间戳和最多 1,000 个自定义词偏置；Live 版本通过 WebSocket 输出 interim/final 结果，并提供多种 VAD 策略。这说明端到端语音对话变强之后，结构化转写仍需要可控、可审计的专用接口。([Gemini API Release Notes](https://ai.google.dev/gemini-api/docs/changelog))
- **OpenAI GPT-Live 把实时语音从“轮次请求”改为持续推理（2026-07-08 / 2026-08-03）**：GPT-Live 采用全双工语音架构，可同时听和说；工程实现让媒体流保持连续，同时把工具或任务委派放到异步路径，避免阻塞当前对话。7 月 31 日更新还为支持的生成音频加入 SynthID 来源标记。([Introducing GPT-Live](https://openai.com/index/introducing-gpt-live/), [Realtime system engineering](https://openai.com/index/continuous-voice-interaction-with-gpt-live/))
- **字节 SeedRealtime 把全双工扩展到音频、视觉和工具调用（2026-08-05）**：模型持续融合音频、视频和时间信息，不再先把视觉或语音全部转成文本再判断；官方展示的目标包括区分旁人闲聊与真实指令、根据场景主动提醒，以及在对话中调用工具。它值得进入实时交互观察池，但官方端到端人评不能替代本地噪声、口音、多人和权限测试。([SeedRealtime 官方发布](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction))
- **Qwen3-ASR 的本地部署入口趋于完整（2026-06-26）**：0.6B 与 1.7B 模型支持 52 种语言及方言的识别和语言判断，配套 0.6B ForcedAligner；官方仓库新增 Transformers 原生支持与 `torch.compile`，并保留 vLLM、流式推理和微调路径。对中文私有化语音栈，它比只有云 API 的模型更适合作为可重放基线。([Qwen3-ASR 官方仓库](https://github.com/QwenLM/Qwen3-ASR))
- **ElevenLabs 的近期更新集中在运行可靠性而非新榜单（2026-08-24）**：Scribe Realtime 客户端改进错误传递、麦克风初始化失败清理、连接关闭和迟到音频帧处理；同时 CLI v1 允许把 Agent、工具和测试配置保存为文件。这个信号提示实时语音上线后的主要成本往往来自资源释放、断线和状态恢复。([ElevenLabs Changelog](https://elevenlabs.io/docs/changelog))
- **全双工评测开始覆盖多轮、语言和领域差异（2026-07-31）**：M3-DuplexBench 同时比较英语、日语、闲聊和多轮问答，并区分单轮、仅用户历史、teacher-forced 全上下文等设置。论文结果显示，不同模型存在不同的接话特征，增加上下文也不一定稳定改善结果。([M3-DuplexBench](https://arxiv.org/abs/2607.29125))

## 国内语音大模型观察池

本系列把“语音大模型”限定为至少覆盖语音理解、语音生成或实时交互中的一项，并且有官方模型、API、代码或技术报告可验证。国内固定观察池如下：

| 厂商 / 模型 | 主要方向 | 当前位置 | 持续观察点 |
| --- | --- | --- | --- |
| 字节 SeedRealtime / Seed Audio 1.0 | 全双工音视频交互、场景音频生成 | Trial | 多人抗干扰、主动发言边界、工具调用权限、端到端延迟 |
| 阿里 Qwen3-ASR / Qwen-Omni | ASR、强制对齐、端到端多模态语音 | Trial | 中文方言、流式 partial、本地吞吐、音频 token 预算 |
| 阶跃 StepAudio 2.5 | 统一 ASR、TTS 与 Realtime | Watch | 单一模型跨三种运行模式时的质量与资源折中 |
| MiniMax Speech 2.8 | TTS、克隆、情绪与声音标签 | Trial | 中文韵律、克隆授权、首包延迟、长文本稳定性 |
| 小米 MiMo-Audio / MiMo-ASR | 开源音频理解、生成与 ASR | Watch | 少样本泛化能否复现、6.25 Hz LLM 表征的效率收益 |

## Adopt

- **把专用 ASR 与原生全双工对话拆成两条路由**
  - **为什么重要**：会议转写、字幕和结构化抽取需要稳定文本、时间戳和说话人；实时陪伴或语音 Agent 才需要重叠语音、插话和连续听说。
  - **成熟度**：高（两类模型均已有可用产品）。
  - **风险**：统一入口若隐藏底层路由，会让同一音频在不同任务下得到不可解释的结果。
  - **下一步**：定义 `transcribe` 与 `duplex_dialogue` 两个显式任务类型，禁止由模型根据 prompt 静默切换。

- **把双工交互记录成可回放时间线**
  - **为什么重要**：最终回答正确不代表交互正确；抢话、误触发、迟答和打断后继续说都发生在毫秒级时间线上。
  - **成熟度**：中高（已有公开评测框架可借鉴）。
  - **风险**：原始音频、说话人和工具调用日志同时落盘会扩大隐私面。
  - **下一步**：默认只保留脱敏事件：`audio_in/out` 区间、partial 变化、发言决策、barge-in、工具开始/结束和取消结果；原音频单独设置短留存。

- **给生成语音增加来源与授权字段**
  - **为什么重要**：声音克隆和高度拟真人声已进入生产能力，只有音频文件而没有来源信息无法支持投诉、撤回或审计。
  - **成熟度**：中（部分平台已提供水印，跨平台标准仍不统一）。
  - **风险**：水印可能在转码、剪辑或混音后丢失。
  - **下一步**：产物侧同时保存 `provider`、`model`、`voice_id`、授权记录、生成时间和可用的水印验证结果，不把单一水印当作唯一证据。

## Trial

- **用 Qwen3-ASR 与 Gemini 3.5 Transcribe 建立本地 / 云端双基线**
  - **为什么重要**：前者提供可部署、可微调的中文基线，后者提供说话人、时间戳和热词能力完整的托管基线。
  - **成熟度**：高。
  - **风险**：语言覆盖、模型规模和 API 后处理不同，不能只比较一个总 WER。
  - **下一步**：固定 100 条中文样本，按普通话、方言、噪声、多人、热词、长音频分桶，记录 CER/WER、时间戳偏差、说话人错误、首个 partial 延迟和最终稳定时间。

- **做一次 SeedRealtime / GPT-Live / Gemini Live 风格的双工小样本评测**
  - **为什么重要**：三条路线都强调自然实时对话，但产品演示无法回答中文停顿、多人闲聊和连续工具调用时谁更稳。
  - **成熟度**：中（产品可用性和区域入口不同）。
  - **风险**：模型版本、音频前端和网络条件会显著影响结果。
  - **下一步**：先跑 20 组脚本化场景：犹豫停顿、用户抢话、系统被打断、背景对话、同音词 + 视觉线索、工具调用中继续说；统一记录 premature response、false trigger、barge-in success、first-audio latency 和任务完成率。

- **比较 MiniMax Speech 2.8 与 Eleven v3 的可控生成，而不是只听自然度**
  - **为什么重要**：声音标签、情绪、停顿和克隆能力只有在文本规范化、实体读法和长段一致性可控时才适合生产。
  - **成熟度**：中高。
  - **风险**：主观试听容易忽略电话号码、金额、缩写和跨语言专名错误。
  - **下一步**：构造数字、URL、专名、情绪切换、长段落和中英混读集合，记录可懂度、实体准确率、首包延迟、长段音色漂移和人工偏好。([MiniMax Speech 2.8](https://www.minimax.io/news/minimax-speech-28), [ElevenLabs Models](https://elevenlabs.io/docs/overview/models))

## Watch

- **StepAudio 2.5 的统一模型路线**：技术报告将 ASR、TTS 和 Realtime 视为同一音频语言模型的不同运行制度，值得观察统一表征是否真的降低系统复杂度，还是把三种任务的延迟与解码约束藏进更复杂的推理配置。([StepAudio 2.5 Technical Report](https://arxiv.org/abs/2605.23463))
- **Seed Audio 1.0 的“完整声音场景”生成**：它把语音、环境声和音效放进同一场景，并提供对话时间控制；更适合内容生产，不应直接等同于低延迟语音 Agent。([Seed Audio 1.0](https://seed.bytedance.com/en/blog/from-speech-to-audio-creation-introducing-the-seed-audio-1-0-audio-creation-model))
- **MiMo-Audio 的少样本音频任务泛化**：官方开源模型把 RVQ token 经 patch encoder 压到 6.25 Hz 供 LLM 建模，并提供理解、生成、编辑和评测工具；需验证其训练外任务表现是否能在公开权重上复现。([MiMo-Audio](https://github.com/XiaomiMiMo/MiMo-Audio))
- **全双工训练数据的真实性**：DuplexChat 等工作开始规模化构造分离说话人流，但播客分离与合成脚本不等于真实设备上的回声、串音、近讲和远讲分布。([DuplexChat](https://arxiv.org/abs/2607.04941))

## Hold/Risks

- **暂缓用端到端全双工模型替换所有 VAD + ASR 链路**：结构化转写、法务留痕和可编辑字幕仍优先选择可观察的专用识别路径。
- **暂缓用单一 MOS 或试听投票决定 TTS 上线**：至少同时检查实体读法、长段一致性、跨语言发音、延迟和克隆授权。
- **暂缓让主动语音模型默认拥有写操作工具**：能主动插话不等于应主动执行；工具权限仍需按读、写、破坏性动作分层。
- **暂缓保存无限期原始双工音频**：先定义用途、留存期限、访问范围和删除路径，再开启生产级回放。

## Practical Stack Adjustments

1. 新增 `speech_task_type`：`transcribe`、`align`、`tts`、`duplex_dialogue`、`audio_scene`，每类绑定独立模型与验收指标。
2. 给实时链路增加统一事件账本：音频输入输出区间、partial/final、turn decision、barge-in、false trigger、工具调用和取消状态。
3. 建立 100 条 ASR 分桶集与 20 组双工脚本集，国内外模型共用同一采样率、网络条件和超时预算。
4. 给所有合成语音产物附加模型、voice_id、授权、时间和来源验证元数据；原始授权材料与音频产物分开保存。
5. 先把 Qwen3-ASR 作为本地可重放基线，Gemini 3.5 Transcribe 作为云端能力上界，再决定是否引入额外识别服务。
6. 每月扫描国内 Seed、Qwen、StepAudio、MiniMax、MiMo 与海外 OpenAI、Google、ElevenLabs 的官方模型和运行时更新。

## 要解决的问题

- 什么时候应该使用可解释的 ASR + LLM + TTS 级联，什么时候原生全双工模型的交互收益足以覆盖治理成本？
- 如何同时评估语音内容是否正确、系统何时开口、被打断后是否恢复，以及工具是否越权？
- 国内外模型的语言、网络、部署和计费条件不同，怎样构造公平且可复现的横向评测？
- 高拟真语音与声音克隆进入常规 API 后，来源、授权、删除和审计如何成为默认工程字段？

## 最小抽象

- `perception`：ASR、说话人、时间戳、语言和音频事件识别。
- `interaction`：turn-taking、backchannel、barge-in、误触发和恢复。
- `generation`：音色、韵律、实体读法、情绪、延迟和长段稳定性。
- `action`：语音意图触发的工具权限、异步任务和取消语义。
- `governance`：授权、来源、水印、留存、可回放和删除路径。

任何雷达信号都必须落到其中至少一层；只有模型名字、参数量或厂商自报总分而没有可验证工程入口的更新，不进入 Adopt 或 Trial。

## 工程闭环

1. 每周按 ASR、实时对话、TTS/克隆、音频理解/生成、评测与治理六类扫描官方来源。
2. 新模型先进入固定离线集；只有分桶指标可解释，才进入实时或用户试验。
3. 实时试验必须保存脱敏事件时间线，并能回放一次抢话、一次误触发、一次用户打断和一次工具取消。
4. 每次模型或 API 升级后重跑相同样本，差异按模型、网络、音频前端、VAD 和后处理五类归因。
5. 每季度做一次语音产物退出演练：撤销 voice_id、删除原音频、验证派生物和缓存是否可追踪。

## 直接结论

语音大模型已经分成两种生产逻辑：专用 ASR 追求结构化、稳定和可审计，原生全双工模型追求连续感知、自然接话和边说边行动。首期雷达建议 Adopt 的不是某个单一模型，而是“任务显式路由 + 时间线回放 + 来源授权”三件基础设施；模型本身先用 Qwen3-ASR / Gemini Transcribe 与 SeedRealtime / GPT-Live 两组对照进入 Trial。

## 主线判断

未来半年语音栈的竞争重点会从单句 WER、MOS 和首包延迟，转向多轮状态、发言时机、干扰鲁棒性、工具协作与内容来源。全双工不会消灭 ASR；相反，越是端到端，越需要一条可重放的专用识别基线帮助定位模型到底听到了什么。

## 小样本推演

- 同一段 800ms 停顿，专用 VAD 可能立即判停，语义 turn detector 可能继续等，全双工模型还可能先用 backchannel 表示在听。三者都可能合理，评测必须看用户后续行为而不是只看边界标签。
- 一条多人会议音频即使最终文本 CER 很低，只要说话人归属或时间戳错误，就不能用于纪要追溯；这类任务优先专用 Transcribe，而不是原生语音聊天模型。
- 一个 TTS 样本听起来很自然，但若金额、账号或药名读错，其生产价值可能低于声音略机械但实体准确的模型。自然度只能是评测的一列。
- 如果用户打断正在调用工具的语音 Agent，而系统只停止播报、不取消写操作，交互层看似成功，行动层却已经失败；双工评测必须包含工具副作用。

## 下一步阅读：

- [实时语音 Turn-taking 评测：从端点检测到可接话判断](/2026/06/10/Realtime-Speech-Turn-Taking-Evaluation/)
- [语音大模型工程：音频 token、LLM 主干与对齐契约](/2026/06/10/Speech-LLM-Audio-Token-Alignment/)
- [LLM 与语音模型推理服务：队列、流式与可观测性](/2026/06/10/LLM-Speech-Inference-Serving-Observability/)
- [Gemini 3.5 Transcribe Release Notes](https://ai.google.dev/gemini-api/docs/changelog)
- [GPT-Live Realtime Engineering](https://openai.com/index/continuous-voice-interaction-with-gpt-live/)
- [SeedRealtime](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction)
- [Qwen3-ASR](https://github.com/QwenLM/Qwen3-ASR)
- [M3-DuplexBench](https://arxiv.org/abs/2607.29125)

## 结论

首期语音大模型雷达的关键词不是“更像真人”，而是“路由、时机、恢复与来源”。先把专用 ASR 和全双工对话分开评测，把音频事件与工具副作用放进同一时间线，再讨论哪个模型进入主栈。国内 Seed、Qwen、StepAudio、MiniMax、MiMo 与海外 OpenAI、Google、ElevenLabs 将使用同一套工程口径持续跟踪。
