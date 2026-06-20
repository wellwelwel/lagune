---
id: install
title: Install
sidebar_label: Install
description: Set Blue Spec up in any project, new or existing, with a single command.
---

# Install

**Blue Spec** adapts to your environment, whether it is a new project or an existing one.

```bash
npx -y blue-spec@latest init
```

Run without an agent key and **Blue Spec** asks you to choose one. Pass the key to skip the prompt:

```bash
# For example, using Blue Spec with Claude
npx -y blue-spec@latest init claude
```

See every key in [**Supported Agents**](../supported-agents.md).

:::info[Any language]
**Blue Spec** runs on **Node.js** under the hood, you use whatever language you want 🃏
:::

## What gets created

Running **Blue Spec** in your project creates two things:

- **`.bluespec/`** holds Blue Spec's state in that project: the charter, the artifact each phase produces, the on-demand skills, and the internal tracking. It is committed alongside your code, so the security work is versioned and reviewable like any other part of the project.
- **Agent commands** are written into your agent's own location, in its native format, so the `/bluespec.*` commands are ready to run.

## Next

Once **Blue Spec** is set up, your agent unlocks a set of slash commands. See [**Commands**](./commands.md).
