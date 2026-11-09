# Hook agent: Wykrywanie pętli agentów bez limitu

> Przeszukaj bazę kodu pod kątem wywołań agentów i LLM bez limitu kroków lub czasu albo oceń pojedyncze wywołanie z wiersza poleceń.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/agent
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/agent
Ostatnia aktualizacja: 2026-11-09

Hook `agent` zgłasza **środowiska uruchomieniowe agentów, które działają w pętli bez limitu tur, budżetu lub czasu**, czyli lukę niekontrolowanej autonomii, przez którą spreparowane dane wejściowe prowadzą do nieograniczonych kosztów albo eskalacji przez prompt injection. **Rozpoznaje język** i obejmuje dwa ekosystemy frameworków agentowych: **JavaScript** (środowisko `query` z SDK agentów **Claude**) i **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Jest deterministycznym silnikiem stojącym za [specjalizacją `llm`](https://lagune.ai/pl-PL/docs/catalog), a ty możesz go uruchomić samodzielnie w trybie **scan** lub **check**.

## Uruchamianie

**Przeszukaj bazę kodu**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Sprawdź wywołanie**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Każdy wiersz pod nagłówkiem **Uncapped agent loops found** dotyczy pliku, który importuje SDK agentów, i wskazuje albo wywołanie środowiska `query` z SDK agentów Claude bez limitu tur, budżetu lub czasu (JavaScript, domyślnie bez ograniczeń), albo jawne zniesienie domyślnego limitu frameworka, takie jak `max_iterations=None` / `max_turns=None` (Python, domyślnie z limitem). W obu przypadkach hook kończy działanie z niezerowym kodem wyjścia. W Vercel AI SDK funkcje `generateText`/`streamText` domyślnie wykonują jeden krok (`stopWhen: stepCountIs(1)`), więc samo ich wywołanie nie może się zapętlić i nie jest zgłaszane, a zwykłego `db.query(...)` hook nigdy nie myli z wywołaniem agenta. Gdy nic nie znajdzie, wypisuje `no uncapped agent loops found`.

## Jak czytać werdykt

| Werdykt    | Znaczenie                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Wywołanie środowiska `query` bez limitu (JS) albo jawne zniesienie limitu (`=None`, Py).                          |
| `safe`     | Wywołanie `query`, które ustawia limit, generowanie w jednym kroku albo wywołanie frameworka z domyślnym limitem. |
| `invalid`  | Fragment kodu nie zawiera rozpoznawalnego wywołania agenta, które można by ocenić.                                |

### Opcje CLI

| Opcja       | Wartość       | Opis                                                                                         |
| ----------- | ------------- | -------------------------------------------------------------------------------------------- |
| `--pattern` | fragment kodu | Sprawdza jedno wywołanie. Powtórz opcję, aby sprawdzić kilka, po jednym werdykcie na wiersz. |
| `--lang`    | język         | Wymagana z `--pattern`: `javascript` lub `python`.                                           |
| `--dir`     | folder        | Zawęża skanowanie do folderu. Można ją powtarzać i łączyć z `--file`.                        |
| `--file`    | plik          | Zawęża skanowanie do jednego pliku. Można ją powtarzać i łączyć z `--dir`.                   |

Bez żadnej opcji przeszukuje cały projekt. Opcja `--pattern` wymaga `--lang` i nie można jej łączyć z `--dir` ani `--file`.

### Wybierz, co przeszukuje

Pomija to, co **Git** ignoruje. Aby pominąć więcej albo przeszukać to, co **Git** ignoruje, nadaj hookowi `agent` własne ustawienia:

```bash
npx lagune write add --ignore test/fixtures --checker agent
```

```json
{
  "checkers": {
    "agent": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Wszystkie ustawienia opisuje strona [Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure).

**W miarę możliwości, bez gwarancji kompletności**

Ręcznie napisana pętla agenta, w dowolnym języku, wykracza poza możliwości skanowania statycznego. Traktuj wynik jako solidne minimum, a nie pełną inwentaryzację.

**Wskazówka**

Hook rozstrzyga tylko kwestię limitu: zawężanie uprawnień agenta, mieszanie poziomów zaufania i autoryzacja wymagają oceny, którą nadal zapewnia [specjalizacja `llm`](https://lagune.ai/pl-PL/docs/catalog).

## Najczęściej zadawane pytania

### Po co ograniczać pętlę agenta?

Agenta bez limitu można wciągnąć w niekończącą się rekurencję, nieograniczone koszty albo eskalację przez prompt injection. Ustawienie maxTurns/maxBudgetUsd/stopWhen/signal go ogranicza, a hook agent zgłasza każde wywołanie środowiska query, które nie ustawia żadnego z nich.
