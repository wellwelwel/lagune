# Install Lagune on Factory Droid as a Plugin

> Install Lagune on Factory Droid as a plugin, keep it updated, and allow its engine's tools.

Canonical: https://lagune.ai/docs/install/factory-droid
Last updated: 2026-11-03

Install the plugin from your terminal:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Update

To update **Lagune**, run:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Commands

Type the commands by name, such as `/lagune-charter`.

---

**Permissions**

The engine runs through two tools: `lagune_read` only reads your project, and `lagune_write` only writes to `.lagune/`. When **Factory Droid** asks, choose to always allow each one. It asks again after syncing a new commit of the `lagune` marketplace, which it can do when it starts.

## Frequently Asked Questions

### How do I install Lagune on Factory Droid?

Run droid plugin marketplace add wellwelwel/lagune, then droid plugin install lagune@lagune.

### How do I update Lagune on Factory Droid?

Run droid plugin marketplace update lagune, then droid plugin update lagune@lagune.

### How do I run Lagune's commands on Factory Droid?

Type them by name, such as /lagune-charter.

### Can Factory Droid run Lagune without asking for permission?

Yes. Choose to always allow lagune_read and lagune_write when Factory Droid asks. It asks again after syncing a new commit of the lagune marketplace.
