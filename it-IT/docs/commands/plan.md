# /lagune-plan: valuta i rilievi e pianifica le correzioni

> Trasforma ciò che detect ha trovato in un piano di difesa, valutando ogni rilievo con una categoria e un punteggio CVSS v4.0 e abbinandolo a una correzione.

Canonico: https://lagune.ai/it-IT/docs/commands/plan
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/plan
Ultimo aggiornamento: 2026-11-05

🛡️ Trasforma ciò che detect ha trovato in un piano di difesa: valuta ogni rilievo con una categoria e un punteggio CVSS v4.0, poi abbinalo alla correzione da applicare.

## Come usarlo

**Pianifica tutto**

```prompt
/lagune-plan
```

**Indica i percorsi**

```prompt
/lagune-plan src/routes/upload.ts
```

**Concentrati su un timore**

```prompt
/lagune-plan dove potrebbero trapelare dati sensibili
```

## Come funziona

Questa fase riprende da detect. Detect ha già trovato cosa fa il tuo sistema e il rischio che ogni cosa comporta, quindi il piano non ripete il rischio: ne valuta la gravità e decide cosa fare. Plan non legge mai il codice, e questo obbliga ogni correzione a puntare a qualcosa che detect ha davvero rilevato. Valuta ogni rilievo con il metodo CVSS v4.0: una categoria, un vettore CVSS v4.0 ragionato a partire da ciò che detect e il charter hanno raccolto e calcolato dall'[hook `cvss`](https://lagune.ai/it-IT/docs/hooks/cvss), e la fascia di priorità in cui cade quel punteggio. Ogni correzione indica anche il principio del charter che rispetta.

Per esempio:

- **Caricamento di file** (Priorità: **Critical**)
  - _Categoria:_ caricamento di file senza restrizioni (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Perché questa priorità:_ chiunque può raggiungere il caricamento via internet, e si trova sul server che conserva i file dei clienti.
  - _Rispetta:_ III. Ogni input è non attendibile finché non viene validato.
  - _Correzione:_ controllare il tipo reale e la dimensione del file, rinominarlo al salvataggio e conservare i caricamenti dove non possono essere eseguiti come codice.

Da lì hai un elenco di correzioni valutate e con priorità, ognuna legata a un rilievo e pronta per essere applicata nella fase successiva. Il punteggio viene calcolato, mai stimato: il vettore riporta l'esposizione e la posta in gioco del progetto come metriche Environmental, e chiunque può incollarlo nel calcolatore di FIRST o del NVD e ricavare lo stesso punteggio.

**Suggerimento**

- Si basa interamente su detect. Se un file o un timore non è mai stato mappato, ti dice di eseguire prima `/lagune-detect` su di esso.
- Eseguirlo di nuovo aggiorna il piano: le correzioni completate escono, quelle nuove entrano.
- Il piano di difesa si trova in `.lagune/memory/plan.md`.

**Dipende da detect**

Plan lavora solo su ciò che [`/lagune-detect`](https://lagune.ai/it-IT/docs/commands/detect) ha già mappato, quindi esegui prima detect.

## Passo successivo

Applica il piano: [`/lagune-harden`](https://lagune.ai/it-IT/docs/commands/harden).

## Domande frequenti

### Come assegna Lagune la priorità alle vulnerabilità?

/lagune-plan valuta ogni rilievo con una categoria e un punteggio CVSS v4.0 calcolato dall'hook cvss, poi lo abbina alla correzione da applicare.

### Lagune usa CVSS v4.0?

Sì. Ogni rilievo riceve un vettore e un punteggio CVSS v4.0, calcolati dall'hook cvss con la stessa aritmetica del calcolatore di FIRST, così chiunque può incollarvi il vettore e ricavare di nuovo il punteggio.

### Il piano legge il mio codice?

No. Plan non legge mai il codice, e questo obbliga ogni correzione a puntare a qualcosa che detect ha davvero rilevato.
