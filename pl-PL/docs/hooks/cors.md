# Hook cors: Audyt originów CORS

> Przeszukaj kod źródłowy pod kątem listy dozwolonych originów CORS, którą da się obejść, albo oceń z wiersza poleceń, czy pojedyncza wartość originu nie daje zbyt szerokiego dostępu.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/cors
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/cors
Ostatnia aktualizacja: 2026-11-09

Hook `cors` jest deterministycznym silnikiem stojącym za [specjalizacją `http-request`](https://lagune.ai/pl-PL/docs/catalog), a ty możesz go uruchomić samodzielnie. Jedno polecenie działa w dwóch trybach: w trybie **scan** przeszukuje kod źródłowy w poszukiwaniu **listy dozwolonych originów, którą da się obejść** (wyrażenia regularnego walidującego hosta, przez które prześlizguje się host atakującego), a w trybie **score** ocenia pojedynczą wartość **originu CORS** jako `wildcard`, `null` lub `safe`.

## Skanowanie bazy kodu

Bez żadnej opcji przeszukuje cały projekt.

**Cały projekt**

```bash
npx lagune read cors
```

**Folder**

```bash
npx lagune read cors --dir src/server
```

**Pojedynczy plik**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Wypisuje każdą listę dozwolonych originów, którą da się obejść, pod jednym nagłówkiem, z podziałem na pliki. Walidator hosta, w którym `.+`/`.*` stoi w części authority przed sufiksem zaufanego hosta (`^https?://.+\.trusted\.com`), przepuszcza host atakującego, taki jak `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

To wskazówka do przeglądu, a nie zamknięte ustalenie: z samego tekstu nie da się rozstrzygnąć, czy wyrażenie regularne strzeże rzeczywistej decyzji o zaufaniu, więc skanowanie nigdy nie zmienia kodu wyjścia. Przejrzyj każde trafienie i upewnij się, że lista dozwolonych porównuje origin na zasadzie pełnej równości. Gdy nic nie znajdzie, wypisuje jeden wiersz.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Ocena originu

Podaj każdy origin w opcji `--origin`. Hook wypisuje jedno słowo na każdy origin i kończy działanie z niezerowym kodem wyjścia przy każdym `wildcard` lub `null`.

**Jeden origin**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Kilka originów**

Powtórz opcję `--origin`, aby jednym wywołaniem ocenić całą listę dozwolonych, po jednym werdykcie na wiersz, w tej samej kolejności.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Werdykt    | Znaczenie                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `safe`     | Nie jest to `*`, `null` ani glob z `*`. Nie gwarantuje to poprawnie zbudowanego originu.                  |
| `wildcard` | `*` albo glob subdomeny, hosta lub portu: odpowiedź może odczytać dowolna strona (lub szeroki ich zbiór). |
| `null`     | Origin `null`, który mogą sfałszować ramki iframe w piaskownicy i przekierowania.                         |

Tylko `safe` oznacza zezwolenie, a opcja `--origin` to wyrocznia wartości: ocenia wartość, a nie handler, więc handler sprawdź za pomocą specjalizacji `http-request`.

### Opcje CLI

| Opcja      | Wartość | Opis                                                                                |
| ---------- | ------- | ----------------------------------------------------------------------------------- |
| `--origin` | origin  | Ocenia jedną wartość originu. Powtórz opcję, aby ocenić kilka, po jednej na wiersz. |
| `--dir`    | folder  | Zawęża skanowanie do folderu. Można ją powtarzać i łączyć z `--file`.               |
| `--file`   | plik    | Zawęża skanowanie do jednego pliku. Można ją powtarzać i łączyć z `--dir`.          |

Bez żadnej opcji przeszukuje cały projekt. Opcja `--origin` włącza tryb score i nie można jej łączyć z `--dir` ani `--file`.

### Wybierz, co przeszukuje

Pomija to, co **Git** ignoruje. Aby pominąć więcej albo przeszukać to, co **Git** ignoruje, nadaj hookowi `cors` własne ustawienia:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Wszystkie ustawienia opisuje strona [Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure).

**Czego nie obejmuje**

Skanowanie rozpoznaje kształt **wyrażenia regularnego, które da się obejść**, a opcja `--origin` ocenia **wartości** originów. Dwa wzorce na poziomie kodu źródłowego pozostają poza ich zasięgiem: odbijanie nagłówka `Origin` z żądania (serwer odsyła przychodzący `Origin` z powrotem albo łączy go z danymi uwierzytelniającymi) oraz zbyt liberalna lista dozwolonych oparta na `endsWith` lub dopasowaniu podciągu. Rozpoznaj je w kodzie i postępuj z nimi tak, jak opisuje [specjalizacja `http-request`](https://lagune.ai/pl-PL/docs/catalog).

## Najczęściej zadawane pytania

### Dlaczego origin null w CORS jest niebezpieczny?

Ramki iframe w piaskownicy i niektóre przekierowania wysyłają Origin: null, więc lista dozwolonych, która ufa null, daje tym kontekstom dostęp do odczytu. Hook cors zgłasza to razem z wildcardem.

### Jak wykryć listę dozwolonych originów CORS, którą da się obejść?

Uruchom npx lagune read cors na bazie kodu. Hook zgłasza wyrażenie regularne walidujące hosta, którego zachłanny wildcard stoi przed zaufanym sufiksem, przez co host atakującego, taki jak your-site.com.attacker.com, prześlizguje się przez walidację.
