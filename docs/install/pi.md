# Install Lagune on Pi as a Package

> Install Lagune on Pi as a package, from npm or from GitHub, and keep it updated.

Canonical: https://lagune.ai/docs/install/pi
Last updated: 2026-11-04

**npm**

Install the package from your terminal:

```bash
pi install npm:lagune
```

**GitHub**

Install the latest commit from **GitHub**, which runs the engine through **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Update

**npm**

To update **Lagune**, run:

```bash
pi update npm:lagune
```

**GitHub**

To update **Lagune**, run:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` updates every package you installed, while `pi update` alone updates only **Pi**.

## Commands

Type the commands with the `skill:` prefix, such as `/skill:lagune-charter` for `/lagune-charter`.

## Frequently Asked Questions

### How do I install Lagune on Pi?

Run pi install npm:lagune, or pi install git:github.com/wellwelwel/lagune for the latest commit from GitHub.

### How do I update Lagune on Pi?

Run pi update npm:lagune, or pi update git:github.com/wellwelwel/lagune for a GitHub install. pi update --extensions updates every package you installed.

### How do I run Lagune's commands on Pi?

Type them with the skill: prefix, such as /skill:lagune-charter.
