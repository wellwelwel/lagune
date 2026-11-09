# Hook cvss: Ocena wektora CVSS v4.0

> Oceniaj jeden lub wiele wektorów CVSS v4.0 z wiersza poleceń, licząc tak samo jak kalkulator FIRST, i zobacz każdy z nich objaśniony prostymi słowami.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/cvss
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/cvss
Ostatnia aktualizacja: 2026-11-09

Hook `cvss` ocenia **wektor CVSS v4.0** i wypisuje jego wynik oraz przedział poziomu zagrożenia, czyli ocenę, którą polecenie [`/lagune-plan`](https://lagune.ai/pl-PL/docs/commands/plan) zapisuje przy każdej poprawce, a polecenie [`/lagune-prove`](https://lagune.ai/pl-PL/docs/commands/prove) przy każdym biuletynie bezpieczeństwa. To deterministyczny silnik stojący za tymi ocenami, który liczy dokładnie tak samo jak [kalkulator FIRST](https://www.first.org/cvss/calculator/4.0), i możesz uruchomić go samodzielnie.

## Uruchamianie

Przekaż każdy wektor w opcji `--vector`. Hook wypisuje po jednej linii na wektor: jego wynik i przedział.

**Jeden wektor**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Kilka wektorów**

Powtórz `--vector`, aby ocenić kilka wektorów naraz, każdy w osobnej linii, w tej samej kolejności.

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**Prostymi słowami**

Dodaj `--explain`, aby zobaczyć każdą metrykę objaśnioną prostymi słowami. Gdy metryki Threat lub Environmental zmieniają wynik, najpierw pojawia się sam wynik Base.

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## Jak odczytać wynik

| Przedział  | Wynik          |
| ---------- | -------------- |
| `None`     | 0.0            |
| `Low`      | od 0.1 do 3.9  |
| `Medium`   | od 4.0 do 6.9  |
| `High`     | od 7.0 do 8.9  |
| `Critical` | od 9.0 do 10.0 |

Wektor zawierający tylko metryki Base ocenia samą podatność i zakłada najgorszy przypadek: każde wymaganie bezpieczeństwa ma poziom High, a podatność jest aktywnie atakowana w praktyce. Metryki Environmental (`MAV` i pozostałe metryki zmodyfikowane oraz `CR`, `IR` i `AR`) dopasowują wynik do konkretnego wdrożenia, a metryka Threat (`E`) do tego, co wiadomo o wykorzystywaniu podatności.

Dla nieprawidłowego wektora hook wypisuje `invalid vector:` wraz z opisem błędu i kończy działanie z niezerowym kodem wyjścia.

### Opcje CLI

| Opcja       | Wartość           | Opis                                                                                           |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `--vector`  | wektor `CVSS:4.0` | Ocenia jeden wektor. Powtórz, aby ocenić kilka, każdy w osobnej linii, w tej samej kolejności. |
| `--explain` |                   | Dodaje pod każdą linią z oceną objaśnienie każdej metryki prostymi słowami.                    |

Wymagana jest co najmniej jedna opcja `--vector`. Wektor nigdy nie jest samodzielnym argumentem pozycyjnym, więc nie da się go pomylić z flagą.

**Dlaczego wartość flagi**

Każdy wektor trafia do hooka jako wartość flagi i nigdy nie jest wstawiany do polecenia. Wartość z cudzysłowami lub backtickami pozostaje nieszkodliwa i nie może niczego wstrzyknąć do powłoki. Zawsze ujmuj ją w apostrofy, aby powłoka nie rozwinęła jej wcześniej.

**Czego nie obejmuje**

Tylko CVSS v4.0: hook odrzuca wektor w wersji v2.0, v3.0 lub v3.1, zamiast go ocenić, bo **Lagune** ocenia każde ustalenie w wersji v4.0.

**Wskazówka**

Walidacja fazy plan powtarza te same obliczenia dla każdej linii CVSS, więc wynik, który rozminął się ze swoim wektorem, zostaje wychwycony, zanim plan zostanie zaakceptowany.

## Najczęściej zadawane pytania

### Jak Lagune oblicza wynik CVSS?

Hook cvss liczy według referencyjnego kalkulatora FIRST dla CVSS v4.0, więc wektor otrzymuje dokładnie taki sam wynik jak na stronie FIRST.

### Czy mogę nim ocenić wektor CVSS v3.1?

Nie. Lagune ocenia każde ustalenie w CVSS v4.0, a hook odrzuca każdą inną wersję, zamiast ją oceniać.

### Do czego służy flaga --explain?

Objaśnia każdą metrykę prostymi słowami i pokazuje wynik Base obok wyniku ogólnego, dzięki czemu każdy widzi, co mówi wektor i jak kontekst projektu zmienił wynik.
