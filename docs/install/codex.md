# Install Lagune on Codex CLI as a Plugin

> Install Lagune on Codex CLI as a plugin, keep it updated, and run its engine inside the sandbox.

Canonical: https://lagune.ai/docs/install/codex
Last updated: 2026-11-03

Install the plugin from your terminal:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Update

To update **Lagune**, run:

```bash
codex plugin marketplace upgrade lagune
```

## Commands

Type `$` and the command under the plugin's name, followed by your input, such as `$lagune:lagune-charter` for `/lagune-charter`. Typing `$` lists the commands, and picking one inserts its full name.

---

**Permissions**

**Codex**'s sandbox has no network access. Install the engine in your project from your own terminal, once and after each update:

```bash
npm i -D lagune@0.18.0
```

## Frequently Asked Questions

### How do I install Lagune on Codex CLI?

Run codex plugin marketplace add wellwelwel/lagune, then codex plugin add lagune@lagune.

### How do I update Lagune on Codex CLI?

Run codex plugin marketplace upgrade lagune.

### How do I run Lagune's commands on Codex CLI?

Type $ and the command under the plugin's name, followed by your input, such as $lagune:lagune-charter.

### Does Lagune work inside Codex's sandbox?

Yes, once you install the engine in your project with npm i -D lagune@0.18.0 from your own terminal, once and after each update.
