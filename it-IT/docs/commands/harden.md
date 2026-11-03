# /lagune-harden: applica le correzioni di sicurezza al tuo codice

> Applica al tuo codice le correzioni del piano, in sicurezza e una alla volta.

Canonico: https://lagune.ai/it-IT/docs/commands/harden
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/harden
Ultimo aggiornamento: 2026-11-03

🔧 Applica al tuo codice le correzioni del piano, in sicurezza e una alla volta.

## Come usarlo

**Applica tutto**

```prompt
/lagune-harden
```

**Indica i percorsi**

```prompt
/lagune-harden src/routes/upload.ts
```

**Per priorità**

```prompt
/lagune-harden priorità critica e alta
```

## Come funziona

Il piano ha già deciso ogni correzione, quindi harden si limita ad applicarla. Dato che è l'unica fase che tocca il tuo codice, procede con cautela: applica una correzione alla volta perché ogni modifica resti facile da rivedere, e non indebolisce mai un controllo per far quadrare una correzione. Per esempio, la correzione del caricamento:

- **Caricamento di file** (Stato: **Applied**)
  - _Cosa è cambiato:_ controlla il tipo reale e la dimensione del file, rifiuta tutto ciò che è inatteso, lo rinomina al salvataggio e lo conserva dove non può essere eseguito come codice.
  - _Dove:_ la funzione `handleUpload`, più l'helper di archiviazione che richiama.

Se una correzione non può essere applicata del tutto, harden fa ciò che può in sicurezza e segna il resto come **Partial** o **Blocked**, lasciandolo aperto.

**Applicata non significa verificata**

Applied non significa ancora dimostrata. È a questo che serve [verify](https://lagune.ai/it-IT/docs/commands/verify).

**Suggerimento**

- Si basa interamente sul piano. Se una correzione o un file non è mai stato pianificato, ti dice di eseguire prima `/lagune-plan` su di esso.
- Eseguirlo di nuovo riconcilia il registro: le modifiche annullate escono, le correzioni appena applicate entrano.
- Il registro di hardening si trova in `.lagune/memory/harden.md`.

**Dipende da plan e modifica il tuo codice**

Harden si basa su [`/lagune-plan`](https://lagune.ai/it-IT/docs/commands/plan). È l'unica fase che modifica il tuo codice.

## Passo successivo

Dimostra che ogni correzione regge: [`/lagune-verify`](https://lagune.ai/it-IT/docs/commands/verify).

## Domande frequenti

### /lagune-harden modifica il mio codice?

Sì. È l'unica fase che tocca il tuo codice, applicando le correzioni del piano una alla volta.

### Cosa significano Applied, Partial e Blocked?

Sono gli stati che Lagune registra per ogni correzione. Applied significa che la correzione è stata fatta, Partial che ne è stata fatta solo una parte, Blocked che non è stato possibile applicarla. Applied non significa ancora dimostrata.

### Lagune applica le correzioni senza chiedere?

Se una modifica richiede la tua approvazione lo decidono il tuo agente e la modalità di permessi in cui lo esegui, non Lagune, che non aggiunge alcun passaggio di conferma proprio. In ogni caso non indebolisce mai un controllo per soddisfare una correzione, e se una correzione entrasse in conflitto con una regola del charter, si ferma e te lo dice prima.
