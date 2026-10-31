---
name: architecture
description: Authoritative architecture reference for Lagune, covering repository layout, the three owners, the published skills and their plugins, the catalog, the engine command and its fallback, and the tracking-map model. Use when a decision depends on repo shape.
user-invocable: true
metadata:
  internal: true
---

# Lagune architecture

This skill is the specialized, authoritative description of **how Lagune is structured**: repository layout, the three owners, how the published skills and their templates are organized and shipped as plugins, the catalog of specializations, the engine command, and the tracking-map model. Consult it before changing source and whenever a decision depends on the shape of the codebase.

The product mission and workflow philosophy live in [CLAUDE.md](../../../CLAUDE.md). The toolchain, code conventions, build path, and how the tracking hooks are implemented live in the [engineering](../engineering/SKILL.md) skill. The language conventions and the boundaries on what prose carries and who may author it live in the [writer](../writer/SKILL.md) skill. This skill covers the _shape_, not the _build_.

## The three owners

| Owner                     | What it holds                                                                          | Where it lives                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| The project               | the charter, the phase artifacts, the tracking map, its categories and its own catalog | `.lagune/`, committed with the project                                                    |
| **Lagune**'s instructions | the nine commands, each beside the template it fills                                   | the skill folders the **skills** CLI or an agent's plugin installer copies from `skills/` |
| **Lagune**'s engine       | the hooks, validation, the built-in specializations and their categories               | the `lagune` package on **npm**, reached through the engine command                       |

Installing and updating the commands belongs to the **skills** CLI, the route that works in any agent, and to each agent's own plugin installer. **Lagune** keeps no per-agent format inside the skills or the engine, and the engine never inspects how its skills were installed: it applies wherever its artifacts exist.

## Repository layout

| Directory         | Purpose                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `skills/`         | The nine published skills, authored here and installed as they stand.                                        |
| `catalog/`        | The built-in specializations, published with the engine.                                                     |
| `assets/`         | The logo and the mark for plugin listings, kept outside `website/`, which release archives leave out.        |
| `src/bin/`        | The engine's entry: the hook routing, `catalog`, the categories, `migrate`, the dashboard, and the fallback. |
| `src/cli/`        | Argument parsing, messages, pickers, and the hook runner.                                                    |
| `src/catalog/`    | The built-in index, the name grammar, listing and merging, and the project's own index.                      |
| `src/categories/` | The categories, their changes, and the project's record of them.                                             |
| `src/core/`       | Tracking, the project's configs, markdown, CVSS, scanning, and the migration.                                |
| `src/hooks/`      | The 14 hooks.                                                                                                |
| `src/dashboard/`  | The live view of `.lagune/`.                                                                                 |
| `src/plugins/`    | The plugin entries an agent loads as code from the npm package, such as **OpenCode**'s.                      |
| `src/types/`      | The single home for every type declaration. No type is declared elsewhere.                                   |
| `lib/`            | Build output, ignored by git and published.                                                                  |
| `test/`           | Poku test suites.                                                                                            |
| `website/`        | The documentation site, an npm workspace of the root package.                                                |

## Build & ship

- **Build tool:** **esbuild** bundles the engine, hooks included, from `src/` into one self-contained JavaScript file in `lib/`, with the worker the regex scan spreads its analysis across and each plugin entry bundled beside it, so the published package carries no runtime `node_modules` for the end user. **Vite** builds the dashboard client into `lib/dashboard`.
- **Entry points:** the `package.json` `bin` field maps the `lagune` command to the engine entry in `lib/`, so the engine command runs the bundle directly, and `main` names the **OpenCode** plugin entry.
- **Published:** `lib/`, `catalog/`, `schemas/`, and `skills/`. The **skills** CLI and most plugin installers take the skills from the repository's default branch, a few agents install its latest release, and the agents that install from **npm** take them from the package.
- **Versioning:** one version across the package, every plugin manifest, and every engine call. The release pull request moves `package.json` and each manifest the release config lists, and a step in it pins the engine calls in `skills/` and `catalog/` at the new version. No release goes out while a pin on the default branch disagrees with the package version.

## The published skills

Each command is a folder under `skills/` holding its `SKILL.md`, plus `template.md` when the command fills one (charter, detect, plan, harden, specialize, prove). A folder's name, such as `lagune-detect`, joins lowercase words with hyphens, the Agent Skills form every agent loads as it stands. **Hermes Agent** rejects a dotted name and unloads the whole plugin with it. Prove and specialize also hold `agents/openai.yaml`, the only way **Codex** keeps a skill out of the model's reach, and a file every other agent leaves inert. Every installer copies the whole folder, so nothing else belongs in it.

- **A skill instructs.** It is the agent's reading: how to think about the phase, what to look for, what questions to resolve. Its frontmatter carries `name` (equal to its folder), the description, `argument-hint`, and `user-invocable`, plus `disable-model-invocation` on prove and specialize, and never `metadata.internal`, which would hide it from discovery, or `allowed-tools`, which would approve the engine on the user's behalf. Its input section names every place an agent may deliver the input, since only some agents fill the placeholder.
- **A template structures.** It is the mould for the phase's output, read from `template.md` next to the skill. The skill carries the reasoning, the template carries the shape of the result.

Every deterministic step a skill or a built-in specialization writes uses the engine command with long flags only.

## The plugins

An agent with a plugin installer of its own gets one thin manifest, in the folder that installer reads (such as `.claude-plugin/`), beside a marketplace listing when the installer installs through one. A manifest is distribution metadata only: it names the plugin `lagune`, carries the package version, and reaches the skills in `skills/`, by the installer's convention or by pointing there, never through a copy of a skill. **Hermes Agent** takes a native plugin's skills from its code alone, so its folder also holds **Lagune**'s one module outside TypeScript, in standard-library Python, which registers each skill in `skills/` under its name, and fails the load when the skills are missing. A marketplace listing names the repository root as the plugin and leaves the version to the manifest. The plugins test checks every manifest against the release config.

- **The repository root is the plugin.** Every tracked file at the root ships in every user's plugin folder, so the root holds no symlink and none of the files an agent loads from a plugin root, a list the plugins test keeps. No folder holds an `AGENTS.md` either, since Kimi Code surfaces one once a file below it is read. `CLAUDE.md` stays for contributors, who point their own agent at it and link the development skills locally. Release archives leave it out, along with `website/`, `test/`, `src/`, and `.claude/`, since Gemini CLI can read it as context from an installed release when a user's own settings name it.
- **OpenCode loads code, not a manifest.** It installs the npm package and runs the entry `main` names, which hands it the package's `skills/` and, where the host can, leaves prove and specialize out of the skills the model is offered. A skill the host rejects is skipped, never the whole plugin.
- **No session-start bootstrap.** The user invokes the commands, and `/lagune` is matched by its description, so no manifest injects context into a session.
- **No root `plugin.json`.** The cross-agent format it would hold cuts the skill text Codex injects, installs the plugin disabled on Hermes Agent, and outranks the per-agent manifests.

## The catalog

A **specialization** is an agent-agnostic knowledge module that loads only on demand. The built-ins live in `catalog/`, each indexed in `src/catalog/builtin.ts` with its tags and its **categories**. A project's **catalog** is the built-ins of the categories it records plus its own specializations, its own winning a name collision. `.lagune/configs.json` records the categories and indexes the project's own specializations, whose files live in `.lagune/catalog/<name>.md`. While no category is recorded the project uses OWASP alone.

The engine computes the catalog on demand: `catalog` prints it as `name: tags`, flagging a required built-in, and `catalog <name>` prints the one specialization the project resolves under that name, its own first and then the built-in, whatever the categories. Adding a built-in is one file in `catalog/` plus one row in the index, never a new command. `/lagune-specialize` grows a project's own catalog the same way.

## The engine command

Every skill and built-in specialization calls the engine as `npx --yes lagune@<version> <subcommand>` from the project root, pinned at the package version, so each runs the engine it was written for and none fetches whatever version is newest. A specialization a project writes keeps the version of the day it was written. No plugin grants a permission, so the first call stays the user's to allow. Everything a person reads, from the docs to the engine's own messages, shows it as `npx lagune <subcommand>`. A hook subcommand is routed ahead of the argument parser, so its arguments reach the hook untouched, and a subcommand the engine does not know fails instead of reading as clean. The engine's own subcommands are `catalog`, the category subcommands (`add`, `remove`, and `list` with `--categories`), `list --findings`, `migrate`, and the dashboard.

A project the **Lagune** CLI installed carries `.lagune/manifest.json`, and that manifest alone decides who answers there: `migrate` runs this design, everything else the old CLI knows is handed to the frozen `lagune@0.15.0`, and what only this design has fails with a notice pointing to the migrate page. The old CLI wrote its commands under dotted names, such as `lagune.detect`, and migrate removes only those the manifest lists, never a hyphenated one. The hand-off runs the npm installed with the running **Node.js**, with no shell and never one a search path or the project could plant, and a runtime without one fails with the command to run instead. Without a manifest, `init`, `pull`, and `update` fail, pointing to the **skills** CLI.

## Project state

`.lagune/` holds only the project's state, created by the first command or hook that writes: the memory artifacts under `memory/`, the tracking map, `configs.json` with the recorded categories and the index of the project's own specializations, their files under `catalog/`, and the proofs, which keep themselves out of version control with their own `.gitignore`. There is no manifest, no generated file, and no `.gitignore` block.

## The tracking map

Each detect finding is one tracked **item**. The later phases carry that same item forward: it is a single entry that plan and harden re-report by name as they act on it, never a separate entry per phase. Its identity is its `name` (the finding's name, written identically as the section title in `detect.md`, `plan.md`, and `harden.md`), and the map keys on that name and nothing else. The prose artifacts carry only that shared title and never a path. The file paths are the one volatile thing, and they live only in the tracking map. A rename or a moved path is corrected in one place, and every memory stays valid. The **tracking map** is tracking only: no prose, no note, no separate id, no phase.

- **Where it lives:** `.lagune/tracking.json`, a sibling of `memory/`. It is internal state, committed but never hand-edited and never shown to the user.
- **Shape:** `{ entries: [{ name, paths }] }`, where `name` is the identity and `paths` is `string[]` (charter has no items). There is no cross-entry link: the conveyor lives in the prose (which artifact carries the item's section), not in the map. Types live in the types module under `src/types/`.
- **Two flow acts, plus repair apart:** the map is maintained by two acts the phases perform in the normal flow, **track** (registration) and **untrack** (stand-down), and by **repair** (realignment), a maintenance act that runs only via `/lagune-repair`, never as part of a phase. Track records each finding a phase reports and re-reports an existing item by name as a later phase writes, following a renamed path and never removing. By convention detect is where a finding is born and plan and harden re-report it, but the hook keys on the name alone and does not enforce the order. Untrack stands a proven-closed finding down: verify hands it the name, and the hook removes that finding's section from the prose artifacts and drops its entry from the map in one pass. Repair realigns the whole map against the artifacts and the code, and is the only act that surfaces what is gone. Without tracking there is nothing to repair, so track is what populates the map along the normal flow.
- **Who calls them:** detect, plan, and harden call the **track** hook at the end of their write step. Detect registers the findings it wrote, and plan and harden re-report each item by the finding's name (additive, never removing). Only `/lagune-verify` calls the **untrack** hook, handing it a proven-closed finding's name, which is why verify alone writes across the other phases' artifacts. Only the `/lagune-repair` command calls the **repair** hook, to realign the whole map when something diverged. The phases never repair the tracking themselves: when one notices the tracking is inconsistent (a tracked path that no longer exists), it runs `/lagune-repair` and continues. There is no user-facing track or untrack command, both are internal plumbing.
- **Non-goals:** the hooks are mechanical and read nothing but the snippets they are handed. The `/lagune-repair` command reads the user's source only to learn a renamed file's new path, never to author or judge security. Only **untrack** edits the `.lagune/memory/*.md` prose, and only to stand a proven-closed finding down: it injects no IDs or anchors and authors no security content. The one call no hook makes alone (fixed vs renamed) is returned for the agent or user to decide, never guessed.

## The tracking hooks

The tracking-map model (item identity, where the map lives, its shape, who calls each hook, and the non-goals) lives in the section above. This section covers how that machinery is implemented.

- **The shared core:** a pure tracking module under `src/core/` holds only what the hooks share: the map's I/O (load, serialize, write), the matcher and fold that drive registration, the removal that drives stand-down, and the payload guards (an `{ entries: [...] }` guard that requires `name` plus a `paths` string array, and a `{ names: [...] }` guard for untrack), each failing closed. The matcher finds the single map entry whose `name` equals the observed name, then overwrites `paths` in place when they changed (`moved`) or leaves it (`unchanged`), and a name with no match is `new`. Every hook consumes the same flat entry shape the file has. A separate core module holds the pure section-removal surgery, apart from the tracking module so repair can reuse it later.
- **Each hook owns its own logic.** What is specific to one hook lives in that hook's scope, not in the core. The **track** hook registers and updates and never orphans, treating an empty payload as a no-op. The **untrack** hook removes entries by name and, uniquely, reaches into the memory artifacts through the shared section-removal surgery to stand a finding down there too, and rejects an empty payload. The **repair** hook runs the same fold but additionally surfaces every map entry whose name appears in no reported entry as `unresolved` (`orphan`, or `renamed-candidate` when its paths match a reported entry under a new name), never removing it itself, and rejects an empty payload rather than accepting it. Each exposes a pure engine the tests exercise directly, plus the payload-driven function the CLI entry runs.
- **The hooks:** the deterministic engines live under `src/hooks/`, each with a `cli.ts` that turns its process arguments into a result. The engine entry routes a hook subcommand to that handler through the hook runner. Passing the input as a process argument keeps it inert, so a value with quotes or backticks can never inject into the command.

## Memory validation

The **validate** hook judges one thing: that a written memory artifact kept its template's shape, never its security content. A plan's CVSS line is part of that shape: its score and band follow from the vector, so the hook rescores it and rejects a line that drifted. Detect's "Applied specializations" section must name a specialization as the catalog lists it, and the legacy heading and path rows still validate. Ownership stays with the writer: each phase checks the artifact it wrote, verify checks the record it wrote its verdicts into, and the no-argument sweep over the whole memory belongs to `/lagune-repair`, which reports drift for the owning phase to fix. It writes nothing, and like track and untrack it is internal plumbing the commands run, with no user-facing command.
