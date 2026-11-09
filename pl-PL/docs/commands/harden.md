# /lagune-harden: Wdróż poprawki bezpieczeństwa w swoim kodzie

> Wdróż poprawki z planu w swoim kodzie, bezpiecznie i po jednej naraz.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/harden
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/harden
Ostatnia aktualizacja: 2026-11-09

🔧 Wdróż poprawki z planu w swoim kodzie, bezpiecznie i po jednej naraz.

## Użycie

**Wdróż wszystko**

```prompt
/lagune-harden
```

**Wskaż ścieżki**

```prompt
/lagune-harden src/routes/upload.ts
```

**Według priorytetu**

```prompt
/lagune-harden priorytet krytyczny i wysoki
```

## Jak to działa

Plan rozstrzygnął już każdą poprawkę, więc harden po prostu ją wdraża. Ponieważ to jedyna faza, która zmienia twój kod, działa ostrożnie: wdraża jedną poprawkę naraz, aby każdą zmianę dało się łatwo przejrzeć, i nigdy nie osłabia zabezpieczenia tylko po to, żeby poprawka pasowała. Na przykład poprawka przesyłania plików:

- **Przesyłanie plików** (status: **Applied**)
  - _Co się zmieniło:_ sprawdza rzeczywisty typ i rozmiar pliku, odrzuca wszystko, co nieoczekiwane, zmienia nazwę pliku przy zapisie i przechowuje go tam, gdzie nie da się go uruchomić jako kodu.
  - _Gdzie:_ funkcja `handleUpload` oraz wywoływana przez nią funkcja pomocnicza do zapisu.

Jeśli poprawki nie da się wdrożyć w całości, harden robi to, co może bezpiecznie zrobić, a resztę oznacza jako **Partial** lub **Blocked** i zostawia otwartą.

**Wdrożona nie znaczy zweryfikowana**

Applied nie oznacza jeszcze, że działanie poprawki zostało wykazane. Od tego jest faza [verify](https://lagune.ai/pl-PL/docs/commands/verify).

**Wskazówka**

- Faza opiera się w całości na planie. Jeśli wskażesz poprawkę lub plik, których nigdy nie zaplanowano, każe ci najpierw uruchomić dla nich polecenie `/lagune-plan`.
- Ponowne uruchomienie uzgadnia rejestr: wycofane zmiany znikają, nowo wdrożone poprawki się pojawiają.
- Rejestr utwardzania znajduje się w pliku `.lagune/memory/harden.md`.

**Zależy od fazy plan i zmienia twój kod**

Harden opiera się na poleceniu [`/lagune-plan`](https://lagune.ai/pl-PL/docs/commands/plan). To jedyna faza, która zmienia twój kod.

## Co dalej

Wykaż, że każda poprawka działa: [`/lagune-verify`](https://lagune.ai/pl-PL/docs/commands/verify).

## Najczęściej zadawane pytania

### Czy /lagune-harden zmienia mój kod?

Tak. To jedyna faza, która zmienia twój kod, wdrażając poprawki z planu po jednej naraz.

### Co oznaczają statusy Applied, Partial i Blocked?

To status, który Lagune zapisuje dla każdej poprawki. Applied oznacza, że poprawkę wdrożono, Partial, że wdrożono tylko jej część, a Blocked, że nie dało się jej wdrożyć. Applied nie oznacza jeszcze, że działanie poprawki zostało wykazane.

### Czy Lagune wdraża poprawki bez pytania?

O tym, czy zmiana wymaga twojej zgody, decyduje twój agent i tryb uprawnień, w którym go uruchamiasz, a nie Lagune: Lagune nie dodaje własnego etapu potwierdzania. Mimo to nigdy nie osłabia zabezpieczenia na potrzeby poprawki, a jeśli poprawka naruszałaby którąś z zasad bezpieczeństwa, najpierw się zatrzymuje i ci o tym mówi.
