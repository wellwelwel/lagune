# 安装：为任何 AI 智能体提供安全加固

> 在任何项目中安装 Lagune：智能体支持插件时以插件安装，否则使用 skills CLI，然后选择适合项目的安全专项。

规范链接: https://lagune.ai/zh-CN/docs
语言: zh-CN
原文: https://lagune.ai/docs
最后更新: 2026-11-09

**Lagune** 帮助你的 AI 智能体提升项目的安全性。你把它指向自己的代码，智能体就会弄清楚你的系统实际在做什么，再带你完成对它而言真正重要的安全工作。**Lagune** 是 [Security-Driven Hardening (SDH)](https://lagune.ai/zh-CN/docs/references/paper) 方法论的第一个项目。

**支持开源**

喜欢 **Lagune**？[到 **GitHub** 给我们点个 ⭐](https://github.com/wellwelwel/lagune)

## 选择你的智能体

- [Claude Code](https://lagune.ai/zh-CN/docs/install/claude-code): Anthropic 的智能体编程工具
- [Codex](https://lagune.ai/zh-CN/docs/install/codex): OpenAI 的编程智能体
- [Cursor](https://lagune.ai/zh-CN/docs/install/cursor): AI 代码编辑器
- [GitHub Copilot](https://lagune.ai/zh-CN/docs/install/github-copilot-cli): GitHub 的 AI 结对编程助手
- [Gemini CLI](https://lagune.ai/zh-CN/docs/install/gemini-cli): Google 的开源终端智能体
- [Antigravity](https://lagune.ai/zh-CN/docs/install/antigravity-cli): Google 的智能体开发平台
- [OpenCode](https://lagune.ai/zh-CN/docs/install/opencode): 开源编程智能体
- [Devin for Terminal](https://lagune.ai/zh-CN/docs/install/devin-cli): Cognition 的终端智能体
- [Factory Droid](https://lagune.ai/zh-CN/docs/install/factory-droid): Factory 的软件开发智能体
- [Grok Build](https://lagune.ai/zh-CN/docs/install/grok-build): xAI 的编程智能体
- [Qwen Code](https://lagune.ai/zh-CN/docs/install/qwen-code): Qwen 的终端编程智能体
- [Kimi Code](https://lagune.ai/zh-CN/docs/install/kimi-code): Moonshot AI 的编程智能体
- [Muse Code](https://lagune.ai/zh-CN/docs/install/muse-code): Meta 的编程智能体
- [Pi](https://lagune.ai/zh-CN/docs/install/pi): 极简的终端编程智能体
- [Hermes Agent](https://lagune.ai/zh-CN/docs/install/hermes-agent): Nous Research 的开源智能体
- [通用](https://lagune.ai/zh-CN/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed 及另外 66 款

**信息**

- **Lagune** 底层基于 **Node.js** 运行，但你用什么语言都可以。
- 如需完全离线运行，用 `npm i -D lagune@0.18.2` 把 **Lagune** 安装到你的项目中。

## 类别

**Lagune** 的安全知识以 [**专项**](https://lagune.ai/zh-CN/docs/catalog) 的形式提供，并按 [**类别**](https://lagune.ai/zh-CN/docs/categories) 分组。

- **OWASP** (`owasp`): 防范 OWASP 追踪的应用安全风险：注入、失效的访问控制、身份认证失效和加密失效
- **基础设施** (`infra`): 加固容器、工作负载和 Serverless 配置：Dockerfile、Compose、Pod 安全、FaaS 的 IAM 与触发器
- **AI / LLM** (`ai`): 加固 AI 与 LLM 集成，防范提示词注入，以及工具、智能体、检索和 MCP 的不安全接入
- **Lovable** (`lovable`): 加固 AI 生成的 Supabase 应用（Lovable 及同类工具）：RLS 策略缺失、service_role 密钥泄露和不安全的默认设置
- **JavaScript** (`javascript`): 加固 JavaScript 及其运行时，防范 eval 和 child_process 导致的 RCE、路径遍历和原型链污染
- **Python** (`python`): 加固 Python，防范 pickle 和 YAML 反序列化 RCE、str.format 格式化字符串遍历和类污染
- **Rust** (`rust`): 加固 Rust，防范不健全的 unsafe API、transmute 误用、整数溢出，以及 FFI 边界上的未定义行为
- **Java** (`java`): 加固 Java，防范最终导致远程代码执行的 ObjectInputStream 反序列化利用链
- **Ruby** (`ruby`): 加固 Ruby，防范可导致远程代码执行的 Marshal.load 和 YAML 反序列化利用链
- **PHP** (`php`): 加固 PHP，防范弱类型比较导致的认证绕过、对象注入利用链和不安全的默认配置
- **Go** (`go`): 加固 Go，防范带类型 nil 的接口漏洞、goroutine 数据竞争，以及安全路径上的不安全并发
- **C / C++** (`c-cpp`): 加固 C 和 C++，防范可导致代码执行的格式化字符串漏洞、缓冲区溢出和越界写入
- **.NET** (`dotnet`): 加固 .NET 和 C#，防范 BinaryFormatter 反序列化 RCE，以及可导致 XSS 的编码器绕过

运行 `npx lagune write add --categories`，并传入你所选类别的键名。

**提示**

项目起初只启用 `owasp`，随后 [`/lagune-charter`](https://lagune.ai/zh-CN/docs/commands/charter) 会根据它对项目的解读，添加有依据的类别。

## 环境要求

你需要在系统中安装 [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager)。

## 使用徽章 ✨

正在使用 **Lagune**？在你的 **README** 里加一个吧：

**双色**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**纯色**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## 下一步

了解 **Lagune** 的每个 [**Skills**](https://lagune.ai/zh-CN/docs/get-started/commands) 分别做什么。

## 常见问题

### 什么是 Lagune？

Lagune 是一个开源、仅限防御的安全工作流，帮助你的 AI 智能体加固任何代码库。你把它指向自己的代码，它会检测出你的系统实际在做什么，再针对这个场景引导真正重要的安全修复。

### 怎么安装 Lagune？

先选择你的智能体：Claude Code、GitHub Copilot CLI、Muse Code、Antigravity CLI、Cursor、Kimi Code、OpenCode、Codex CLI、Factory Droid、Grok Build、Devin CLI 和 Hermes Agent 以插件形式安装 Lagune，Gemini CLI 和 Qwen Code 以扩展形式安装，Pi 以包的形式安装，其他任何智能体都可以用 npx skills add wellwelwel/lagune -y 安装。新项目和现有项目都能用。

### Lagune 需要 API 密钥吗？

不需要。它通过你自己的 AI 智能体运行，所以用不着 API 密钥。

### 有哪些环境要求？

你需要在系统中安装 Node.js (LTS)。

### Lagune 支持哪些编程语言？

任何语言都支持。Lagune 底层基于 Node.js 运行，但能审计和加固用任何编程语言编写的项目。

### Lagune 会往我的项目里加什么？

一个保存项目安全状态的 .lagune/ 目录，由第一个需要写入的命令创建。skills CLI 还会把斜杠命令安装到项目中，供智能体读取，而插件则把它们保留在智能体内部。

### 怎么更新 Lagune？

和安装时的方式一样。每个智能体的安装页面都说明了如何在该智能体中更新 Lagune，skills CLI 则用 npx skills update 更新。你的安全原则、各阶段产物和你自己的专项都不会受影响。

### 一个项目会用到哪些专项？

项目所属类别中的内置专项，加上项目自己的专项。charter 阶段会根据它对项目的解读，记录有依据的类别，npx lagune write add --categories 可以修改这些类别。

### 一定要等项目开发完，才能开始做安全吗？

不用。/lagune 命令会边写边加固：它接受任何提示词，按你的要求构建，并在安全原则的指引下，用安全的默认设置加固构建出的内容。五阶段的 Blue Team 流程则用来审计已有的代码。

### Lagune 能审计现有项目吗？

能。五阶段的 Blue Team 流程会审计已有的代码：charter 设定你的安全规则，detect 梳理系统做了什么、风险在哪里，plan 为每个发现项打分并配上修复，harden 应用这些修复，verify 证明它们确实有效并将其结案。

### 用 Lagune 和直接让智能体找出漏洞与安全缺陷，有什么区别？

智能体自己读代码时，会找出看起来像漏洞的地方，却跳过看起来像控制措施的地方。一份屏蔽地址列表看上去像是已经有人处理过这个风险，于是没人去检查它其实漏掉了大部分该屏蔽的地址，代码就这样上线了。Lagune 扭转了这种默认做法：代码里已有的防护在检查之前一律视为未经证明，目录中的每个专项都会得到明确的判定结果，verify 问的是风险是否已经消除，而不是有没有控制措施。每个发现项在多次运行之间也始终是同一个追踪项，因此可以证明它已关闭并将其结案，而直接提问每次给你的报告都不一样，无从比较。

### 用 Lagune 开发和直接让智能体写安全的代码，有什么区别？

直接要求写安全的代码，等于把安全的定义交给了智能体，而且还默认你知道该提什么要求。安全需求往往早就藏在你的请求里，只是你和智能体都没察觉：要一个展示用户有权访问的课程的页面，本身就规定了一条授权规则，而从没写下的检查，在代码里也就无迹可寻。/lagune 命令会在写下第一行代码之前，加载你的安全原则，以及与即将构建的内容相匹配的专项，然后对照它所采用的防御重新审视结果。安全的写法很少比不安全的写法成本更高，所以决定结果的是知道该选哪一种，而这正是它提前提供的。

### Lagune 会做 DAST（动态应用安全测试），或者测试我正在运行的应用吗？

不会。Lagune 只读代码，从不运行你的系统，也不会向它发送构造的请求。verify 确认的是控制措施在源码中存在且正确，这和它能否在线上目标遭受攻击时守住是两个不同的问题，所以"cannot tell from the code"（无法从代码判断）是正当的判定结果，而不是悄悄放行。DAST 回答运行时的问题，Lagune 回答源码的问题，二者谁也替代不了谁。就连可选的 prove 命令也守着这条线：它的测试断言的是安全行为，从不使用攻击 payload。

### Lagune 能取代渗透测试（Pentest）吗？

不能，绝对不能！渗透测试是一项经过授权的工作，由专业人员针对你的线上系统运用自己的判断，把多个发现项串联起来，并探查任何按攻击面划分的规则都描述不了的业务逻辑。渗透测试的发现项可以进入 Lagune 的 Blue Team 流程，交由 detect 记录这些问题，让专业人员报告的内容也能得到规划、加固和验证。

## 安全策略

请查看 [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md)。

## 许可证

**Lagune** 采用 [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE) 许可。

Copyright © 2026 至今 [Weslley Araújo](https://github.com/wellwelwel) 及 [贡献者](https://github.com/wellwelwel/lagune/graphs/contributors)。
