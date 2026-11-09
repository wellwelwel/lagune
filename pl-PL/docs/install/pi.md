# Instalacja pakietu Lagune w Pi

> Zainstaluj pakiet Lagune w Pi z npm lub z serwisu GitHub i aktualizuj go.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/pi
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/pi
Ostatnia aktualizacja: 2026-11-09

**npm**

Zainstaluj pakiet z terminala:

```bash
pi install npm:lagune
```

**GitHub**

Zainstaluj najnowszy commit z serwisu **GitHub**. Ta wersja uruchamia silnik przez **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Aktualizacja

**npm**

Aby zaktualizować pakiet **Lagune**, uruchom:

```bash
pi update npm:lagune
```

**GitHub**

Aby zaktualizować pakiet **Lagune**, uruchom:

```bash
pi update git:github.com/wellwelwel/lagune
```

Polecenie `pi update --extensions` aktualizuje wszystkie zainstalowane pakiety, a samo `pi update` aktualizuje tylko **Pi**.

## Polecenia

Wpisuj polecenia z prefiksem `skill:`, na przykład `/skill:lagune-charter` zamiast `/lagune-charter`.

## Najczęściej zadawane pytania

### Jak zainstalować pakiet Lagune w Pi?

Uruchom pi install npm:lagune albo pi install git:github.com/wellwelwel/lagune, aby zainstalować najnowszy commit z serwisu GitHub.

### Jak zaktualizować pakiet Lagune w Pi?

Uruchom pi update npm:lagune albo pi update git:github.com/wellwelwel/lagune, jeśli pakiet pochodzi z serwisu GitHub. Polecenie pi update --extensions aktualizuje wszystkie zainstalowane pakiety.

### Jak uruchamiać polecenia Lagune w Pi?

Wpisuj je z prefiksem skill:, na przykład /skill:lagune-charter.
