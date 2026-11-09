# Dashboard

> Se dit projekts sikkerhedsprincipper, fund og katalog i en lokal livevisning, der åbner med én kommando.

Kanonisk URL: https://lagune.ai/da-DK/docs/get-started/dashboard
Sprog: da-DK
Original: https://lagune.ai/docs/get-started/dashboard
Sidst opdateret: 2026-11-09

Kør **Lagune** direkte uden underkommando for at få en interaktiv livevisning af `.lagune/`. Den starter et dashboard og åbner det på en tilfældig port:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Privat** og **lokalt**
- [x] Viser alt, hvad `.lagune/` indeholder, fra de første sikkerhedsprincipper og frem
- [x] **Administrér** projektets kategorier, og hvad dets hooks scanner, direkte fra din browser
- [x] Hverken `node_modules` eller `package.json` er nødvendig 📦

![Sikkerhedsprincipper i dashboardet for Lagune](https://lagune.ai/img/dashboard/02.webp)

![Fund i dashboardet for Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side quests i dashboardet for Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detaljevisning af et fund i dashboardet for Lagune](https://lagune.ai/img/dashboard/05.webp)

![Katalog i dashboardet for Lagune](https://lagune.ai/img/dashboard/06.webp)

**Tip**

- 🚪 Brug `--port` til at angive en bestemt port.
- ⏏️ Tryk på `Ctrl+C` for at stoppe.

## Ofte stillede spørgsmål

### Hvordan åbner jeg dashboardet i Lagune?

Kør npx lagune uden underkommando i roden af dit projekt. Den viser en livevisning af .lagune/ på en tilfældig port og åbner den i din browser.

### Er dashboardet privat?

Ja. Det kører kun på din egen maskine, på en lokal adresse, som ingen anden computer kan nå.

### Kan jeg ændre mit projekt fra dashboardet?

Kun dets kategorier, og hvad dets hooks udelader, fra din browser. Alt andet, dashboardet viser, kan kun læses.
