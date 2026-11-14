# Install Lagune on OpenCode as a Plugin

> Install Lagune on OpenCode 1.x and 2.x as a plugin, and keep it updated.

Canonical: https://lagune.ai/docs/install/opencode
Last updated: 2026-11-07

**OpenCode 2.x**

Install the plugin from your terminal:

```bash
opencode plugin add lagune
```

Or add it to the `plugins` list of `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Install the plugin in your project from your terminal, or add `-g` to install it for all your projects:

```bash
opencode plugin lagune
```

Or add it to the `plugin` list of `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Update

**OpenCode 2.x**

To update **Lagune**, run:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

To update **Lagune**, install the new release over the old one, adding `-g` if you installed it for all your projects:

```bash
opencode plugin lagune@0.19.0 --force
```

## Commands

**OpenCode 2.x**

Type `@` and pick the command, such as `@lagune-charter`, then write your input in the same message.

**OpenCode 1.x**

Type the commands by name, such as `/lagune-charter`. They are listed under `/skills`, not in the `/` menu.

## Frequently Asked Questions

### How do I install Lagune on OpenCode?

On OpenCode 2.x, run opencode plugin add lagune. On OpenCode 1.x, run opencode plugin lagune, adding -g to install it for all your projects.

### How do I update Lagune on OpenCode?

On OpenCode 2.x, run opencode plugin update lagune, then opencode reload. On OpenCode 1.x, run opencode plugin lagune@0.19.0 --force.

### How do I run Lagune's commands on OpenCode?

On OpenCode 2.x, type @ and pick the command, such as @lagune-charter, then write your input in the same message. On OpenCode 1.x, type them by name, such as /lagune-charter, or find them under /skills.

### Does OpenCode ask for permission before Lagune runs?

No. OpenCode runs the engine's two tools, lagune_read and lagune_write, without asking.
