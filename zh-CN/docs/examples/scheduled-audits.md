# 定时审计：按计划自动运行 Lagune

> 用你自己的密钥在 GitHub Actions 中，或在 Claude Code、Codex、Cursor、Antigravity 或 OpenCode 中，为 Lagune 设置定期审计，可以只报告新风险，也可以运行完整的 Blue Team 流程。

规范链接: https://lagune.ai/zh-CN/docs/examples/scheduled-audits
语言: zh-CN
原文: https://lagune.ai/docs/examples/scheduled-audits
最后更新: 2026-11-09

让 **Lagune** 按计划自动审计你的项目，可以只报告发现的问题，也可以运行完整的 Blue Team 流程。

## 设置定时任务

**Universal**

**GitHub Actions** 借助 [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) 在云端运行审计。它的 **Copilot CLI** 引擎会用你自己的密钥调用你选择的模型提供商，因此不需要订阅任何智能体：

- 用 `gh extension install github/gh-aw` 安装扩展。
- 用 `gh secret set PROVIDER_API_KEY` 把提供商的密钥保存为仓库机密。
- 把这个工作流保存为 `.github/workflows/lagune-audit.md`，将 `<model>` 替换为你的提供商中支持工具调用的某个模型，将 `<your-prompt>` 替换为某个 [提示词示例](#prompt-examples)：

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.2
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  然后用你的修改创建一个 pull request。
  ```

  | 提供商                                          | `<type>`    | `<url>`                                            |
  | ----------------------------------------------- | ----------- | -------------------------------------------------- |
  | **OpenAI**                                      | `openai`    | `https://api.openai.com/v1`                        |
  | **Anthropic**                                   | `anthropic` | `https://api.anthropic.com`                        |
  | 任何兼容 **OpenAI** 的 API，例如 **OpenRouter** | `openai`    | 它的 base URL，例如 `https://openrouter.ai/api/v1` |

- 运行 `gh aw compile`，然后把工作流和它生成的 `.lock.yml` 文件一起提交。

**在云端**，即使电脑关机，审计也会照常运行：

- 改用 [通用安装](https://lagune.ai/zh-CN/docs/install/universal) 代替插件，并把 **Lagune** 提交到仓库。
- 在 **Claude Code** 会话中输入 `/schedule` 并描述这次审计，或者在 [claude.ai/code/routines](https://claude.ai/code/routines) 创建它。

**在你的电脑上**，审计会使用你为自己安装的插件：

- 在桌面应用的 **Scheduled tasks** 页面创建一个本地任务。
- 按照 [安装页面](https://lagune.ai/zh-CN/docs/install/claude-code) 的说明，提前允许引擎，因为运行时没有人在场批准它的工具。
- 只有在应用打开且电脑处于唤醒状态时，任务才会运行。

定时任务要在 **ChatGPT** 桌面应用中创建，而不是在 **Codex CLI** 中，并在你的电脑上运行：

- 在 **Codex** 聊天中描述这次审计、运行时间，并说明每次运行都开启一个新聊天。结果会出现在 **Scheduled** 中。
- 在提示词中用 `$` 写出每条命令，例如 `$lagune:lagune-detect`，让每次运行都显式调用它。
- 选择你的本地项目，而不是新的 worktree，因为新的 worktree 启动时没有你 [安装在项目中](https://lagune.ai/zh-CN/docs/install/codex) 的引擎。
- 只有在应用打开、电脑开机且项目在磁盘上时，任务才会运行。

**Cursor** 的 Automations 在云端运行，即使电脑关机也不受影响：

- 改用 [通用安装](https://lagune.ai/zh-CN/docs/install/universal) 代替插件，并把 **Lagune** 提交到仓库。
- 在 [cursor.com/automations](https://cursor.com/automations) 创建一个 automation，或者在智能体会话中用 `/automate` 描述它，并为它设置定时触发器。
- 选择你的仓库，因为定时触发器启动时不带任何仓库。

**Antigravity** 的 Automations 在你的电脑上运行，每次都在一个新对话中进行：

- 在 **Antigravity** 应用中打开 **Automations** 标签页，为你的项目创建一个定时 automation，或者让智能体帮你设置。
- 按照 [安装页面](https://lagune.ai/zh-CN/docs/install/antigravity-cli) 的说明，提前允许引擎，因为运行时没有人在场批准它的工具。
- 使用 automation，而不是 `/schedule`，因为后者只在所属对话存续期间有效。
- 只有在 **Antigravity** 运行时，automation 才会运行。

**OpenCode** 没有自己的调度器，所以审计通过 **GitHub Actions** 在云端运行：

- 按照 [安装页面](https://lagune.ai/zh-CN/docs/install/opencode) 的说明，在仓库的 `opencode.json` 中提交 **Lagune**。
- 运行 `opencode github install`，连接 **OpenCode** 的 GitHub 应用并保存你的模型提供商密钥。
- 添加一个工作流，按计划把提示词传给 **OpenCode**（这里是每周一 09:00 UTC）。`<KEY>` 和 `<provider>/<model>` 按 `opencode github install` 所创建工作流中的值填写，`<your-prompt>` 替换为某个 [提示词示例](#prompt-examples)：

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### 提示词示例 \{#prompt-examples}

**💧 仅报告**

梳理新风险、规划修复，并重新检查已应用的控制措施，不会修改你的代码：

```md
依次执行以下命令：`/lagune-detect` 和 `/lagune-plan`。如果项目已有加固记录，再执行 `/lagune-verify`。

不要修改项目的代码。最后，总结新的发现项，以及所有不再有效的已应用控制措施。
```

**🌊 完整循环**

还会应用规划好的修复并证明每项修复都有效，所以请在这些修改进入主分支之前先审查它们：

```md
依次执行以下命令：`/lagune-detect`、`/lagune-plan`、`/lagune-harden` 和 `/lagune-verify`。

最后，总结已应用的修复以及仍未解决的发现项。
```
