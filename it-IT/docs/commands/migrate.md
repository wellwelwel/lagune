# Migrate: sposta un progetto Lagune basato sul manifest alle skill e ai plugin

> Sposta un progetto Lagune basato sul manifest al Lagune basato sulle skill, mantenendo il charter, gli artefatti, il tracciamento e le tue specializzazioni.

Canonico: https://lagune.ai/it-IT/docs/commands/migrate
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/migrate
Ultimo aggiornamento: 2026-11-04

🔀 Sposta un progetto **Lagune** basato sul manifest al **Lagune** basato sulle skill, mantenendo tutto ciò che hai scritto.

**Avviso di deprecazione**

Un progetto con un manifest continua a funzionare così com'è fino alla `v1.x`: `npx lagune` passa `init`, `pull`, `update`, `add`, `remove`, `list` e la dashboard a `lagune@0.15.0`, l'ultima versione basata sul manifest.

## Spostalo

1. Assicurati che il lavoro in corso sia nel commit, poi esegui migrate dalla radice del progetto:

   ```bash
   npx lagune migrate
   ```

2. Fai un commit con le sole modifiche di migrate, così lo spostamento resta un'unica modifica revisionabile.
3. Installa i comandi per il tuo agente, come mostra la [pagina di installazione](https://lagune.ai/it-IT/docs).
4. Se il progetto ha già un artefatto di detect, plan o harden, chiedi a [`/lagune-repair`](https://lagune.ai/it-IT/docs/commands/repair) di riconciliare i vecchi riferimenti al loro interno e nelle tue specializzazioni:

   ```prompt
   /lagune-repair Riconcilia le specializzazioni applicate (prima chiamate sub-skill) negli artefatti in `.lagune/memory/` (`detect.md`, `plan.md` e `harden.md`) con i nomi elencati dal nuovo catalogo, e riscrivi ogni chiamata che le mie specializzazioni in `.lagune/catalog/` fanno ai vecchi hook in `.lagune/hooks/` come una chiamata allo strumento `lagune_read` o `lagune_write`.
   ```

## Cosa cambia

| Prima                                                                 | Dopo                                                                              |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` e `.lagune/specializations.md` | Rimossi: ogni skill porta con sé il suo template e il motore esegue gli hook      |
| Le copie delle specializzazioni integrate in `.lagune/skills/`        | Rimosse: il motore serve quelle integrate                                         |
| Le tue specializzazioni in `.lagune/skills/`                          | Spostate in `.lagune/catalog/`                                                    |
| `.lagune/skills.json`, l'indice delle tue specializzazioni            | Unito a `.lagune/configs.json`                                                    |
| Le categorie del manifest                                             | Registrate in `.lagune/configs.json`                                              |
| I vecchi comandi dell'agente, come `/lagune.detect`                   | Rimossi: [installare **Lagune**](https://lagune.ai/it-IT/docs) porta quelli nuovi, come `/lagune-detect` |
| Il blocco di **Lagune** in `.gitignore`                               | Rimosso, insieme al file quando non conteneva altro                               |
| `.lagune/proofs/`, ignorata da quel blocco                            | Tenuta fuori dai commit dal suo `.gitignore`                                      |
| `.lagune/manifest.json`                                               | Eliminato, per ultimo                                                             |

Il tuo lavoro di sicurezza resta com'è: il charter, l'artefatto prodotto da ogni fase e la mappa di tracciamento con i percorsi a cui punta ogni rilievo.

## Domande frequenti

### Devo per forza migrare?

Sì. I progetti basati sul manifest sono deprecati e continuano a funzionare solo fino alla v1.x, quindi esegui npx lagune migrate per spostare il tuo.

### Cosa mantiene migrate?

Il tuo charter, ogni artefatto delle fasi, la mappa di tracciamento, le tue categorie e le tue specializzazioni. Le specializzazioni si spostano in .lagune/catalog/, e il loro indice si unisce alle tue categorie in .lagune/configs.json.

### Quando installo i nuovi comandi?

Dopo migrate, come mostra la pagina di installazione per il tuo agente. Va bene anche installarli prima, perché migrate mantiene il nuovo /lagune.

### Un collega ha già fatto la migrazione. Cosa devo eseguire?

Scarica lo spostamento, poi esegui npx lagune migrate una volta. Rimuove ciò che il Lagune basato sul manifest ha lasciato nel tuo clone, che il controllo di versione non ha mai portato, e tiene le tue prove fuori dai commit.
