# /lagune-plan: Oceń ustalenia i zaplanuj poprawki

> Zamień to, co wykryła faza detect, w plan obrony, oceniając każde ustalenie kategorią i wynikiem CVSS v4.0 oraz dobierając do niego poprawkę.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/plan
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/plan
Ostatnia aktualizacja: 2026-11-09

🛡️ Zamień to, co wykryła faza detect, w plan obrony: oceń każde ustalenie kategorią i wynikiem CVSS v4.0, a potem dobierz do niego poprawkę do wdrożenia.

## Użycie

**Zaplanuj wszystko**

```prompt
/lagune-plan
```

**Wskaż ścieżki**

```prompt
/lagune-plan src/routes/upload.ts
```

**Skup się na obawie**

```prompt
/lagune-plan gdzie mogą wyciec wrażliwe dane
```

## Jak to działa

Ta faza kontynuuje pracę fazy detect. Detect ustaliła już, co robi twój system i jakie ryzyko niesie każdy jego element, więc plan nie powtarza opisu ryzyka, tylko ocenia, jak jest poważne, i decyduje, co z nim zrobić. Plan nigdy nie czyta kodu, dzięki czemu każda poprawka musi wskazywać coś, co detect rzeczywiście wykryła. Każde ustalenie ocenia metodą CVSS v4.0: przypisuje mu kategorię, wektor CVSS v4.0 wyprowadzony z tego, co zarejestrowały fazy detect i charter, z wynikiem obliczonym przez [hook `cvss`](https://lagune.ai/pl-PL/docs/hooks/cvss), oraz poziom priorytetu, do którego ten wynik należy. Każda poprawka wskazuje też zasadę bezpieczeństwa, którą chroni.

Na przykład:

- **Przesyłanie plików** (priorytet: **Critical**)
  - _Kategoria:_ nieograniczone przesyłanie plików (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Dlaczego taki priorytet:_ każdy może dotrzeć do przesyłania plików przez internet, a działa ono na serwerze, który przechowuje pliki klientów.
  - _Chroni zasadę:_ III. Wszystkie dane wejściowe są niezaufane, dopóki nie przejdą walidacji.
  - _Poprawka:_ sprawdzać rzeczywisty typ i rozmiar pliku, zmieniać jego nazwę przy zapisie i przechowywać przesłane pliki tam, gdzie nie da się ich uruchomić jako kodu.

W efekcie masz ocenioną listę poprawek uporządkowaną według priorytetu, w której każda poprawka jest powiązana z ustaleniem i gotowa do wdrożenia w kolejnej fazie. Wynik jest obliczany, nigdy szacowany: wektor ujmuje ekspozycję projektu i stawkę jako metryki Environmental, a każdy może wkleić go do kalkulatora FIRST lub NVD i otrzymać ten sam wynik.

**Wskazówka**

- Faza opiera się w całości na fazie detect. Jeśli wskażesz plik lub obawę, których nigdy nie zmapowano, każe ci najpierw uruchomić dla nich polecenie `/lagune-detect`.
- Ponowne uruchomienie aktualizuje plan: ukończone poprawki znikają, nowe się pojawiają.
- Plan obrony znajduje się w pliku `.lagune/memory/plan.md`.

**Zależy od fazy detect**

Plan działa wyłącznie na tym, co polecenie [`/lagune-detect`](https://lagune.ai/pl-PL/docs/commands/detect) już zmapowało, więc najpierw uruchom detect.

## Co dalej

Wdróż plan: [`/lagune-harden`](https://lagune.ai/pl-PL/docs/commands/harden).

## Najczęściej zadawane pytania

### Jak Lagune ustala priorytety podatności?

/lagune-plan ocenia każde ustalenie kategorią i wynikiem CVSS v4.0 obliczonym przez hook cvss, a potem dobiera do niego poprawkę do wdrożenia.

### Czy Lagune korzysta z CVSS v4.0?

Tak. Każde ustalenie dostaje wektor i wynik CVSS v4.0, które hook cvss oblicza według tej samej arytmetyki co kalkulator FIRST, więc każdy może wkleić tam wektor i samodzielnie odtworzyć wynik.

### Czy faza plan czyta mój kod?

Nie. Plan nigdy nie czyta kodu, dzięki czemu każda poprawka musi wskazywać coś, co detect rzeczywiście wykryła.
