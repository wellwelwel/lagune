---
name: architecture
description: Authoritative record of Lagune's architecture decisions, covering the three owners, what ships, the engine command, the published skills and their plugins, project state, the catalog, and the tracking map. Use when a change depends on one or alters it.
user-invocable: true
metadata:
  internal: true
---

# Lagune architecture

This skill records **Lagune**'s architecture decisions: each states a structural choice and why it holds. Consult it before changing source and whenever a decision depends on the shape of the codebase.

## The three owners

| Owner                     | What it holds                                                                          | Where it lives                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| The project               | the charter, the phase artifacts, the tracking map, its categories and its own catalog | `.lagune/`, committed with the project                                                    |
| **Lagune**'s instructions | the nine commands, each beside the template it fills                                   | the skill folders the **skills** CLI or an agent's plugin installer copies from `skills/` |
| **Lagune**'s engine       | the hooks, validation, the built-in specializations and their categories               | the `lagune` package on **npm** and the plugin branches that carry its build              |

Installing and updating the commands belongs to the **skills** CLI and to each agent's own plugin installer. The engine never inspects how its skills were installed: it applies wherever its artifacts exist.

## What ships

- **The package carries no runtime dependency.** Everything it runs is bundled at build time, so running the engine installs nothing on the user's machine, and `src/` is never published.
- **Whatever lands on the default branch reaches users.** The **skills** CLI and most plugin installers take the skills from it, a few agents install the latest release, and the agents that install from **npm** take them from the package.
- **One version across the package, every plugin manifest, and every engine call.** The release moves them together, and no release goes out while a pinned call on the default branch disagrees with the package version.

## The engine

- **Skills and built-in specializations write every engine call as a call to the engine's own MCP tools, spelling every flag in full.** An agent follows the form a call is written in, so a call written as a shell command draws the shell even when the tools are there.
- **Each skill ends with the npx fallback, after the work.** For an agent without the tools, its last section runs each call as `npx --yes lagune@<version> <subcommand>` from the project root, pinned at the package version so each skill runs the engine it was written for and none fetches whatever is newest. What a person reads, from the docs to the engine's own messages, shows `npx lagune <subcommand>`.
- **The MCP server splits reading from writing.** One tool runs the commands that only read and the other the commands that write `.lagune/`, so a user can allow reading alone. Each call runs the engine in its own process with no shell, exactly as the CLI would.
- **The checkers scan only inside the project.** A target above the project root, or a link that leaves it, fails, since the MCP server runs outside the agent's sandbox.
- **The engine fails closed.** An unknown subcommand or a malformed payload fails instead of reading as clean.
- **A project the old Lagune CLI installed answers to its manifest.** That `.lagune/manifest.json` alone decides: `migrate` runs this design, everything else the old CLI knows is handed to the frozen `lagune@0.15.0`, and what only this design has fails, pointing to the migration. Migrate removes only what the manifest lists. The hand-off runs the **npm** installed with the running **Node.js**, with no shell and never one a search path or the project could plant. Without a manifest, `init`, `pull`, and `update` fail, pointing to the **skills** CLI.
- **`src/types/` is the single home of every type declaration.**

## The published skills

- **A skill instructs and a template structures.** Each command is a folder under `skills/` holding its skill and, when it fills one, the template beside it. The skill carries the reasoning of the phase, and the template carries the shape of its result.
- **A folder holds only what an agent loads**, since every installer copies the whole folder as it stands.
- **Names join lowercase words with hyphens**, such as `lagune-detect`, the **Agent Skills** form every agent accepts, since an agent may reject any other form and unload the whole plugin with it.
- **One skill serves every agent.** Its input section names every place an agent may deliver the input, since only some agents fill the placeholder.
- **Prove and specialize run only when the user invokes them.** Every agent that can keep a skill from the model keeps these two from it, even when that takes a file of the agent's own inside their folders.
- **Nothing Lagune ships grants a permission.** No skill carries `allowed-tools` and no plugin pre-approves the engine, so the first engine call stays the user's to allow.

## The plugins

- **A plugin is the thinnest adapter its agent accepts.** Whatever form it takes, it reaches the skills in `skills/`, never a copy of one, and carries no instruction of its own.
- **A manifest is distribution metadata only.** Each sits where its agent's installer reads it and names the plugin `lagune`, beside a marketplace listing when the agent installs through one, which leaves the version to the manifest.
- **The repository root is the plugin.** Every tracked file at the root ships in every user's plugin folder, so the root holds no symlink and nothing an agent would load beside the skills, and no folder holds an instruction file an agent could surface into the user's session. `CLAUDE.md` alone stays, for contributors.
- **Release archives leave out `CLAUDE.md` and the contributor folders.** An agent that installs a release can read `CLAUDE.md` as context when the user's settings name it, and since the website is among the folders left out, the art that plugin listings show lives in `assets/`.
- **A listing that refuses the repository root gets a bundle on a branch of its own.** Such a listing weighs every file it receives and rejects archives that leave files out, so each release publishes only what that plugin needs to its branch.
- **A plugin branch carries the engine.** Its bundle holds the build and the built-in specializations, plus the server declaration its agent reads, which only the branch holds, since the repository root carries no build to start. Each release builds once, and the **npm** package and every branch take that same build.
- **An agent that loads code gets the smallest entry that hands it the skills.** A TypeScript entry is bundled into the **npm** package with the engine. Where an agent accepts only another language, the entry uses that language's standard library alone, the one exception to TypeScript in, JavaScript out.
- **No session-start bootstrap.** The user invokes the commands and `/lagune` is matched by its description, so no plugin injects context into a session.

## The project's state

`.lagune/` holds only the project's state, created by the first command or hook that writes. This design writes no manifest and no generated file there, and adds no block to the project's `.gitignore`. The proofs alone stay out of version control, so an open issue never reaches a commit.

## The catalog

- **The engine composes the catalog on demand** from the built-ins it ships, each indexed with its tags and categories, and the specializations the project keeps in its `.lagune/`.
- **Reading one by name ignores the categories.** It resolves the project's own first, then the built-in.
- **A required built-in always applies**, on every detect run, whatever the project's context.

## The tracking map

- **The finding's name is the item's identity.** Each detect finding is one item, carried forward under the same section title in every artifact rather than as one entry per phase, and the map keys on that name alone.
- **Paths live only in the map.** The prose never holds one, so a rename is corrected in one place and every memory stays valid.
- **The map holds tracking only.** An entry is a name and its paths, with no prose, note, separate id, phase, or link to another entry, since which artifacts carry an item's section is what records its progress. It is never hand-edited and never shown to the user.
- **Track registers and never removes.** Detect, plan, and harden call it at the end of their write step: detect registers the findings it wrote, and plan and harden re-report each by name, following a renamed path. That order is a convention the hook never enforces.
- **Untrack belongs to verify alone.** It stands a proven-closed finding down, removing its section from every artifact and its entry from the map in one pass, which is why verify is the one phase that writes across the other phases' artifacts. It is the only act that edits the memory prose, and it injects no id or anchor and authors no security content.
- **Repair is maintenance, never a phase.** Only `/lagune-repair` runs it, to realign the whole map against the artifacts and the code. It is the only act that surfaces what is gone, and it never removes an entry itself. A phase that finds the tracking inconsistent runs `/lagune-repair` and continues instead of repairing the map.
- **The tracking hooks are mechanical.** They act only on what they are handed, and the one call none makes alone, whether a vanished path means fixed or renamed, goes back to the agent or the user instead of being guessed.

## Memory validation

- **Validation judges shape, never security content.** A written artifact must keep its template's shape, and a value the template derives from another, such as a score from its vector, is part of that shape, so one that drifted fails.
- **Ownership stays with the writer.** Each phase checks the artifact it wrote, verify the record it wrote its verdicts into, and the sweep over the whole memory belongs to `/lagune-repair`, which reports drift for the owning phase to fix. Validation writes nothing, and like track and untrack it is internal plumbing with no user-facing command.
