<img src="./website/static/img/banner.png" />

# 🪼 [Lagune AI](https://lagune.ai)

[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
[![Version](https://img.shields.io/npm/v/lagune?label=&color=2f7bff&logo=npm&logoColor=white)](https://www.npmjs.com/package/lagune)
[![No API Key Needed](https://img.shields.io/badge/No%20API%20Key%20Needed-2f7bff?logo=claudecode&logoColor=white)](https://lagune.ai/docs)

**Lagune** helps your AI agent make a project more secure. You point it at your code, and the agent figures out what your system actually does, then guides you through the security work that matters for it.

- **Lagune** works with projects in **any programming language** ✨

---

Love **Lagune**? [**Give us a ⭐ on GitHub**](https://github.com/wellwelwel/lagune)! It helps more people discover the project.

---

## Get Started

**Lagune** adapts to your environment, whether it is a new project or an existing one.

### Install and Update

Pick your agent:

<table>
<tr>
<th width="50%">Install</th>
<th width="50%">Update</th>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/claude.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/claude-code"><b>Claude Code</b></a></td>
</tr>
<tr>
<td>

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

</td>
<td>

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/claude.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/claude-code"><b>Claude Code Extension</b></a></td>
</tr>
<tr>
<td>

- Type `/plugins`.
- Add `wellwelwel/lagune` on the **Marketplaces** tab.
- Install `lagune` on the **Plugins** tab.

</td>
<td>

- Type `/plugins`.
- Open the **Marketplaces** tab.
- Select the refresh icon on `lagune`.

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/claude.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/claude-code"><b>Claude Desktop</b></a></td>
</tr>
<tr>
<td>

- Install **Lagune** for yourself in **Claude Code** or its extension.
- Start a new session in the desktop app.

</td>
<td>

- Update **Lagune** in **Claude Code** or its extension.
- Start a new session in the desktop app.

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/codex.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/codex"><b>Codex</b></a></td>
</tr>
<tr>
<td>

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

</td>
<td>

```bash
codex plugin marketplace upgrade lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/antigravity.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/antigravity-cli"><b>Antigravity</b></a></td>
</tr>
<tr>
<td>

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

</td>
<td>

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/cursor.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/cursor"><b>Cursor</b></a></td>
</tr>
<tr>
<td>

- Open **Customize**.
- Select **From GitHub Repository** and enter `https://github.com/wellwelwel/lagune`.
- Select **Install** on **Lagune**.

</td>
<td>

- Open **Customize**.
- Select **Refresh** on the `lagune` marketplace.

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/cursor.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/cursor"><b>Cursor CLI</b></a></td>
</tr>
<tr>
<td>

- Add the marketplace:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Type `/plugins` in an `agent` session.
- Install **Lagune**.

</td>
<td>

- Replace the marketplace:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Type `/plugins` in an `agent` session.
- Install **Lagune** again.

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/copilot.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/github-copilot-cli"><b>GitHub Copilot</b></a></td>
</tr>
<tr>
<td>

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

</td>
<td>

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/opencode.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/opencode"><b>OpenCode</b></a></td>
</tr>
<tr>
<td>

```bash
opencode plugin add lagune
```

On **OpenCode** 1.x, run `opencode plugin lagune` instead.

</td>
<td>

```bash
opencode plugin update lagune
opencode reload
```

On **OpenCode** 1.x, install the new release over the old one with `--force`.

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/devin.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/devin-cli"><b>Devin for Terminal</b></a></td>
</tr>
<tr>
<td>

```bash
devin auth login
devin plugins install wellwelwel/lagune
```

</td>
<td>

```bash
devin plugins update lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/droid.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/factory-droid"><b>Factory Droid</b></a></td>
</tr>
<tr>
<td>

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

</td>
<td>

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/grok.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/grok-build"><b>Grok Build</b></a></td>
</tr>
<tr>
<td>

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

</td>
<td>

```bash
grok plugin update lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/qwen.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/qwen-code"><b>Qwen Code</b></a></td>
</tr>
<tr>
<td>

```bash
qwen extensions install lagune
```

</td>
<td>

```bash
qwen extensions update lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/kimi.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/kimi-code"><b>Kimi Code</b></a></td>
</tr>
<tr>
<td>

From a **Kimi Code** session, choose **Trust and install** when asked:

```text
/plugins install https://github.com/wellwelwel/lagune
/new
```

</td>
<td>

Install it again from a **Kimi Code** session:

```text
/plugins install https://github.com/wellwelwel/lagune
/new
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/muse.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/muse-code"><b>Muse Code</b></a></td>
</tr>
<tr>
<td>

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

</td>
<td>

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/pi.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/pi"><b>Pi</b></a></td>
</tr>
<tr>
<td>

```bash
pi install npm:lagune
```

</td>
<td>

```bash
pi update npm:lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/hermes.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/hermes-agent"><b>Hermes Agent</b></a></td>
</tr>
<tr>
<td>

```bash
hermes plugins install wellwelwel/lagune --enable
```

</td>
<td>

```bash
hermes plugins update lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/gemini.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/gemini-cli"><b>Gemini CLI</b></a></td>
</tr>
<tr>
<td>

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

</td>
<td>

```bash
gemini extensions update lagune
```

</td>
</tr>
<tr>
<td colspan="2"><picture><img src="./.github/readme/assets/agents/vercel.svg" width="20" align="absmiddle" /></picture> <a href="https://lagune.ai/docs/install/universal"><b>Universal</b></a></td>
</tr>
<tr>
<td>

```bash
npx skills add wellwelwel/lagune
```

</td>
<td>

```bash
npx skills update
```

</td>
</tr>
</table>

---

#### › Migrate from `lagune init`

A project set up with `npx lagune init` has a `.lagune/manifest.json` and keeps working as it is until `v1.x`. To move it to the new **Lagune** approach, keeping your charter, artifacts, tracking, and own specializations, commit your work and run from the project root:

```bash
npx lagune migrate
```

Then commit what it changed, install **Lagune** as above, and follow the rest of the move in [**Migrate**](https://lagune.ai/docs/commands/migrate).

---

### Skills

Once installed, your **AI** agent unlocks a set of commands, all governed by the **charter**: secure new work as you build it, or run the full audit over a project.

> [!TIP]
>
> See real-world [**Prompt Samples**](https://lagune.ai/docs/examples/prompts) 🪼

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

> [!NOTE]
>
> Some agents take the commands under the plugin's name, such as `/lagune:lagune-charter`. Your agent's [**install page**](https://lagune.ai/docs) shows how to type them.

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
