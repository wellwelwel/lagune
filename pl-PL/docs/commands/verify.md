# /lagune-verify: Wykaż, że zabezpieczenia działają

> Wykaż, że każda wdrożona poprawka działa, i zamknij te, które przejdą weryfikację.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/verify
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/verify
Ostatnia aktualizacja: 2026-11-09

⚖️ Wykaż, że każda wdrożona poprawka działa, czytając kod i zestawiając go z tym, co zapisała faza harden, a potem zamknij te, które przejdą weryfikację.

## Użycie

**Zweryfikuj wszystko**

```prompt
/lagune-verify
```

**Wskaż ścieżki**

```prompt
/lagune-verify src/routes/upload.ts
```

**Według priorytetu**

```prompt
/lagune-verify priorytet krytyczny i wysoki
```

## Jak to działa

Faza verify czyta kod w każdym miejscu zapisanym przez fazę harden i potwierdza, że kod naprawdę odpowiada zapisanej deklaracji. Wykazaniem jest właśnie to zestawienie kodu z rejestrem. Każde zabezpieczenie dostaje jeden z trzech werdyktów:

| Werdykt                      | Znaczenie                                                                  |
| ---------------------------- | -------------------------------------------------------------------------- |
| ✅ Risk closed               | Kod robi dokładnie to, co deklaruje rejestr.                               |
| ❌ Risk not closed           | Zabezpieczenie wciąż jest otwarte. Verify odsyła cię z powrotem do harden. |
| ❓ Cannot tell from the code | Dowodu nie widać w samym kodzie.                                           |

Ryzyko, którego zamknięcie wykazano, zostaje następnie, za twoim potwierdzeniem, wycofane z łańcucha. Na przykład:

- **Przesyłanie plików** (werdykt: **✅ Risk closed**)
  - _Jak wykazano:_ verify przeczytała handler przesyłania i stwierdziła, że rozpoznaje on rzeczywisty typ pliku na podstawie jego zawartości, egzekwuje limit rozmiaru i odrzuca wszystko inne, dokładnie tak, jak deklaruje rejestr.
  - _Dowód:_ funkcja `handleUpload`, która rozpoznaje rzeczywisty typ pliku na podstawie zawartości.

Jeśli ryzyko nie zostało zamknięte, verify mówi to wprost i odsyła cię z powrotem do polecenia [`/lagune-harden`](https://lagune.ai/pl-PL/docs/commands/harden), bo poprawka wciąż jest otwarta.

**Wskazówka**

- Faza opiera się w całości na rejestrze utwardzania.
- Czyta twój kod wyłącznie po to, aby go ocenić, i nigdy nie osłabia zabezpieczenia ani nie przepisuje kodu, żeby werdykt wypadł pozytywnie.
- Ponowne uruchomienie uzgadnia werdykty: nieaktualne znikają, a ryzyko, które przestało być zamknięte, zostaje ponownie zgłoszone.
- Gdy wykaże, że ryzyko jest zamknięte, pyta raz, a potem usuwa to ustalenie z całego łańcucha (detect, plan, harden i śledzenie).
- Nie pisze własnego raportu: każdy werdykt trafia do bloku swojego zabezpieczenia w pliku `.lagune/memory/harden.md`, gdzie harden odczytuje go przy następnym uruchomieniu.

**Zależy od fazy harden**

Verify opiera się na poleceniu [`/lagune-harden`](https://lagune.ai/pl-PL/docs/commands/harden).

## Cykl się zamyka

Gdy wszystko w zakresie zostanie wycofane, cykl przechodzi w stan spoczynku. Otwiera się ponownie dopiero wtedy, gdy zmieni się kod. Bezpieczeństwo jest możliwe do zamknięcia, więc przepływ pracy ma stan końcowy, a nie nieskończoną pętlę.

## Najczęściej zadawane pytania

### Jak Lagune weryfikuje poprawkę?

/lagune-verify czyta kod, zestawia go z tym, co zapisała faza harden, i zwraca jeden z trzech werdyktów: Risk closed, Risk not closed albo Cannot tell from the code.

### Co oznacza wycofanie ustalenia?

Gdy verify wykaże, że ryzyko jest zamknięte, ustalenie zostaje wycofane: za twoim potwierdzeniem znika z całego łańcucha, więc nie jest już przetwarzane od nowa.

### Czy pracę nad bezpieczeństwem da się kiedyś zakończyć?

Tak. W SDH bezpieczeństwo jest możliwe do zamknięcia: ustalenie, którego zamknięcie wykazano, zostaje wycofane, więc przepływ pracy ma stan końcowy, a nie nieskończoną pętlę.
