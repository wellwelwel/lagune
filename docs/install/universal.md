# Install Lagune in Any Agent with skills.sh

> Install Lagune in any AI agent with the skills CLI, and keep it updated.

Canonical: https://lagune.ai/docs/install/universal
Last updated: 2026-11-03

The [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) installs **Lagune**'s commands in any agent:

```bash
npx skills add wellwelwel/lagune
```

Or paste this prompt into your agent:

```md
Run `npx --yes skills add wellwelwel/lagune` and follow the generated skill instructions now. Read its complete output, redirecting it to a temporary file first if necessary. Resolve relative paths from the supporting-files directory it provides.
```

## Update

To update **Lagune**, run:

```bash
npx skills update
```

If your agent lists the commands with a dot, such as `/lagune.charter`, remove **Lagune** and add it again:

```bash
npx skills remove wellwelwel/lagune
npx skills add wellwelwel/lagune
```

---

**One route per agent**

Install **Lagune** through the **skills.sh** or through its **plugin**, never both.

**Permissions**

The commands run the engine as `npx --yes lagune@0.16.0`, and each [agent's install page](https://lagune.ai/docs) shows the rule that allows it up front. In a sandbox without network access, install the engine in your project from your own terminal, once and after each update:

```bash
npm i -D lagune@0.16.0
```

## Frequently Asked Questions

### How do I install Lagune in any AI agent?

Run npx skills add wellwelwel/lagune in your project.

### How do I update Lagune installed with the skills CLI?

Run npx skills update.

### Can I install Lagune with both the skills CLI and a plugin?

No. With both, the agent lists every command twice, or uses one copy and hides the other.
