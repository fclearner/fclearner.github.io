---
title: 【Agent Engineering Radar】2026-06-16 Agent 工程技术雷达
date: 2026-06-16 09:00:00
tags: [AI, Agent, Engineering, Evaluation, Open Source]
---

本期信号很明确：agent 技术栈的竞争正在从“哪个框架更会跑 demo”，转向“哪个框架更容易被实现、验证、观测和约束”。公开评测、trace 规范、MCP 工具连接和 skills 基准都指向同一个结论：先建设吸收机制，再选择框架。

<!--more-->

## 要解决的问题

Agent 框架和工具更新很快，但直接追新会带来三个风险。

第一，文档 demo 成功不代表真实任务成功。ADK Arena 把 51 个 Python Agent Development Kit 放到同一套自动化流程里比较，框架生成成功率只有 57%，生成成本相差 5.6 倍，单一 benchmark 上的最佳框架可以很强，但中位框架只有 32% 左右任务解决率。[来源：arXiv:2606.05548](https://arxiv.org/abs/2606.05548)

第二，连接标准不等于可信执行。MCP 解决 AI 应用和外部系统的连接问题，但身份、权限、预算、审计和禁用开关仍然要自己做。[来源：MCP 官方文档](https://modelcontextprotocol.io/docs/getting-started/intro)

第三，skills 不一定带来收益。SWE-Skills-Bench 测了 49 个公开 SWE skills，很多 skill 没有提升 pass-rate，版本不匹配还会伤害结果。[来源：arXiv:2603.15401](https://arxiv.org/abs/2603.15401)

## 最小抽象

可以把 agent 技术栈拆成四层。

框架层负责 agent loop、状态和工具调用。

连接层负责 MCP、API、文件系统、浏览器和终端。

观测层负责 trace、span、成本、错误和 artifact 记录。OpenInference 已经覆盖 LLM 调用、检索、工具调用等上下文，OpenTelemetry 也在推进 GenAI 和 Agent spans 语义约定。[来源：OpenInference](https://arize-ai.github.io/openinference/) [来源：OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

评测层负责 smoke、benchmark、dialogue task 和安全门槛。Dialogue SWE-Bench 提醒我们，交互式 coding agent 的澄清和对话能力与一次性解题不是同一维度。[来源：arXiv:2606.13995](https://arxiv.org/abs/2606.13995)

## 工程闭环

本周真正该做的是小闭环，而不是迁移主栈。

1. 建一个最小 agent smoke suite，覆盖工具调用、文件修改、测试、恢复和 trace。
2. 给每次 agent 实验记录成功率、成本、步数和失败类型。
3. MCP server 默认进入 Trial 清单，必须通过权限和日志检查后再进入常用工具集。
4. Skills 做 paired eval，同一任务有 skill / 无 skill 各跑一组，比较成功率、token 和错误类型。

Terminal-Bench 2.0 和 TerminalWorld 也说明，终端任务需要单独评估命令规划、环境感知、文件副作用和恢复能力，不能只用 coding benchmark 替代。[来源：Terminal-Bench](https://www.tbench.ai/) [来源：arXiv:2605.22535](https://arxiv.org/abs/2605.22535)

## 直接结论

Agent Engineering 的技术视野要保持开放，但吸收机制要收紧。框架、协议、skills、benchmark 都可以跟进；真正进入主技术栈的，只应该是能被验证、能被观测、能被回滚的部分。

下一步阅读：[Agentic Coding 工程治理：多模型协作先定义责任边界](/2026/06/10/Agentic-Coding-Governance/)
