# Instalacja rozszerzenia Lagune w Gemini CLI

> Zainstaluj rozszerzenie Lagune w Gemini CLI, aktualizuj je i z góry zezwól na działanie jego silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/gemini-cli
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/gemini-cli
Ostatnia aktualizacja: 2026-11-09

Zainstaluj rozszerzenie z terminala:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Aktualizacja

Aby zaktualizować rozszerzenie **Lagune**, uruchom:

```bash
gemini extensions update lagune
```

Aby aktualizacje instalowały się automatycznie, zainstaluj rozszerzenie z flagą `--auto-update`.

## Polecenia

Wpisuj polecenia poprzedzone nazwą rozszerzenia, na przykład `/lagune:lagune-charter` zamiast `/lagune-charter`.

---

**Uprawnienia**

Silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. **Gemini CLI** uruchamia je wyłącznie w zaufanym folderze. Aby z góry zezwolić na ich użycie, zapisz tę regułę w pliku `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Gdy silnik działa przez **npx**, jak w przypadku **skills.sh**, dodaj do tego samego pliku tę regułę:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Najczęściej zadawane pytania

### Jak zainstalować rozszerzenie Lagune w Gemini CLI?

Uruchom gemini extensions install https://github.com/wellwelwel/lagune.

### Jak zaktualizować rozszerzenie Lagune w Gemini CLI?

Uruchom gemini extensions update lagune albo zainstaluj rozszerzenie z flagą --auto-update.

### Jak uruchamiać polecenia Lagune w Gemini CLI?

Wpisuj je poprzedzone nazwą rozszerzenia, na przykład /lagune:lagune-charter.

### Czy Gemini CLI może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. Dodaj regułę polityki, która zezwala na narzędzia lagune_read i lagune_write serwera lagune, a gdy silnik działa przez npx, także regułę dla run_shell_command z npx --yes lagune@ i numerem wersji.
