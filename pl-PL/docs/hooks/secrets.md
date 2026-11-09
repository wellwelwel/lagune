# Hook secrets: Wykrywanie sekretów zapisanych na sztywno w kodzie

> Przeszukuj bazę kodu z wiersza poleceń pod kątem danych uwierzytelniających zapisanych na sztywno w kodzie.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/secrets
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/secrets
Ostatnia aktualizacja: 2026-11-09

Hook `secrets` zgłasza **dane uwierzytelniające wkompilowane w kod źródłowy**, a nie odczytywane ze środowiska. Opiera się na **pochodzeniu** wartości (literał czy odczyt ze środowiska), a nie na jej zawartości, więc nie potrzebuje wyczerpującej listy prefiksów dostawców i prawie nie zgłasza fałszywych alarmów. To deterministyczny silnik stojący za [specjalizacją `secrets`](https://lagune.ai/pl-PL/docs/catalog).

Sygnatury w formatach dostawców, dane uwierzytelniające w ciągach połączenia i literał przypisany do identyfikatora o nazwie wskazującej na sekret są **niezależne od języka**: ten sam ciąg znaków znaczy to samo w każdym pliku. Dwie heurystyki zależne od składni, czyli odczyt ze środowiska z wartością domyślną zapisaną na sztywno w kodzie i sekret trafiający do sinka logów, **rozpoznają język**, więc hook nigdy nie szuka `console.log` z JavaScriptu w pliku Rusta, a `os.getenv("X", "default")` z Pythona rozpoznaje według reguł tego języka.

## Uruchamianie

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

Skanowanie wypisuje maksymalnie dwie sekcje. **Hardcoded secrets found** to zbiór ustaleń (wartość domyślna zapisana na sztywno dla zmiennej środowiskowej o nazwie wskazującej na sekret, dane uwierzytelniające osadzone w ciągu połączenia lub wartość pasująca do starannie dobranego formatu dostawcy), więc hook kończy działanie z niezerowym kodem wyjścia. **Secret handling to review manually** to zbiór tropów: zwykły literał przypisany do identyfikatora o nazwie wskazującej na sekret (jego pochodzenie da się rozstrzygnąć, ale to, czy wartość jest prawdziwym sekretem, już nie) oraz wartość o nazwie wskazującej na sekret, która trafia do sinka logów lub odpowiedzi. Gdy nic nie znajdzie, hook wypisuje `no hardcoded secrets found`.

### Opcje CLI

| Opcja    | Wartość | Opis                                                                       |
| -------- | ------- | -------------------------------------------------------------------------- |
| `--dir`  | folder  | Ogranicza skanowanie do folderu. Można powtarzać i łączyć z `--file`.      |
| `--file` | plik    | Ogranicza skanowanie do jednego pliku. Można powtarzać i łączyć z `--dir`. |

Bez żadnej opcji hook przeszukuje cały projekt.

### Wybierz, co hook przeszukuje

Hook pomija to, co ignoruje **Git**. Aby pominąć więcej albo przeszukać to, co ignoruje **Git**, nadaj hookowi `secrets` własne ustawienia:

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

[Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure) opisuje każde ustawienie.

### Obsługiwane języki

Ustalenie dotyczące wartości domyślnej zmiennej środowiskowej i trop dotyczący sinka logów odczytują konstrukcje właściwe dla każdego języka, więc obejmują poniższe języki, a w pozostałych milczą. Pozostałe trzy sygnały działają na **każdym** pliku.

| Sygnał                                  | Języki                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Wartość domyślna zmiennej środowiskowej | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Sink logów lub odpowiedzi               | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Czy to nie narusza zasad?**

Nie. Wykrywanie formatu sekretu, aby ostrzec, że trafił do commita, to standardowa praktyka narzędzi defensywnych, ta sama operacja, którą wykonują gitleaks, trufflehog i funkcja push protection w GitHubie. Hook dostarcza sygnatury wykrywania (publiczne **formaty** tokenów), nigdy działający sekret, i audytuje oraz wyjaśnia, zamiast wykradać dane.

## Najczęściej zadawane pytania

### Jak hook secrets unika fałszywych alarmów?

Opiera się na pochodzeniu wartości, a nie na jej zawartości. Formaty o wysokiej pewności (tokeny dostawców, wartości domyślne zmiennych środowiskowych, ciągi połączenia) to ustalenia, przy których hook kończy działanie z niezerowym kodem wyjścia. Zwykły literał przypisany do identyfikatora o nazwie wskazującej na sekret to trop do potwierdzenia, a ten sam identyfikator odczytany z process.env w ogóle nie jest zgłaszany.
