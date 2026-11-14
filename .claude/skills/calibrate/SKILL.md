---
name: calibrate
description: Confronts every block, warning, and piece of noise a change raises with the false positives real projects trigger, measured on this tree's build, then gives a verdict and the calibration each case needs.
argument-hint: a branch, the current work, paths, or a checker or surface to confront, in any language. Empty means the current branch against the default branch
user-invocable: true
disable-model-invocation: true
metadata:
  internal: true
---

# Calibrating against false positives

A false alarm costs more than its own noise. Each one teaches the user, and the model reading the result, that **Lagune** can be ignored, so the alarm that matters is dismissed with the rest. This skill finds every place a change raises friction without a real risk behind it, proves each case on a running build, and recommends the calibration that keeps the true positives blocking.

## User Input

```text
$ARGUMENTS
```

The User Input selects the scope, read by meaning in whatever language it is written: a branch (against the default branch unless a base is named), the current work, paths, or a checker or surface to confront. Empty means the current branch against the default branch. Reply in the language the user writes in.

## Ground rules

- **Read-only on the project.** The review changes no code, no test, and nothing under `.lagune/`. Builds and fixtures live in the scratchpad.
- **Measured, never imagined.** A case counts only once a build has produced it. A case that cannot run, such as friction a skill's instruction raises, is judged by reading and labeled as read, not measured.
- **Named, never plausible.** A false positive stands on a real convention, tool, or layout that produces it, named as such, never on an input invented to make the rule fail.
- **The true positives stay.** Every recommendation names what stops blocking because of it.

## The yardstick

Read the charter first. Its principle that only a real risk earns friction sets the tier each piece of evidence earns:

| Tier                           | Earned by                                                       |
| ------------------------------ | --------------------------------------------------------------- |
| A finding, which fails the run | Evidence that proves a real risk, exposed in the project itself |
| A review lead                  | A plausible risk the evidence cannot confirm                    |
| An advisory                    | A real risk not exposed yet                                     |
| Silence                        | A harmless look-alike                                           |

Three limits bound every recommendation:

- **Doubt fails closed.** A state the engine cannot read never becomes silence. It becomes unconfirmed, and many unknowns with one cause collapse into one entry that names the cause.
- **The engine stays inside the project.** A blind spot that only reading outside the root would close calls for a clearer message, never a wider read.
- **No path leaves the scan on the engine's own judgment.** A look-alike that lives in a folder, such as a test fixture, changes tier and stays scanned, and leaving it out remains the user's choice in the project's configs.

The cost of the remedy counts too. A message whose advice breaks the project when followed, such as untracking a key the test suite loads, is friction even when its evidence is right.

## When invoked

1. **Map the friction.** Read the scope's diff and list every point that can stop or warn the user: each verdict a checker emits and the exit code it sets, each warning a skill tells the agent to raise or record, and each remedy those messages advise. For each, write down the evidence it stands on.
2. **Name the look-alikes.** For each point, name the real projects that produce the same evidence without the risk: defaults a framework commits on purpose, templates, test fixtures, files a tool is designed to commit, formats that share an extension, prefixes that make a value public by design, and places where the state cannot be read, such as a **Git** worktree or a package inside a monorepo. Name the reverse as well: real risks the change misses, since a blanket warning often exists to cover one, and closing the blind spot is what lets the warning go.
3. **Build the engine from this tree.** Bundle its command-line entry with the options the build script uses, into the scratchpad, with the **Prism** WebAssembly file beside it. Never run the build script itself, which wipes the build folder.
4. **Build the fixtures.** One small project per case in the scratchpad, each its own **Git** repository, with every file in the state the case needs: tracked, untracked, or ignored. Add a control group of true positives that must keep blocking.
5. **Measure.** Run the engine in each fixture with an empty home folder, so the user's global **Git** excludes cannot change the result, and record the output and the exit code. Where a rule matches line by line, run each value alone to pin which rule fires. Run the same evidence through the engine's other paths, such as a value in source against the same value in a config file, since one piece of evidence must earn one tier wherever it appears.
6. **Classify.** Set each case's tier against the yardstick, beside the tier it got, and trace each mismatch to the line that decides it. Separate what the change introduced from what it inherited.

## Report

Open with the verdict in one line: whether the change is calibrated, and if not, which tier fails the yardstick.

1. **False positives that block:** a table with the real case, the example measured, the cause with a link to the line that decides it, and the calibration it needs.
2. **Noise that does not block:** warnings and leads that fire without a real risk, or repeat on every run with no way to settle them but leaving the file out entirely.
3. **What holds:** the look-alikes it already silences and the true positives it catches, in a few lines.
4. **Out of scope:** what it inherited from before the change, one line each.

Close with the order to fix them in, by how often each case occurs in real projects and what it costs, and where the fixtures live so the user can run them again. Offer to apply the calibration, and change nothing until the user accepts.
