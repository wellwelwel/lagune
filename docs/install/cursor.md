# Install Lagune on Cursor as a Plugin

> Install Lagune on Cursor and the Cursor CLI as a plugin, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/cursor
Last updated: 2026-11-05

**Cursor**

- Open **Customize**.
- Select **From GitHub Repository** and enter `https://github.com/wellwelwel/lagune`.
- Select **Install** on **Lagune** and choose a project or user scope.

**Cursor CLI**

- Add the marketplace from your terminal:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Type `/plugins` in an `agent` session.
- Install **Lagune**.

If **Lagune** is already installed in **Claude Code**, the **Cursor CLI** loads it from there.

## Update

**Cursor**

- Open **Customize**.
- Select **Refresh** on the `lagune` marketplace.

**Cursor CLI**

- Replace the marketplace from your terminal:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Type `/plugins` in an `agent` session.
- Install **Lagune** again.

## Commands

Type the commands by name, such as `/lagune-charter`.

---

**Permissions**

In **Cursor**, the commands run the engine through **npx**, which the default Auto-review mode allows without asking.

In the **Cursor CLI**, the engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. To allow them up front, add these rules to `.cursor/cli.json` for one project, or to `~/.cursor/cli-config.json` for all of them:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

When the engine runs through **npx**, as with the **skills.sh**, allow `Shell(npx:--yes lagune@*)`.

## Frequently Asked Questions

### How do I install Lagune on Cursor?

In Cursor, open Customize, select From GitHub Repository, enter https://github.com/wellwelwel/lagune, and install Lagune. In the Cursor CLI, run agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, then install Lagune from /plugins.

### How do I update Lagune on Cursor?

In Cursor, select Refresh on the lagune marketplace in Customize. In the Cursor CLI, remove the lagune marketplace, add it again, then install Lagune again from /plugins.

### How do I run Lagune's commands on Cursor?

Type them by name, such as /lagune-charter.

### Can Cursor run Lagune without asking for permission?

Yes. Cursor's default Auto-review mode already allows it. In the Cursor CLI, allow Mcp(plugin-lagune-lagune:lagune_read) and Mcp(plugin-lagune-lagune:lagune_write), plus Shell(npx:--yes lagune@*) when the engine runs through npx.
