# Install Lagune on Gemini CLI as an Extension

> Install Lagune on Gemini CLI as an extension, keep it updated, and allow its engine up front.

Canonical: https://lagune.ai/docs/install/gemini-cli
Last updated: 2026-11-04

Install the extension from your terminal:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Update

To update **Lagune**, run:

```bash
gemini extensions update lagune
```

To keep it updated, install it with `--auto-update`.

## Commands

Type the commands under the extension's name, such as `/lagune:lagune-charter` for `/lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. **Gemini CLI** starts them only in a trusted folder. To allow them up front, save this rule as `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

When the engine runs through **npx**, as with the **skills.sh**, add this rule to the same file:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Frequently Asked Questions

### How do I install Lagune on Gemini CLI?

Run gemini extensions install https://github.com/wellwelwel/lagune.

### How do I update Lagune on Gemini CLI?

Run gemini extensions update lagune, or install the extension with --auto-update.

### How do I run Lagune's commands on Gemini CLI?

Type them under the extension's name, such as /lagune:lagune-charter.

### Can Gemini CLI run Lagune without asking for permission?

Yes. Add a policy rule that allows the lagune server's lagune_read and lagune_write tools, plus one for run_shell_command with npx --yes lagune@ and a version when the engine runs through npx.
