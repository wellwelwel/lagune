# Migrate: Przenieś projekt Lagune oparty na manifeście na skille i wtyczki

> Przenieś projekt Lagune oparty na manifeście na wersję Lagune opartą na skillach, zachowując zasady bezpieczeństwa, artefakty, śledzenie i własne specjalizacje.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/migrate
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/migrate
Ostatnia aktualizacja: 2026-11-09

🔀 Przenieś projekt **Lagune** oparty na manifeście na wersję **Lagune** opartą na skillach, zachowując całą swoją dotychczasową pracę.

**Rozwiązanie przestarzałe**

Projekt z manifestem działa bez zmian aż do `v1.x`: `npx lagune` przekazuje `init`, `pull`, `update`, `add`, `remove`, `list` i dashboard do `lagune@0.15.0`, ostatniej wersji opartej na manifeście.

## Migracja

1. Upewnij się, że bieżąca praca jest zapisana w commicie, a potem uruchom migrate w głównym folderze projektu:

   ```bash
   npx lagune migrate
   ```

2. Zrób commit wyłącznie ze zmianami wprowadzonymi przez migrate, aby przeniesienie pozostało jedną zmianą, łatwą do przejrzenia.
3. Zainstaluj polecenia dla swojego agenta, jak pokazuje [strona instalacji](https://lagune.ai/pl-PL/docs).
4. Jeśli projekt ma już artefakt fazy detect, plan lub harden, użyj polecenia [`/lagune-repair`](https://lagune.ai/pl-PL/docs/commands/repair), aby uzgodnić stare odwołania w tych artefaktach i w twoich własnych specjalizacjach:

   ```prompt
   /lagune-repair Uzgodnij zastosowane specjalizacje (wcześniej sub-skille) w artefaktach w `.lagune/memory/` (`detect.md`, `plan.md` i `harden.md`) z nazwami, które wymienia nowy katalog, i zamień każde wywołanie starych hooków z `.lagune/hooks/` w moich własnych specjalizacjach w `.lagune/catalog/` na wywołanie narzędzia `lagune_read` lub `lagune_write`.
   ```

## Co się zmienia

| Przed                                                                 | Po                                                                               |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` i `.lagune/specializations.md` | Usunięte: każdy skill zawiera swój szablon, a hooki uruchamia silnik             |
| Kopie wbudowanych specjalizacji w `.lagune/skills/`                   | Usunięte: wbudowane specjalizacje dostarcza silnik                               |
| Twoje własne specjalizacje w `.lagune/skills/`                        | Przeniesione do `.lagune/catalog/`                                               |
| `.lagune/skills.json`, indeks twoich własnych specjalizacji           | Scalony z `.lagune/configs.json`                                                 |
| Kategorie z manifestu                                                 | Zapisane w `.lagune/configs.json`                                                |
| Stare polecenia agenta, takie jak `/lagune.detect`                    | Usunięte: [instalacja **Lagune**](https://lagune.ai/pl-PL/docs) dodaje nowe, takie jak `/lagune-detect` |
| Blok **Lagune** w `.gitignore`                                        | Usunięty, razem z plikiem, jeśli nie zawierał nic więcej                         |
| `.lagune/proofs/`, ignorowany przez ten blok                          | Trzymany z dala od commitów przez własny plik `.gitignore`                       |
| `.lagune/manifest.json`                                               | Usunięty na samym końcu                                                          |

Twoja praca nad bezpieczeństwem zostaje bez zmian: zasady bezpieczeństwa, artefakt utworzony przez każdą fazę i mapa śledzenia ze ścieżkami, na które wskazuje każde ustalenie.

## Najczęściej zadawane pytania

### Czy muszę przeprowadzić migrację?

Tak. Projekty oparte na manifeście są przestarzałe i działają tylko do v1.x, więc uruchom npx lagune migrate, aby przenieść swój projekt.

### Co zachowuje migrate?

Twoje zasady bezpieczeństwa, każdy artefakt faz, mapę śledzenia, twoje kategorie i twoje własne specjalizacje. Specjalizacje trafiają do .lagune/catalog/, a ich indeks dołącza do twoich kategorii w .lagune/configs.json.

### Kiedy zainstalować nowe polecenia?

Po migracji, jak pokazuje strona instalacji dla twojego agenta. Instalacja przed migracją też zadziała, bo migrate zachowuje nowe polecenie /lagune.

### Ktoś z zespołu już przeprowadził migrację. Co mam uruchomić?

Pobierz zmiany z migracją przez pull, a potem raz uruchom npx lagune migrate. Polecenie usunie to, co wersja Lagune oparta na manifeście zostawiła w twoim klonie repozytorium, a czego system kontroli wersji nigdy nie przechowywał, i zadba, żeby twoje wykazania nie trafiały do commitów.
