# Install Lagune on Hermes Agent as a Plugin

> Install Lagune on Hermes Agent as a plugin, and keep it updated.

Canonical: https://lagune.ai/docs/install/hermes-agent
Last updated: 2026-11-04

Install the plugin from your terminal:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- When **Hermes Agent** asks you to confirm a plugin from outside its catalog, **confirm it**.
- When it offers to install the repository's **Node.js** dependencies, **decline**.

## Update

To update **Lagune**, run:

```bash
hermes plugins update lagune
```

## Commands

Type the commands under the plugin's name, such as `/lagune:lagune-charter` for `/lagune-charter` and `/lagune:lagune` for `/lagune`.

## Frequently Asked Questions

### How do I install Lagune on Hermes Agent?

Run hermes plugins install wellwelwel/lagune --enable. Confirm the plugin when asked, and decline installing the repository's Node.js dependencies.

### How do I update Lagune on Hermes Agent?

Run hermes plugins update lagune.

### How do I run Lagune's commands on Hermes Agent?

Type them under the plugin's name, such as /lagune:lagune-charter and /lagune:lagune.
