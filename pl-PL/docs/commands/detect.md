# /lagune-detect: Zmapuj swój system i jego ryzyka

> Ta strona jest nieaktualna w porównaniu z wersją angielską. [Przeczytaj wersję oryginalną](https://lagune.ai/docs/commands/detect).

> Przeanalizuj kod i zmapuj, co robi twój system oraz gdzie kryją się ryzyka.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/detect
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/detect
Ostatnia aktualizacja: 2026-11-09

🔬 Sprawdź, co naprawdę robi twój system i gdzie kryją się ryzyka.

Faza detect czyta kod i zapisuje tylko to, co rzeczywiście w nim znajdzie, razem z dowodami potrzebnymi kolejnym fazom. Jej nadrzędna zasada brzmi: wykrywać, nie wymyślać.

## Użycie

**Pełne skanowanie**

```prompt
/lagune-detect
```

**Wskaż ścieżki**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Opisz zagadnienie**

```prompt
/lagune-detect upewnij się, że dane klientów nigdy nie są ujawniane
```

## Co mapuje

**Lagune** czyta kod i mapuje to, co w nim znajdzie. Każde ustalenie mówi, czego dotyczy, dlaczego ma znaczenie i na jakim dowodzie się opiera. Na przykład:

- **Przesyłanie plików**, system przyjmuje pliki od użytkowników:
  - _Dlaczego to ważne:_ plik podszywający się pod obraz może ukrywać złośliwy kod.
  - _Dowód:_ handler `POST /upload` ufa typowi MIME podanemu przez klienta i nie sprawdza rzeczywistego typu pliku.
- **Logowanie i sesje**, użytkownicy logują się, aby dostać się do swojego konta:
  - _Dlaczego to ważne:_ słaba obsługa sesji pozwala przejąć cudze konto.
  - _Dowód:_ logika wydawania sesji, która wydaje sesje bez ustawionego czasu wygaśnięcia.

Przy okazji faza detect wydaje werdykt dla każdej specjalizacji z [katalogu](https://lagune.ai/pl-PL/docs/catalog) twojego projektu, zestawiając ją z kodem, stosuje te, których kontekst występuje w projekcie, i zapisuje je w sekcji **Applied specializations**, czyli na liście, z której korzystają potem fazy harden i verify.

W efekcie masz przejrzystą mapę tego, co robi twój system i gdzie kryją się ryzyka, gotową do dalszych kroków.

**Wskazówka**

- Ponowne uruchomienie aktualizuje mapę: rozwiązane ustalenia znikają, nowe się pojawiają.
- Mapa wykrywania znajduje się w pliku `.lagune/memory/detect.md`.

## Co dalej

Zamień mapę w plan: [`/lagune-plan`](https://lagune.ai/pl-PL/docs/commands/plan).

## Najczęściej zadawane pytania

### Co robi /lagune-detect?

Czyta twój kod i mapuje, co robi twój system oraz gdzie kryją się ryzyka, zapisując tylko to, co rzeczywiście znajdzie. Jego zasada brzmi: wykrywać, nie wymyślać.

### Czym jest ustalenie w Lagune?

Ustalenie to jedno wykryte ryzyko, które mówi, czego dotyczy, dlaczego ma znaczenie i na jakim dowodzie w kodzie się opiera. To śledzona jednostka, którą dalej przejmują fazy plan, harden i verify.

### Gdzie jest zapisana mapa wykrywania?

W pliku .lagune/memory/detect.md.

### Z jakich specjalizacji korzysta detect?

Każda specjalizacja z katalogu twojego projektu dostaje werdykt po zestawieniu z kodem. Detect stosuje te, których kontekst występuje w projekcie, i zapisuje je w sekcji Applied specializations.
