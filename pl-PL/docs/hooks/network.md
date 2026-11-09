# Hook network: Ocena adresów URL pod kątem SSRF

> Oceniaj jeden lub wiele adresów docelowych żądań pod kątem SSRF, prosto z wiersza poleceń.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/network
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/network
Ostatnia aktualizacja: 2026-11-09

Hook `network` rozstrzyga, czy adres docelowy żądania wysyłanego przez serwer jest bezpieczny pod kątem **SSRF** (żądania, które można skierować do usług wewnętrznych, metadanych chmury lub prywatnych hostów). To deterministyczny silnik stojący za [specjalizacją `network`](https://lagune.ai/pl-PL/docs/catalog), który możesz uruchomić samodzielnie.

## Uruchamianie

Przekaż każdy adres docelowy w opcji `--url`. Hook wypisuje po jednym słowie na adres, a ich znaczenie wyjaśnia tabela poniżej.

**Jeden adres**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Kilka adresów**

Powtórz `--url`, aby w jednym wywołaniu ocenić całą listę dozwolonych lub zabronionych, po jednym werdykcie w linii, w tej samej kolejności.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Hook odczytuje host tak, jak odczytuje go sieć, więc zakodowane zapisy adresu wewnętrznego się nie prześlizgną: zapis szesnastkowy, ósemkowy, dziesiętny bez kropek, skrócony, IPv6 i IPv4 mapowany na IPv6 dają wynik `private-target`. A tam, gdzie niedbały walidator i klient, który faktycznie pobiera dane, odczytałyby różne hosty, werdykt brzmi `parser-divergent`.

## Jak odczytać werdykt

| Werdykt            | Znaczenie                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `safe`             | Adres docelowy prowadzi do publicznego hosta, a niedbały walidator odczytałby ten sam host.      |
| `private-target`   | Host wskazuje na adres prywatny, loopback, link-local, nieokreślony lub adres metadanych chmury. |
| `parser-divergent` | Niedbały walidator tekstowy odczytałby inny rzeczywisty host niż ten, z którym łączy się klient. |
| `invalid url`      | Ciągu znaków nie da się sparsować jako URL, więc nie ma czego pobrać.                            |

Tylko `safe` oznacza zezwolenie. Wszystkie pozostałe werdykty, czyli `private-target`, `parser-divergent` i `invalid url`, traktuj jako blokadę.

### Opcje CLI

| Opcja   | Wartość            | Opis                                                                                      |
| ------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `--url` | adres URL lub host | Sprawdza jeden adres docelowy. Powtórz, aby sprawdzić kilka, po jednym werdykcie w linii. |

Wymagana jest co najmniej jedna opcja `--url`. Adres docelowy nigdy nie jest samodzielnym argumentem pozycyjnym, więc nie da się go pomylić z flagą.

**Dlaczego wartość flagi**

Każdy adres docelowy trafia do hooka jako wartość flagi i nigdy nie jest wstawiany do polecenia. Wartość z cudzysłowami lub backtickami pozostaje nieszkodliwa i nie może niczego wstrzyknąć do powłoki. Zawsze ujmuj ją w apostrofy, aby powłoka nie rozwinęła jej wcześniej.

**Czego nie obejmuje**

Hook jest czystą funkcją i nigdy nie odpytuje DNS, więc dwie luki, które pojawiają się dopiero w czasie działania, są poza zakresem: **DNS rebinding** (nazwa, która przy sprawdzaniu wskazuje na adres publiczny, a przy pobieraniu na wewnętrzny) i **łańcuchy przekierowań** (pierwszy skok, który przechodzi sprawdzenie, a potem przekierowuje do wewnątrz). Zamknij je, rozwiązując nazwę raz i łącząc się ze zweryfikowanym adresem oraz odrzucając przekierowania. Zarezerwowane nazwy loopback (`localhost` i rodzinę `.localhost`) hook bez odpytywania DNS uznaje za wewnętrzne, ale każda inna nazwa DNS daje `safe`, bo stwierdzenie, że wskazuje do wewnątrz, wymagałoby rozwiązania nazwy: takie nazwy chroni lista dozwolonych i to właśnie ją sprawdza ten hook.

**Wskazówka**

To ta sama kontrola, którą uruchamia [specjalizacja `network`](https://lagune.ai/pl-PL/docs/catalog), aby wykazać, że filtr adresów docelowych działa.

## Najczęściej zadawane pytania

### Jak sprawdzić adres URL pod kątem SSRF?

Uruchom hook network. Ocenia on adres docelowy żądania i zwraca safe, private-target, parser-divergent lub invalid url. Tylko safe oznacza zezwolenie.

### Co to jest URL typu parser-divergent?

Adres URL, który różne parsery odczytują inaczej, co jest klasycznym sposobem obejścia ochrony przed SSRF. Hook network zgłasza go, zamiast go przepuścić.
