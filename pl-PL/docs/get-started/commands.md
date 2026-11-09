# Skille bezpieczeństwa dla agentów AI

> Skille, które twój agent AI zyskuje dzięki Lagune: audyt istniejącego projektu albo zabezpieczanie nowej pracy na bieżąco, zawsze zgodnie z zasadami bezpieczeństwa.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/get-started/commands
Język: pl-PL
Oryginał: https://lagune.ai/docs/get-started/commands
Ostatnia aktualizacja: 2026-11-09

Po [instalacji](https://lagune.ai/pl-PL/docs) **Lagune** twój agent **AI** zyskuje zestaw skilli. Możesz z nich korzystać na dwa sposoby, a oba podlegają twoim **zasadom bezpieczeństwa**: zabezpieczać nową pracę na bieżąco albo uruchomić pełny audyt projektu.

**⌨️ Budowanie / programowanie**

Nie musisz kończyć pracy, żeby ją zabezpieczyć. Używaj polecenia [**`/lagune`**](https://lagune.ai/pl-PL/docs/commands/lagune) do pracy, którą piszesz **właśnie teraz**:

| Skill                                         | Co dla ciebie robi                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/pl-PL/docs/commands/charter) | Ustala zasady bezpieczeństwa twojego projektu, podstawę, na której buduje `/lagune`             |
| [**/lagune**](https://lagune.ai/pl-PL/docs/commands/lagune)          | Buduje to, o co prosisz, i utwardza kod w trakcie pisania, kierując się zasadami bezpieczeństwa |

**Używaj go w każdej chwili**

Polecenie [**`/lagune`**](https://lagune.ai/pl-PL/docs/commands/lagune) przestrzega twoich zasad bezpieczeństwa przy każdym uruchomieniu. Przyjmuje dowolny prompt, buduje to, o co prosisz, i od razu utwardza wynik bezpiecznymi ustawieniami domyślnymi, a nie później.

---

#### Skille specjalne

| Skill                                               | Co robi                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [**/lagune-specialize**](https://lagune.ai/pl-PL/docs/commands/specialize) | Poszerza wiedzę **Lagune** o nową specjalizację bezpieczeństwa na podstawie artykułów, exploitów lub tematów |

**🔬 Audyt: przepływ pracy Blue Team**

Pełny **przepływ pracy Blue Team** sprawdza, co robi projekt, mapuje jego ryzyka i je zamyka. Każdy krok opiera się na poprzednim, więc wystarczy przejść listę od góry do dołu:

| #   | Skill                                         | Co dla ciebie robi                                                                                                 |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | [**/lagune-charter**](https://lagune.ai/pl-PL/docs/commands/charter) | Ustala zasady bezpieczeństwa twojego projektu, zaproponowane dla ciebie albo ukształtowane według twoich wskazówek |
| 2   | [**/lagune-detect**](https://lagune.ai/pl-PL/docs/commands/detect)   | Czyta twój kod i mapuje, co robi system i gdzie leżą ryzyka                                                        |
| 3   | [**/lagune-plan**](https://lagune.ai/pl-PL/docs/commands/plan)       | Zamienia to, co znalazła faza detect, w plan obrony z poprawką do każdego ustalenia                                |
| 4   | [**/lagune-harden**](https://lagune.ai/pl-PL/docs/commands/harden)   | Wdraża poprawki z planu w twoim kodzie, bezpiecznie i po jednej naraz                                              |
| 5   | [**/lagune-verify**](https://lagune.ai/pl-PL/docs/commands/verify)   | Wykazuje, że każda wdrożona poprawka działa, i zamyka te, które przejdą weryfikację                                |

---

#### Skille specjalne

| Skill                                               | Co robi                                                                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/pl-PL/docs/commands/specialize) | Poszerza wiedzę **Lagune** o nową specjalizację bezpieczeństwa na podstawie artykułów, exploitów lub tematów                       |
| [**/lagune-prove**](https://lagune.ai/pl-PL/docs/commands/prove)           | Zamienia każde wykryte ustalenie w wyłącznie defensywne wykazanie, które da się uruchomić, na potrzeby odpowiedzialnego ujawniania |

---

#### Skille wewnętrzne

| Skill                                       | Co robi                                  |
| ------------------------------------------- | ---------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/pl-PL/docs/commands/repair) | Naprawia wewnętrzne śledzenie **Lagune** |

**Wskazówka**

Bezpieczeństwo to nie koszt, tylko inwestycja: to, co włożysz w nie na początku, zaoszczędzisz wielokrotnie na incydentach, które nigdy się nie wydarzą 🙋🏻‍♂️

## Najczęściej zadawane pytania

### Jakie skille dodaje Lagune?

/lagune do utwardzania pracy na bieżąco oraz pięciofazowy przepływ pracy audytu Blue Team: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Do tego /lagune-specialize i /lagune-prove.

### Czym jest przepływ pracy Blue Team w Lagune?

To pięciofazowy audyt: charter (ustalenie zasad), detect (mapowanie ryzyk), plan (ocena i zaplanowanie poprawek), harden (wdrożenie poprawek), verify (wykazanie, że działają, i ich zamknięcie).

### Czym różni się /lagune od przepływu pracy audytu?

/lagune zabezpiecza nową pracę na bieżąco, w trakcie pisania, bez przepływu pracy, którego trzeba by się trzymać. Przepływ pracy audytu uruchamia pięć faz po kolei na istniejącym projekcie.
