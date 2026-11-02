---
name: playground
description: Mounts an agent against this tree's build in an isolated home and a fresh fixture, then measures it, probes it, or adds it, before any release publishes that build.
argument-hint: the agent to measure or probe (such as cursor, antigravity, or claude), or one to add. Empty lists the supported agents
user-invocable: true
disable-model-invocation: true
metadata:
  internal: true
---

# Playgrounds

A playground runs one agent against this tree's build, in an isolated home and a fresh copy of a fixture, so a session measures exactly what a release would publish for that agent, before the release exists. Two scripts drive it: `scripts/playground/agents.sh` for every agent but Claude Code, and `scripts/playground/mount.sh` for Claude Code. Their helpers live in `tools/playground/`.

## When invoked

1. **Pick the agent** from the arguments. Without one, list the supported agents as a numbered list and ask which to measure, probe, or add.
2. **Mount it.** When its CLI is missing, give the user its install command from "Supported agents", step by step, and wait.
3. **Run what needs no session yourself:** the mount, the report, the server switch, and headless checks. For everything that needs the user's session, hand over the exact steps: the command to start it, what to type, what to approve, and when to stop.
4. **Read the verdict** from the report, and the agent's transcript in the isolated home when the report alone does not explain it.
5. **Report back** each measurement's verdict, with its evidence.

---

## Ground rules

- **The keys file is the owner's alone.** No agent ever reads, opens, searches, parses, or inspects it in any way, not even to check whether a key is set. This rule is absolute and has no exception. Only the playground loads it, into the agent it starts.
- **Free models only.** When an agent runs a prompt itself, it picks a free model or the agent's Auto choice.
- **Nothing approved up front.** A session allows only the rules its measurement needs, and never a flag that approves every tool.
- **Nothing escapes.** Every write lands in the isolated home or the project. The owner's own configuration, global git settings, and sign-ins stay untouched.

---

## Set up once

1. Install the agent's CLI, as "Supported agents" lists, or point `LAGUNE_PLAYGROUND_BIN` at one outside `PATH`.
2. Create the keys file with `bash scripts/playground/agents.sh keys`, then let the owner fill it:
   - `LAGUNE_BYOK_BASE_URL`, `LAGUNE_BYOK_API_KEY`, and `LAGUNE_BYOK_MODEL`: one OpenAI-compatible endpoint that each mount preselects as "Playground" for **Factory Droid**, **Grok Build**, **Qwen Code**, **OpenCode**, and **Pi**. Pick a model that supports tool calls, since a free one may be overloaded and a weak one may never load the tools an agent defers.
   - `GEMINI_API_KEY`: **Gemini CLI** and **Antigravity CLI**.
   - `CURSOR_API_KEY`: **Cursor CLI**, whose sign-in reaches for the macOS keychain, which the isolated home hides.

Everything lives in `~/.lagune-playground`, or wherever `LAGUNE_PLAYGROUND` points: each agent's isolated home, where sign-ins stay across mounts, its project, and its measurements. The agent starts with a clean environment, as outside any editor: only `PATH`, the user and shell, the terminal, the locale, proxy and certificate settings, and the keys file reach it.

---

## Measure an agent

1. **Mount:** `bash scripts/playground/agents.sh <agent> mount`, or `mount sign-in` to use the agent's own sign-in instead of the keys file's BYOK. It builds the tree, installs what the release would publish into the isolated home, copies the fixture into a fresh project, and prints the command to type.
2. **Run:** `bash scripts/playground/agents.sh <agent> run` starts a session in the project. Type the printed command and answer each prompt as it comes. The verdict needs only the first engine call.
3. **Report:** `bash scripts/playground/agents.sh <agent> report` prints each engine call's route, the exact command for **npx**, and the verdict.
4. **Server off:** `bash scripts/playground/agents.sh <agent> server off` takes the plugin's server out and starts a new measurement, which `run` and `report` repeat. `server on` puts it back. `report` keeps every measurement until the next mount.

| Server | Expected first engine call                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------ |
| On     | A call to a tool whose name ends in `lagune_read` or `lagune_write`, or a tool search followed by one  |
| Off    | The pinned `npx --yes lagune@<version>` followed by the tool's prefix, such as `read validate charter` |

The pinned **npx** call reaches this tree's build through a local registry the playground serves at that version, never the release **npm** still serves under it.

### Claude Code

`bash scripts/playground/mount.sh [fixture]` installs the plugin from a local marketplace into the project under the repository's ignored `playground` folder, with a unique version on every mount and this repository's `CLAUDE.md` excluded. It then serves the pinned build from a local registry outside the project, which the project's settings point **npx** at, until Ctrl+C, so start **Claude Code** there from another terminal, with the owner's account. The fixture is `image-upload-service` by default, or `template-toolkit`.

### Headless checks

`run` hands its arguments to the agent's CLI, so an agent can run a session itself through the CLI's print mode, or list what the CLI sees, such as its models or plugins. A headless run denies whatever would ask, which ends the turn, so it measures only what its allow rules let through: pass the rules a check needs for that session alone. When a behavior shows only in the interactive interface, as **Antigravity CLI**'s first message does, the owner runs it, and the agent reads the transcript the agent keeps in the isolated home.

### Probes

The `copilot` and `kimi` playgrounds install a stub server instead of the plugin, since neither agent can carry the engine yet. After `mount` and `run`, ask the session to call the `where` tool of the `lagune-probe` server, and `report` shows the folder, variables, environment, and MCP roots that server received. **Kimi Code** installs the stub inside the session, with the `/plugins install` command `mount` prints.

---

## Test an install from GitHub before a release

1. Assemble the bundle with `bash scripts/plugins/bundle.sh <plugin> <empty folder>`.
2. Create a bare repository whose default branch holds a placeholder and whose plugin branch holds the bundle.
3. Point the agent at it:
   - **With a `file://` URL or a commit SHA,** where the agent takes one, as `mount` does for **Factory Droid** and **Grok Build**.
   - **Through the GitHub URL,** where the agent accepts nothing else: map `https://github.com/wellwelwel/lagune`, with and without `.git`, to the bare repository through `url.<bare repository>.insteadOf` in the isolated home's git config. The agent clones what the release would publish, and nothing reaches **GitHub**.
4. A step the agent's own servers run, such as **Cursor**'s marketplace re-index, still fetches from github.com. Pair it with a commit **GitHub** already serves.

---

## Supported agents

| Agent                  | `<agent>`     | Kind       | CLI                                                                        | Model                                                                   |
| ---------------------- | ------------- | ---------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Claude Code**        | (`mount.sh`)  | Acceptance | `claude`                                                                   | The owner's account                                                     |
| **Factory Droid**      | `droid`       | Acceptance | `droid`, from `npm install --global @factory/cli`                          | BYOK or its sign-in                                                     |
| **Grok Build**         | `grok`        | Acceptance | `grok`, from `npm install --global @xai-official/grok`                     | BYOK or its sign-in                                                     |
| **Gemini CLI**         | `gemini`      | Acceptance | `gemini`, from `npm install --global @google/gemini-cli`                   | A paid `GEMINI_API_KEY` or a Code Assist Standard or Enterprise sign-in |
| **Qwen Code**          | `qwen`        | Acceptance | `qwen`, from `npm install --global @qwen-code/qwen-code`                   | BYOK or its sign-in                                                     |
| **OpenCode**           | `opencode`    | Acceptance | `opencode`, from `opencode-ai` (1.x) or `@opencode/cli` (2.x)              | BYOK or its sign-in                                                     |
| **Pi**                 | `pi`          | Acceptance | `pi`, from `npm install --global @earendil-works/pi-coding-agent`          | BYOK or its sign-in                                                     |
| **Cursor CLI**         | `cursor`      | Acceptance | `agent`, from `curl https://cursor.com/install -fsS \| bash`               | `CURSOR_API_KEY`                                                        |
| **Antigravity CLI**    | `antigravity` | Acceptance | `agy`, from `curl -fsSL https://antigravity.google/cli/install.sh \| bash` | `GEMINI_API_KEY` or a Google sign-in                                    |
| **GitHub Copilot CLI** | `copilot`     | Probe      | `copilot`, from `npm install --global @github/copilot`                     | The owner's account, through `/login`                                   |
| **Kimi Code**          | `kimi`        | Probe      | `kimi`, from `npm install --global @moonshot-ai/kimi-code`                 | The owner's account, through `/login`                                   |

For manual tests and debugging, prefer **OpenCode** with BYOK, and without it, **Grok Build**, then **Antigravity CLI**, then **Cursor CLI**. **Antigravity CLI** loads the plugin's tools only once a session's first message runs, so send its command after any other message.

---

## Add an agent

1. **Learn how the agent loads a plugin:** where it installs from, the file that declares an MCP server, which variables it expands there, the folder it starts the server in, how it names and allows tools, and where it keeps its settings, sign-in, and transcripts.
2. **Teach the agents script about it:** its CLI and how to install it, the variables that keep its configuration inside the isolated home, how `mount` installs what the release publishes for it (its bundle, a bare repository's branch, or the package from the local registry), where `server off` finds its server declaration, the form of its charter command, and how its model is chosen. An agent that cannot carry the engine yet gets a probe instead, with a stub plugin in the form it installs.
3. **Confirm the isolation:** with a marker file, check that a session writes nothing outside the isolated home.
4. **Measure it** with the server on and off.
5. **List it** under "Supported agents".
