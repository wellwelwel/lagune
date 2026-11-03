# Installa Lagune su Pi come pacchetto

> Installa Lagune su Pi come pacchetto, da npm o da GitHub, e tienilo aggiornato.

Canonico: https://lagune.ai/it-IT/docs/install/pi
Lingua: it-IT
Originale: https://lagune.ai/docs/install/pi
Ultimo aggiornamento: 2026-11-03

**npm**

Installa il pacchetto dal terminale:

```bash
pi install npm:lagune
```

**GitHub**

Installa l'ultimo commit da **GitHub**, che esegue il motore tramite **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Aggiornamento

**npm**

Per aggiornare **Lagune**, esegui:

```bash
pi update npm:lagune
```

**GitHub**

Per aggiornare **Lagune**, esegui:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` aggiorna tutti i pacchetti che hai installato, mentre `pi update` da solo aggiorna soltanto **Pi**.

## Comandi

Digita i comandi con il prefisso `skill:`, come `/skill:lagune-charter` per `/lagune-charter`.

## Domande frequenti

### Come installo Lagune su Pi?

Esegui pi install npm:lagune, oppure pi install git:github.com/wellwelwel/lagune per l'ultimo commit da GitHub.

### Come aggiorno Lagune su Pi?

Esegui pi update npm:lagune, oppure pi update git:github.com/wellwelwel/lagune per un'installazione da GitHub. pi update --extensions aggiorna tutti i pacchetti che hai installato.

### Come eseguo i comandi di Lagune su Pi?

Digitali con il prefisso skill:, come /skill:lagune-charter.
