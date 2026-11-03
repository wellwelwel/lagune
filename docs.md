# Install: Security Hardening for Any AI Agent

> Install Lagune in any project, as a plugin where your agent supports one or with the skills CLI elsewhere, then choose the security specializations that fit it.

Canonical: https://lagune.ai/docs
Last updated: 2026-11-03

**Lagune** helps your AI agent make a project more secure. You point it at your code, and the agent figures out what your system actually does, then guides you through the security work that matters for it. **Lagune** is the first project of the [Security-Driven Hardening (SDH)](https://lagune.ai/docs/references/paper) methodology.

**Support the OSS**

Love **Lagune**? [Give us a ⭐ on **GitHub**](https://github.com/wellwelwel/lagune)

## Pick your agent

- [Claude Code](https://lagune.ai/docs/install/claude-code): Anthropic's agentic coding tool
- [Codex](https://lagune.ai/docs/install/codex): OpenAI's coding agent
- [Cursor](https://lagune.ai/docs/install/cursor): The AI code editor
- [GitHub Copilot](https://lagune.ai/docs/install/github-copilot-cli): GitHub's AI pair programmer
- [Gemini CLI](https://lagune.ai/docs/install/gemini-cli): Google's open-source terminal agent
- [Antigravity](https://lagune.ai/docs/install/antigravity-cli): Google's agentic development platform
- [OpenCode](https://lagune.ai/docs/install/opencode): The open-source coding agent
- [Devin for Terminal](https://lagune.ai/docs/install/devin-cli): Cognition's terminal agent
- [Factory Droid](https://lagune.ai/docs/install/factory-droid): Factory's software development agent
- [Grok Build](https://lagune.ai/docs/install/grok-build): xAI's coding agent
- [Qwen Code](https://lagune.ai/docs/install/qwen-code): Qwen's terminal coding agent
- [Kimi Code](https://lagune.ai/docs/install/kimi-code): Moonshot AI's coding agent
- [Muse Code](https://lagune.ai/docs/install/muse-code): Meta's coding agent
- [Pi](https://lagune.ai/docs/install/pi): A minimal terminal coding agent
- [Hermes Agent](https://lagune.ai/docs/install/hermes-agent): Nous Research's open-source agent
- [Universal](https://lagune.ai/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed & 66 more

**Info**

- **Lagune** runs on **Node.js** under the hood, but you use whatever language you want.
- To run completely offline, install **Lagune** in your project with `npm i -D lagune@0.16.0`.

## Categories

**Lagune**'s security knowledge comes as [**specializations**](https://lagune.ai/docs/catalog), grouped into [**categories**](https://lagune.ai/docs/categories).

- **OWASP** (`owasp`): Harden against the application security risks OWASP tracks: injection, broken access control, auth, and crypto failures
- **Infrastructure** (`infra`): Harden container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers
- **AI / LLM** (`ai`): Harden AI and LLM integrations against prompt injection and unsafe tool, agent, retrieval, and MCP wiring
- **Lovable** (`lovable`): Harden AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked service_role keys, and insecure defaults
- **JavaScript** (`javascript`): Harden JavaScript and its runtimes against eval and child_process RCE, path traversal, and prototype pollution
- **Python** (`python`): Harden Python against pickle and YAML deserialization RCE, str.format string traversal, and class pollution
- **Rust** (`rust`): Harden Rust against unsound unsafe APIs, transmute misuse, integer overflow, and FFI boundary undefined behavior
- **Java** (`java`): Harden Java against ObjectInputStream deserialization gadget chains that culminate in remote code execution
- **Ruby** (`ruby`): Harden Ruby against Marshal.load and YAML deserialization gadget chains that reach remote code execution
- **PHP** (`php`): Harden PHP against type-juggling auth bypass, object injection gadget chains, and insecure configuration defaults
- **Go** (`go`): Harden Go against typed-nil interface bugs, goroutine data races, and unsafe concurrency on security paths
- **C / C++** (`c-cpp`): Harden C and C++ against format-string bugs, buffer overflows, and out-of-bounds writes that enable code execution
- **.NET** (`dotnet`): Harden .NET and C# against BinaryFormatter deserialization RCE and the encoder bypasses that reach XSS

Run `npx lagune write add --categories` with the keys of the categories you choose.

**Tip**

A project starts with `owasp`, and [`/lagune-charter`](https://lagune.ai/docs/commands/charter) adds the categories its reading of the project supports.

## Requirements

You will need [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installed on your system.

## Use a badge ✨

Using **Lagune**? Add one to your **README**:

**Two tones**

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

**Solid**

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

## Next

See what each of **Lagune**'s [**Skills**](https://lagune.ai/docs/get-started/commands) does.

## Frequently Asked Questions

### What is Lagune?

Lagune is an open-source, defense-only security workflow that helps your AI agent harden any codebase. You point it at your code, it detects what your system actually does, then it guides the security fixes that matter for that context.

### How do I install Lagune?

Pick your agent: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI, and Hermes Agent install Lagune as a plugin, Gemini CLI and Qwen Code as an extension, Pi as a package, and any other agent with npx skills add wellwelwel/lagune. It works in both new and existing projects.

### Does Lagune need an API key?

No. It runs through your own AI agent, so no API keys are required.

### What are the requirements?

You need Node.js (LTS) installed on your system.

### What programming languages does Lagune support?

Any. Lagune runs on Node.js under the hood, but it audits and hardens projects written in any programming language.

### What does Lagune add to my project?

A .lagune/ directory with your project's security state, created by the first command that writes. The skills CLI also installs the slash commands in the project, where your agent reads them, while a plugin keeps them inside the agent.

### How do I update Lagune?

The same way you installed it. Each agent's install page shows how to update Lagune there, and the skills CLI updates it with npx skills update. Your charter, phase artifacts, and own specializations stay untouched.

### Which specializations does a project use?

The built-in ones of its categories, plus its own. The charter records the categories its reading of the project supports, and npx lagune write add --categories changes them.

### Do I need to finish building before securing my project?

No. The /lagune command hardens work as it is written: it takes any prompt, builds what you asked, and hardens it with safe defaults, guided by the charter. The five-phase Blue Team flow audits what already exists.

### Can Lagune audit an existing project?

Yes. The five-phase Blue Team flow audits what already exists: charter sets your security rules, detect maps what the system does and where the risks are, plan scores each finding and pairs it with a fix, harden applies the fixes, and verify proves they hold and closes them.

### What is the difference between using Lagune and just asking the agent to map vulnerabilities and security flaws?

An agent reading on its own finds what looks like a vulnerability and skips what looks like a control. A list of blocked addresses reads as though someone already handled the risk, so nobody checks that it misses most of them, and the code ships. Lagune inverts that default: a guard already in the code is presumed unproven until it is checked, every specialization in the catalog gets an explicit verdict, and verify asks whether the risk is gone, not whether a control is there. Each finding also stays one tracked item across runs, so it can be proven closed and stood down, where a plain request gives you a different report every time with nothing to compare.

### What is the difference between developing with Lagune and just asking the agent to write secure code?

Asking for secure code leaves the definition of secure to the agent, and it assumes you know what to ask for. The requirement is usually already inside your request without either of you seeing it: asking for a page that shows the courses a user has access to states an authorization rule, and a check that is never written leaves nothing in the code to notice. The /lagune command loads your charter and the specializations that match what is about to be built before the first line is written, then re-reads the result against the defense it used. The safe shape rarely costs more than the unsafe one, so what decides the outcome is knowing which one to reach for, and that is what arrives up front.

### Does Lagune run DAST (Dynamic Application Security Testing) or test my running application?

No. Lagune reads code and never runs your system or sends it crafted requests. Verify confirms a control is present and correct in the source, which is a different question from whether it survives an attack on a live target, so "cannot tell from the code" is a legitimate verdict instead of a quiet pass. DAST answers the runtime question and Lagune answers the source question, so neither replaces the other. Even the optional prove command holds this line: its tests assert the safe behavior, never an attack payload.

### Does Lagune replace a Pentest (penetration test)?

No, definitely not! A pentest is an authorized engagement where a professional exercises judgment against your live system, chaining findings and probing the business logic that no per-surface rule describes. Findings from a pentest can enter the Lagune Blue Team flow as concerns you hand to detect, so what a professional reports gets planned, hardened, and verified.

## Security Policy

Please check the [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## License

**Lagune** is under the [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-present [Weslley Araújo](https://github.com/wellwelwel) and [contributors](https://github.com/wellwelwel/lagune/graphs/contributors).
