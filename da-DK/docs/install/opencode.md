# Installér Lagune i OpenCode som et plugin

> Installér Lagune i OpenCode 1.x og 2.x som et plugin, og hold det opdateret.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/opencode
Sprog: da-DK
Original: https://lagune.ai/docs/install/opencode
Sidst opdateret: 2026-11-09

**OpenCode 2.x**

Installér pluginnet fra din terminal:

```bash
opencode plugin add lagune
```

Eller tilføj det til listen `plugins` i `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Installér pluginnet i dit projekt fra din terminal, eller tilføj `-g` for at installere det til alle dine projekter:

```bash
opencode plugin lagune
```

Eller tilføj det til listen `plugin` i `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Opdatering

**OpenCode 2.x**

Kør følgende for at opdatere **Lagune**:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Installér den nye udgivelse oven på den gamle for at opdatere **Lagune**, og tilføj `-g`, hvis du installerede det til alle dine projekter:

```bash
opencode plugin lagune@0.19.0 --force
```

## Kommandoer

**OpenCode 2.x**

Skriv `@`, og vælg kommandoen, såsom `@lagune-charter`, og skriv derefter dit input i samme besked.

**OpenCode 1.x**

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`. De står under `/skills`, ikke i menuen `/`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i OpenCode?

I OpenCode 2.x kører du opencode plugin add lagune. I OpenCode 1.x kører du opencode plugin lagune og tilføjer -g for at installere det til alle dine projekter.

### Hvordan opdaterer jeg Lagune i OpenCode?

I OpenCode 2.x kører du opencode plugin update lagune og derefter opencode reload. I OpenCode 1.x kører du opencode plugin lagune@0.19.0 --force.

### Hvordan kører jeg kommandoerne i Lagune i OpenCode?

I OpenCode 2.x skriver du @ og vælger kommandoen, såsom @lagune-charter, og skriver derefter dit input i samme besked. I OpenCode 1.x skriver du dem ved deres navn, såsom /lagune-charter, eller finder dem under /skills.

### Beder OpenCode om tilladelse, før Lagune kører?

Nej. OpenCode kører motorens to værktøjer, lagune_read og lagune_write, uden at spørge.
