# Installa Lagune su Claude Code come plugin

> Installa Lagune su Claude Code come plugin, nel terminale, nell'estensione o nell'app desktop, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/claude-code
Lingua: it-IT
Originale: https://lagune.ai/docs/install/claude-code
Ultimo aggiornamento: 2026-11-03

**Terminale**

Installa il plugin dal terminale:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Oppure da una sessione di **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Estensione**

- Digita `/plugin` e seleziona **Manage plugins**.
- Aggiungi `wellwelwel/lagune` nella scheda **Marketplaces**.
- Installa `lagune` nella scheda **Plugins**.

**Desktop**

- Installa **Lagune** dal terminale o dall'estensione, scegliendo **Install for you** nell'estensione.
- Avvia una nuova sessione nell'app desktop, che carica i plugin che installi per te.

## Aggiornamento

**Terminale**

Per aggiornare **Lagune**, esegui:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Per tenerlo aggiornato, seleziona **Enable auto-update** per il marketplace `lagune` in `/plugin`.

**Estensione**

- Digita `/plugin` e seleziona **Manage plugins**.
- Apri la scheda **Marketplaces**.
- Seleziona l'icona di aggiornamento su `lagune`.

**Desktop**

- Aggiorna **Lagune** dal terminale o dall'estensione.
- Avvia una nuova sessione nell'app desktop.

## Comandi

Digita i comandi per nome, come `/lagune-charter`, oppure con il nome del plugin, come `/lagune:lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Per consentirli in anticipo, aggiungi queste regole a `.claude/settings.json` per un singolo progetto, oppure a `~/.claude/settings.json` per tutti:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Quando il motore viene eseguito tramite **npx**, come con **skills.sh**, consenti `Bash(npx --yes lagune@*)`. Con la sandbox attiva, aggiungi anche `registry.npmjs.org` a `sandbox.network.allowedDomains`.

## Domande frequenti

### Come installo Lagune su Claude Code?

Esegui claude plugin install lagune --marketplace wellwelwel/lagune. In una sessione o nell'estensione, aggiungi il marketplace wellwelwel/lagune dal gestore dei plugin e installa lagune. L'app desktop lo carica una volta che l'hai installato per te nel terminale o nell'estensione.

### Come aggiorno Lagune su Claude Code?

Esegui claude plugin marketplace update lagune, poi claude plugin update lagune@lagune, oppure seleziona Enable auto-update per il marketplace lagune in /plugin. Nell'estensione, apri Manage plugins da /plugin e seleziona l'icona di aggiornamento sul marketplace lagune. L'app desktop carica l'aggiornamento nella sessione successiva.

### Come eseguo i comandi di Lagune su Claude Code?

Digitali per nome, come /lagune-charter, oppure con il nome del plugin, come /lagune:lagune-charter.

### Claude Code può eseguire Lagune senza chiedere il permesso?

Sì. Consenti mcp__plugin_lagune_lagune__lagune_read e mcp__plugin_lagune_lagune__lagune_write nelle impostazioni di Claude Code, più Bash(npx --yes lagune@*) quando il motore viene eseguito tramite npx.
