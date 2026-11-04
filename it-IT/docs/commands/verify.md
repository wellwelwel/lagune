# /lagune-verify: dimostra che i controlli di sicurezza reggono

> Dimostra che ogni correzione applicata regge, poi chiudi quelle che reggono.

Canonico: https://lagune.ai/it-IT/docs/commands/verify
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/verify
Ultimo aggiornamento: 2026-11-04

⚖️ Dimostra che ogni correzione applicata regge, leggendo il codice e confrontandolo con ciò che harden ha registrato, poi chiudi quelle che reggono.

## Come usarlo

**Verifica tutto**

```prompt
/lagune-verify
```

**Indica i percorsi**

```prompt
/lagune-verify src/routes/upload.ts
```

**Per priorità**

```prompt
/lagune-verify priorità critica e alta
```

## Come funziona

Legge il codice in ogni punto registrato da harden e conferma che corrisponda davvero a quanto dichiarato. La prova è proprio quel confronto, codice contro registro. Ogni controllo riceve uno di tre verdetti:

| Verdetto                     | Significato                                               |
| ---------------------------- | --------------------------------------------------------- |
| ✅ Risk closed               | Il codice fa esattamente ciò che dichiara il registro.    |
| ❌ Risk not closed           | Il controllo è ancora aperto. Verify ti rimanda a harden. |
| ❓ Cannot tell from the code | L'evidenza non è visibile nel solo codice.                |

Un rischio dimostrato chiuso viene poi archiviato e tolto dalla catena, con la tua conferma. Per esempio:

- **Caricamento di file** (Verdetto: **✅ Risk closed**)
  - _Come è stato dimostrato:_ ha letto l'handler del caricamento e ha visto che rileva il tipo reale del file dal contenuto, impone un limite di dimensione e rifiuta tutto il resto, esattamente come dichiara il registro.
  - _Evidenza:_ la funzione `handleUpload`, che rileva il tipo reale del file dal contenuto.

Se il rischio non è chiuso, verify lo dice chiaramente e ti rimanda a [`/lagune-harden`](https://lagune.ai/it-IT/docs/commands/harden), perché la correzione è ancora aperta.

**Suggerimento**

- Si basa interamente sul registro di hardening.
- Legge il tuo codice solo per giudicarlo, e non indebolisce mai un controllo né riscrive il codice per far passare un verdetto.
- Eseguirlo di nuovo riconcilia i verdetti: quelli superati escono, e un rischio che non è più chiuso viene segnalato di nuovo.
- Quando un rischio è dimostrato chiuso, chiede una volta, poi rimuove quel rilievo da tutta la catena (detect, plan, harden e tracciamento).
- Non scrive alcun report proprio: ogni verdetto si trova nel blocco del suo controllo in `.lagune/memory/harden.md`, dove harden lo legge all'esecuzione successiva.

**Dipende da harden**

Verify si basa su [`/lagune-harden`](https://lagune.ai/it-IT/docs/commands/harden).

## Il ciclo si chiude

Quando tutto ciò che rientra nell'ambito è archiviato, il ciclo è a riposo. Si riapre solo quando il codice cambia. La sicurezza si può chiudere, quindi il flusso ha uno stato finale, non un ciclo infinito.

## Domande frequenti

### Come verifica Lagune una correzione?

/lagune-verify legge il codice e lo confronta con ciò che harden ha registrato, restituendo uno di tre verdetti: Risk closed, Risk not closed o Cannot tell from the code.

### Cosa significa archiviare un rilievo?

Quando verify dimostra che un rischio è chiuso, il rilievo viene archiviato: rimosso da tutta la catena, con la tua conferma, così smette di essere rielaborato.

### Il lavoro di sicurezza può mai dirsi concluso?

Sì. SDH si può chiudere: un rilievo dimostrato chiuso viene archiviato, quindi il flusso ha uno stato finale, non un ciclo infinito.
