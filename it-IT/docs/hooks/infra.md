# Hook infra: rileva le configurazioni IaC errate

> Analizza Terraform, Dockerfile e GitHub Actions alla ricerca di configurazioni errate, oppure valuta un singolo frammento, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/infra
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/infra
Ultimo aggiornamento: 2026-11-03

L'hook `infra` segnala le **configurazioni errate dell'infrastructure as code** che si possono stabilire dal file stesso: una rete aperta al mondo, un permesso wildcard, un segreto in un manifest, un container eseguito come root, un valore non attendibile in una shell di CI. Legge solo file IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). È il motore deterministico dietro la [specializzazione `infra`](https://lagune.ai/it-IT/docs/catalog), in modalità **scan** o **check**.

## Come eseguirlo

**Analizza la codebase**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Controlla un frammento**

Passa il frammento con `--pattern` e il suo tipo con `--kind` (`terraform`, `dockerfile` o `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

L'analisi stampa fino a due sezioni. **Infrastructure risks found** esce con un codice diverso da zero e contiene i difetti accertabili (un ingresso `0.0.0.0/0` su una porta sensibile, una regola IAM wildcard, un segreto in un manifest, `encrypted = false`, un modulo git non fissato a una versione, un'immagine che gira esplicitamente come root, un `curl | sh`, una script injection nella CI, `permissions: write-all`). **Infrastructure hardening advisories** non cambia il codice di uscita (un tag di base mutabile, un'action fissata a un tag). Un'esecuzione pulita stampa `no infrastructure risks found`.

## Come leggere il verdetto

La modalità check stampa il tag di gravità più alta che ha trovato (per esempio `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), un tag di avviso (`mutable-tag`, `unpinned-action`) oppure `safe`. Solo un tag con gravità da rilievo esce con un codice diverso da zero.

### Opzioni della CLI

| Opzione     | Valore                                          | Descrizione                                                                   |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `--pattern` | un frammento                                    | Controlla un frammento. Richiede `--kind`. Ripetila per controllarne diversi. |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Il tipo con cui viene giudicato il frammento.                                 |
| `--dir`     | una directory                                   | Limita l'analisi a una directory. Si ripete e si combina con `--file`.        |
| `--file`    | un file                                         | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`.       |

Senza opzioni analizza ogni file IaC del progetto. `--pattern` non si può combinare con `--dir` o `--file`.

**Suggerimento**

L'hook coglie i casi evidenti e accertabili: la cifratura assente, l'esposizione tramite `pull_request_target` e il giusto ambito IAM restano valutazioni coperte dalla [specializzazione `infra`](https://lagune.ai/it-IT/docs/catalog).

## Domande frequenti

### Quali file di infrastruttura legge l'hook infra?

Terraform/HCL (.tf, .tf.json, .hcl), i Dockerfile e lo YAML dei workflow e delle action di GitHub Actions in .github/. Raggiunge quei file anche se gli scanner del sorgente li saltano.
