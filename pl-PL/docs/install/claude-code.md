# Instalacja wtyczki Lagune w Claude Code

> Zainstaluj wtyczkę Lagune w Claude Code, w terminalu, w rozszerzeniu lub w aplikacji desktopowej, aktualizuj ją i z góry zezwól na działanie jej silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/claude-code
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/claude-code
Ostatnia aktualizacja: 2026-11-09

**Terminal**

Zainstaluj wtyczkę z terminala:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Albo w sesji **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Rozszerzenie**

- Wpisz `/plugin` i wybierz **Manage plugins**.
- Na karcie **Marketplaces** dodaj `wellwelwel/lagune`.
- Na karcie **Plugins** zainstaluj `lagune`.

**Desktop**

- Zainstaluj wtyczkę **Lagune** z terminala lub z rozszerzenia, wybierając w rozszerzeniu **Install for you**.
- Rozpocznij nową sesję w aplikacji desktopowej, która wczytuje wtyczki, które instalujesz dla siebie.

## Aktualizacja

**Terminal**

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Aby aktualizacje instalowały się automatycznie, wybierz **Enable auto-update** dla marketplace'u `lagune` w menu `/plugin`.

**Rozszerzenie**

- Wpisz `/plugin` i wybierz **Manage plugins**.
- Otwórz kartę **Marketplaces**.
- Kliknij ikonę odświeżania przy `lagune`.

**Desktop**

- Zaktualizuj wtyczkę **Lagune** z terminala lub z rozszerzenia.
- Rozpocznij nową sesję w aplikacji desktopowej.

## Polecenia

Wpisuj nazwy poleceń, na przykład `/lagune-charter`, albo poprzedzaj je nazwą wtyczki, na przykład `/lagune:lagune-charter`.

---

**Uprawnienia**

Silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. Aby z góry zezwolić na ich użycie, dodaj te reguły do pliku `.claude/settings.json` dla jednego projektu albo do pliku `~/.claude/settings.json` dla wszystkich projektów:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Gdy silnik działa przez **npx**, jak w przypadku **skills.sh**, zezwól na `Bash(npx --yes lagune@*)`. Jeśli sandbox jest włączony, dodaj też `registry.npmjs.org` do listy `sandbox.network.allowedDomains`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Claude Code?

Uruchom claude plugin install lagune --marketplace wellwelwel/lagune. W sesji lub w rozszerzeniu dodaj w menedżerze wtyczek marketplace wellwelwel/lagune i zainstaluj lagune. Aplikacja desktopowa wczyta wtyczkę, gdy zainstalujesz ją dla siebie w terminalu lub w rozszerzeniu.

### Jak zaktualizować wtyczkę Lagune w Claude Code?

Uruchom claude plugin marketplace update lagune, a następnie claude plugin update lagune@lagune albo wybierz Enable auto-update dla marketplace'u lagune w menu /plugin. W rozszerzeniu otwórz Manage plugins z poziomu /plugin i kliknij ikonę odświeżania marketplace'u lagune. Aplikacja desktopowa wczyta aktualizację w następnej sesji.

### Jak uruchamiać polecenia Lagune w Claude Code?

Wpisuj ich nazwy, na przykład /lagune-charter, albo poprzedzaj je nazwą wtyczki, na przykład /lagune:lagune-charter.

### Czy Claude Code może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. W ustawieniach Claude Code zezwól na mcp__plugin_lagune_lagune__lagune_read i mcp__plugin_lagune_lagune__lagune_write, a gdy silnik działa przez npx, także na Bash(npx --yes lagune@*).
