# /lagune: Bezpieczny kod już wtedy, gdy pisze go AI

> Buduje to, o co prosisz, i utwardza kod w trakcie pisania, kierując się zasadami bezpieczeństwa, bez przepływu pracy, którego trzeba się trzymać.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/lagune
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/lagune
Ostatnia aktualizacja: 2026-11-09

⌨️ Praca, o którą prosisz, wykonana i zabezpieczona już w trakcie pisania. **`/lagune`** przyjmuje dowolny prompt na każdym etapie, buduje to, czego potrzebujesz, i utwardza wynik bezpiecznymi ustawieniami domyślnymi, zanim ci go odda.

## Użycie

Oznacz dowolny prompt poleceniem **`/lagune`** i opisz zadanie tak jak zawsze.

**📘 Instrukcje dla agentów**

```md
# Instrukcje mojego projektu dla agentów

<!-- ... -->

## Bezpieczeństwo

- Zawsze, gdy tworzysz lub zmieniasz kod, używaj skilla `/lagune` ([**lagune.ai**](https://lagune.ai/llms.txt)), nazwanego `/lagune:lagune` po zainstalowaniu jako wtyczka, aby domyślnie zwiększać bezpieczeństwo.
```

    - Na przykład: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** itp.

**💬 Nowa funkcja**

```prompt
/lagune pozwól użytkownikom przesyłać własne zdjęcie profilowe.
```

**💬 Poprawka błędu**

```prompt
/lagune nic się nie dzieje, gdy użytkownik wysyła formularz. Sprawdź, co może być przyczyną, i to napraw.
```

**💬 Refaktoryzacja**

```prompt
/lagune rozdziel zależności i usprawnij logikę payloadu
```

**Zasady opcjonalne, ale warto je mieć**

**`/lagune`** działa z zasadami bezpieczeństwa lub bez nich. Jeśli je masz, wszystko, co powstaje, kształtują własne reguły twojego projektu. Ustal je raz poleceniem [`/lagune-charter`](https://lagune.ai/pl-PL/docs/commands/charter).

## Jak to działa

Polecenie prowadzi pracę w trzech krokach, nie zapisując niczego w pamięci Lagune:

1. Wczytuje twoje zasady bezpieczeństwa, jeśli istnieją, i to one kierują całą pracą. Jeśli jeszcze ich nie masz, opiera się na domyślnie bezpiecznej podstawie.
2. Przegląda [katalog](https://lagune.ai/pl-PL/docs/catalog) twojego projektu i wczytuje tylko te specjalizacje, których dotyczy twoja praca, czyli tę samą wiedzę na żądanie, z której korzysta przepływ pracy audytu.
3. Wdraża obronę już podczas pisania kodu, a potem ponownie czyta własny wynik, aby potwierdzić, że zabezpieczenia faktycznie działają, zanim odda ci pracę.

Efektem jest działający kod w twoim projekcie, bezpieczny od pierwszej linii.

**Używaj go w każdej chwili**

Bez fazy detect, bez fazy plan, bez sprzątania na koniec. **`/lagune`** sprawdza się równie dobrze przy świeżym szkielecie projektu, jak przy zmianie w dojrzałej bazie kodu, i utwardza pracę na bieżąco, a nie później.

## Czego nie robi

- Niczego nie zapisuje w folderze `.lagune`: żadnych artefaktów ani śledzenia, więc jedyne, co powstaje, to utwardzony kod, o który prosisz.
- Nie osłabia żadnej reguły, żeby spełnić prompt, więc jeśli twoja prośba naruszałaby którąś z zasad bezpieczeństwa, zatrzymuje się i najpierw ci o tym mówi, zamiast od razu zbudować to w niebezpieczny sposób.

## Najczęściej zadawane pytania

### Co robi /lagune?

Przyjmuje dowolny prompt na każdym etapie, buduje to, o co prosisz, i utwardza wynik bezpiecznymi ustawieniami domyślnymi, zanim ci go odda. Obronę wdraża już podczas pisania kodu, a nie później.

### Czy do używania /lagune potrzebuję zasad bezpieczeństwa?

Nie. Polecenie działa z nimi lub bez nich. Gdy je masz, wszystko, co powstaje, kształtują własne reguły twojego projektu. Bez nich opiera się na domyślnie bezpiecznej podstawie.

### Czym różni się /lagune od przepływu pracy Blue Team?

/lagune zabezpiecza nową pracę na bieżąco, w trakcie pisania, bez przepływu pracy, którego trzeba by się trzymać. Przepływ pracy Blue Team uruchamia pięć faz audytu po kolei na istniejącym projekcie.

### Czy /lagune śledzi ustalenia albo zapisuje artefakty?

Nie. Niczego nie zapisuje w folderze .lagune: żadnych artefaktów ani śledzenia. Jedyne, co powstaje, to utwardzony kod, o który prosisz.

### Jak sprawić, żeby agent automatycznie używał /lagune?

Dodaj do pliku instrukcji swojego agenta (AGENTS.md, CLAUDE.md, .cursorrules i podobnych) wskazówkę, by używał skilla /lagune zawsze, gdy tworzy lub zmienia kod.
