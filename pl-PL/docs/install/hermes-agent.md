# Instalacja wtyczki Lagune w Hermes Agent

> Zainstaluj wtyczkę Lagune w Hermes Agent i aktualizuj ją.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/hermes-agent
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/hermes-agent
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- Gdy **Hermes Agent** poprosi o potwierdzenie wtyczki spoza swojego katalogu, **potwierdź**.
- Gdy zaproponuje zainstalowanie zależności **Node.js** z repozytorium, **odmów**.

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
hermes plugins update lagune
```

## Polecenia

Wpisuj polecenia poprzedzone nazwą wtyczki, na przykład `/lagune:lagune-charter` zamiast `/lagune-charter` i `/lagune:lagune` zamiast `/lagune`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Hermes Agent?

Uruchom hermes plugins install wellwelwel/lagune --enable. Potwierdź wtyczkę, gdy pojawi się pytanie, i odmów zainstalowania zależności Node.js z repozytorium.

### Jak zaktualizować wtyczkę Lagune w Hermes Agent?

Uruchom hermes plugins update lagune.

### Jak uruchamiać polecenia Lagune w Hermes Agent?

Wpisuj je poprzedzone nazwą wtyczki, na przykład /lagune:lagune-charter i /lagune:lagune.
