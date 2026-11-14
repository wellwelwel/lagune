# Hook secrets: Oppdag hardkodede hemmeligheter

> Denne siden er utdatert sammenlignet med den engelske versjonen. [Les originalversjonen](https://lagune.ai/docs/hooks/secrets).

> Skann en kodebase etter hardkodede påloggingsdetaljer rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/secrets
Språk: no-NO
Original: https://lagune.ai/docs/hooks/secrets
Sist oppdatert: 2026-11-09

Hooken `secrets` flagger **påloggingsdetaljer som er skrevet rett inn i kildekoden** i stedet for å bli lest fra miljøet. Den ser på **opphav** (en literal eller et oppslag i miljøet), ikke på innholdet i verdien, så den trenger ingen uttømmende katalog over leverandørprefikser og gir nesten ingen falske positiver. Den er den deterministiske motoren bak [spesialiseringen `secrets`](https://lagune.ai/no-NO/docs/catalog).

Signaturer i formatet til en leverandør, påloggingsdetaljer i tilkoblingsstrenger og en literal som er bundet til en identifikator med et navn som tyder på en hemmelighet, er **språkuavhengige**: Den samme strengen leses likt i alle filer. De to heuristikkene som avhenger av syntaks, et miljøoppslag med en hardkodet standardverdi og en hemmelighet som flyter inn i en loggsink, er **språkbevisste**, så en `console.log` fra JavaScript blir aldri lest i en Rust-fil, og `os.getenv("X", "default")` fra Python blir gjenkjent på egne premisser.

## Kjør

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

Gjennomgangen skriver ut opptil to seksjoner. **Hardcoded secrets found** er funnene (en hardkodet standardverdi for en miljøvariabel med et navn som tyder på en hemmelighet, påloggingsdetaljer bygd inn i en tilkoblingsstreng, eller en verdi som passer et kuratert leverandørformat), så hooken avslutter med en exit-kode som ikke er null. **Secret handling to review manually** er spor å følge opp: en vanlig literal bundet til en identifikator med et navn som tyder på en hemmelighet (opphavet kan avgjøres, men ikke om verdien er en ekte hemmelighet), og en verdi med et navn som tyder på en hemmelighet, som flyter inn i en sink for logg eller respons. Finner den ingenting, skriver den ut `no hardcoded secrets found`.

### CLI-alternativer

| Alternativ | Verdi    | Beskrivelse                                                                 |
| ---------- | -------- | --------------------------------------------------------------------------- |
| `--dir`    | en mappe | Avgrens gjennomgangen til en mappe. Kan gjentas og kombineres med `--file`. |
| `--file`   | en fil   | Avgrens gjennomgangen til én fil. Kan gjentas og kombineres med `--dir`.    |

Uten alternativer skanner den hele prosjektet.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `secrets` egne innstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker secrets
```

```json
{
  "checkers": {
    "secrets": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) dekker alle innstillingene.

### Språkdekning

Funnet for standardverdier i miljøet og sporet for loggsinker leser et eget sett med former per språk, så de dekker språkene nedenfor og er stille ellers. De tre andre signalene kjører på **alle** filer.

| Signal                      | Språk                                                                           |
| --------------------------- | ------------------------------------------------------------------------------- |
| Standardverdi i miljøet     | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Sink for logg eller respons | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Bryter dette med retningslinjene?**

Nei. Å gjenkjenne formatet til en hemmelighet for å advare om at den er committet, er vanlig defensiv verktøybruk, den samme operasjonen som gitleaks, trufflehog og push protection i GitHub utfører. Hooken leverer gjenkjenningssignaturer (offentlige **formater** for tokens), aldri en ekte hemmelighet, og den reviderer og forklarer i stedet for å eksfiltrere data.

## Vanlige spørsmål

### Hvordan unngår hooken secrets falske positiver?

Den ser på opphav, ikke på innholdet i verdien. Formater med høy treffsikkerhet (leverandørtokens, standardverdier i miljøet, tilkoblingsstrenger) er funn som avslutter med en exit-kode som ikke er null. En vanlig literal bundet til en identifikator med et navn som tyder på en hemmelighet, er et spor du må bekrefte, og den samme identifikatoren lest fra process.env blir ikke flagget i det hele tatt.
