# Kategorie

> Kategorie specjalizacji, z których może korzystać projekt Lagune, od OWASP po utwardzanie dla konkretnych języków, takich jak JavaScript, Python, Go i Rust, oraz sposób ich zmiany.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/categories
Język: pl-PL
Oryginał: https://lagune.ai/docs/categories
Ostatnia aktualizacja: 2026-11-09

**Lagune** grupuje swoje wbudowane [**specjalizacje**](https://lagune.ai/pl-PL/docs/catalog) w **13 kategorii**. Kategorie, z których korzysta projekt, decydują o tym, które wbudowane specjalizacje trafią do jego [**katalogu**](https://lagune.ai/pl-PL/docs/catalog), i dzielą się na dwie grupy: to, co robi system, i to, w czym jest napisany.

Dopóki nie zapisano żadnej kategorii, projekt korzysta tylko z `owasp`. Polecenie [`/lagune-charter`](https://lagune.ai/pl-PL/docs/commands/charter) zapisuje każdą kategorię, którą uzasadnia jego analiza projektu, a ty w każdej chwili możesz je zmienić samodzielnie.

## Co robi system

| Kategoria      | Klucz     | Co utwardza                                                                                                                               |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`   | Ryzyka bezpieczeństwa aplikacji, które śledzi OWASP: wstrzykiwanie, błędna kontrola dostępu, błędy uwierzytelniania i kryptografii        |
| Infrastruktura | `infra`   | Konfiguracja kontenerów, obciążeń i usług serverless: Dockerfile, Compose, bezpieczeństwo podów, IAM i wyzwalacze FaaS                    |
| AI / LLM       | `ai`      | Integracje AI i LLM: ochrona przed prompt injection i niebezpiecznym podłączaniem narzędzi, agentów, mechanizmów retrieval i MCP          |
| Lovable        | `lovable` | Aplikacje Supabase generowane przez AI (Lovable i podobne): luki w RLS, wycieki kluczy `service_role` i niebezpieczne ustawienia domyślne |

## W czym jest napisany

| Kategoria  | Klucz        | Co utwardza                                                                                                                              |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE przez `eval` i `child_process`, path traversal i prototype pollution we wszystkich jego środowiskach uruchomieniowych                |
| Python     | `python`     | RCE przez deserializację `pickle` i YAML, string traversal przez `str.format` i class pollution                                          |
| Rust       | `rust`       | Niepoprawne (unsound) API z `unsafe`, nadużycia `transmute`, przepełnienia liczb całkowitych i niezdefiniowane zachowanie na granicy FFI |
| C / C++    | `c-cpp`      | Błędy ciągów formatujących, przepełnienia bufora i zapisy poza zakresem, które umożliwiają wykonanie kodu                                |
| PHP        | `php`        | Obejście uwierzytelniania przez type juggling, łańcuchy gadżetów do object injection i niebezpieczne domyślne ustawienia konfiguracji    |
| Go         | `go`         | Błędy interfejsów z typed nil, data races między gorutynami i niebezpieczna współbieżność na ścieżkach krytycznych dla bezpieczeństwa    |
| Java       | `java`       | Łańcuchy gadżetów przy deserializacji przez `ObjectInputStream`, które kończą się zdalnym wykonaniem kodu                                |
| Ruby       | `ruby`       | Łańcuchy gadżetów przy deserializacji przez `Marshal.load` i YAML, które prowadzą do zdalnego wykonania kodu                             |
| .NET / C#  | `dotnet`     | RCE przez deserializację `BinaryFormatter` i obejścia enkoderów, które prowadzą do XSS                                                   |

**Wskazówka**

**Lagune** działa z każdym językiem: cały przepływ pracy czyta projekt, w czymkolwiek jest napisany, a te kategorie tylko pogłębiają analizę pułapek typowych dla jednego języka.

## Dodawaj i usuwaj w każdej chwili

Kategoria to punkt wyjścia, a nie zobowiązanie. Używaj tych, które pasują do projektu teraz, i zmieniaj je w każdej chwili po kluczu, poleceniami `write add` i `write remove`. Opcja `--categories` bez wartości otwiera w terminalu interaktywny wybór (spacja zaznacza, Enter zatwierdza, pusty wybór pomija). Poza terminalem podaj kategorie zaraz po tej opcji.

**Dodaj**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Usuń**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

Pierwsze wywołanie `write add` lub `write remove` wychodzi od `owasp`, więc usunięcie wszystkich kategorii zostawia pustą listę, nigdy wartość domyślną. Każda zmiana trafia do pliku `.lagune/configs.json`, dzięki czemu cały zespół pracuje z tym samym zestawem.

## Sprawdź, z czego korzysta projekt

Polecenie `read list --categories` pokazuje każdą kategorię i to, czy projekt z niej korzysta:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Jakie specjalizacje zawiera każda kategoria, sprawdzisz w [**Katalogu**](https://lagune.ai/pl-PL/docs/catalog). Twoje własne specjalizacje, napisane poleceniem [`/lagune-specialize`](https://lagune.ai/pl-PL/docs/commands/specialize), trafiają do katalogu niezależnie od kategorii.

## Najczęściej zadawane pytania

### Jak dodać kategorię?

Przekaż klucz kategorii do opcji --categories, na przykład npx lagune write add --categories javascript. Dopóki nie zapisano żadnej kategorii, faza charter również zapisuje te, które uzasadnia jej analiza projektu.

### Czy mogę używać więcej niż jednej kategorii?

Tak. Wymień je w tym samym wierszu, jedną po drugiej.

### Jaką kategorię wybrać dla projektu?

Zacznij od owasp, czyli kategorii domyślnej, a potem dodaj tę dla swojego języka lub stosu. Specjalizacje ładują się tylko na żądanie, więc kategoria nic nie kosztuje, dopóki któraś faza nie będzie potrzebować jednej z jej specjalizacji.
