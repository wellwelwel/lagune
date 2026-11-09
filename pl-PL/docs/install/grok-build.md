# Instalacja wtyczki Lagune w Grok Build

> Zainstaluj wtyczkę Lagune w Grok Build, aktualizuj ją i z góry zezwól na działanie jej silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/grok-build
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/grok-build
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
grok plugin update lagune
```

## Polecenia

Wpisuj nazwy poleceń, na przykład `/lagune-charter`, albo poprzedzaj je nazwą wtyczki, na przykład `/lagune:lagune-charter`.

---

**Uprawnienia**

Silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. Aby z góry zezwolić na ich użycie, dodaj te reguły do pliku `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Gdy silnik działa przez **npx**, jak w przypadku **skills.sh**, zezwól na `Bash(npx --yes lagune@*)`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Grok Build?

Uruchom grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Jak zaktualizować wtyczkę Lagune w Grok Build?

Uruchom grok plugin update lagune.

### Jak uruchamiać polecenia Lagune w Grok Build?

Wpisuj ich nazwy, na przykład /lagune-charter, albo poprzedzaj je nazwą wtyczki, na przykład /lagune:lagune-charter.

### Czy Grok Build może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. W konfiguracji Grok Build zezwól na MCPTool(lagune__lagune_read) i MCPTool(lagune__lagune_write), a gdy silnik działa przez npx, także na Bash(npx --yes lagune@*).
