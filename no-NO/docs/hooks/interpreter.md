# Hook interpreter: Flagg sinks for dynamisk kodekjøring

> Skann en kodebase etter sinks for dynamisk kodekjøring på tvers av språk, eller vurder ett enkelt kodeutdrag, rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/interpreter
Språk: no-NO
Original: https://lagune.ai/docs/hooks/interpreter
Sist oppdatert: 2026-11-09

Hooken `interpreter` flagger **sinks for dynamisk kodekjøring**: konstruksjoner som gjør data om til kode som kjører, eller sender dem videre til et skall, fra `eval` til native deserialisering. Den er språkbevisst og leser hver fil etter dens egne regler. Den er den deterministiske motoren bak [spesialiseringen `interpreter`](https://lagune.ai/no-NO/docs/catalog), og du kan kjøre hooken selv i modusen **scan** eller **check**.

## Kjør

**Skann kodebasen**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Sjekk et kodeutdrag**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Disse sinkene har dobbel bruk: Om input som en angriper kan påvirke, når en av dem, kan ikke en statisk gjennomgang avgjøre, så hvert treff er en **advarsel til gjennomsyn**, aldri et bekreftet funn. Gjennomgangen skriver ut én enkelt seksjon, **Dynamic-execution sinks to review**, gruppert etter fil. Finner den ingenting, skriver den ut `no dynamic-execution sinks found`.

**Les den flaggede koden, kjør den aldri!**

Vurder hver sink **statisk** ved å spore om ikke-klarert input når den. Kjør aldri den flaggede koden og send den aldri til `eval`, heller ikke kode den henter inn eksternt eller under kjøring, for å "teste" hva den gjør.

## Slik leser du konklusjonen

| Konklusjon | Betydning                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `careful`  | Kodeutdraget inneholder en sink for dynamisk kjøring i sitt språk. Gå gjennom den ved å lese den, aldri ved å kjøre den. |
| `safe`     | Ingen sink for dynamisk kjøring ble funnet for det angitte språket.                                                      |

### CLI-alternativer

| Alternativ  | Verdi         | Beskrivelse                                                                                            |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `--pattern` | et kodeutdrag | Sjekk ett kodeutdrag. Gjenta for å sjekke flere, én konklusjon per linje.                              |
| `--lang`    | et språk      | Påkrevd med `--pattern`: ett av javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp. |
| `--dir`     | en mappe      | Avgrens gjennomgangen til en mappe. Kan gjentas og kombineres med `--file`.                            |
| `--file`    | en fil        | Avgrens gjennomgangen til én fil. Kan gjentas og kombineres med `--dir`.                               |

Uten alternativer skanner den hele prosjektet. `--pattern` krever `--lang` og kan ikke kombineres med `--dir` eller `--file`.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `interpreter` egne innstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) dekker alle innstillingene.

### Støttede språk

Gjennomgangen leser disse språkene, gjenkjent etter filendelse, og sjekker hvert av dem mot sitt eget sett med sinks for dynamisk kjøring.

| #   | Språk                       | Filendelser                                                                                                  | Sinks den flagger                                                                                                                                                                                                                     |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, Function-konstruktøren, `setTimeout`/`setInterval` med en streng som kropp, modulen `vm`, exec i `child_process`, dynamisk `require()`, dynamisk `import()`                                                                 |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` `shell=True`, `pickle.load`/`loads`, `yaml.load` (usikker)                                                                                                        |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval-familien (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, backticks eller `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                      |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                   |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` på en streng, `create_function()`, skallkjøring (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` med en sti satt sammen under kjøring |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                    |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                      |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | JVM-sinkene: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                         |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                   |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, familien `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                              |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, familien `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                              |

**Etter beste evne, ikke uttømmende**

Den leser kildekoden som tekst, så en sink som settes sammen under kjøring, skjules bak et alias eller skrives i en form den ikke kjenner igjen, kan slippe gjennom. Se på tabellen som et solid utgangspunkt, ikke som en fullstendig oversikt.

**Tips**

Hooken garanterer minimumet (at disse sinkene finnes, og hvor): Om en ikke-klarert verdi faktisk når en av dem, er vurderingen som [spesialiseringen `interpreter`](https://lagune.ai/no-NO/docs/catalog) dekker.

## Vanlige spørsmål

### Bekrefter hooken interpreter en sårbarhet?

Nei. Den flagger sinks for dynamisk kjøring som en advarsel til gjennomsyn, aldri som et bekreftet funn, fordi en statisk gjennomgang ikke kan avgjøre om input som en angriper kan påvirke, når sinken.

### Hvilke språk dekker hooken interpreter?

Den leser språkene i tabellen "Støttede språk", gjenkjent etter filendelse, og sjekker hvert av dem mot sitt eget sett med sinks. Andre språk gir ingen sinks.
