# Installa Lagune su OpenCode come plugin

> Installa Lagune su OpenCode 1.x e 2.x come plugin e tienilo aggiornato.

Canonico: https://lagune.ai/it-IT/docs/install/opencode
Lingua: it-IT
Originale: https://lagune.ai/docs/install/opencode
Ultimo aggiornamento: 2026-11-04

**OpenCode 2.x**

Installa il plugin dal terminale:

```bash
opencode plugin add lagune
```

Oppure aggiungilo all'elenco `plugins` di `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Installa il plugin nel tuo progetto dal terminale, oppure aggiungi `-g` per installarlo per tutti i tuoi progetti:

```bash
opencode plugin lagune
```

Oppure aggiungilo all'elenco `plugin` di `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Aggiornamento

**OpenCode 2.x**

Per aggiornare **Lagune**, esegui:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Per aggiornare **Lagune**, installa la nuova release sopra quella vecchia, aggiungendo `-g` se l'hai installato per tutti i tuoi progetti:

```bash
opencode plugin lagune@0.17.0 --force
```

## Comandi

**OpenCode 2.x**

Digita `@` e scegli il comando, come `@lagune-charter`, poi scrivi il tuo input nello stesso messaggio.

**OpenCode 1.x**

Digita i comandi per nome, come `/lagune-charter`. Sono elencati sotto `/skills`, non nel menu `/`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. **OpenCode** li esegue senza chiedere.

## Domande frequenti

### Come installo Lagune su OpenCode?

Su OpenCode 2.x, esegui opencode plugin add lagune. Su OpenCode 1.x, esegui opencode plugin lagune, aggiungendo -g per installarlo per tutti i tuoi progetti.

### Come aggiorno Lagune su OpenCode?

Su OpenCode 2.x, esegui opencode plugin update lagune, poi opencode reload. Su OpenCode 1.x, esegui opencode plugin lagune@0.17.0 --force.

### Come eseguo i comandi di Lagune su OpenCode?

Su OpenCode 2.x, digita @ e scegli il comando, come @lagune-charter, poi scrivi il tuo input nello stesso messaggio. Su OpenCode 1.x, digitali per nome, come /lagune-charter, oppure trovali sotto /skills.

### OpenCode chiede il permesso prima di eseguire Lagune?

No. OpenCode esegue i due strumenti del motore, lagune_read e lagune_write, senza chiedere.
