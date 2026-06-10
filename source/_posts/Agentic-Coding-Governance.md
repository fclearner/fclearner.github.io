---
title: Agentic Coding 工程治理：多模型协作的角色、权限与验证闭环
date: 2026-06-10 18:00:00
tags: [AI, Agent, Coding, Open Source]
---

代码生成工具越来越强，多模型协作也越来越常见。真正的问题已经不只是“哪个模型会写代码”，而是多个代理如何共享上下文、谁能写文件、谁负责审查、如何避免互相覆盖，以及如何验证最终结果。

Agentic Coding 的难点更像工程治理，而不是单纯模型能力。

<!--more-->

## 先分角色，再接工具

一个稳定的多代理流程，至少应该区分四类角色：

- explorer：只读探索代码，回答具体问题；
- worker：负责明确文件范围内的实现；
- reviewer：检查风险、回归和测试缺口；
- integrator：合并结果、运行验证、决定是否发布。

如果所有代理都能同时写同一批文件，冲突和回退风险会急剧上升。写入权限应该比读取权限更谨慎。

## 单一写入者原则

多代理不是越并行越好。最容易失控的情况，是多个代理同时修改同一模块，却没有统一状态机。

一个实用原则是：同一文件或同一行为边界，在同一阶段只交给一个写入者。其他代理可以读、审、提建议，但不要并发改同一处。

如果确实要并行实现，写入范围必须物理隔离，例如一个负责测试，一个负责文档，一个负责某个独立模块。

## 上下文要可复盘

代理之间共享的不是聊天热情，而是结构化上下文。关键决策应该进入任务记录：

- 要改什么行为；
- 不改什么边界；
- 已验证什么事实；
- 失败过哪些方案；
- 哪些测试必须通过；
- 当前还有什么风险。

这些信息如果只留在对话里，下一轮代理很容易重复踩坑。

## MCP 与工具权限

MCP、浏览器控制、终端、GitHub 连接器都能扩展代理能力。能力越强，权限边界越重要。

建议把工具分成三类：

1. read-only：搜索、读取、截图、日志查看；
2. scoped-write：只允许写指定目录或文件；
3. privileged：发布、删除、重置、凭证相关操作。

默认给 read-only，需要写入时再按任务授权。这样可以减少无意副作用。

## 验证闭环

Agentic Coding 的交付不能停在“模型说完成了”。至少要有三类验证：

- 静态验证：格式、lint、类型、配置检查；
- 行为验证：测试、构建、端到端 smoke；
- 变更验证：diff 审阅、敏感信息扫描、发布前检查。

如果代理修改了验证脚本本身，还要确认验证规则没有被放松。

## 开源实践方向

这个方向适合沉淀成可复用模板：

- 任务计划格式；
- 代理角色说明；
- 写入范围声明；
- 审查 checklist；
- 发布前检查脚本；
- 失败记录和恢复流程。

模型会变，工具会变，但这些治理结构相对稳定。

## 小结

Agentic Coding 的关键不是把多个模型接到一起，而是明确角色、权限、状态和验证。没有边界的多代理系统，只会把单模型的不确定性放大成协作层面的不确定性。

## Role-state handoff

Agentic coding workflows benefit from a small state machine: explore, propose, apply, review, verify, publish. Each state should define the allowed tools, write boundary, expected artifact, and handoff summary.

The handoff should preserve verified facts, rejected assumptions, touched files, test evidence, residual risks, and the next action. This is more reliable than preserving a raw transcript, because later agents need current state and evidence, not every intermediate turn.
