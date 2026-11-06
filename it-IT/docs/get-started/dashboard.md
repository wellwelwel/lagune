# Dashboard

> Guarda il charter, i rilievi e il catalogo del tuo progetto in una vista locale in tempo reale che si apre con un solo comando.

Canonico: https://lagune.ai/it-IT/docs/get-started/dashboard
Lingua: it-IT
Originale: https://lagune.ai/docs/get-started/dashboard
Ultimo aggiornamento: 2026-11-06

Esegui **Lagune** direttamente, senza sottocomando, per una vista interattiva e in tempo reale di `.lagune/`. Serve una dashboard e la apre su una porta casuale:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Privata** e **locale**
- [x] Mostra qualunque cosa contenga `.lagune/`, a partire dal primo charter
- [x] **Gestisci** le categorie del progetto e cosa analizzano i suoi hook, direttamente dal browser
- [x] Non servono `node_modules` né `package.json` 📦

![Charter nella dashboard di Lagune](https://lagune.ai/img/dashboard/02.webp)

![Rilievi nella dashboard di Lagune](https://lagune.ai/img/dashboard/03.webp)

![Missioni secondarie nella dashboard di Lagune](https://lagune.ai/img/dashboard/04.webp)

![Dettaglio di un rilievo nella dashboard di Lagune](https://lagune.ai/img/dashboard/05.webp)

![Catalogo nella dashboard di Lagune](https://lagune.ai/img/dashboard/06.webp)

**Suggerimento**

- 🚪 Usa `--port` per indicare una porta personalizzata.
- ⏏️ Premi `Ctrl+C` per fermarla.

## Domande frequenti

### Come apro la dashboard di Lagune?

Esegui npx lagune senza sottocomando nella radice del tuo progetto. Serve una vista in tempo reale di .lagune/ su una porta casuale e la apre nel tuo browser.

### La dashboard è privata?

Sì. Gira solo sulla tua macchina, a un indirizzo locale che nessun altro computer può raggiungere.

### Posso modificare il mio progetto dalla dashboard?

Solo le sue categorie e cosa lasciano fuori i suoi hook, dal browser. Tutto il resto che la dashboard mostra è in sola lettura.
