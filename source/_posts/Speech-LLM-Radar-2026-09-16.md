---
title: 【Speech LLM Radar】2026-09-16 语音大模型与交互系统技术雷达
date: 2026-09-16 10:30:00
tags: [AI, LLM, Speech, ASR, TTS, Realtime, Agent, Evaluation, China AI]
---

过去两周，语音大模型最值得关注的变化不是音色又自然了一点，而是**语音交互系统开始形成新的架构共识**：延迟敏感的前台模型持续听、说和维持对话，耗时更长的推理、检索与工具调用转到后台异步执行，再把结果安全地合并回当前会话。

这意味着语音 Agent 的竞争单位正在从单个模型升级为一套实时系统：媒体传输、连续感知、发言决策、异步任务、打断恢复、状态一致性与权限治理缺一不可。

<!--more-->

## This Week’s Signal

- **GPT‑Live‑1 正式进入 API（2026-09-10）**：模型能够同时听和说，同时仍输出 ASR transcript 与回复文本，支持关键词偏置和显式 turn boundary。OpenAI 公布其 Full Duplex Bench 相比 GPT‑Realtime‑2.1 提升 30 个百分点，并把自然停顿、自我修正下的工具调用纳入评测。工程上的关键信号不是某个总分，而是“原生全双工”和“结构化文本旁路”可以同时存在。([GPT‑Live‑1 API](https://openai.com/index/introducing-gpt-live-1-in-the-api/))
- **Gemini 3.8 Live 把异步工具调用设为默认（2026-09-15）**：模型支持音频、视频、文本输入和音频输出，提供交错推理、异步 function calling 与完整 session content 更新。工具可以按 `SILENT`、`WHEN_IDLE`、`INTERRUPTED` 调度，这使“工具结果何时进入当前对话”从应用层补丁变成协议层语义。([Gemini 3.8 Live](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live))
- **Realtime‑Venus 展示双循环语音 Agent（2026-09）**：9B 前台模型负责连续感知、对话控制和原生语音生成，后台 Harness 异步执行推理与工具；二者共享用户输入、模型输出和 delegation event 的因果时间线。论文在 Full‑Duplex‑Bench v1.5 中分别测量“应该响应的打断”和“应该继续说的 backchannel / 旁人说话 / 背景语音”，比单一打断成功率更接近真实交互。([Realtime‑Venus](https://arxiv.org/abs/2609.13814))
- **全双工可控性进入独立评测（2026-09-11）**：SteerDuplex 不只测能否插话，还测语气、角色、语速、口音和回答长度是否服从指令。其强化学习结果同时暴露了新风险：系统可能通过缩短甚至不完整回答来换取更漂亮的时序指标，因此“及时”必须和“完整”联评。([SteerDuplex](https://arxiv.org/abs/2609.12623))
- **训练数据开始保留真实对话结构（2026-09-08）**：ConversationalVoice 从真实双人音频中恢复分离声道、说话人、词级对齐、停顿、重叠、backchannel 与打断，再进行受原对话约束的重建和扩展。这比把两段独立 TTS 拼在一起更适合训练 turn-taking，但论文目前主要验证数据属性，尚未证明下游全双工模型一定受益。([ConversationalVoice](https://arxiv.org/abs/2609.08147))

## 最近的语音交互系统进展

### 1. 从“轮次流水线”转向“持续时间线”

传统语音 Agent 通常是：

`VAD -> ASR -> LLM -> TTS`

这条链路容易调试，也适合结构化客服与合规留痕，但它把一次对话切成离散请求：VAD 没有判停，后续模块就不能开始；系统播报时，用户的新语音往往只能触发粗粒度 stop。

新一代系统把输入音频、输出音频、模型状态和工具事件放在同一条持续时间线上。模型可以在用户仍说话时积累语义，在自己播报时继续监听，并区分四类重叠：

1. 用户真正抢话，需要停止当前回复并响应新意图。
2. 用户发出“嗯”“对”之类 backchannel，系统应该继续说。
3. 用户对旁人说话，系统不应抢答。
4. 环境声或串音，系统既不应停播也不应创建新任务。

因此，“能被打断”已经不够；更关键的是**只在该被打断时停下来**。

### 2. 从单循环模型转向前台 / 后台双循环

GPT‑Live、Gemini 3.8 Live 与 Realtime‑Venus 虽然实现不同，但都指向相似分工：

| 层 | 主要职责 | 时间预算 | 失败时的正确行为 |
| --- | --- | --- | --- |
| 媒体层 | WebRTC / WebSocket、编解码、抖动缓冲、回声消除 | 毫秒级 | 保持连接或快速重连，不重复提交音频 |
| 前台交互循环 | 连续监听、backchannel、发言时机、短回复、打断 | 数百毫秒级 | 降级为简短确认，不伪造后台结果 |
| 后台任务循环 | 深度推理、检索、工具调用、跨 Agent 委派 | 秒到分钟级 | 可取消、可超时、可重试，副作用幂等 |
| 会话协调层 | 合并结果、版本检查、权限确认、状态回放 | 事件驱动 | 丢弃过期结果，避免污染新话题 |

双循环解决的是“工具慢，但对话不能僵住”。它也引入新问题：后台结果返回时，用户可能已经改口、取消或切换话题。因此每次委派至少需要 `task_id`、`conversation_revision`、`cancel_state`、`side_effect_level` 和 `result_ttl`，不能只靠自然语言上下文猜结果是否仍然有效。

### 3. 工具调用从 blocking API 变成对话调度问题

在文本 Agent 中，调用工具时暂停输出通常可以接受；在语音中，数秒沉默会被用户理解为断线。新的实时 API 开始显式支持非阻塞工具与返回时机，但应用仍要定义三种策略：

- **silent**：静默执行，不主动打断当前话题，例如缓存偏好或读取低优先级状态。
- **when_idle**：等当前发言完成、用户没有继续说时再汇报，例如搜索结果或长任务摘要。
- **interrupted**：结果具有高时效或安全意义时打断当前播报，例如支付失败、设备危险或权限即将过期。

这不只是体验配置。只要工具含写操作，就必须把“停止播报”和“取消执行”分成两个信号；用户说“算了”时，系统应明确回答任务是尚未开始、已取消、无法取消还是已经完成。

### 4. 低延迟开始由媒体系统与推理系统共同决定

模型首 token 变快，并不等于用户更快听到声音。端到端延迟至少包括：采集帧、上行网络、抖动缓冲、音频前处理、模型调度、首个可播放音频块和下行播放。

OpenAI 的实时系统实践把 WebRTC session state 放在边缘 transceiver 中，再把媒体与事件转为内部推理协议；多人会议、课堂或人工接管场景则更适合 SFU，因为它能统一处理参与者、录制、转发和 per-stream policy。([Realtime media architecture](https://openai.com/index/delivering-low-latency-voice-ai-at-scale/))

工程监控不应只记录平均“模型延迟”，而要拆成：

- connection setup、首个上行音频帧和首个 partial transcript；
- 语义判停到首个回复音频块；
- barge-in 到输出真正停止；
- 工具开始、工具结果返回和结果被会话接受；
- p50 / p95 / p99 抖动、丢包与重连恢复时间。

### 5. 评测从自然度扩展到交互策略

近期 benchmark 正在把“听起来像真人”拆成可诊断行为：

| 维度 | 典型错误 | 推荐指标 |
| --- | --- | --- |
| 发言时机 | 用户思考时抢答、该接话时沉默 | premature response、time-to-first-audio |
| 重叠处理 | backchannel 被误判成抢话 | continuation rate、false barge-in |
| 真正打断 | 用户改口后仍继续旧回复 | interruption response、stop latency |
| 指令可控 | 要求简短却长篇输出、口音/语速漂移 | rubric pass rate、style consistency |
| 任务完成 | 对话自然但工具序列错误 | task success、tool sequence pass@1 |
| 回答完整 | 为降低延迟而提前截断 | semantic completeness、unfinished rate |
| 状态一致 | 过期后台结果插入新话题 | stale-result acceptance rate |

这组指标必须联合看。只优化 stop latency，系统可能一有声音就停；只优化 continuation rate，系统又可能忽略真正打断；只优化 turn-taking，模型还可能用不完整答案“刷分”。

## 国内语音交互系统观察池

| 厂商 / 系统 | 当前路线 | 雷达位置 | 这期重点 |
| --- | --- | --- | --- |
| 字节 SeedRealtime | 原生音视频全双工、主动感知、工具调用 | Trial | 验证旁人语音、视觉指代、主动发言边界与工具权限 |
| 阿里 Qwen3-ASR / Qwen3-Omni | 专用 ASR + 原生多模态实时语音 | Trial | 保留本地可重放识别基线，验证端到端 turn-taking |
| 阶跃 Step-Audio2 / Realtime API | 统一音频理解、生成、推理与工具调用 | Watch | 比较普通、mini、think 模式的延迟与任务完成率 |
| OpenBMB MiniCPM-o 4.5 | 端侧友好的全双工多模态交互 | Watch | 设备算力、持续视频记忆、回声与热管理 |
| 小米 MiMo-Audio / MiMo-ASR | 开源音频理解、生成与专用识别 | Watch | 是否形成可部署的完整实时交互 runtime |
| MiniMax Speech | TTS、声音克隆与表达控制 | Trial | 作为生成层评测，不直接等同于全双工对话系统 |

国内系统下一步不应只比较中文榜单。更有区分度的问题是：是否开放事件协议、能否导出时间线、工具是否异步可取消、部署时能否稳定处理回声与多人串音，以及本地 ASR 能否作为端到端模型的旁路审计。

## Adopt

- **采用“实时前台 + 异步后台 + 会话协调”三层架构**：让延迟敏感的听说路径与深度推理、工具副作用解耦，并为所有后台结果增加版本与过期检查。
- **采用统一因果事件账本**：至少记录 `audio_in/out`、partial/final transcript、turn decision、barge-in、delegation、tool start/end/cancel 和结果合并事件。
- **保留专用 ASR 文本旁路**：即使使用原生 audio-to-audio 模型，也保留可搜索、可脱敏、可回放的 transcript，用于排障和合规；它不是最终真相，但比只保存最终回复更可诊断。
- **将取消语义做到工具层**：语音停止、任务取消和副作用回滚分别建模，写操作默认需要幂等键和确认点。

## Trial

- **GPT‑Live‑1 与 Gemini 3.8 Live 的系统级对照**：使用同一 30 组中文场景，比较自然停顿、自我修正、backchannel、旁人语音、背景声、真实打断和异步工具返回，而不是只测首包延迟。
- **Realtime‑Venus 双循环模式的小规模复现**：即使不替换模型，也可先复现 shared timeline、foreground acknowledgement 和 background delegation 三个机制，验证过期结果丢弃与取消路径。
- **国内模型统一事件适配层**：为 SeedRealtime、Qwen/Step Realtime 建立内部事件规范，把供应商的 session、audio、tool 与 cancel 事件映射成同一结构，降低迁移成本。
- **可控性 + 完整性联合评测**：参考 SteerBench 增加语速、风格、简洁度和角色约束，同时检查答案是否完成，防止模型以省略内容换取时序得分。

## Watch

- **原生全双工是否真的降低系统复杂度**：模型内部可能省掉 VAD / turn detector，但生产系统仍需要权限、审计、重试、连接状态和降级路径。
- **真实对话数据能否带来稳定下游收益**：ConversationalVoice 已验证数据重建质量，仍需等待训练后对不同语言、口音、回声与设备的增益证据。
- **端侧实时交互**：端侧能改善隐私和网络稳定性，但持续音视频推理会受到功耗、温度、内存与设备差异约束。
- **主动发言策略**：视觉或环境变化触发提醒很有价值，也最容易造成打扰和越权；需要 per-scenario policy，而不是全局“主动模式”开关。

## Hold / Risks

- **暂缓用一个“全双工总分”决定上线**：中断响应率和继续说话率存在天然张力，必须按重叠类型分别统计。
- **暂缓让后台结果无条件回灌会话**：任务返回前必须检查当前 revision、用户是否取消、结果是否过期以及副作用是否已发生。
- **暂缓把 transcript 当作完整审计记录**：语气、停顿、重叠和说话对象可能在文本化时丢失，关键决策还需要事件时间线。
- **暂缓默认长期保存原始连续音视频**：持续监听会显著扩大隐私面，应明确采集指示、留存期限、访问控制与删除路径。
- **暂缓让主动语音模型直接持有高风险写权限**：支付、删除、设备控制等动作需要显式确认、短期凭据和可验证的取消结果。

## Practical Stack Adjustments

1. 将现有 `speech_task_type` 扩展为 `transcribe`、`turn_management`、`duplex_dialogue`、`background_task`、`tts` 与 `audio_scene`。
2. 新增内部 `conversation_event` schema，所有 provider adapter 都输出统一的时间戳、revision、task_id、speaker_target 与 cancel_state。
3. 建立 30 组交互脚本：每组包含正常接话、思考停顿、backchannel、旁人说话、背景噪声、用户抢话、工具中取消和结果过期。
4. 仪表盘拆分媒体、模型、交互与工具四层延迟，并展示 p95/p99，禁止只报平均首包时间。
5. 为写工具加入 idempotency key、pre-commit confirmation 和 compensating action；停止播报不得自动标记工具已取消。
6. 用 Qwen3-ASR 或等价专用识别模型保留一条可重放旁路，再分别接入国内外原生实时模型做系统级比较。

## 要解决的问题

- 前台模型怎样在保持自然 backchannel 的同时，不把思考停顿和旁人语音误判成新指令？
- 后台任务返回时，怎样证明它仍对应用户当前意图，而不是几秒前已经被取消的话题？
- 如何把媒体延迟、模型延迟、发言决策和工具延迟分开观测，避免所有问题都被归因成“模型慢”？
- 语音 Agent 的取消、确认和回滚怎样做到既能被用户听懂，又能被系统精确执行？
- 国内外 API 事件协议不同，什么内部抽象既能支持迁移，又不会抹平各模型真正的全双工能力？

## 最小抽象

- `media plane`：采集、编解码、传输、抖动、回声与连接恢复。
- `interaction loop`：连续感知、turn-taking、backchannel、barge-in 与短反馈。
- `task loop`：推理、检索、工具、委派、重试、超时与取消。
- `coordination`：因果时间线、revision、结果合并、过期判断与状态回放。
- `governance`：权限、确认、来源、留存、删除与审计。

任何新模型都要说明自己改变了哪一层。如果只是 MOS、WER 或厂商总分提高，却没有给出交互协议、延迟分解和失败恢复证据，就不应直接进入生产 Trial。

## 工程闭环

1. 每周扫描模型、API 协议、运行时、benchmark 与真实事故，不只跟踪模型发布。
2. 所有候选系统先跑离线音频，再跑脚本化双工交互，最后才进入真人灰度。
3. 每次失败都回放同一条因果时间线，区分媒体、感知、发言策略、生成、工具和协调层责任。
4. 每次 provider 升级重跑相同 30 组脚本，并对比 revision 丢弃、取消成功率和状态恢复，而不只对比音质。
5. 每季度做一次断网、重连、后台超时、工具重复执行和用户撤回演练。

## 直接结论

近期语音交互系统最值得采用的不是某一个模型，而是三项系统能力：前台听说与后台任务解耦、所有事件进入同一条因果时间线、用户取消能够一路传递到工具副作用。GPT‑Live‑1 与 Gemini 3.8 Live 适合进入托管服务对照，国内 SeedRealtime、Qwen 与 Step Realtime 应使用相同脚本评测；专用 ASR 继续作为转写、检索和排障旁路。

## 主线判断

语音交互系统正在从“低延迟语音聊天”迈向“持续在线的实时 Agent”。真正的进展有三点：第一，模型能够同时听和说，并学习何时保持沉默；第二，前台互动与后台智能开始解耦；第三，工具返回时机、取消和状态一致性成为协议的一部分。

下一阶段的领先者不会只由声音自然度决定，而会由四件事共同决定：能否正确处理重叠语音，能否在长任务期间维持对话，能否拒绝过期结果和越权动作，以及能否把整条交互恢复成一条可解释的因果时间线。

## 小样本推演

- **用户在系统播报时说“嗯，你继续”**：只靠能量阈值的 barge-in 会立刻停播；合格的全双工系统应把它识别成 backchannel，继续当前回答，并在事件账本中记录“检测到重叠但未切换发言权”。
- **用户让 Agent 订票，三秒后改口说“别订了，先查天气”**：前台应立即确认收到取消请求，后台订票任务则根据执行阶段返回“已取消”或“无法取消”；即使旧结果随后到达，revision 检查也必须阻止它回灌新话题。
- **搜索工具执行十秒，用户期间继续追问**：前台可以先处理新问题，但后台结果不能随到随播；应按 `WHEN_IDLE` 等待合适时机，并在汇报时说明它对应哪一个旧问题。
- **模型在安静实验室首包很快，电话线上却频繁迟答**：若监控只记录模型推理时间，问题会被误判为模型波动；拆分连接、抖动缓冲、判停与首个可播放音频块后，才能定位是媒体层还是模型层。
- **为了降低抢话率，模型总是等待很久**：premature response 可能变好，但交互会变迟钝；必须同时看响应延迟、用户重复提问率和任务完成率，避免单指标优化。

## 下一步阅读：

- [上一期：2026-09-01 语音大模型技术雷达](/2026/09/01/Speech-LLM-Radar-2026-09-01/)
- [实时语音 Turn-taking 评测：从端点检测到可接话判断](/2026/06/10/Realtime-Speech-Turn-Taking-Evaluation/)
- [语音大模型工程：音频 token、LLM 主干与对齐契约](/2026/06/10/Speech-LLM-Audio-Token-Alignment/)
- [LLM 与语音模型推理服务：队列、流式与可观测性](/2026/06/10/LLM-Speech-Inference-Serving-Observability/)
- [GPT‑Live‑1 API](https://openai.com/index/introducing-gpt-live-1-in-the-api/)
- [Gemini 3.8 Live](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live)
- [Realtime‑Venus](https://arxiv.org/abs/2609.13814)
- [SteerDuplex](https://arxiv.org/abs/2609.12623)
- [ConversationalVoice](https://arxiv.org/abs/2609.08147)

## 结论

这一期语音雷达的关键词从“路由、时机、恢复与来源”进一步升级为“前台、后台、协调与取消”。专用 ASR 仍是重要旁路，但新系统的核心已经是持续时间线：前台保持自然交互，后台完成复杂任务，协调层保证只有仍然有效且获得授权的结果才能回到会话。模型能力只是起点，实时系统是否可观测、可取消、可回放，才决定它能否真正进入生产。
