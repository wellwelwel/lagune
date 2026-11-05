# Install Lagune on Grok Build as a Plugin

> Install Lagune on Grok Build as a plugin, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/grok-build
Last updated: 2026-11-05

Install the plugin from your terminal:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Update

To update **Lagune**, run:

```bash
grok plugin update lagune
```

## Commands

Type the commands by name, such as `/lagune-charter`, or under the plugin's name, such as `/lagune:lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. To allow them up front, add these rules to `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

When the engine runs through **npx**, as with the **skills.sh**, allow `Bash(npx --yes lagune@*)`.

## Frequently Asked Questions

### How do I install Lagune on Grok Build?

Run grok plugin install wellwelwel/lagune@plugin-grok --trust.

### How do I update Lagune on Grok Build?

Run grok plugin update lagune.

### How do I run Lagune's commands on Grok Build?

Type them by name, such as /lagune-charter, or under the plugin's name, such as /lagune:lagune-charter.

### Can Grok Build run Lagune without asking for permission?

Yes. Allow MCPTool(lagune__lagune_read) and MCPTool(lagune__lagune_write) in Grok Build's config, plus Bash(npx --yes lagune@*) when the engine runs through npx.
