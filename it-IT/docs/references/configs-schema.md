# Schema delle configurazioni

> Lo JSON Schema delle configurazioni di un progetto Lagune, per l'autocompletamento e la validazione nel tuo editor, allineato al Lagune attuale o fissato a una versione.

Canonico: https://lagune.ai/it-IT/docs/references/configs-schema
Lingua: it-IT
Originale: https://lagune.ai/docs/references/configs-schema
Ultimo aggiornamento: 2026-11-05

`.lagune/configs.json` registra le [**categorie**](https://lagune.ai/it-IT/docs/categories) usate da un progetto, indicizza le sue [**specializzazioni**](https://lagune.ai/it-IT/docs/catalog) e stabilisce cosa lasciano fuori i [**checker**](https://lagune.ai/it-IT/docs/hooks/configure). Il suo JSON Schema permette al tuo editor di completare automaticamente ogni campo e di segnalare un refuso o una categoria sconosciuta mentre modifichi il file.

## Lo schema attuale

Ogni volta che **Lagune** scrive il file e non vi trova alcun `$schema`, fa puntare il file allo schema attuale:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Questo indirizzo segue sempre il **Lagune** attuale. Un file scritto prima di **Lagune** 0.16.0 lo riceve alla modifica successiva, e fino ad allora ogni fase lo fa notare.

## Fissa una versione

Ogni release di **Lagune** dalla 0.16.0 in poi porta con sé lo schema com'era in quella versione, pubblicato su **npm** e servito da **jsDelivr**. Per fissarne una, metti la versione dopo `lagune@` nell'indirizzo di `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

La versione accetta qualsiasi intervallo semver:

| Versione          | Schema                          |
| ----------------- | ------------------------------- |
| `0.16.0`          | Quello della 0.16.0             |
| `0.16.x` o `0.16` | Quello dell'ultima release 0.16 |
| `0.x` o `0`       | Quello dell'ultima release 0.x  |
| `latest`          | Quello dell'ultima release      |

## Domande frequenti

### Lagune ha bisogno dello schema?

No. Lo schema aiuta solo il tuo editor, e Lagune legge il file nello stesso modo con o senza $schema.

### Lagune sovrascrive uno schema fissato?

No. Lagune scrive $schema solo quando il file non ne ha uno, e mantiene qualsiasi indirizzo tu abbia impostato.

### Quando dovrei fissare una versione?

Quando il progetto usa una versione specifica di Lagune, così il tuo editor valida il file rispetto a ciò che quella versione accetta.
