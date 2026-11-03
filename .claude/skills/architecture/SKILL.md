---
name: architecture
description: Authoritative record of Lagune's architecture decisions, covering the three owners, what ships, the engine, the skills and plugins, project state, the catalog, the tracking map, and the website's languages. Use when a change depends on one or alters it.
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
- **Whatever lands on the default branch reaches users.** The **skills** CLI and the plugins that install from the default branch take the skills from it as it stands, while the plugin branches and the **npm** package take them at each release.
- **One version across the package, every plugin manifest, and the npx fallback.** The release moves them together, and no release goes out while a pinned call on the default branch disagrees with the package version.

## The engine

- **Skills and built-in specializations write every engine call as a call to the engine's own MCP tools, spelling every flag in full.** An agent follows the form a call is written in, so a call written as a shell command draws the shell even when the tools are there. Where an agent can load the tools up front instead of deferring them, its plugin does that too.
- **Each skill ends with the npx fallback, after the work.** For an agent without the tools, its last section runs each call as `npx --yes lagune@<version>` followed by its tool's prefix, the command, and its arguments, from the project root, pinned at the package version so each skill runs the engine it was written for and none fetches whatever is newest. What a person reads, from the docs to the engine's own messages, shows the same command unpinned, such as `npx lagune read catalog`.
- **The tool names are a contract.** The skills name `lagune_read` and `lagune_write`, so every agent must reach the tools under names that end in them. A prefix the agent adds is fine, and any other renaming is not.
- **The MCP server splits reading from writing.** One tool runs the commands that only read and the other the commands that write `.lagune/`, so a user can allow reading alone. Each call runs the engine in its own process with no shell.
- **A tool command has only its tool's shape.** On the command line, a command an engine tool runs answers only behind that tool's prefix, `read` or `write`, and a tool call runs as that same command line. A model without the tools translates a tool call into the shell literally, so the tool's shape is the form that answers it. The tool definitions alone decide each command's prefix, so the CLI and the MCP server never disagree. An unprefixed command fails, naming its prefixed form, so the refusal teaches the one form instead of keeping a second.
- **The MCP server serves only a project.** It takes the folder its agent names, or the folder its agent starts it in when the agent has no project variable to fill in, and never its own folder or the root of the file system. Started in one of those, it serves the single folder its client lists as its MCP root, the one channel left to name the workspace, and serves nothing for any other list, so the skills fall back to npx instead of writing elsewhere.
- **The checkers scan only inside the project.** A target above the project root, or a link that leaves it, fails, since the MCP server runs outside the agent's sandbox.
- **The engine fails closed.** An unknown subcommand or a malformed payload fails instead of reading as clean.
- **A manifest-based project answers to its manifest.** That `.lagune/manifest.json` alone decides: `migrate` runs this design, everything else the manifest-based **Lagune** knows is handed to the frozen `lagune@0.15.0`, and what only this design has fails, pointing to the migration. The hand-off runs the **npm** installed with the running **Node.js**, with no shell and never one a search path or the project could plant, and it never hands off again, so a copy of this design answering under the frozen version cannot loop. Without a manifest, `init`, `pull`, and `update` fail, pointing to the install page.
- **Migrate removes only what the manifest-based Lagune wrote**, under the names and in the folders its releases used, and keeps the skills-based `/lagune` that shares its name. The manifest-based **Lagune** kept those files out of version control, so every clone holds its own, and migrate cleans a clone that pulled the move even without a manifest.
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
- **Each plugin installs from a branch of its own where its agent can, then from npm, then from the default branch.** npm comes first where it is the agent's native plugin format. A plugin installed from the default branch keeps only the npx fallback, since that branch carries no build.
- **A plugin branch carries the engine.** Its bundle holds only what its agent loads, the build, and the built-in specializations, plus the server declaration its agent reads, which no other tree holds, since the default branch has no build to start. A listing that weighs every file it receives gets exactly that tree. Each release builds once, and the **npm** package and every branch take that same build.
- **The default branch still ships as a plugin.** Every tracked file at its root reaches the plugin folder of an agent that installs from it, so the root holds no symlink and nothing an agent would load beside the skills, and no folder holds an instruction file an agent could surface into the user's session. `CLAUDE.md` alone stays, for contributors.
- **Release archives leave out `CLAUDE.md` and the contributor folders.** An agent that installs a release can read `CLAUDE.md` as context when the user's settings name it, and since the website is among the folders left out, the art that plugin listings show lives in `assets/`.
- **An agent that loads code gets the smallest entry that hands it the skills.** A TypeScript entry is bundled into the **npm** package with the engine, and where the agent's plugin API registers tools, the same entry registers the two engine tools from the engine's own definitions and process runner instead of starting the server. Its host may not run on **Node.js**, so the entry runs the engine on the **Node.js** of the search path's absolute, non-package folders, never one the project could plant. Where an agent accepts only another language, the entry uses that language's standard library alone, the one exception to TypeScript in, JavaScript out. It registers the tools from the definitions the build writes out and relays each call through the engine's MCP server, so it never holds a copy of either.
- **No session-start bootstrap.** The user invokes the commands and `/lagune` is matched by its description, so no plugin injects context into a session, and the server sends no instructions, which an agent would load into every session.

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

## The website's languages

- **English is the source and stays at the root.** Every other language derives from it under its own prefix, so no existing URL, backlink, or redirect moves, and a change always starts in English before it reaches a translation.
- **One locale registry decides every language and whether it is published.** The build, the language switcher, hreflang, the sitemaps, `robots.txt`, and the AI corpus all derive from it, so no layer can disagree about which languages exist. A draft builds in development and CI and never deploys, so a half-translated language never reaches readers or crawlers.
- **A translation pairs with its English page by doc id and records the English version it came from.** That pairing gives each page one state, translated, stale, or untranslated, and every layer follows the state instead of deciding on its own, so a page cannot be translated for search and untranslated for its reader.
- **Every route exists in every published language.** An untranslated page shows its English content inside the language's interface, with its canonical on the English page, so navigation never leaves the language and search engines never index the copy.
- **hreflang pairs only real translations.** The **Docusaurus** default declares every locale on every page, which would point crawlers at English content dressed as a translation.
- **One structured-data identity in every language.** The organization, the author, the website, and the software are the same entity across languages, and a translated page points to its English original, so search engines and AI assistants never split the project into one entity per language.
- **The website overlays engine and Dashboard text by key and never edits it.** That text keeps its English source in the engine, where the engine and the Dashboard also read it, so a translation can never change what they show, and a missing translation falls back to it key by key.
- **The translation check is a barrier, not a style linter.** A mistranslated command in a security product is a real risk, so commands, code, tokens, paths, and links stay as in English, and the check rejects any translation that changes or adds one.
- **A translated language's build keeps only what it serves.** Root-only files, such as `robots.txt` and the host's settings, and every static file its pages take from the root stay at the root alone, since the host reads them only at the root and the language's pages load them from there, so a copy under its prefix would only be dead weight.
