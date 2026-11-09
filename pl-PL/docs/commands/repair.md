# /lagune-repair: Napraw zepsute śledzenie ustaleń

> Napraw łańcuch, gdy zmiana nazwy lub przeniesienie pliku zaburzy śledzenie w Lagune.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/repair
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/repair
Ostatnia aktualizacja: 2026-11-09

🧰 Napraw łańcuch, gdy zmiana nazwy lub przeniesienie pliku go zaburzy.

**Wewnętrzna konserwacja, nie faza bezpieczeństwa**

Repair nie jest szóstą fazą liniowego przepływu pracy. Jego zadaniem jest utrzymanie spójności śledzenia.

```prompt
# Nie przyjmuje żadnych argumentów: zawsze naprawia cały łańcuch
/lagune-repair
```

## Jak to działa

Każde ustalenie z fazy detect to jeden śledzony element, który przejmują dalej fazy plan, harden i verify. Każda z nich na nim działa i ponownie wymienia go z nazwy. Ta nazwa, zapisana identycznie jako tytuł sekcji w każdym artefakcie, przez cały czas stanowi jego tożsamość.

Jedyna zmienna informacja, jaką przechowuje śledzenie, to ścieżki plików, na które wskazuje element. Te ścieżki nie występują nigdzie indziej, więc zmiana nazwy lub przeniesienie pliku może zerwać powiązanie tylko w tym jednym miejscu, nigdy w dwóch rozbieżnych kopiach. Gdy tak się stanie, repair poprawia mapę (`.lagune/tracking.json`), aby tożsamość przetrwała zmianę nazwy. Czyta artefakty i mapę śledzenia, twój kod źródłowy czyta tylko po to, aby poznać nową ścieżkę pliku o zmienionej nazwie, i nigdy nie tworzy treści dotyczących bezpieczeństwa.

W tym samym przebiegu sprawdza każdy artefakt pamięci względem jego szablonu i zgłasza rozbieżności, wskazując przy każdej fazę, która ją naprawia.

**Wskazówka**

- Nie zmienia ani twojego kodu, ani artefaktów tekstowych, tylko śledzenie.
- Rzadko uruchamiasz to polecenie ręcznie. Gdy jakaś faza zauważy, że łańcuch jest niespójny, sama uruchamia repair i kontynuuje pracę.
- Śledzenie, które utrzymuje, znajduje się w pliku `.lagune/tracking.json`. To wewnętrzny stan, którego nigdy nie edytujesz ręcznie.
