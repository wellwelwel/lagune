# Migrate: Move a Manifest-Based Lagune Project to the Skills and Plugins

> Move a manifest-based Lagune project to the skills-based Lagune, keeping your charter, artifacts, tracking, and own specializations.

Canonical: https://lagune.ai/docs/commands/migrate
Last updated: 2026-11-05

🔀 Move a manifest-based **Lagune** project to the skills-based **Lagune**, keeping everything you wrote.

**Deprecation Notice**

A project with a manifest keeps working as it is until `v1.x`: `npx lagune` hands `init`, `pull`, `update`, `add`, `remove`, `list`, and the dashboard to `lagune@0.15.0`, the last manifest-based version.

## Move it

1. Make sure your current work is committed, then run migrate from the project root:

   ```bash
   npx lagune migrate
   ```

2. Commit only what it changed, so the move stays one reviewable change.
3. Install the commands for your agent, as the [install page](https://lagune.ai/docs) shows.
4. If the project already has a detect, plan, or harden artifact, ask [`/lagune-repair`](https://lagune.ai/docs/commands/repair) to reconcile the old references in them and in your own specializations:

   ```prompt
   /lagune-repair Reconcile the applied specializations (formerly sub-skills) in the artifacts under `.lagune/memory/` (`detect.md`, `plan.md`, and `harden.md`) with the names the new catalog lists, and rewrite every call my own specializations in `.lagune/catalog/` make to the old hooks in `.lagune/hooks/` as a call to the `lagune_read` or `lagune_write` tool.
   ```

## What changes

| Before                                                                   | After                                                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/`, and `.lagune/specializations.md` | Removed: each skill carries its template, and the engine runs the hooks               |
| The copies of built-in specializations in `.lagune/skills/`              | Removed: the engine serves the built-ins                                              |
| Your own specializations in `.lagune/skills/`                            | Moved to `.lagune/catalog/`                                                           |
| `.lagune/skills.json`, the index of your own specializations             | Merged into `.lagune/configs.json`                                                    |
| The manifest's categories                                                | Recorded in `.lagune/configs.json`                                                    |
| The old agent commands, such as `/lagune.detect`                         | Removed: [installing **Lagune**](https://lagune.ai/docs) brings the new ones, such as `/lagune-detect` |
| The **Lagune** block in `.gitignore`                                     | Removed, with the file when it held nothing else                                      |
| `.lagune/proofs/`, ignored by that block                                 | Kept out of commits by its own `.gitignore`                                           |
| `.lagune/manifest.json`                                                  | Deleted, last                                                                         |

Your security work stays as it is: the charter, the artifact each phase produced, and the tracking map with the paths each finding points at.

## Frequently Asked Questions

### Do I have to migrate?

Yes. Manifest-based projects are deprecated and only keep working until v1.x, so run npx lagune migrate to move yours.

### What does migrate keep?

Your charter, every phase artifact, the tracking map, your categories, and your own specializations. The specializations move to .lagune/catalog/, and their index joins your categories in .lagune/configs.json.

### When do I install the new commands?

After migrate, as the install page shows for your agent. Installing first works too, since migrate keeps the new /lagune.

### A teammate already migrated. What do I run?

Pull the move, then run npx lagune migrate once. It removes what the manifest-based Lagune left on your clone, which version control never carried, and keeps your proofs out of commits.
