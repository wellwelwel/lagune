# Install Lagune on Antigravity CLI as a Plugin

> Install Lagune on Antigravity CLI as a plugin, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/antigravity-cli
Last updated: 2026-11-03

Install the plugin from your terminal:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Update

To update **Lagune**, install it again:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Commands

Type the commands under the plugin's name, such as `/lagune:lagune-charter` for `/lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. A command sent as a session's first message runs before they load, so it uses **npx** instead. To allow the tools and **npx** up front, add these rules to `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Frequently Asked Questions

### How do I install Lagune on Antigravity CLI?

Run agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### How do I update Lagune on Antigravity CLI?

Run agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity again.

### How do I run Lagune's commands on Antigravity CLI?

Type them under the plugin's name, such as /lagune:lagune-charter.

### Can Antigravity CLI run Lagune without asking for permission?

Yes. Allow mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write), and command(regex:npx --yes lagune@[0-9.]+) in Antigravity CLI's settings. The npx rule covers a command sent as a session's first message.
