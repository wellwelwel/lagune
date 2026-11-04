# Install Lagune on Qwen Code as an Extension

> Install Lagune on Qwen Code as an extension, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/qwen-code
Last updated: 2026-11-04

Install the extension from your terminal:

```bash
qwen extensions install lagune
```

## Update

To update **Lagune**, run:

```bash
qwen extensions update lagune
```

To keep it updated, install it with `--auto-update`.

## Commands

Type the commands under the extension's name, such as `/lagune:lagune-charter` for `/lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. To allow them up front, add these rules to `.qwen/settings.json` for one project, or to `~/.qwen/settings.json` for all of them:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

When the engine runs through **npx**, as with the **skills.sh**, allow `Shell(npx --yes lagune@*)`.

## Frequently Asked Questions

### How do I install Lagune on Qwen Code?

Run qwen extensions install lagune.

### How do I update Lagune on Qwen Code?

Run qwen extensions update lagune, or install the extension with --auto-update.

### How do I run Lagune's commands on Qwen Code?

Type them under the extension's name, such as /lagune:lagune-charter.

### Can Qwen Code run Lagune without asking for permission?

Yes. Allow mcp__lagune__lagune_read and mcp__lagune__lagune_write in Qwen Code's settings, plus Shell(npx --yes lagune@*) when the engine runs through npx.
