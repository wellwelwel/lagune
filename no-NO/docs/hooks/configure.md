# Konfigurer hookene: Velg hva de skanner

> Velg hva hookene som skanner filer, utelater, for alle eller for én av dem.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/configure
Språk: no-NO
Original: https://lagune.ai/docs/hooks/configure
Sist oppdatert: 2026-11-09

Blokken `checkers` i `.lagune/configs.json` bestemmer hva hookene som skanner filer, utelater, for alle eller for én av dem.

## Konfigurer

Legg til eller fjern stier og mønstre fra kommandolinjen, og sett et mønster i anførselstegn, så skallet lar det stå slik det er skrevet:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

Eller velg dem under Settings i [dashbordet](https://lagune.ai/no-NO/docs/get-started/dashboard), eller angi dem i filen:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Innstillinger

| Nøkkel      | Verdi                                 | Standard | Beskrivelse                                                                            |
| ----------- | ------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `gitignore` | `true` eller `false`                  | `true`   | Utelater det **Git** ignorerer. En fil som **Git** sporer, skannes uansett.            |
| `ignore`    | stier eller mønstre fra prosjektroten | `[]`     | Utelater det hver oppføring treffer, og alt under den, også en fil som **Git** sporer. |

Øverst i `checkers` gjelder en nøkkel for alle kontroller. Under navnet på en kontroll gjelder den bare for den kontrollen og erstatter den felles nøkkelen, så i eksempelet skanner `secrets` det **Git** ignorerer, og utelater `test/fixtures` og `temp`. Når `write add --ignore` gir en kontroll dens første egne liste, starter listen som en kopi av den felles listen.

### Mønstre

Et mønster starter i prosjektroten, så `*.generated.ts` når bare filene der, mens `**/*.generated.ts` når dem på alle nivåer. Navn må stemme nøyaktig, også når det gjelder store og små bokstaver.

| Mønster             | Utelater                                       |
| ------------------- | ---------------------------------------------- |
| `dist`              | `dist` i prosjektroten                         |
| `packages/*/dist`   | `dist` i hver mappe under `packages`           |
| `**/dist`           | hver `dist`, på alle nivåer                    |
| `**/*.generated.ts` | hver fil der navnet slutter på `.generated.ts` |
| `fixture-?`         | `fixture-a`, `fixture-1` og lignende           |
| `[ab]-cache`        | `a-cache` og `b-cache`                         |
| `[*]x`              | `*x`, med en bokstavelig `*`                   |

## Slik leser du resultatet

Rapporten avsluttes med hvor mange stier gjennomgangen utelot, fordelt på hva som ignorerer dem:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

En sti du angir med `--dir` eller `--file`, skannes uansett hva innstillingene sier. En innstilling motoren ikke kan lese, stopper kontrollen med en feil som navngir den, for eksempel et mønster som starter med `!` eller et mellomrom, går ut av prosjektet, lar en hakeparentes stå åpen eller tar for lang tid å matche.

## Vanlige spørsmål

### Setter Lagune disse innstillingene for meg?

Nei. Fasen charter lister opp mappene som er committet, og som etter dens vurdering ikke er kode du skal forsvare, for eksempel testfixtures som er skrevet for å se sårbare ut, og registrerer bare dem du velger med nummer.

### Når bør en kontroll skanne det Git ignorerer?

Når du ikke har grunn til å stole på repositoryet, siden dets egne .gitignore-filer kan skjule kode, eller når en build-mappe kan inneholde en nøkkel som ble bygd inn ved bygging. Sett gitignore til false for alle kontroller eller for én av dem.
