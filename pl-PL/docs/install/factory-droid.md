# Instalacja wtyczki Lagune w Factory Droid

> Zainstaluj wtyczkę Lagune w Factory Droid, aktualizuj ją i zezwól na użycie narzędzi jej silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/factory-droid
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/factory-droid
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Polecenia

Wpisuj nazwy poleceń, na przykład `/lagune-charter`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Factory Droid?

Uruchom droid plugin marketplace add wellwelwel/lagune, a następnie droid plugin install lagune@lagune.

### Jak zaktualizować wtyczkę Lagune w Factory Droid?

Uruchom droid plugin marketplace update lagune, a następnie droid plugin update lagune@lagune.

### Jak uruchamiać polecenia Lagune w Factory Droid?

Wpisuj ich nazwy, na przykład /lagune-charter.

### Czy Factory Droid może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. Gdy Factory Droid zapyta o zgodę, wybierz stałe zezwolenie na lagune_read i lagune_write. Zapyta ponownie po zsynchronizowaniu nowego commita marketplace'u lagune.
