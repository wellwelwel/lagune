# Zaplanowane audyty: Uruchamiaj Lagune cyklicznie

> Zaplanuj cykliczny audyt Lagune w GitHub Actions z własnym kluczem albo w Claude Code, Codex, Cursor, Antigravity lub OpenCode, który zgłasza nowe ryzyka albo uruchamia cały przepływ pracy Blue Team.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/examples/scheduled-audits
Język: pl-PL
Oryginał: https://lagune.ai/docs/examples/scheduled-audits
Ostatnia aktualizacja: 2026-11-09

Zaplanuj samodzielny audyt projektu z **Lagune**, który albo zgłasza to, co znajdzie, albo uruchamia cały przepływ pracy Blue Team.

## Harmonogram

**Universal**

**GitHub Actions** uruchamia audyt w chmurze za pomocą [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Jego silnik **Copilot CLI** łączy się z wybranym przez ciebie dostawcą modeli przy użyciu twojego własnego klucza, więc nie wymaga subskrypcji żadnego agenta:

- Zainstaluj rozszerzenie poleceniem `gh extension install github/gh-aw`.
- Zapisz klucz dostawcy jako sekret repozytorium poleceniem `gh secret set PROVIDER_API_KEY`.
- Zapisz ten workflow jako `.github/workflows/lagune-audit.md`, zastępując `<model>` jednym z modeli dostawcy obsługujących wywoływanie narzędzi, a `<your-prompt>` jednym z [przykładowych promptów](#prompt-examples):

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.19.0
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  Następnie otwórz pull request ze swoimi zmianami.
  ```

  | Dostawca                                            | `<type>`    | `<url>`                                             |
  | --------------------------------------------------- | ----------- | --------------------------------------------------- |
  | **OpenAI**                                          | `openai`    | `https://api.openai.com/v1`                         |
  | **Anthropic**                                       | `anthropic` | `https://api.anthropic.com`                         |
  | Dowolne API zgodne z **OpenAI**, np. **OpenRouter** | `openai`    | Jego bazowy URL, np. `https://openrouter.ai/api/v1` |

- Uruchom polecenie `gh aw compile` i zacommituj workflow razem z wygenerowanym przez nie plikiem `.lock.yml`.

**W chmurze** audyt działa nawet przy wyłączonym komputerze:

- Zainstaluj **Lagune** w repozytorium przez [instalację uniwersalną](https://lagune.ai/pl-PL/docs/install/universal) zamiast wtyczki i zacommituj zmiany.
- Wpisz `/schedule` w sesji **Claude Code** i opisz audyt albo utwórz go na stronie [claude.ai/code/routines](https://claude.ai/code/routines).

**Na twoim komputerze** audyt korzysta z wtyczki zainstalowanej tylko dla ciebie:

- Utwórz lokalne zadanie na stronie **Scheduled tasks** w aplikacji desktopowej.
- Zezwól z góry na użycie silnika, jak pokazuje [strona instalacji](https://lagune.ai/pl-PL/docs/install/claude-code), bo nikt nie zatwierdzi wtedy jego narzędzi.
- Zadanie działa tylko wtedy, gdy aplikacja jest otwarta, a komputer nie jest uśpiony.

Zaplanowane zadania tworzy się w aplikacji desktopowej **ChatGPT**, a nie w **Codex CLI**, i działają one na twoim komputerze:

- W czacie **Codex** opisz audyt, określ, kiedy ma się uruchamiać, i zaznacz, że każde uruchomienie zaczyna nowy czat. Wyniki trafiają do sekcji **Scheduled**.
- W prompcie poprzedź nazwę każdego polecenia znakiem `$`, np. `$lagune:lagune-detect`, aby uruchomienie wywołało je jawnie.
- Wybierz swój lokalny projekt zamiast nowego worktree, który startuje bez silnika [zainstalowanego w twoim projekcie](https://lagune.ai/pl-PL/docs/install/codex).
- Zadanie działa tylko wtedy, gdy aplikacja jest otwarta, komputer jest włączony, a projekt jest na dysku.

Automatyzacje w **Cursor** działają w chmurze, nawet przy wyłączonym komputerze:

- Zainstaluj **Lagune** w repozytorium przez [instalację uniwersalną](https://lagune.ai/pl-PL/docs/install/universal) zamiast wtyczki i zacommituj zmiany.
- Utwórz automatyzację na stronie [cursor.com/automations](https://cursor.com/automations) albo opisz ją poleceniem `/automate` w sesji agenta, ustawiając wyzwalacz harmonogramu.
- Wybierz swoje repozytorium, bo wyzwalacz harmonogramu startuje bez niego.

Automatyzacje w **Antigravity** działają na twoim komputerze, każda w nowej rozmowie:

- Otwórz kartę **Automations** w aplikacji **Antigravity** i utwórz zaplanowaną automatyzację dla swojego projektu albo poproś agenta, aby ją skonfigurował.
- Zezwól z góry na użycie silnika, jak pokazuje [strona instalacji](https://lagune.ai/pl-PL/docs/install/antigravity-cli), bo nikt nie zatwierdzi wtedy jego narzędzi.
- Użyj automatyzacji zamiast polecenia `/schedule`, które działa tylko tak długo, jak trwa jego rozmowa.
- Automatyzacja działa tylko wtedy, gdy aplikacja **Antigravity** jest uruchomiona.

**OpenCode** nie ma własnego harmonogramu zadań, więc audyt uruchamia się z **GitHub Actions**, w chmurze:

- Dodaj **Lagune** do pliku `opencode.json` w repozytorium i zacommituj go, jak pokazuje [strona instalacji](https://lagune.ai/pl-PL/docs/install/opencode).
- Uruchom polecenie `opencode github install`, aby połączyć aplikację GitHub **OpenCode** i zapisać klucz dostawcy modeli.
- Dodaj workflow, który przekazuje prompt do **OpenCode** według harmonogramu, tutaj w każdy poniedziałek o 09:00 UTC, uzupełniając `<KEY>` i `<provider>/<model>` tak jak w workflow utworzonym przez `opencode github install`, a `<your-prompt>` jednym z [przykładowych promptów](#prompt-examples):

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### Przykładowe prompty \{#prompt-examples}

**💧 Tylko raport**

Mapuje nowe ryzyka, planuje dla nich poprawki i ponownie sprawdza wdrożone już zabezpieczenia, nie zmieniając twojego kodu:

```md
Wykonaj po kolei następujące polecenia: `/lagune-detect` i `/lagune-plan`. Jeśli projekt ma rejestr utwardzania, wykonaj też `/lagune-verify`.

Nie zmieniaj kodu projektu. Na koniec podsumuj nowe ustalenia i każde wdrożone zabezpieczenie, które przestało działać.
```

**🌊 Pełny cykl**

Dodatkowo wdraża zaplanowane poprawki i wykazuje, że każda z nich działa, więc przejrzyj zmiany, zanim trafią do głównej gałęzi:

```md
Wykonaj po kolei następujące polecenia: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` i `/lagune-verify`.

Na koniec podsumuj wdrożone poprawki i każde ustalenie, które pozostaje otwarte.
```
