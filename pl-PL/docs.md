# Instalacja: Utwardzanie zabezpieczeń dla każdego agenta AI

> Zainstaluj Lagune w dowolnym projekcie, jako wtyczkę, jeśli twój agent ją obsługuje, a w innym przypadku przez CLI skills, i wybierz pasujące do niego specjalizacje bezpieczeństwa.

Adres kanoniczny: https://lagune.ai/pl-PL/docs
Język: pl-PL
Oryginał: https://lagune.ai/docs
Ostatnia aktualizacja: 2026-11-09

**Lagune** pomaga twojemu agentowi AI zwiększyć bezpieczeństwo projektu. Wskazujesz mu swój kod, a agent ustala, co twój system faktycznie robi, i prowadzi cię przez prace nad bezpieczeństwem, które mają dla niego znaczenie. **Lagune** to pierwszy projekt metodologii [Security-Driven Hardening (SDH)](https://lagune.ai/pl-PL/docs/references/paper).

**Wesprzyj open source**

Podoba ci się **Lagune**? [Zostaw nam ⭐ w serwisie **GitHub**](https://github.com/wellwelwel/lagune)

## Wybierz swojego agenta

- [Claude Code](https://lagune.ai/pl-PL/docs/install/claude-code): Agentowe narzędzie programistyczne od Anthropic
- [Codex](https://lagune.ai/pl-PL/docs/install/codex): Agent programistyczny od OpenAI
- [Cursor](https://lagune.ai/pl-PL/docs/install/cursor): Edytor kodu z AI
- [GitHub Copilot](https://lagune.ai/pl-PL/docs/install/github-copilot-cli): Partner AI od GitHub do programowania w parach
- [Gemini CLI](https://lagune.ai/pl-PL/docs/install/gemini-cli): Agent open source od Google działający w terminalu
- [Antigravity](https://lagune.ai/pl-PL/docs/install/antigravity-cli): Agentowa platforma programistyczna od Google
- [OpenCode](https://lagune.ai/pl-PL/docs/install/opencode): Agent programistyczny open source
- [Devin for Terminal](https://lagune.ai/pl-PL/docs/install/devin-cli): Agent od Cognition działający w terminalu
- [Factory Droid](https://lagune.ai/pl-PL/docs/install/factory-droid): Agent od Factory do tworzenia oprogramowania
- [Grok Build](https://lagune.ai/pl-PL/docs/install/grok-build): Agent programistyczny od xAI
- [Qwen Code](https://lagune.ai/pl-PL/docs/install/qwen-code): Agent programistyczny od Qwen działający w terminalu
- [Kimi Code](https://lagune.ai/pl-PL/docs/install/kimi-code): Agent programistyczny od Moonshot AI
- [Muse Code](https://lagune.ai/pl-PL/docs/install/muse-code): Agent programistyczny od Meta
- [Pi](https://lagune.ai/pl-PL/docs/install/pi): Minimalistyczny agent programistyczny działający w terminalu
- [Hermes Agent](https://lagune.ai/pl-PL/docs/install/hermes-agent): Agent open source od Nous Research
- [Uniwersalna](https://lagune.ai/pl-PL/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed i jeszcze 66

**Informacja**

- **Lagune** działa pod maską na **Node.js**, ale ty pracujesz w dowolnym języku.
- Aby pracować całkowicie offline, zainstaluj **Lagune** w swoim projekcie poleceniem `npm i -D lagune@0.18.2`.

## Kategorie

Wiedza o bezpieczeństwie w **Lagune** ma postać [**specjalizacji**](https://lagune.ai/pl-PL/docs/catalog), pogrupowanych w [**kategorie**](https://lagune.ai/pl-PL/docs/categories).

- **OWASP** (`owasp`): Wzmocnij zabezpieczenia aplikacji przed ryzykami, które śledzi OWASP: wstrzykiwaniem, błędną kontrolą dostępu oraz błędami uwierzytelniania i kryptografii
- **Infrastruktura** (`infra`): Utwardź konfigurację kontenerów, obciążeń i usług serverless: Dockerfile, Compose, bezpieczeństwo podów, IAM i wyzwalacze FaaS
- **AI / LLM** (`ai`): Wzmocnij zabezpieczenia integracji AI i LLM przed prompt injection oraz niebezpiecznym podłączaniem narzędzi, agentów, mechanizmów retrieval i MCP
- **Lovable** (`lovable`): Utwardź aplikacje Supabase generowane przez AI (Lovable i podobne): luki w RLS, wycieki kluczy service_role i niebezpieczne ustawienia domyślne
- **JavaScript** (`javascript`): Wzmocnij zabezpieczenia JavaScriptu i jego środowisk uruchomieniowych przed RCE przez eval i child_process, path traversal i prototype pollution
- **Python** (`python`): Wzmocnij zabezpieczenia kodu w Pythonie przed RCE przez deserializację pickle i YAML, string traversal przez str.format i class pollution
- **Rust** (`rust`): Wzmocnij zabezpieczenia kodu w Rust przed niepoprawnymi (unsound) API z unsafe, nadużyciami transmute, przepełnieniami liczb całkowitych i niezdefiniowanym zachowaniem na granicy FFI
- **Java** (`java`): Wzmocnij zabezpieczenia kodu w Javie przed łańcuchami gadżetów przy deserializacji przez ObjectInputStream, które kończą się zdalnym wykonaniem kodu
- **Ruby** (`ruby`): Wzmocnij zabezpieczenia kodu w Ruby przed łańcuchami gadżetów przy deserializacji przez Marshal.load i YAML, które prowadzą do zdalnego wykonania kodu
- **PHP** (`php`): Wzmocnij zabezpieczenia kodu w PHP przed obejściem uwierzytelniania przez type juggling, łańcuchami gadżetów do object injection i niebezpiecznymi domyślnymi ustawieniami konfiguracji
- **Go** (`go`): Wzmocnij zabezpieczenia kodu w Go przed błędami interfejsów z typed nil, data races między gorutynami i niebezpieczną współbieżnością na ścieżkach krytycznych dla bezpieczeństwa
- **C / C++** (`c-cpp`): Wzmocnij zabezpieczenia kodu w C i C++ przed błędami ciągów formatujących, przepełnieniami bufora i zapisami poza zakresem, które umożliwiają wykonanie kodu
- **.NET** (`dotnet`): Wzmocnij zabezpieczenia kodu .NET i C# przed RCE przez deserializację BinaryFormatter oraz obejściami enkoderów, które prowadzą do XSS

Uruchom `npx lagune write add --categories` z kluczami wybranych kategorii.

**Wskazówka**

Projekt zaczyna od kategorii `owasp`, a polecenie [`/lagune-charter`](https://lagune.ai/pl-PL/docs/commands/charter) dodaje te kategorie, za którymi przemawia jego analiza projektu.

## Wymagania

W systemie musisz mieć zainstalowany [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager).

## Dodaj odznakę ✨

Używasz **Lagune**? Dodaj odznakę do swojego pliku **README**:

**Dwukolorowa**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Jednolita**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Co dalej

Sprawdź, do czego służy każdy [**skill**](https://lagune.ai/pl-PL/docs/get-started/commands) **Lagune**.

## Najczęściej zadawane pytania

### Czym jest Lagune?

Lagune to przepływ pracy open source nastawiony wyłącznie na bezpieczeństwo defensywne, który pomaga twojemu agentowi AI utwardzić dowolną bazę kodu. Wskazujesz mu swój kod, a on wykrywa, co twój system faktycznie robi, i prowadzi cię przez poprawki bezpieczeństwa, które mają znaczenie w tym kontekście.

### Jak zainstalować Lagune?

Wybierz swojego agenta: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI i Hermes Agent instalują Lagune jako wtyczkę, Gemini CLI i Qwen Code jako rozszerzenie, Pi jako pakiet, a każdy inny agent poleceniem npx skills add wellwelwel/lagune -y. Działa zarówno w nowych, jak i w istniejących projektach.

### Czy Lagune potrzebuje klucza API?

Nie. Działa przez twojego własnego agenta AI, więc nie potrzebujesz żadnych kluczy API.

### Jakie są wymagania?

W systemie musisz mieć zainstalowany Node.js (LTS).

### Jakie języki programowania obsługuje Lagune?

Wszystkie. Lagune działa pod maską na Node.js, ale audytuje i utwardza projekty napisane w dowolnym języku programowania.

### Co Lagune dodaje do mojego projektu?

Folder .lagune/ ze stanem bezpieczeństwa projektu. Tworzy go pierwsze polecenie, które coś zapisuje. CLI skills instaluje też w projekcie polecenia z ukośnikiem, skąd czyta je twój agent, a wtyczka trzyma je wewnątrz agenta.

### Jak zaktualizować Lagune?

Tak samo jak przy instalacji. Strona instalacji każdego agenta pokazuje, jak zaktualizować w nim Lagune, a przy CLI skills służy do tego polecenie npx skills update. Twoje zasady bezpieczeństwa, artefakty faz i własne specjalizacje pozostają nietknięte.

### Jakich specjalizacji używa projekt?

Wbudowanych z jego kategorii oraz własnych. Faza charter zapisuje kategorie, za którymi przemawia jej analiza projektu, a polecenie npx lagune write add --categories je zmienia.

### Czy muszę skończyć budować projekt, zanim zacznę go zabezpieczać?

Nie. Polecenie /lagune utwardza kod na bieżąco, w miarę jak powstaje: przyjmuje dowolny prompt, buduje to, o co prosisz, i utwardza wynik bezpiecznymi ustawieniami domyślnymi, kierując się zasadami bezpieczeństwa. Pięciofazowy przepływ pracy Blue Team audytuje to, co już istnieje.

### Czy Lagune potrafi audytować istniejący projekt?

Tak. Pięciofazowy przepływ pracy Blue Team audytuje to, co już istnieje: charter ustala twoje zasady bezpieczeństwa, detect mapuje, co robi system i gdzie leżą ryzyka, plan ocenia każde ustalenie i dobiera do niego poprawkę, harden wdraża poprawki, a verify wykazuje, że działają, i je zamyka.

### Czym różni się praca z Lagune od zwykłego poproszenia agenta o zmapowanie podatności i luk w zabezpieczeniach?

Agent czytający kod na własną rękę znajduje to, co wygląda na podatność, i pomija to, co wygląda na zabezpieczenie. Lista zablokowanych adresów sprawia wrażenie, jakby ktoś już zajął się ryzykiem, więc nikt nie zauważa, że brakuje na niej większości z nich, i kod trafia na produkcję. Lagune odwraca to domyślne założenie: zabezpieczenie obecne już w kodzie uznaje za niewykazane, dopóki go nie sprawdzi, każda specjalizacja z katalogu dostaje wyraźny werdykt, a verify pyta, czy ryzyko zniknęło, a nie, czy zabezpieczenie istnieje. Każde ustalenie pozostaje też jednym śledzonym elementem we wszystkich uruchomieniach, więc można wykazać jego zamknięcie i wycofać je, podczas gdy zwykła prośba daje za każdym razem inny raport, bez punktu odniesienia.

### Czym różni się programowanie z Lagune od zwykłego poproszenia agenta o bezpieczny kod?

Prośba o bezpieczny kod zostawia agentowi decyzję, co znaczy "bezpieczny", i zakłada, że wiesz, o co pytać. Wymaganie zwykle kryje się już w twojej prośbie, choć nie dostrzega go ani ty, ani agent: prośba o stronę z kursami, do których użytkownik ma dostęp, wyraża regułę autoryzacji, a sprawdzenie, którego nikt nie napisał, nie zostawia w kodzie niczego, co mogłoby zwrócić uwagę. Polecenie /lagune wczytuje twoje zasady bezpieczeństwa i specjalizacje pasujące do tego, co ma powstać, zanim powstanie pierwsza linia kodu, a potem ponownie sprawdza wynik pod kątem zastosowanej obrony. Bezpieczny wariant rzadko kosztuje więcej niż niebezpieczny, więc o wyniku decyduje wiedza, po który sięgnąć, i właśnie ta wiedza jest dostępna od samego początku.

### Czy Lagune wykonuje DAST (Dynamic Application Security Testing) albo testuje moją działającą aplikację?

Nie. Lagune czyta kod i nigdy nie uruchamia twojego systemu ani nie wysyła do niego spreparowanych żądań. Faza verify potwierdza, że zabezpieczenie jest obecne i poprawne w kodzie źródłowym, a to inne pytanie niż to, czy wytrzyma atak na działający cel, więc "cannot tell from the code" to uprawniony werdykt, a nie ciche przepuszczenie. DAST odpowiada na pytanie o czas działania, a Lagune na pytanie o kod źródłowy, więc żadne z nich nie zastępuje drugiego. Nawet opcjonalne polecenie prove trzyma się tej granicy: jego testy sprawdzają bezpieczne zachowanie, nigdy payload ataku.

### Czy Lagune zastępuje pentest (test penetracyjny)?

Nie, zdecydowanie nie! Pentest to autoryzowane zlecenie, w którym specjalista ocenia twój działający system według własnego osądu, łączy ustalenia w łańcuchy i bada logikę biznesową, której nie opisuje żadna reguła dla pojedynczej powierzchni ataku. Ustalenia z pentestu mogą trafić do przepływu pracy Blue Team w Lagune jako zagadnienia przekazane fazie detect, dzięki czemu to, co zgłasza specjalista, zostaje zaplanowane, utwardzone i zweryfikowane.

## Polityka bezpieczeństwa

Zapoznaj się z plikiem [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licencja

Projekt **Lagune** jest udostępniany na licencji [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-obecnie [Weslley Araújo](https://github.com/wellwelwel) i [współtwórcy](https://github.com/wellwelwel/lagune/graphs/contributors).
