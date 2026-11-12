# Instalacja wtyczki Lagune w Codex CLI

> Zainstaluj wtyczkę Lagune w Codex CLI, aktualizuj ją i uruchamiaj jej silnik w sandboxie.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/codex
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/codex
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
codex plugin marketplace upgrade lagune
```

## Polecenia

Wpisz `$` i polecenie poprzedzone nazwą wtyczki, a po nim własny tekst, na przykład `$lagune:lagune-charter` zamiast `/lagune-charter`. Po wpisaniu `$` pojawia się lista poleceń, a wybranie jednego z nich wstawia jego pełną nazwę.

---

**Sandbox**

Sandbox agenta **Codex** nie ma dostępu do sieci. Zainstaluj silnik w projekcie z własnego terminala, raz, a potem po każdej aktualizacji:

```bash
npm i -D lagune@0.18.2
```

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Codex CLI?

Uruchom codex plugin marketplace add wellwelwel/lagune, a następnie codex plugin add lagune@lagune.

### Jak zaktualizować wtyczkę Lagune w Codex CLI?

Uruchom codex plugin marketplace upgrade lagune.

### Jak uruchamiać polecenia Lagune w Codex CLI?

Wpisz $ i polecenie poprzedzone nazwą wtyczki, a po nim własny tekst, na przykład $lagune:lagune-charter.

### Czy Lagune działa w sandboxie agenta Codex?

Tak, gdy zainstalujesz silnik w projekcie poleceniem npm i -D lagune@0.18.2 z własnego terminala, raz, a potem po każdej aktualizacji.
