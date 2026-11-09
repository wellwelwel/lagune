# Install Lagune on Claude Code as a Plugin

> Install Lagune on Claude Code as a plugin, in the terminal, the extension, or the desktop app, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/claude-code
Last updated: 2026-11-09

**Terminal**

Install the plugin from your terminal:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Or from a **Claude Code** session:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Extension**

- Type `/plugin` and select **Manage plugins**.
- Add `wellwelwel/lagune` on the **Marketplaces** tab.
- Install `lagune` on the **Plugins** tab.

**Desktop**

- Install **Lagune** from the terminal or the extension, choosing **Install for you** in the extension.
- Start a new session in the desktop app, which loads the plugins you install for yourself.

## Update

**Terminal**

To update **Lagune**, run:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

To keep it updated, select **Enable auto-update** for the `lagune` marketplace under `/plugin`.

**Extension**

- Type `/plugin` and select **Manage plugins**.
- Open the **Marketplaces** tab.
- Select the refresh icon on `lagune`.

**Desktop**

- Update **Lagune** from the terminal or the extension.
- Start a new session in the desktop app.

## Commands

Type the commands by name, such as `/lagune-charter`, or under the plugin's name, such as `/lagune:lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. To allow them up front, add these rules to `.claude/settings.json` for one project, or to `~/.claude/settings.json` for all of them:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

When the engine runs through **npx**, as with the **skills.sh**, allow `Bash(npx --yes lagune@*)`. With the sandbox on, also add `registry.npmjs.org` to `sandbox.network.allowedDomains`.

## Frequently Asked Questions

### How do I install Lagune on Claude Code?

Run claude plugin install lagune --marketplace wellwelwel/lagune. In a session or the extension, add the wellwelwel/lagune marketplace from the plugin manager and install lagune. The desktop app loads it once you install it for yourself in the terminal or the extension.

### How do I update Lagune on Claude Code?

Run claude plugin marketplace update lagune, then claude plugin update lagune@lagune, or select Enable auto-update for the lagune marketplace under /plugin. In the extension, open Manage plugins from /plugin and select the refresh icon on the lagune marketplace. The desktop app loads the update in its next session.

### How do I run Lagune's commands on Claude Code?

Type them by name, such as /lagune-charter, or under the plugin's name, such as /lagune:lagune-charter.

### Can Claude Code run Lagune without asking for permission?

Yes. Allow mcp__plugin_lagune_lagune__lagune_read and mcp__plugin_lagune_lagune__lagune_write in your Claude Code settings, plus Bash(npx --yes lagune@*) when the engine runs through npx.
