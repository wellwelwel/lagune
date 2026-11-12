# Install Lagune in Any Agent with skills.sh or GitHub CLI

> Install Lagune in any AI agent with the skills CLI or the GitHub CLI, and keep it updated.

Canonical: https://lagune.ai/docs/install/universal
Last updated: 2026-11-09

**skills.sh**

Install **Lagune**'s commands in your project from your terminal with the [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Or paste this prompt into your agent:

```md
Run `npx --yes skills add wellwelwel/lagune --yes` and follow the generated skill instructions now. Read its complete output, redirecting it to a temporary file first if necessary. Resolve relative paths from the supporting-files directory it provides.
```

**GitHub CLI**

Install **Lagune**'s commands in your project from your terminal with the [**GitHub CLI**](https://cli.github.com/) 2.90.0 or later:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Or paste this prompt into your agent:

```md
Run `gh skill install wellwelwel/lagune --all --scope project` and read its complete output, redirecting it to a temporary file first if necessary.
```

## Update

**skills.sh**

To update **Lagune**, run:

```bash
npx skills update
```

Or paste this prompt into your agent:

```md
Run `npx --yes skills update -y` and read its complete output, redirecting it to a temporary file first if necessary.
```

**GitHub CLI**

To update **Lagune**, run:

```bash
gh skill update --all
```

Or paste this prompt into your agent:

```md
Run `gh skill update --all` and read its complete output, redirecting it to a temporary file first if necessary.
```

---

**Sandbox**

In a sandbox without network access, the commands cannot download the engine. Install it in your project from your own terminal, once and after each update:

```bash
npm i -D lagune@0.18.2
```

## Frequently Asked Questions

### How do I install Lagune in any AI agent?

Run npx skills add wellwelwel/lagune -y or gh skill install wellwelwel/lagune --all --scope project in your project, or paste the install prompt into your agent.

### How do I update Lagune in any AI agent?

Run npx skills update if you installed it with the skills.sh, or gh skill update --all if you installed it with the GitHub CLI. You can also paste the update prompt into your agent.

### Can I install Lagune through more than one route?

No. With two, the agent lists every command twice, or uses one copy and hides the other.
