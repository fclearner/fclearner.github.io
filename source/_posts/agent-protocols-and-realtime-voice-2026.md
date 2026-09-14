---
title: 智能体协议全景：从三种 ACP、MCP、A2A 到实时语音交互
date: 2026-09-13 12:00:00
updated: 2026-09-13 12:00:00
tags: [AI, Agent, MCP, ACP, A2A, Voice, WebRTC]
categories: [人工智能]
description: 按工具连接、智能体协作、客户端交互、实时语音与商务交易分层，梳理智能体协议及其截至 2026 年 9 月的进展。
---

智能体领域最近出现了大量协议缩写：MCP、A2A、ACP、AG-UI、A2UI、RTVI……
如果只看名字，很容易以为它们都在解决“让两个 AI 对话”这件事。
实际接入时才会发现，有的连接编辑器和编码助手，有的描述远程任务，有的传递界面状态，
还有的负责语音会话中的说话、打断和交接。

理解这些协议，可以先问三个问题：**谁与谁连接？交换什么？谁负责执行和确认？**
本文据此整理协议地图，再单独展开实时语音，因为“能发送音频”与“能自然对话”之间还有很大距离。

<!--more-->

## 要解决的问题

这篇文章要回答的是：面对一个具体智能体产品，应当在哪条连接边界上引入什么协议，
以及怎样避免把同名缩写、厂商 API 和开放标准混为一谈。

### 检索范围与阅读方式

本文于 **2026 年 9 月 13 日**检索，重点覆盖 2025—2026 年形成或发生重要变化的智能体协议，
并纳入实时语音所依赖的既有互联网标准。资料优先采用官方规范、维护者仓库、更新日志与项目公告，
不使用搜索排名、GitHub 星数或厂商宣传来推断市场份额。

这是一份有范围的技术综述，不是所有同名项目的完整目录。纳入对象需要有可查阅的规范、文档或实现；
仅有论文构想的方案不与已有实现的协议并列推荐。
文中的“当前”“候选”“草案”按检索日的官方标注记录；选型建议和组合架构属于本文分析。
`latest` 和仓库 `main` 都会变化，实际开发仍应固定规范与 SDK 版本。

## 主线判断

本文的判断是：先定义连接双方和状态责任，再选择协议。
工具调用、远程任务、界面事件与语音播放有不同的生命周期，采用同一种底层传输也不会让它们自动兼容。
因此，评估重点应是业务语义和失败处理，而不是某个缩写是否流行。

## 最小抽象：协议分别连接什么

下表中的官方入口也作为各条目的来源索引。它们属于不同层级，不能仅凭名称判断替代关系。

| 连接边界 | 协议或接口 | 交换的主要内容 | 类型与边界 |
| --- | --- | --- | --- |
| 应用／智能体 ↔ 工具和数据 | [MCP](https://modelcontextprotocol.io/specification/2026-07-28) | 工具、资源、提示模板及相关调用 | 开放协议；不规定智能体内部如何规划 |
| 客户端 ↔ 编码智能体 | [ACP：Agent Client Protocol](https://agentclientprotocol.com/protocol/v1/overview) | 会话、进度、文件操作、权限请求 | 开放协议；典型客户端是编辑器 |
| 独立智能体 ↔ 独立智能体 | [A2A](https://a2a-protocol.org/latest/specification/) | 能力描述、消息、任务、产物 | 开放协议；保留对方内部实现的独立性 |
| 应用／智能体 ↔ 智能体服务 | [旧 ACP：Agent Communication Protocol](https://agentcommunicationprotocol.dev/introduction/welcome) | 运行、会话、多模态消息 | 历史路线；现已并入 A2A |
| 开放网络中的智能体 | [ANP](https://github.com/agent-network-protocol/AgentNetworkProtocol/blob/main/docs/anp-getting-started-guide.md) | 身份、发现、描述、跨域消息 | 开放协议套件；部分模块仍是草案 |
| 用户界面 ↔ 智能体后端 | [AG-UI](https://docs.ag-ui.com/introduction) | 运行事件、文本、工具事件、共享状态 | 开放事件协议 |
| 智能体 → 界面渲染器 | [A2UI](https://a2ui.org/) | 声明式组件和界面数据 | 开放 UI 描述协议；可由其他协议承载 |
| 语音客户端 ↔ 对话后端 | [RTVI](https://docs.pipecat.ai/client/rtvi-standard) | 就绪、说话状态、转写、工具事件 | Pipecat 生态的开放交互协议 |
| 对话助手 ↔ 对话助手 | [Open Floor Protocol](https://voiceinteroperability.ai/) | 助手发现、对话事件、委派和交接 | 开放对话互操作协议 |
| 应用 ↔ 实时模型服务 | [OpenAI Realtime](https://developers.openai.com/api/docs/guides/realtime)、[GPT-Live](https://developers.openai.com/api/docs/guides/live)、[Gemini Live](https://ai.google.dev/gemini-api/docs/live-api) | 音频、会话事件、工具或委派结果 | 厂商 API；彼此并非自动兼容 |
| 实时通信端点之间 | [WebRTC](https://www.rfc-editor.org/rfc/rfc8825)、[WebSocket](https://www.rfc-editor.org/rfc/rfc6455)、[SIP](https://www.rfc-editor.org/rfc/rfc3261) | 媒体、通用双向消息或呼叫信令 | 既有互联网标准；不是新发明的智能体协议 |
| 购物智能体 ↔ 商家／支付体系 | [商务 ACP](https://www.agenticcommerce.dev/docs)、[UCP](https://ucp.dev/)、[AP2](https://ap2-protocol.org/) | 结账、商务能力、可验证的支付授权 | 领域协议；业务职责与覆盖范围不同 |

可以把典型系统画成下面这样。线条代表可采用的连接方式，不表示每个系统都要装齐全部协议。

```text
用户
 ├─ 编辑器 ── Agent Client Protocol ── 编码智能体
 ├─ 业务界面 ── AG-UI ── 智能体后端
 │                 └─ 可承载 A2UI 界面描述
 └─ 语音客户端 ── 实时媒体 + RTVI／厂商会话事件 ── 语音助手
                                                        │
                                      工具和数据 ← MCP ─┤
                                      远程专家   ← A2A ─┤
                                      其他对话助手 ← OFP ┤
                                      商务服务 ← 领域协议┘
```

## 二、ACP 到底是哪一个

### 1. Agent Client Protocol：让编辑器接入不同编码智能体

Zed 于 **2025 年 8 月 27 日**介绍这条 ACP 路线，并以 Gemini CLI 为初始集成之一。
它把编辑器与编码智能体之间的交互抽象出来：编辑器提供用户界面，智能体负责自己的执行过程。
这样，接入一个智能体不必重新实现整套聊天、改动展示和权限交互。
来源：[Zed 发布文章](https://zed.dev/blog/bring-your-own-agent-to-zed)。

当前 v1 规范采用 JSON-RPC 2.0。一个典型回合包括初始化、建立会话、发送提示、接收进度，
必要时由智能体请求文件访问或用户授权，最后返回停止原因。
`session/prompt`、`session/update` 和 `session/request_permission` 分别对应这条链上的不同职责。
文件与终端能力需要按客户端声明使用，不能假定所有客户端全部实现。
来源：[ACP v1 概览](https://agentclientprotocol.com/protocol/v1/overview)。

**版本提醒：**官方 TypeScript SDK 页面已提供实验性 v2 入口，明确标注 v2 仍是草案，
稳定入口仍为 v1。SDK 的版本号与协议版本号也不是同一个概念。
来源：[ACP TypeScript SDK](https://agentclientprotocol.github.io/typescript-sdk/)。

### 2. Agent Communication Protocol：已并入 A2A 的旧路线

IBM／BeeAI 相关的 Agent Communication Protocol 也缩写为 ACP。
它曾使用 RESTful API 连接智能体，覆盖同步、异步、流式消息与长任务。
但其官方首页如今明确说明 ACP 已成为 A2A 的一部分，并提供迁移入口；维护者的合并公告日期为
**2025 年 8 月 25 日**。
来源：[旧 ACP 首页](https://agentcommunicationprotocol.dev/introduction/welcome)、
[维护者合并公告](https://github.com/orgs/i-am-bee/discussions/5)。

因此，阅读早期“MCP、ACP、A2A 三选一”文章时，需要先核对文章日期。
我的选型判断是：新建跨框架智能体服务先评估 A2A；维护旧 ACP 系统则先做迁移和兼容性盘点。
项目合并不代表旧请求报文会自动被 A2A 服务接受。

### 3. Agentic Commerce Protocol：购物结账的 ACP

第三种常见 ACP 是 OpenAI 与 Stripe 发起的 Agentic Commerce Protocol。
它定义买家、购物智能体和商家之间的交易接口，重点包括结账流程和支付凭证传递。
它不会让编辑器获得编码能力，也不是通用智能体任务协议。
来源：[商务 ACP 官方网站](https://www.agenticcommerce.dev/)、
[协议介绍](https://www.agenticcommerce.dev/docs)。

所以，技术文档第一次写 ACP 时，应写出全称和项目链接。
“我们支持 ACP”这一句话不足以判断两个系统能否互通。

## 三、工具、任务与开放网络：MCP、A2A、ANP

### MCP：把工具和上下文接到应用中

Model Context Protocol 标准化的是应用与外部能力之间的接口。
其主要抽象包括 Tools、Resources 和 Prompts，分别对应可调用能力、上下文数据与提示模板。
调用一个知识库或数据库工具时，应用依旧负责把结果纳入自己的推理与工作流。
来源：[MCP 2026-07-28 规范](https://modelcontextprotocol.io/specification/2026-07-28)。

**本轮检索中一个重要更新：**官方 `latest` 已指向 **2026-07-28**。
这一修订移除了协议级会话及原先的初始化握手，改为在请求中携带版本和客户端能力，
加入 `server/discover`，并把实验性 Tasks 从核心移到扩展。
因此，不能把 2025 年教程中的初始化和会话流程原样当成当前规范。
来源：[MCP 修订日志](https://modelcontextprotocol.io/specification/2026-07-28/changelog)。

MCP 也在通过扩展覆盖更丰富的用途，例如异步 Tasks、Skills over MCP 和交互式 MCP Apps。
这些扩展要求双方支持；“支持 MCP”本身不等于支持所有扩展。
来源：[MCP 扩展入口及说明](https://modelcontextprotocol.io/specification/2026-07-28#extensions)。

### A2A：把工作交给一个独立智能体

Agent2Agent 更适合表达“请你完成这项工作”。
对方可以使用自己的模型、工具和内部工作流，对调用者只暴露协议约定的能力与结果。
核心概念包括 Agent Card、Message、Task 和 Artifact；任务更新可以通过流式或异步机制传递。
当前规范包含 JSON-RPC、gRPC 和 HTTP+JSON／REST 绑定，不能再简单概括成“只有 JSON-RPC”。
来源：[A2A 规范](https://a2a-protocol.org/latest/specification/)。

例如，主助手把一份材料交给远程研究智能体，后者可能继续工作、请求补充信息或交付报告。
这个例子体现的是任务委派边界；若主助手只是调用一个查询接口并自行组织答案，MCP 往往更直接。
这是架构上的判断，不意味着工具一定同步，也不意味着 MCP 绝对不能包装智能体。

**最新进展：**A2A 官方文档已提供 v1.0 迁移说明。
**2026 年 8 月 17 日**，AAIF 宣布 A2A 加入其托管项目，与 MCP 等项目进入同一开放治理体系。
共同治理不等于两种协议已经合并。
来源：[A2A v1.0 更新说明](https://a2a-protocol.org/latest/whats-new-v1/)、
[AAIF 公告](https://aaif.io/blog/a2a-joins-aaif)。

### ANP：把身份与发现扩展到开放网络

Agent Network Protocol 面向跨域智能体网络，涉及 `did:wba` 身份与认证、能力描述、
发现以及跨域消息。它更关心陌生服务如何被找到、识别和连接。
当前入门文档以 **ANP 1.1** 为发布线，同时明确说明元协议协商模块仍是草案。
来源：[ANP 入门文档](https://github.com/agent-network-protocol/AgentNetworkProtocol/blob/main/docs/anp-getting-started-guide.md)。

这里需要区分愿景与实现：项目可以提出“智能体互联网”的目标，
但这不意味着全球发现、身份治理和所有客户端互通已经解决。
我的建议是按实际需要评估身份、发现或消息模块，不因愿景宏大就引入整套协议。

## 四、用户怎么参与：AG-UI 与 A2UI

### AG-UI：传递工作过程与用户交互

Agent–User Interaction Protocol 是事件驱动的前后端交互协议。
它让界面接收智能体运行过程中的文本、工具事件和状态变化，也让用户输入进入后端。
当产品需要展示进度、维护共享状态或在中途让用户参与时，统一事件语义比只返回一段最终文本更有用。
来源：[AG-UI 官方介绍](https://docs.ag-ui.com/introduction)。

### A2UI：描述应该显示什么界面

A2UI 让智能体输出声明式组件描述和数据，由客户端自己的渲染器显示表单、卡片等界面。
它关注界面内容的表达；AG-UI 关注交互事件的流动，两者可以组合。
检索日 A2UI 官网标注 **v0.9.1 为 Current，v1.0 为 Candidate**，因此不应把 1.0 候选版写成稳定正式版。
来源：[A2UI 官方说明与版本表](https://a2ui.org/)。

以选择酒店为例，后端可以通过 AG-UI 推送进度，再交付 A2UI 描述的酒店卡片和日期输入框。
这是一个组合示例，实际能否工作还取决于客户端支持的组件目录、传输适配和版本。
采用声明式界面也不意味着业务动作可以绕过权限检查。

## 五、实时语音：先区分四个层次

语音智能体同时面对媒体传输、实时会话、业务执行和助手交接。
将这些问题都塞进“语音协议”一个名词，容易做出错误的技术选择。

| 层次 | 需要解决的问题 | 代表方案 |
| --- | --- | --- |
| 媒体与连接 | 音频如何传输，连接如何建立 | WebRTC、WebSocket；电话侧 SIP 与媒体通道 |
| 实时会话事件 | 谁在说话，转写是否结束，何时停止播放 | RTVI、厂商实时 API |
| 任务与工具执行 | 对话中如何查资料、调用服务、委派工作 | MCP、A2A、应用后端 |
| 多助手会话协作 | 如何发现另一助手、引入对话并交接 | Open Floor Protocol |

### 1. WebRTC、WebSocket、SIP 分别做什么

**WebRTC 是一套实时通信技术与协议组合。**
媒体使用 RTP／SRTP 等机制，非媒体数据可以走 Data Channel；它还涉及连接协商和网络传输机制。
它适合承担浏览器语音连接，但不会规定“工具完成”“用户改了日期”这类业务事件。
来源：[IETF RFC 8825](https://www.rfc-editor.org/rfc/rfc8825)。

**WebSocket 提供通用双向消息通道。**
应用可以在上面传送音频块和 JSON 事件，但消息的业务含义仍需上层约定。
两个服务都使用 WebSocket，只能说明它们使用了相同的基础通信机制，不能说明消息格式兼容。
来源：[IETF RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)。

**SIP 主要负责建立、修改和结束会话。**
在电话智能体中，它用于对接电话基础设施；音频媒体通常经另外协商的媒体通道传输。
所以“接入 SIP”与“设计好智能体对话事件”是两项工作。
来源：[IETF RFC 3261](https://www.rfc-editor.org/rfc/rfc3261)。

### 2. RTVI：客户端理解对话后端在做什么

RTVI 在 Pipecat 生态中提供实时语音／多模态交互消息约定。
例如 `client-ready` 和 `bot-ready` 用于就绪通知，`user-started-speaking` 表达用户开始说话，
`user-transcription` 包含部分或最终转写，`bot-output` 表达机器人输出文本。
这些事件让前端能够显示“正在听”“正在说”或字幕，而不必直接理解后端每个模型服务的内部消息。
来源：[RTVI 标准](https://docs.pipecat.ai/client/rtvi-standard)。

RTVI 应与实际媒体传输配合使用。Pipecat 客户端文档要求同时提供客户端 SDK 和传输实现，
说明交互协议与音频通道是可区分的两部分。
来源：[Pipecat Web 客户端仓库](https://github.com/pipecat-ai/pipecat-client-web)。

版本兼容也值得注意：客户端更新日志记录了 RTVI 1.0 对旧 action、service configuration 消息的移除。
因此，不宜从旧教程复制消息后，仅替换 SDK 版本就假定兼容。
本文不把滚动文档或 `latest` 源码中的版本常量直接当成所有已发布客户端共同支持的版本。
来源：[Pipecat 客户端更新日志](https://github.com/pipecat-ai/pipecat-client-web/blob/main/client-js/CHANGELOG.md)。

### 3. 模型厂商的实时 API：接口公开，但不是共同标准

**OpenAI Realtime** 提供语音到语音会话，支持音频、会话状态和工具调用。
官方文档区分浏览器 WebRTC 与服务端 WebSocket 接入；API 参考还覆盖 SIP 呼叫。
其事件和对象属于 OpenAI 的服务接口。
来源：[Realtime 入门](https://developers.openai.com/api/docs/guides/realtime)、
[Realtime API 参考](https://platform.openai.com/docs/api-reference/realtime?lang=javascript)。

**OpenAI GPT-Live** 则把持续语音对话与后端委派工作区分开来：
前者可以边听边说，后者执行查询和任务。
官方文档特别指出，打断语音不会自动取消后台工作。
这是一种厂商提供的语音与任务组织方式，不应改称为行业通用协议。
来源：[GPT-Live 官方指南](https://developers.openai.com/api/docs/guides/live)。

**Gemini Live API** 通过有状态 WSS 连接处理实时音频、图像和文本，提供打断、工具使用与转写等能力。
检索日官网仍标记为 Preview。
它与 OpenAI 实时接口在事件、音频要求和会话模型上各有约定；接入相同的底层传输并不能消除这些差异。
来源：[Gemini Live API 概览](https://ai.google.dev/gemini-api/docs/live-api)。

如果使用 Pipecat、LiveKit 等框架封装厂商接口，迁移时也应逐项验证能力映射。
本文的工程判断是：统一 SDK 可以减少集成代码，却不能保证不同模型的打断、字幕和工具时序完全一致。

### 4. Open Floor Protocol：多个对话助手如何接力

Open Voice Interoperability 项目目前将其标准消息体系称为 **Open Floor Protocol，简称 OFP**。
它支持寻找具有特定能力的助手、委派用户请求，以及让用户转到其他助手。
规范资料包括 Conversational Envelope、Dialog Events 和助手发现相关描述。
来源：[Open Voice Interoperability 官网](https://voiceinteroperability.ai/)、
[规范目录](https://github.com/open-voice-interoperability/openfloor-docs/tree/main/specifications)。

阅读带有 OVON 或 Open Voice 名称的旧资料时，应沿维护者入口核对现行名称和格式。
OFP 更贴近“另一位助手如何加入当前对话”，RTVI 更贴近“客户端如何与对话后端交互”。
两者都不能替代音频媒体传输，也没有足够依据称 OFP 已获得所有主流语音助手的普遍支持。

## 小样本推演：打断后的状态一致性

设想助手正在播报：“我找到三家酒店，第一家……”用户插话：“只看可取消的。”
下面是本文建议的一组实现检查点，不是某个协议原文规定的统一流程：

1. 区分检测到声音、得到转写和确认一个用户回合结束，避免把噪声直接当成新意图。
2. 及时停止旧音频播放，并处理已缓冲、尚未播出的内容。
3. 让对话上下文区分已生成内容与用户实际听到的内容。
4. 明确旧查询继续、取消还是复用；停止说话不能被当成后台任务已取消。
5. 用任务或回合标识处理迟到结果，避免旧结果覆盖用户刚更新的条件。

这也是为什么“支持音频消息”不能证明“支持低延迟可打断语音”。
接入验收应实际测量打断到停止播放的时间，并检查后台副作用和上下文，而不只检查音频能否播放。
关于媒体与事件的区分，可参考 [Realtime 会话文档](https://developers.openai.com/api/docs/guides/realtime-conversations)；
关于语音与任务取消的边界，可参考 [GPT-Live 指南](https://developers.openai.com/api/docs/guides/live)。

## 六、商务场景：ACP、UCP、AP2 的分工

智能体一旦从查询信息走向购买服务，就需要更明确的交易语义。
本节只比较技术接口，不讨论支付合规结论。

| 方案 | 全称 | 主要关心的问题 |
| --- | --- | --- |
| 商务 ACP | Agentic Commerce Protocol | 买家代理与商家如何完成程序化结账、传递支付凭证 |
| UCP | Universal Commerce Protocol | 平台与商家如何发现、协商和组合商务能力 |
| AP2 | Agent Payments Protocol | 如何以可验证的授权支持智能体发起交易 |

商务 ACP 以结账接口为重要切入点；UCP 将能力发现和协商纳入规范，并可采用 REST、MCP 等接入方式。
因此，业务协议与底层调用协议可以叠加，不能看到支持 MCP 就认定两种商务系统已经语义互通。
来源：[ACP 文档](https://www.agenticcommerce.dev/docs)、
[UCP 2026-04-08 规范](https://ucp.dev/2026-04-08/specification/overview/)。

AP2 聚焦授权与可信交易，可作为 A2A 和 UCP 的扩展。
其官网列出了 **AP2 v0.2 发布与向 FIDO Alliance 捐赠**的进展入口。
阅读早期 AP2 介绍时，也需要核对当前版本和治理变化。
来源：[AP2 官网](https://ap2-protocol.org/)。

我的判断是：先确定业务需要的是工具调用、完整结账生命周期，还是可验证的委托授权，
再决定引入哪些协议。它们存在覆盖重叠，不能机械地按一层一个协议堆叠。

## 七、截至检索日，哪些更新最值得记住

| 时间或版本 | 已核实变化 | 阅读旧资料时需要修正什么 |
| --- | --- | --- |
| 2025-08-25 | 旧 Agent Communication Protocol 宣布并入 A2A | 不再把它当成完全独立的新建选型路线 |
| 2025-08-27 | Zed 发布 Agent Client Protocol 相关集成 | 同为 ACP，但与上面的旧协议不是一个项目 |
| MCP 2026-07-28 | 无状态请求、发现与扩展机制发生调整 | 不能默认沿用旧初始化和协议级会话流程 |
| 2026-08-17 | A2A 加入 AAIF | 更新项目治理信息，不据此推断协议合并 |
| ACP SDK 当前文档 | v1 稳定入口，v2 实验性草案 | 不把可导入的实验 API 等同于稳定协议 |
| A2UI 当前文档 | v0.9.1 Current，v1.0 Candidate | 区分当前版与候选版 |
| ANP 当前入门文档 | 1.1 发布线，元协议仍是草案 | 不能把愿景中的所有模块视为已发布能力 |
| Open Voice 当前官网 | 使用 Open Floor Protocol 名称 | 沿现行规范理解助手互操作 |

表中来源分别见前文各协议章节。这里特意把“事件发生日期”和“检索时版本状态”分开，
避免把网页更新时间误当作协议首次发布日。

## 工程闭环：如何按需求选型

下面是基于上述协议边界的工程建议，不是兼容性认证或市场排名。

| 你的需求 | 优先评估 | 需要验证的关键点 |
| --- | --- | --- |
| 给现有助手连接数据库、文件或业务工具 | MCP | 规范版本、工具权限、所需扩展 |
| 让编码智能体进入编辑器 | Agent Client Protocol | 客户端能力、权限交互、会话恢复支持 |
| 把任务交给其他框架或团队的智能体 | A2A | 发现、身份、任务状态、取消与结果交付 |
| 做展示过程并允许用户参与的助手界面 | AG-UI；需要生成组件时再评估 A2UI | 事件映射、共享状态、组件目录 |
| 做网页或移动端语音助手 | 实时媒体连接 + RTVI 或厂商会话接口 | 打断、播放队列、转写、重连和延迟 |
| 做电话智能体 | SIP／电话网关 + 媒体与对话后端 | 编码格式、呼叫生命周期、挂机和转接 |
| 让多个对话助手协作接力 | OFP；独立后台任务另评估 A2A | 助手发现、上下文交接与取消边界 |
| 探索跨域开放智能体网络 | ANP 的适用模块 | 身份信任、发现策略、模块发布状态 |
| 做购物和支付代理 | 商务 ACP／UCP，按授权需要评估 AP2 | 商家实际支持、交易状态、授权范围 |

例如，一个语音研究助手可以先用实时接口处理对话，再通过 MCP 获取资料；
只有当研究工作被拆给独立远程服务时，才需要进一步评估 A2A。
如果一个进程内部已经能完成工作，不必仅为了“多智能体”这个名字额外增加网络边界。

选型时还应检查四件事：**规范版本是否一致、必选能力是否齐全、权限责任是否明确、失败后能否恢复。**
一个演示中成功交换消息，只能证明最基本的连通性；可靠互操作还要覆盖超时、重复请求、
用户改口、任务取消和迟到结果。

## 直接结论

这次检索给我的判断是，智能体协议正在围绕不同连接边界形成分工。
理解每条边上的责任，再选择协议组合，比记住更多缩写更有价值。

下一步阅读：若关心语音交互的实际验收，可继续阅读
[Turn-taking 与打断评测](/2026/06/10/Realtime-Speech-Turn-Taking-Evaluation/)；
若关心编码智能体的权限与执行约束，可继续阅读
[Agentic Coding 工程治理](/2026/06/10/Agentic-Coding-Governance/)。
