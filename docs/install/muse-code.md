# Install Lagune on Muse Code as a Plugin

> Install Lagune on Muse Code as a plugin, keep it updated, and run its engine inside the sandbox.

Canonical: https://lagune.ai/docs/install/muse-code
Last updated: 2026-11-07

Install the plugin from your terminal:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Update

To update **Lagune**, refresh the marketplace and reinstall the plugin:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Commands

Type the commands by name, such as `/lagune-charter`, or under the plugin's name, such as `/lagune:lagune-charter`.

---

**Sandbox**

**Muse Code**'s sandbox cannot download the engine. Install it in your project from your own terminal, once and after each update:

```bash
npm i -D lagune@0.18.2
```

## Frequently Asked Questions

### How do I install Lagune on Muse Code?

Run muse plugins marketplace add lagune wellwelwel/lagune, then muse plugins install lagune@lagune.

### How do I update Lagune on Muse Code?

Run muse plugins marketplace update lagune, then reinstall with muse plugins remove lagune and muse plugins install lagune@lagune.

### How do I run Lagune's commands on Muse Code?

Type them by name, such as /lagune-charter, or under the plugin's name, such as /lagune:lagune-charter.

### Does Lagune work inside Muse Code's sandbox?

Yes, once you install the engine in your project with npm i -D lagune@0.18.2 from your own terminal, once and after each update.
