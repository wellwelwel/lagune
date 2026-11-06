# Installa Lagune su Factory Droid come plugin

> Installa Lagune su Factory Droid come plugin, tienilo aggiornato e consenti gli strumenti del suo motore.

Canonico: https://lagune.ai/it-IT/docs/install/factory-droid
Lingua: it-IT
Originale: https://lagune.ai/docs/install/factory-droid
Ultimo aggiornamento: 2026-11-03

Installa il plugin dal terminale:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Aggiornamento

Per aggiornare **Lagune**, esegui:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Comandi

Digita i comandi per nome, come `/lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Quando **Factory Droid** lo chiede, scegli di consentire sempre ciascuno dei due. Lo chiede di nuovo dopo aver sincronizzato un nuovo commit del marketplace `lagune`, cosa che può fare all'avvio.

## Domande frequenti

### Come installo Lagune su Factory Droid?

Esegui droid plugin marketplace add wellwelwel/lagune, poi droid plugin install lagune@lagune.

### Come aggiorno Lagune su Factory Droid?

Esegui droid plugin marketplace update lagune, poi droid plugin update lagune@lagune.

### Come eseguo i comandi di Lagune su Factory Droid?

Digitali per nome, come /lagune-charter.

### Factory Droid può eseguire Lagune senza chiedere il permesso?

Sì. Scegli di consentire sempre lagune_read e lagune_write quando Factory Droid lo chiede. Lo chiede di nuovo dopo aver sincronizzato un nuovo commit del marketplace lagune.
