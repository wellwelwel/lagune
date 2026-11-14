# Katalog: Specjalizacje bezpieczeństwa na żądanie

> Ta strona jest nieaktualna w porównaniu z wersją angielską. [Przeczytaj wersję oryginalną](https://lagune.ai/docs/catalog).

> Jak ładowane są specjalizacje z katalogu twojego projektu: na żądanie przez fazę albo bezpośrednio przez ciebie.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/catalog
Język: pl-PL
Oryginał: https://lagune.ai/docs/catalog
Ostatnia aktualizacja: 2026-11-09

🧠 Specjalizacje **Lagune** to skupione na jednym zagadnieniu, niezależne od języka programowania moduły wiedzy o bezpieczeństwie, ładowane tylko na żądanie, nigdy domyślnie. Nie są poleceniami. Katalog twojego projektu to zestaw, z którego projekt korzysta: wbudowane specjalizacje jego [kategorii](https://lagune.ai/pl-PL/docs/categories) oraz jego własne. Fazy detect i verify sięgają po nie w trakcie działania, a ty możesz w każdej chwili załadować dowolną z nich bezpośrednio.

**Przegląd**

*Interaktywny przegląd katalogu znajdziesz na stronie internetowej. Wszystkie wbudowane specjalizacje są w tabeli poniżej.*

**Jak to działa**

## Samodzielne użycie

Aby użyć specjalizacji bezpośrednio, poproś agenta, żeby załadował ją poleceniem `read catalog <name>`, i opisz zadanie w tym samym prompcie. Agent stosuje wtedy tę wiedzę do tego, o co prosisz. Działa to w każdym prompcie, nawet niezwiązanym z przepływem pracy **Lagune**.

Na przykład bezpośredni prompt w dowolnej formie, który generuje bezpieczny zbiór wyrażeń **RegExp** w języku **Python**:

```prompt
Załaduj specjalizację regex poleceniem `npx lagune read catalog regex`, a potem utwórz w @src/utils/regex.py zbiór wyrażeń regularnych do walidacji adresów e-mail i nazw użytkowników.
```

Agent korzysta przy tym z deterministycznego hooka, który testuje każde wyrażenie **RegExp** pod kątem **ReDoS**, zachowuje bezpieczne i daje mniej więcej taki wynik:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Wypróbuj narzędzie do wykrywania ReDoS**

Przetestuj wzorzec samodzielnie na stronie [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Wbudowane specjalizacje

Wbudowane specjalizacje są pogrupowane w [**kategorie**](https://lagune.ai/pl-PL/docs/categories). Oto zestaw, który **Lagune** dostarcza w standardzie:

| Specjalizacja         | Kategoria                   | Obszar                                                                                                 |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `regex`               | `owasp`                     | **ReDoS:** wzorce, których czas dopasowania gwałtownie rośnie przy spreparowanych danych wejściowych.  |
| `network`             | `owasp`                     | **SSRF i przekierowania:** adresy pobierania lub przekierowań podawane przez użytkownika.              |
| `interpreter`         | `owasp`, `lovable`          | **Wstrzykiwanie kodu:** `eval`, dynamiczne dołączanie plików, wywoływanie po nazwie.                   |
| `sql`                 | `owasp`                     | **Relacyjne bazy danych:** wstrzykiwanie SQL, surowe wywołania ORM, uprawnienia, zasięg silnika bazy.  |
| `path`                | `owasp`                     | **Ścieżki w systemie plików:** path traversal, bajt zerowy, strumienie NTFS, podkładanie plików.       |
| `upload`              | `owasp`                     | **Przesyłanie plików:** typ i sygnatura, złośliwa zawartość, przechowywanie, limity.                   |
| `access-control`      | `owasp`, `lovable`          | **Uwierzytelnianie, autoryzacja, sesja:** IDOR, mass assignment, tenanci, sesje.                       |
| `credential-endpoint` | `owasp`, `lovable`          | **Zgadywanie haseł i boty:** brute force, password spraying, credential stuffing, ograniczanie prób.   |
| `federation`          | `owasp`                     | **Zaufanie do tokenów:** OAuth/OIDC, SAML, walidacja JWT, logowanie kodem QR.                          |
| `http-request`        | `owasp`                     | **Pochodzenie żądań:** CSRF, błędna konfiguracja CORS, sfałszowany adres IP klienta.                   |
| `transport`           | `owasp`                     | **Bezpieczeństwo kanału:** konfiguracja TLS, HTTPS i tekst jawny, HSTS, pinning.                       |
| `crypto`              | `owasp`, `lovable`          | **Kryptografia danych w spoczynku:** słabe lub własne algorytmy, CSPRNG, zarządzanie kluczami.         |
| `secrets`             | `owasp`, `lovable`          | **Dane uwierzytelniające zapisane na sztywno w kodzie:** klucze, tokeny, hasła wpisane w kod źródłowy. |
| `api-endpoint`        | `owasp`                     | **Interfejsy inne niż REST:** GraphQL, gRPC, autoryzacja WebSocket, DoS, schemat.                      |
| `payment`             | `owasp`, `lovable`          | **Proces płatności:** weryfikacja w bramce po stronie serwera, podpisane callbacki, idempotentność.    |
| `xml`                 | `owasp`                     | **Parsowanie XML:** XXE, encje zewnętrzne, ekspansja typu billion laughs.                              |
| `csv`                 | `owasp`                     | **Wstrzykiwanie formuł:** komórki arkusza zaczynające się od `=`/`+`/`-`/`@`.                          |
| `container`           | `owasp`, `infra`            | **Konfiguracja kontenerów:** root, capabilities, montowanie gniazda, utwardzanie obrazu.               |
| `infra`               | `infra`                     | **Infrastruktura jako kod:** Terraform, Dockerfile, GitHub Actions.                                    |
| `serverless`          | `owasp`, `infra`, `lovable` | **Funkcje FaaS:** IAM z minimalnymi uprawnieniami, dane wejściowe zdarzeń, kontekst, sekrety.          |
| `llm`                 | `ai`, `lovable`             | **Ryzyka AI i LLM:** prompt injection, autonomia agenta, RAG, MCP, dane wyjściowe.                     |
| `supabase`            | `lovable`                   | **Backend Supabase:** RLS domyślnie wyłączone, błędne polityki generowane przez AI, model kluczy.      |
| `browser`             | `javascript`, `lovable`     | **Ryzyka po stronie klienta:** XSS, CSP, osadzanie w ramkach, przechowywanie danych itp.               |
| `javascript`          | `javascript`                | **Ryzyka na poziomie języka:** RCE, prototype pollution itp.                                           |
| `python`              | `python`                    | **Ryzyka na poziomie języka:** RCE przez `pickle`, class pollution, `-O` itp.                          |
| `rust`                | `rust`                      | **Poprawność `unsafe`:** UB wywołane z bezpiecznego kodu, `transmute`, przepełnienia.                  |
| `java`                | `java`                      | **Deserializacja i kod mobilny:** łańcuchy `readObject`, przejmowanie obiektów.                        |
| `ruby`                | `ruby`                      | **Deserializacja i `open`:** odtwarzanie obiektów przez `Marshal`/YAML, pułapka z potokiem.            |
| `php`                 | `php`                       | **Type juggling i `unserialize`:** magic hashes, łańcuchy POP.                                         |
| `go`                  | `go`                        | **Typed nil i data races:** `nil != nil`, gorutyny ze współdzieloną pamięcią.                          |
| `c-cpp`               | `c-cpp`                     | **Ciągi formatujące:** `printf(user_input)`, zapis write-what-where przez `%n`.                        |
| `dotnet`              | `dotnet`                    | **Ryzyka na poziomie platformy:** RCE przez `BinaryFormatter`, `@Html.Raw`, luki w enumach.            |

Większość wbudowanej wiedzy jest destylowana z OWASP. Pełne przyporządkowanie każdej specjalizacji do kanonicznych stron OWASP, czyli opisów ataków i Cheat Sheets, znajdziesz w sekcji [**Źródła OWASP**](https://lagune.ai/pl-PL/docs/references/owasp-sources). Kilka modułów związanych z konkretnym stosem opiera się zamiast tego na wytycznych samego dostawcy: na przykład `supabase` pochodzi z dokumentacji Supabase i CVE-2025-48757.

## Twoje własne specjalizacje

Zestaw wbudowanych specjalizacji rośnie o jeden plik z wiedzą i jeden wiersz w indeksie, nigdy o nowe polecenie. Własne dodajesz tak samo, poleceniem [`/lagune-specialize`](https://lagune.ai/pl-PL/docs/commands/specialize): wskaż mu artykuł lub temat, a wydestyluje z niego nową specjalizację w twoim projekcie, czyli plik w `.lagune/catalog/` i jej wpis w `.lagune/configs.json`. Twoje własne specjalizacje zawsze należą do katalogu, niezależnie od jego kategorii, a twoja specjalizacja przesłania wbudowaną o tej samej nazwie.

**Wewnętrznie Lagune ładuje specjalizacje automatycznie, na żądanie**

Gdy faza detect lub verify trafia na kontekst, który obejmuje któraś specjalizacja, sama ładuje ją poleceniem `read catalog <name>`. Dzieje się to automatycznie, w ramach fazy. Nie musisz niczego robić ręcznie, żeby to działało.

## Sprawdź, co jest dostępne

Tak wyświetlisz w terminalu katalog swojego projektu, po jednej specjalizacji na wiersz, wraz z jej tagami:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Specjalizacja oznaczona `[required]` obowiązuje zawsze, niezależnie od zadania. To, które wbudowane specjalizacje znajdą się na liście, zależy od [**kategorii**](https://lagune.ai/pl-PL/docs/categories) twojego projektu.

**Specjalizacje nie są ładowane domyślnie**

Zamiast domyślnie uruchamiać każde sprawdzenie, **Lagune** sięga tylko po wiedzę dopasowaną do tego, czym projekt faktycznie jest.

## Najczęściej zadawane pytania

### Czym jest specjalizacja Lagune?

To skupiony na jednym zagadnieniu, niezależny od języka programowania moduł wiedzy o bezpieczeństwie, ładowany tylko na żądanie, nigdy domyślnie. W odróżnieniu od skilli agenta nie jest poleceniem.

### Czym jest katalog projektu?

To specjalizacje, z których korzysta projekt: wbudowane specjalizacje jego kategorii oraz jego własne. Dopóki nie zapisano żadnej kategorii, projekt korzysta tylko z OWASP.

### Czy specjalizacje są ładowane domyślnie?

Nie. Ładują się tylko na żądanie, zgodnie z tym, czym projekt faktycznie jest.

### Jak bezpośrednio załadować specjalizację?

W tym samym prompcie co zadanie poproś agenta, żeby uruchomił npx lagune read catalog <name>.
