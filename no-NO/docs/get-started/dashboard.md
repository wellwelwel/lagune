# Dashbord

> Se sikkerhetsprinsippene, funnene og katalogen til prosjektet ditt i en lokal live-visning som åpnes med én kommando.

Kanonisk URL: https://lagune.ai/no-NO/docs/get-started/dashboard
Språk: no-NO
Original: https://lagune.ai/docs/get-started/dashboard
Sist oppdatert: 2026-11-09

Kjør **Lagune** direkte uten underkommando for å få en interaktiv live-visning av `.lagune/`. Kommandoen starter et dashbord og åpner det på en tilfeldig port:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Privat** og **lokalt**
- [x] Viser alt `.lagune/` inneholder, fra de første sikkerhetsprinsippene og utover
- [x] **Administrer** kategoriene til prosjektet og hva hookene skanner, rett fra nettleseren din
- [x] Verken `node_modules` eller `package.json` er nødvendig 📦

![Sikkerhetsprinsipper i dashbordet til Lagune](https://lagune.ai/img/dashboard/02.webp)

![Funn i dashbordet til Lagune](https://lagune.ai/img/dashboard/03.webp)

![Sideoppdrag i dashbordet til Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detaljvisning av et funn i dashbordet til Lagune](https://lagune.ai/img/dashboard/05.webp)

![Katalogen i dashbordet til Lagune](https://lagune.ai/img/dashboard/06.webp)

**Tips**

- 🚪 Bruk `--port` for å angi en egen port.
- ⏏️ Trykk `Ctrl+C` for å stoppe.

## Vanlige spørsmål

### Hvordan åpner jeg dashbordet til Lagune?

Kjør npx lagune uten underkommando i rotmappen til prosjektet ditt. Kommandoen viser .lagune/ live på en tilfeldig port og åpner visningen i nettleseren din.

### Er dashbordet privat?

Ja. Det kjører bare på din egen maskin, på en lokal adresse som ingen andre datamaskiner kan nå.

### Kan jeg endre prosjektet mitt fra dashbordet?

Bare kategoriene og hva hookene utelater, fra nettleseren din. Alt annet dashbordet viser, er skrivebeskyttet.
