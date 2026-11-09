# Hook regex: Wykrywanie wzorców podatnych na ReDoS

> Przeszukuj bazę kodu pod kątem wyrażeń regularnych podatnych na ReDoS albo oceniaj pojedynczy wzorzec z wiersza poleceń.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/regex
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/regex
Ostatnia aktualizacja: 2026-11-09

Hook `regex` to deterministyczny silnik bezpieczeństwa wyrażeń regularnych, z którego korzysta [specjalizacja `regex`](https://lagune.ai/pl-PL/docs/catalog), i możesz uruchomić go samodzielnie. Jedno polecenie działa w dwóch trybach: **scan** przeszukuje bazę kodu pod kątem wzorców podatnych na **ReDoS** i budowanych w czasie działania, a **check** ocenia pojedynczy wzorzec, który mu przekażesz.

## Przeszukaj bazę kodu

Bez żadnej flagi hook przeszukuje cały projekt. Opcja `--dir` ogranicza skanowanie do folderu, a `--file` do jednego pliku. Obie można powtarzać i łączyć w jeden raport, w którym każdy plik pojawia się tylko raz, nawet jeśli obejmuje go więcej niż jeden cel.

**Cały projekt**

```bash
npx lagune read regex
```

**Folder**

```bash
npx lagune read regex --dir src/services
```

**Jeden plik**

```bash
npx lagune read regex --file bin/import.pl
```

**Kilka celów**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Z limitem**

`--limit` ustawia próg ReDoS dla skanowania (domyślnie 25), czyli ten sam limit, który przyjmuje tryb check. Im niższy limit, tym surowsza ocena.

```bash
npx lagune read regex --dir src/services --limit 15
```

Wynik to zwykły tekst, którego nagłówki mówią, jak czytać każdą sekcję. Sekcja pojawia się tylko wtedy, gdy zawiera ustalenia.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Gdy nic nie znajdzie, hook wypisuje jedną linię.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### Jak odczytać sekcje

| Sekcja                                                                                      | Znaczenie                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | Wzorce podatne na ReDoS, pogrupowane według plików, każdy wzorzec z wcięciem pod nazwą pliku, a za nim w nawiasie powód, dla którego jest niebezpieczny, oraz, jeśli je ma, jego zakres i flagi. Każda linia jest niebezpieczna, więc werdykt się nie powtarza. |
| `Regular expressions the analysis could not settle (review manually)`                       | Wzorce, których analiza nie zdołała rozstrzygnąć w ramach swojego limitu pracy, wypisane w ten sam sposób.                                                                                                                                                      |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Pliki, które budują wyrażenie regularne ze zmiennej, konkatenacji lub interpolacji.                                                                                                                                                                             |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Pliki, które przekazują zwykły literał tekstowy do konstruktora wyrażenia regularnego tam, gdzie literał wyrażenia regularnego jest prostszy i pozwala uniknąć kompilacji w czasie działania.                                                                   |

Pierwsza sekcja to ustalenie bezpieczeństwa. Druga i trzecia same w sobie nie są ustaleniami: wskazują kod, którego statyczne sprawdzenie nie rozstrzygnie, więc wymagają, aby przeczytał go człowiek. Czwarta to wskazówka dotycząca czytelności, a nie ustalenie bezpieczeństwa.

### Opcje CLI

| Opcja       | Wartość                      | Opis                                                                                                          |
| ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--pattern` | źródło wyrażenia regularnego | Sprawdza jeden wzorzec. Powtórz, aby sprawdzić kilka, po jednym werdykcie na wzorzec, w tej samej kolejności. |
| `--flags`   | flagi wyrażenia regularnego  | Sprawdza każdy `--pattern` z tymi flagami, na przykład `im`. Dotyczy tylko trybu check.                       |
| `--dir`     | folder                       | Ogranicza skanowanie do folderu. Można powtarzać i łączyć z `--file`.                                         |
| `--file`    | plik                         | Ogranicza skanowanie do jednego pliku. Można powtarzać i łączyć z `--dir`.                                    |
| `--limit`   | nieujemna liczba całkowita   | Ustawia limit powtórzeń ReDoS (domyślnie 25). Dotyczy obu trybów. Im niższy limit, tym surowsza ocena.        |

Bez żadnej opcji hook przeszukuje cały projekt. Opcja `--pattern` uruchamia tryb check i nie można jej łączyć z `--dir` ani `--file`.

### Wybierz, co hook przeszukuje

Hook pomija to, co ignoruje **Git**. Aby pominąć więcej albo przeszukać to, co ignoruje **Git**, nadaj hookowi `regex` własne ustawienia:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure) opisuje każde ustawienie.

### Obsługiwane języki

Skanowanie czyta poniższe języki, rozpoznając je po rozszerzeniu pliku, każdy według jego własnych reguł, więc wzorca z jednego języka nigdy nie testuje według reguł innego. Wszystko inne pomija, zamiast skanować według niewłaściwych reguł.

| #   | Język                       | Rozszerzenia                                                                                                 |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Staranny, ale niewyczerpujący**

Hook czyta kod źródłowy jako tekst, więc nie oceni wzorca składanego w czasie działania, a wzorzec rozbity na kilka linii, ukryty za aliasem lub zapisany w formie, której nie rozpoznaje, może się prześlizgnąć. Traktuj sekcje jako solidny punkt wyjścia, a nie pełny spis, i nadal czytaj kod, aby wychwycić to, czego one nie obejmują.

## Sprawdź pojedynczy wzorzec

Przekaż źródło wzorca w opcji `--pattern`, aby go ocenić. Hook wypisuje jedno słowo: `safe`, `unsafe`, `undetermined`, gdy analiza osiągnie limit pracy, zanim rozstrzygnie wzorzec, albo `invalid regex`. Powtórz `--pattern`, aby ocenić kilka wzorców naraz, po jednym werdykcie na wzorzec, w tej samej kolejności.

**Jeden wzorzec**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Kilka wzorców**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Z flagami**

`--flags` sprawdza każdy `--pattern` w wywołaniu z flagami, z którymi wzorzec jest uruchamiany, bo flaga zmienia, które znaki wzorzec dopasowuje.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Z limitem**

`--limit` ustawia limit powtórzeń (domyślnie 25) i dotyczy każdego `--pattern` w wywołaniu. Im niższy limit, tym surowsza ocena.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Dlaczego argument w cudzysłowie**

Każdy wzorzec trafia do hooka jako wartość flagi i nigdy nie jest wstawiany do polecenia. Wartość z cudzysłowami lub backtickami pozostaje nieszkodliwa i nie może niczego wstrzyknąć do powłoki. Zawsze ujmuj wzorzec w apostrofy, aby powłoka nie rozwinęła go wcześniej.

**Wskazówka**

To ten sam silnik, którego używa [specjalizacja `regex`](https://lagune.ai/pl-PL/docs/catalog): skanowanie otwiera przegląd pod kątem ReDoS, a sprawdzenie potwierdza wzorzec, który ten przegląd wychwyci.

## Najczęściej zadawane pytania

### Jak sprawdzić regex pod kątem ReDoS z poziomu CLI?

Uruchom npx lagune read regex --pattern '<pattern>'. Polecenie zwraca safe, unsafe, undetermined lub invalid regex.

### Jak przeskanować cały projekt w poszukiwaniu niebezpiecznych regexów?

Uruchom hook regex w trybie scan na całej bazie kodu. Zgłasza wzorce podatne na ReDoS w 25 obsługiwanych językach.
