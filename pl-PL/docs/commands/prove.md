# /lagune-prove: Wyłącznie defensywny Proof of Concept

> Zamień każde wykryte ustalenie w gotowy do uruchomienia, wyłącznie defensywny Proof of Concept (PoC) z biuletynem bezpieczeństwa do odpowiedzialnego ujawniania.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/prove
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/prove
Ostatnia aktualizacja: 2026-11-09

🧪 Zamień każde wykryte ustalenie w gotowe do uruchomienia, wyłącznie defensywne dowody do odpowiedzialnego ujawniania.

Dla każdego ustalenia z mapy wykrywania polecenie pisze samodzielny biuletyn bezpieczeństwa i test, który sprawdza **bezpieczną ścieżkę**. Dzięki temu test nie przechodzi, dopóki problem istnieje, i przechodzi, gdy tylko kod zostanie poprawiony.

**Wskazówka**

Testy **Lagune** są odizolowane w folderze `.lagune/`, z dala od twoich własnych testów.

## Użycie

**Każde ustalenie**

```prompt
/lagune-prove
```

**Wybrane ustalenie**

Wyświetl nazwy ustaleń, które są już śledzone:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection w wyszukiwaniu użytkownika
#   ...
```

```prompt
# Potem wykaż jedno z nich
/lagune-prove SQL injection w wyszukiwaniu użytkownika
```

## Jak to działa

Polecenie czyta kod źródłowy, na który wskazuje każde ustalenie, i dla każdego wykazanego ustalenia tworzy w `.lagune/proofs/` osobny folder z dokładnie dwoma plikami:

| Plik                           | Czym jest                                                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (lub `.cjs`) | Test. Uruchamia się w Poku, jeśli twój projekt już go używa, a w przeciwnym razie w natywnym runnerze testów Node.js, więc niczego nie trzeba instalować.   |
| `report.md`                    | Samodzielny biuletyn bezpieczeństwa: poziom zagrożenia, skutki, sposób odtworzenia problemu i polecenie uruchomienia, zrozumiały bez dodatkowego kontekstu. |

Wykazania są zawsze napisane w JavaScripcie, więc pozostają przenośne niezależnie od języka twojego projektu. Indeks `README.md` linkuje do każdego wykazania i podaje jedno polecenie, które uruchamia je wszystkie.

**Wskazówka**

- Polecenie jest **opcjonalne i autonomiczne**: nie należy do pięciu faz ani do łańcucha śledzenia.
- Zapisuje wyłącznie w `.lagune/proofs/` i nigdy nie zmienia artefaktów faz ani twojego kodu, który tylko czyta.
- Ustalenie, którego test nie odtwarza problemu, nie dostaje wykazania, a polecenie każe ci uruchomić [`/lagune-detect`](https://lagune.ai/pl-PL/docs/commands/detect) dla tego miejsca, aby uzgodnić stan.
- Ponowne uruchomienie uzgadnia wykazania: jeśli ustalenie zniknęło albo problemu nie da się już odtworzyć, jego folder zostaje usunięty.

**Notatka**

**Działa tylko wtedy, gdy je wywołasz:** agent nigdy nie uruchamia go z własnej inicjatywy.

**Opiera się na fazie detect**

Prove czyta mapę wykrywania z polecenia [`/lagune-detect`](https://lagune.ai/pl-PL/docs/commands/detect), więc najpierw uruchom detect.

## Wyłącznie defensywnie i za zgodą

Zanim cokolwiek wygeneruje, polecenie upewnia się, że masz uprawnienia do testowania celu, i odrzuca każdą prośbę o działający exploit, payload ataku lub sposób na uniknięcie wykrycia. Wykazanie pokazuje bezpieczne zachowanie i nigdy nie generuje danych wejściowych do ataku.

## Od wykazania do ujawnienia

Aby zgłosić podatność, udostępnij oba pliki wykazanego ustalenia razem przez **prywatny GitHub Gist**. Są dowodem istniejącego, jeszcze nieujawnionego problemu, dlatego plik `.gitignore` w `.lagune/proofs/` trzyma je z dala od każdego commita: udostępniaj je wyłącznie przez ten Gist, dopóki opiekunowie projektu nie rozwiążą problemu.

Zamykanie ustalenia w łańcuchu **Lagune** pozostaje zadaniem poleceń [`/lagune-harden`](https://lagune.ai/pl-PL/docs/commands/harden) i [`/lagune-verify`](https://lagune.ai/pl-PL/docs/commands/verify): prove dostarcza dowody, ale niczego nie zamyka.

## Najczęściej zadawane pytania

### Czy Lagune generuje exploity?

Nie. /lagune-prove tworzy wyłącznie defensywne dowody: test, który sprawdza bezpieczną ścieżkę, więc nie przechodzi, dopóki problem istnieje, i przechodzi, gdy tylko kod zostanie poprawiony, a do tego biuletyn bezpieczeństwa do odpowiedzialnego ujawniania.

### Co tworzy prove?

Dwa pliki na każde ustalenie: test (report.test.mjs lub .cjs) i biuletyn bezpieczeństwa (report.md).

### Jak odpowiedzialnie zgłosić błąd znaleziony przez Lagune?

Prove tworzy samodzielny biuletyn bezpieczeństwa, który możesz udostępnić prywatnym kanałem, na przykład przez prywatny GitHub Gist, zgodnie z zasadami odpowiedzialnego ujawniania.
