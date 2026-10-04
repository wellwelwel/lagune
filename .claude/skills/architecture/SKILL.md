---
name: architecture
description: Authoritative architecture reference for Lagune, covering repository layout, the command/template split, the core/adapter boundary, what it scaffolds, and the tracking-map model. Use before adding an agent or when a decision depends on repo shape.
user-invocable: true
metadata:
  internal: true
---

# Lagune architecture

This skill is the specialized, authoritative description of **how Lagune is structured**: repository layout, how commands and templates are organized, the core/adapter boundary, what Lagune scaffolds into a target project, and the tracking-map model. Consult it before changing source, before adding an agent, and whenever a decision depends on the shape of the codebase.

The product mission and workflow philosophy live in [CLAUDE.md](../../../CLAUDE.md). The toolchain, code conventions, build path, and how the tracking hooks are implemented live in the [engineering](../engineering/SKILL.md) skill. The language conventions and the boundaries on what prose carries and who may author it live in the [writer](../writer/SKILL.md) skill. This skill covers the _shape_, not the _build_.

## Repository layout

Top-level directories. Their internal structure is defined in the sections below.

| Directory         | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `src/`            | TypeScript source. Everything authored by hand lives here.                   |
| `src/types/`      | The single home for every type declaration. No type is declared elsewhere.   |
| `lib/`            | Compiled JavaScript build output. Generated, not edited. This is what ships. |
| `spec/`           | The Lagune core: the commands, templates, and sub-skills that ship.          |
| `spec/commands/`  | The `/lagune.*` command definitions an agent reads to run each phase.        |
| `spec/templates/` | The files a command fills in (the security artifacts produced per phase).    |
| `spec/skills/`    | Non-invocable sub-skills: on-demand knowledge the phases load.               |
| `test/`           | Poku test suites, run against Node, Bun, and Deno.                           |
| `website/`        | The documentation site, an npm workspace of the root package.                |

## Build & ship

- **Build tool:** esbuild bundles `src/` into self-contained JavaScript in `lib/`, so the published package carries no runtime `node_modules` for the end user.
- **Output:** `lib/` holds the shipped JavaScript. It is generated, never edited by hand.
- **Entry point:** the `package.json` `bin` field maps the `lagune` command to a file in `lib/` (with a `node` shebang), so `npx lagune ...` runs the bundle directly.
- **End-user install:** none. The bundle is self-contained, so running via `npx` needs no dependency install on the user's machine.

## Website

The documentation site under `website/` is an npm workspace of the root package, so one `npm ci` installs both and one lockfile covers them. The site never redeclares what the package already knows: a single bridge module in its data folder is the only website file that imports from `src/`, re-exporting the agent registry, the skill groups, the catalog, and the dashboard's shared presentation metadata, and every other website module reads from that bridge. Logos live once, in the dashboard's public assets folder, which the site serves as a second static directory. Counts in the docs are the build-time tokens `{{agents}}` and `{{categories}}`, substituted before MDX compiles and again when the plain-Markdown mirrors are written, and the supported-agents table is rendered from the registry in both outputs. The README holds the one hand-typed count, and a test keeps it equal to the registry.

## Command & template anatomy

A phase of the workflow is a pair: a **command** and one or more **templates**.

- **A command instructs.** It is the agent's reading: how to think about the phase, what to look for, what questions to resolve. Commands live in `spec/commands/`, as markdown (`.md`) files with frontmatter, the format Claude Code consumes natively.
- **A template structures.** It is the mould for the phase's output: the security artifact the command produces, with its sections and the fields to fill in. Templates live in `spec/templates/`.

A phase command points to its template. The command carries the reasoning, the template carries the shape of the result. Splitting them keeps the "how to think" reusable and the "what to produce" consistent.

A command that fills no template has none, and the type layer encodes that: `TemplateKey` is `CommandKey` minus `repair` and `verify`. Verify records its verdicts on the harden record, so it fills no template of its own. `specialize` is the exception that is not a phase yet still pairs with a template (`specialize-template.md`): its artifact is a sub-skill file under `.lagune/skills/`, not a `memory/` phase artifact.

### Sub-skills

`spec/skills/` holds the **built-in sub-skills**: agent-agnostic knowledge modules that load only on demand. They are not commands. Detect consumes them inline: it reads the catalog from `.lagune/specializations.md` (which lists each sub-skill as `name: tags`, suffixing ` [required]` on any the catalog flags), then reads and follows the matching `.lagune/skills/<name>.md` directly. A user can import one into any prompt with `@.lagune/skills/<name>.md`. Adding a built-in is one `.md` plus one row in the baked catalog (`src/hooks/skills/catalog.ts`), no new command. A user grows the same set at runtime with `/lagune.specialize`, which writes a sub-skill into `.lagune/skills/` and its row into `.lagune/skills.json`. `.lagune/specializations.md` is an internal, gitignored listing rebuilt from the catalog (by `renderSpecializations`, exposed as the `specializations` hook and rerun on every scaffold, pull, update, and skill change), merging the user's `.lagune/skills.json` over the baked catalog, the user's entry winning a name collision.

## Agent-agnostic core vs. agent adapters

The codebase splits into two layers, and the split is what lets new agents be added later without rewriting the workflow.

- **The core is agent-agnostic.** Templates, the per-phase content, and the context-detection logic know nothing about which agent runs them. This is where the security value lives, and it is written once.
- **An adapter is thin.** Its only job is to translate the core's commands into the format and location a given agent expects. It carries no security logic of its own.

Adapters are **data, not code**. Each supported agent is a single entry in the agent registry under `src/providers/`, declaring its key, display name, homepage, logo, command format, target directory, and, when it applies, its deprecation (a successor or an end-of-life date). A factory turns each entry into a provider, and a format dispatcher under `src/transform/` renders the same core command into that agent's packaging. Adding an agent is adding a row, not writing a module. The registry is the single source of truth for which agents are supported.

The command formats are:

- **Skill** (`<dir>/lagune.<phase>/SKILL.md`): a directory per command with `name` / `description` / `argument-hint` / `user-invocable` frontmatter. Skill directories use each agent's current, project-scoped location (for example `.claude/skills`, `.agents/skills`, `.github/skills`, `.cursor/skills`).
- **Continue prompt** (`.continue/prompts/lagune.<phase>.md`): a markdown prompt with `name`, `description`, and `invokable: true` frontmatter, the shape Continue lists under `/`.
- **Markdown command** (`<dir>/lagune.<phase>.md`): a single markdown file whose name becomes the command.
- **Forge** (`.forge/commands/lagune.<phase>.md`): a markdown command with `name` added to its frontmatter, swapping `$ARGUMENTS` for Forge's `{{parameters}}` placeholder.
- **TOML** (`<dir>/lagune.<phase>.toml`): `description` plus a multi-line `prompt`, with `$ARGUMENTS` rendered as `{{args}}`.
- **Goose recipe** (`.goose/recipes/lagune.<phase>.yaml`): a YAML recipe with the required `version` / `title` / `description` / `instructions` / `prompt` fields, with `$ARGUMENTS` rendered as `{{ args }}`.

Which agent uses which format, and its exact directory, lives in the registry (`src/providers/specs.ts`), the single source of truth. Consult it rather than duplicating the mapping here.

A future agent is one more row, leaving the core untouched. Keep adapters thin and the core neutral. Any logic that an adapter would duplicate belongs in the core instead.

## What Lagune scaffolds into a target project

Running Lagune in a user's project creates two things:

- **`.lagune/`** holds Lagune's state in that project: the filled-in charter and the artifacts each phase produces (the detect map, the defense plan, and so on), plus `hooks/` (the compiled helper scripts the agent runs, see The tracking map and Memory validation) and `skills/` (the non-invocable sub-skills the phases load on demand, both the built-ins copied at init and any the user adds with `/lagune.specialize`). Init also seeds `skills.json`, the runtime catalog of user sub-skills (empty until `specialize` writes to it), a sibling of `tracking.json`. The state is committed and reviewable like the user's code: the charter, the phase artifacts, the tracking, `skills.json`, and the manifest. The generated material (`templates/`, `hooks/`, the built-in `skills/*`, the agent commands) is gitignored and restored from the manifest by `pull`. A user sub-skill shares the `skills/` directory but stays versioned: `specialize` re-includes it past the `/.lagune/skills/*` rule.
- **Agent commands** are written by the adapter into the agent's own location, in that agent's native format (a skill directory, a markdown command, a TOML command, or a Goose recipe, per the chosen agent's registry entry). For example, Claude Code reads them from `.claude/skills/`, GitHub Copilot from `.github/skills/`, and opencode from `.opencode/commands/`. All hold the `/lagune.*` commands the user invokes. Across agents the commands are reused, not duplicated: whichever agent came first holds the real file, and every later agent whose rendered command is identical gets a relative symlink to it, while a different rendering keeps its own file. Where a symlink cannot be created, the install falls back to a real copy, and `update` and `pull` re-establish the layout. A recorded command that the current version no longer produces is removed on `update`, so a changed format leaves nothing behind.

The split mirrors the repository's own core/adapter boundary: `.lagune/` is the agent-agnostic state, and the agent's own directory is where the adapter places what that specific agent reads.

## The tracking map

Each detect finding is one tracked **item**. The later phases carry that same item forward: it is a single entry that plan and harden re-report by name as they act on it, never a separate entry per phase. Its identity is its `name` (the finding's name, written identically as the section title in `detect.md`, `plan.md`, and `harden.md`), and the map keys on that name and nothing else. The prose artifacts carry only that shared title and never a path. The file paths are the one volatile thing, and they live only in the tracking map. A rename or a moved path is corrected in one place, and every memory stays valid. The **tracking map** is tracking only: no prose, no note, no separate id, no phase.

- **Where it lives:** `.lagune/tracking.json`, a sibling of `manifest.json` and `memory/`. It is internal state, committed but never hand-edited and never shown to the user.
- **Shape:** `{ name: 'lagune', entries: [{ name, paths }] }`, where `name` is the identity and `paths` is `string[]` (charter has no items). There is no cross-entry link: the conveyor lives in the prose (which artifact carries the item's section), not in the map. Types live in the types module under `src/types/`.
- **Two flow acts, plus repair apart:** the map is maintained by two acts the phases perform in the normal flow, **track** (registration) and **untrack** (stand-down), and by **repair** (realignment), a maintenance act that runs only via `/lagune.repair`, never as part of a phase. Track records each finding a phase reports and re-reports an existing item by name as a later phase writes, following a renamed path and never removing. By convention detect is where a finding is born and plan and harden re-report it, but the hook keys on the name alone and does not enforce the order. Untrack stands a proven-closed finding down: verify hands it the name, and the hook removes that finding's section from the prose artifacts and drops its entry from the map in one pass. Repair realigns the whole map against the artifacts and the code, and is the only act that surfaces what is gone. Without tracking there is nothing to repair, so track is what populates the map along the normal flow.
- **Who calls them:** detect, plan, and harden call the **track** hook at the end of their write step. Detect registers the findings it wrote, and plan and harden re-report each item by the finding's name (additive, never removing). Only `/lagune.verify` calls the **untrack** hook, handing it a proven-closed finding's name, which is why verify alone writes across the other phases' artifacts. Only the `/lagune.repair` command calls the **repair** hook, to realign the whole map when something diverged. The phases never repair the tracking themselves: when one notices the tracking is inconsistent (a tracked path that no longer exists), it runs `/lagune.repair` and continues. There is no user-facing track or untrack command, both are internal plumbing.
- **Non-goals:** the hooks are mechanical and read nothing but the snippets they are handed. The `/lagune.repair` command reads the user's source only to learn a renamed file's new path, never to author or judge security. Only **untrack** edits the `.lagune/memory/*.md` prose, and only to stand a proven-closed finding down: it injects no IDs or anchors and authors no security content. The one call no hook makes alone (fixed vs renamed) is returned for the agent or user to decide, never guessed.

## The tracking hooks

The tracking-map model (item identity, where the map lives, its shape, who calls each hook, and the non-goals) lives in the [architecture](../architecture/SKILL.md) skill. This section covers how that machinery is implemented.

- **The shared core:** a pure tracking module under `src/core/` holds only what the hooks share: the map's I/O (load, serialize, write), the matcher and fold that drive registration, the removal that drives stand-down, and the payload guards (an `{ entries: [...] }` guard that requires `name` plus a `paths` string array, and a `{ names: [...] }` guard for untrack), each failing closed. The matcher finds the single map entry whose `name` equals the observed name, then overwrites `paths` in place when they changed (`moved`) or leaves it (`unchanged`), and a name with no match is `new`. Every hook consumes the same flat entry shape the file has. A separate core module holds the pure section-removal surgery, apart from the tracking module so repair can reuse it later.
- **Each hook owns its own logic.** What is specific to one hook lives in that hook's scope, not in the core. The **track** hook registers and updates and never orphans, treating an empty payload as a no-op. The **untrack** hook removes entries by name and, uniquely, reaches into the memory artifacts through the shared section-removal surgery to stand a finding down there too, and rejects an empty payload. The **repair** hook runs the same fold but additionally surfaces every map entry whose name appears in no reported entry as `unresolved` (`orphan`, or `renamed-candidate` when its paths match a reported entry under a new name), never removing it itself, and rejects an empty payload rather than accepting it. Each exposes a pure engine the tests exercise directly, plus the payload-driven function the CLI entry runs.
- **The hooks:** the deterministic engines ship as runnable **hooks** under `src/hooks/`, invoked as a node CLI from the project root with their input as process arguments. Each entry holds no logic of its own: it imports its hook's pure function and ends with one call to the shared runner under `src/cli/`, which fires only when the file is the one being executed: importing an entry runs nothing, while running it reads the argument, prints the result, and exits non-zero on error. Passing the input as a process argument keeps it inert, so a value with quotes or backticks can never inject into the command. The build compiles each entry on its own into a self-contained artifact. A hook that grows past one file becomes a folder with an `index.ts` entry, and the build resolves the folder name as the artifact name. The init step copies the hooks into `.lagune/hooks/`, so the user never installs Lagune: init populates everything the workflow needs, the hooks included. Hooks are read from `lib/` (compiled JS), not `spec/`, since they ship as runnable code.

## Memory validation

The **validate** hook judges one thing: that a written memory artifact kept its template's shape, never its security content. A plan's CVSS line is part of that shape: its score and band follow from the vector, so the hook rescores it and rejects a line that drifted. Ownership stays with the writer: each phase checks the artifact it wrote, verify checks the record it wrote its verdicts into, and the no-argument sweep over the whole memory belongs to `/lagune.repair`, which reports drift for the owning phase to fix. It writes nothing, and like track and untrack it is internal plumbing the commands run, with no user-facing command.
