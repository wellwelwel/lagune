---
id: commands
title: Commands
sidebar_label: Commands
description: The slash commands your AI agent unlocks once Blue Spec is set up.
---

# Commands

Once **Blue Spec** is set up in your project, your **AI** agent unlocks a set of slash commands.

## The Blue Team flow

These five run in order. Each builds on the previous, so following the list top to bottom is all it takes.

| #   | Command                                        | What it does for you                                                                         | Recommended Minimum Effort                                  |
| --- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | [`/bluespec.charter`](../commands/charter.mdx) | Sets your project's security rules, proposed for you or shaped by what you say _(optional)_. | Medium                                                      |
| 2   | [`/bluespec.detect`](../commands/detect.mdx)   | Reads your code and maps what your system does and where the risks are.                      | High or more (the higher the effort, the better the result) |
| 3   | [`/bluespec.plan`](../commands/plan.mdx)       | Turns what detect found into a defense plan, with a fix for each finding.                    | High                                                        |
| 4   | [`/bluespec.harden`](../commands/harden.mdx)   | Applies the plan's fixes to your code, safely and one at a time.                             | High                                                        |
| 5   | [`/bluespec.verify`](../commands/verify.mdx)   | Proves each applied fix holds and closes out the ones that do.                               | Medium                                                      |

## Additional commands

These are not phases in the linear flow. They support it.

| Command                                              | What it does                                            |
| ---------------------------------------------------- | ------------------------------------------------------- |
| [`/bluespec.specialize`](../commands/specialize.mdx) | Distills a source or topic into a new _sub_-skill.      |
| [`/bluespec.skills`](../commands/skills.mdx)         | Loads an on-demand security _sub_-skill.                |
| [`/bluespec.repair`](../commands/repair.md)          | Repairs **Blue Spec**'s internal tracking.              |
| [`/bluespec.list`](../commands/list.md)              | Lists every finding **Blue Spec** is tracking, by name. |

:::tip[Security is an investment]

Security is not a cost, it is an investment: what you put in upfront, you save many times over in the incidents you never have 🙋🏻‍♂️
:::
