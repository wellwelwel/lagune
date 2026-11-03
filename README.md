<img src="./website/static/img/banner.png" />

# 🪼 [Lagune AI](https://lagune.ai)

[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
[![Version](https://img.shields.io/npm/v/lagune?label=&color=2f7bff&logo=npm&logoColor=white)](https://www.npmjs.com/package/lagune)
[![No API Key Needed](https://img.shields.io/badge/No%20API%20Key%20Needed-2f7bff?logo=claudecode&logoColor=white)](https://lagune.ai/docs)

**Lagune** helps your AI agent make a project more secure. You point it at your code, and the agent figures out what your system actually does, then guides you through the security work that matters for it.

- **Lagune** works with projects in **any programming language** ✨

---

Love **Lagune**? [**Give us a ⭐ on GitHub**](https://github.com/wellwelwel/lagune)!

---

## Get Started

**Lagune** adapts to your environment, whether it is a new project or an existing one.

> [!TIP]
>
> See real-world [**Prompt Samples**](https://lagune.ai/docs/examples/prompts) 🪼

---

### Install

Pick your agent:

<picture><img src="./.github/readme/assets/agents/claude.svg" width="20" align="absmiddle" /></picture> <b>Claude Code</b>

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

<picture><img src="./.github/readme/assets/agents/codex.svg" width="20" align="absmiddle" /></picture> <b>Codex</b>

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

<picture><img src="./.github/readme/assets/agents/antigravity.svg" width="20" align="absmiddle" /></picture> <b>Antigravity</b>

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

<details>
<summary><picture><img src="./.github/readme/assets/agents/cursor.svg" width="20" align="absmiddle" /></picture> <b>Cursor</b></summary>

In **Cursor**, open **Customize**, select **From GitHub Repository**, and enter `https://github.com/wellwelwel/lagune`. Then select **Install** on **Lagune**.

In the **Cursor CLI**, add the marketplace, then type `/plugins` in an `agent` session and install **Lagune**:

```bash
agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/copilot.svg" width="20" align="absmiddle" /></picture> <b>GitHub Copilot</b></summary>

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

For **GitHub Copilot** in an editor, use the [**Universal**](https://lagune.ai/docs/install/universal) route.

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/opencode.svg" width="20" align="absmiddle" /></picture> <b>OpenCode</b></summary>

```bash
opencode plugin add lagune
```

On **OpenCode** 1.x, run `opencode plugin lagune` instead.

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/devin.svg" width="20" align="absmiddle" /></picture> <b>Devin for Terminal</b></summary>

```bash
devin auth login
devin plugins install wellwelwel/lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/droid.svg" width="20" align="absmiddle" /></picture> <b>Factory Droid</b></summary>

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/grok.svg" width="20" align="absmiddle" /></picture> <b>Grok Build</b></summary>

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/qwen.svg" width="20" align="absmiddle" /></picture> <b>Qwen Code</b></summary>

```bash
qwen extensions install lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/kimi.svg" width="20" align="absmiddle" /></picture> <b>Kimi Code</b></summary>

From a **Kimi Code** session, choose **Trust and install** when asked:

```text
/plugins install https://github.com/wellwelwel/lagune
/new
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/muse.svg" width="20" align="absmiddle" /></picture> <b>Muse Code</b></summary>

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/pi.svg" width="20" align="absmiddle" /></picture> <b>Pi</b></summary>

```bash
pi install npm:lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/hermes.svg" width="20" align="absmiddle" /></picture> <b>Hermes Agent</b></summary>

```bash
hermes plugins install wellwelwel/lagune --enable
```

Confirm the plugin from outside its catalog, and decline installing the repository's **Node.js** dependencies.

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/gemini.svg" width="20" align="absmiddle" /></picture> <b>Gemini CLI</b></summary>

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

</details>

<details>
<summary><picture><img src="./.github/readme/assets/agents/vercel.svg" width="20" align="absmiddle" /></picture> <b>Universal (<a href="https://www.skills.sh/wellwelwel/lagune"><b>skills.sh</b></a>)</b></summary>

```bash
npx skills add wellwelwel/lagune
```

Or paste this prompt into your agent:

```md
Run `npx --yes skills add wellwelwel/lagune` and follow the generated skill instructions now. Read its complete output, redirecting it to a temporary file first if necessary. Resolve relative paths from the supporting-files directory it provides.
```

To update **Lagune**, run:

```bash
npx skills update
```

</details>

---

#### › Migrate from `lagune init`

A project set up with `npx lagune init` has a `.lagune/manifest.json` and keeps working as it is until `v1.x`. To move it to the new **Lagune** approach, keeping your charter, artifacts, tracking, and own specializations, commit your work and run from the project root:

```bash
npx lagune migrate
```

Then commit what it changed, install **Lagune** as above, and follow the rest of the move in [**Migrate**](https://lagune.ai/docs/commands/migrate).

---

### Commands

Once installed, your **AI** agent unlocks a set of commands, all governed by the **charter**: secure new work as you build it, or run the full audit over a project.

> [!NOTE]
>
> Some agents take the commands under the plugin's name, such as `/lagune:lagune-charter`. Your agent's [**install page**](https://lagune.ai/docs) shows how to type them.

#### › Build

Harden the work as you write it, with no flow to follow:

| Command                                                        | What it does for you                                                        |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/docs/commands/charter) | Sets your project's security rules, the foundation `/lagune` builds against |
| [**/lagune**](https://lagune.ai/docs/commands/lagune)          | Builds what you ask and hardens it as it is written, guided by the charter  |

#### › Audit: the Blue Team flow

These five run in order. Each builds on the previous, so following the list top to bottom is all it takes:

| #   | Command                                                        | What it does for you                                                           |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | [**/lagune-charter**](https://lagune.ai/docs/commands/charter) | Sets your project's security rules, proposed for you or shaped by what you say |
| 2   | [**/lagune-detect**](https://lagune.ai/docs/commands/detect)   | Reads your code and maps what your system does and where the risks are         |
| 3   | [**/lagune-plan**](https://lagune.ai/docs/commands/plan)       | Turns what detect found into a defense plan, with a fix for each finding       |
| 4   | [**/lagune-harden**](https://lagune.ai/docs/commands/harden)   | Applies the plan's fixes to your code, safely and one at a time                |
| 5   | [**/lagune-verify**](https://lagune.ai/docs/commands/verify)   | Proves each applied fix holds and closes out the ones that do                  |

#### › Special commands

| Command                                                              | What it does                                                                               |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [**/lagune-specialize**](https://lagune.ai/docs/commands/specialize) | Teaches **Lagune** a new security specialization from articles, exploits, or topics        |
| [**/lagune-prove**](https://lagune.ai/docs/commands/prove)           | Turns each detected finding into a runnable, defense-only proof for responsible disclosure |
| [**/lagune-repair**](https://lagune.ai/docs/commands/repair)         | Repairs **Lagune**'s internal tracking                                                     |

> [!TIP]
>
> Security is not a cost, it is an investment: what you put in upfront, you save many times over in the incidents you never have 🙋🏻‍♂️

> [!IMPORTANT]
>
> See the full [**documentation**](https://lagune.ai/) for usage examples and more.

---

### Dashboard

For an interactive live view of `.lagune/`, run:

```bash
npx lagune
```

It serves a dashboard and opens it on a random port:

- [x] **Live Reload**
- [x] **Private** and **Local**
- [x] Follow the findings, fixes, and verdicts, and manage the categories, directly from your browser
- [x] No `node_modules` or `package.json` is needed 📦

<details>
<summary>Overview</summary>
<br />

<img width="320" src="./website/static/img/dashboard/02.png" />
<img width="320" src="./website/static/img/dashboard/03.png" />
<img width="320" src="./website/static/img/dashboard/04.png" />
<img width="320" src="./website/static/img/dashboard/05.png" />
<img width="320" src="./website/static/img/dashboard/06.png" />

</details>

> [!TIP]
>
> - 🚪 Use `--port` to specify a custom port.
> - ⏏️ Press `Ctrl+C` to stop.

---

## Requirements

You will need [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installed on your system.

---

## Security

To report a vulnerability and see the supported versions, check the [**Security Policy**](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

---

## Contributing

See the [**Contributing Guide**](https://github.com/wellwelwel/lagune/blob/main/CONTRIBUTING.md) and please follow our [**Code of Conduct**](https://github.com/wellwelwel/lagune/blob/main/CODE_OF_CONDUCT.md) 🚀

---

## Acknowledgements

### Partners

Partners get an exclusive logo across the repositories and landing pages, plus a spot on a dedicated partners page.

> Help my work grow by [**becoming a partner**](https://weslley.io/?partners) 🖖

### Supporters

Really thanks to everyone who has supported and keeps supporting my work.

[![Sponsors](https://wellwelwel.github.io/wellwelwel/sponsors.svg?v=1)](https://github.com/sponsors/wellwelwel)

> Support my work by [**becoming a sponsor**](https://github.com/sponsors/wellwelwel) too ✨

---

## License

**Lagune** is under the [**Apache License 2.0**](https://github.com/wellwelwel/lagune/blob/main/LICENSE).<br />
Copyright © 2026-present [**Weslley Araújo**](https://github.com/wellwelwel) and [**contributors**](https://github.com/wellwelwel/lagune/graphs/contributors).

All product names, trademarks, and registered trademarks mentioned are the property of their respective owners and are used for identification purposes only.
