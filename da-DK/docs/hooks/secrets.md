# Hook secrets: find hardcodede secrets

> Gennemsøg en kodebase for hardcodede loginoplysninger fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/secrets
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/secrets
Sidst opdateret: 2026-11-09

Hooken `secrets` markerer **loginoplysninger, der er kompileret ind i kildekoden** i stedet for at blive læst fra miljøet. Den tager udgangspunkt i **oprindelsen** (en literal frem for et opslag i miljøet), ikke i værdiens indhold, så den behøver intet udtømmende katalog over udbyderpræfikser og giver næsten ingen falske positiver. Den er den deterministiske motor bag [specialiseringen `secrets`](https://lagune.ai/da-DK/docs/catalog).

Signaturer i udbydernes formater, loginoplysninger i forbindelsesstrenge og en literal, der er bundet til en identifikator med et secret-navn, er **sprogneutrale**: den samme streng læses ens i enhver fil. De to heuristikker, der afhænger af syntaksen, et opslag i miljøet med en hardcodet standardværdi og en secret, der flyder ind i en log-sink, er **sprogbevidste**, så et JavaScript-`console.log` aldrig læses i en Rust-fil, og Pythons `os.getenv("X", "default")` ses for sig selv.

## Kørsel

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

Scanningen udskriver op til to afsnit. **Hardcoded secrets found** er sættet af fund (en hardcodet standardværdi for en miljøvariabel med et secret-navn, en loginoplysning indlejret i en forbindelsesstreng eller en værdi, der matcher et udvalgt udbyderformat), så hooken afslutter med en kode forskellig fra nul. **Secret handling to review manually** er et sæt spor: en almindelig literal bundet til en identifikator med et secret-navn (dens oprindelse kan afgøres, men ikke om værdien er en rigtig secret) og en værdi med et secret-navn, der flyder ind i en log- eller svar-sink. En ren kørsel udskriver `no hardcoded secrets found`.

### CLI-indstillinger

| Indstilling | Værdi    | Beskrivelse                                                                    |
| ----------- | -------- | ------------------------------------------------------------------------------ |
| `--dir`     | en mappe | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.     |
| `--file`    | en fil   | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`. |

Uden indstillinger scanner den hele projektet.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `secrets` sine egne indstillinger:

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

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

### Sprogdækning

Fundet med en standardværdi i miljøet og sporet med en log-sink læser et sæt former pr. sprog, så de dækker sprogene nedenfor og er tavse andre steder. De tre andre signaler kører på **hver** fil.

| Signal                  | Sprog                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Standardværdi i miljøet | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Log- eller svar-sink    | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Er det et problem i forhold til politikker?**

Nej. At genkende en secrets format for at advare om, at den er blevet committet, er almindeligt defensivt værktøj, den samme operation som gitleaks, trufflehog og push protection i GitHub udfører. Hooken leverer signaturer til detektion (offentlige **formater** for tokens), aldrig en aktiv secret, og den gennemgår og forklarer i stedet for at eksfiltrere.

## Ofte stillede spørgsmål

### Hvordan undgår hooken secrets falske positiver?

Den tager udgangspunkt i oprindelsen, ikke i værdiens indhold. Formater med høj sikkerhed (udbydertokens, standardværdier i miljøet, forbindelsesstrenge) er fund, der afslutter med en kode forskellig fra nul. En almindelig literal bundet til en identifikator med et secret-navn er et spor, der skal bekræftes, og den samme identifikator læst fra process.env bliver slet ikke markeret.
