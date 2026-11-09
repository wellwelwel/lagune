# Instalacja rozszerzenia Lagune w Qwen Code

> Zainstaluj rozszerzenie Lagune w Qwen Code, aktualizuj je i z góry zezwól na działanie jego silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/qwen-code
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/qwen-code
Ostatnia aktualizacja: 2026-11-09

Zainstaluj rozszerzenie z terminala:

```bash
qwen extensions install lagune
```

## Aktualizacja

Aby zaktualizować rozszerzenie **Lagune**, uruchom:

```bash
qwen extensions update lagune
```

Aby rozszerzenie aktualizowało się automatycznie, zainstaluj je z opcją `--auto-update`.

## Polecenia

Wpisuj polecenia poprzedzone nazwą rozszerzenia, na przykład `/lagune:lagune-charter` zamiast `/lagune-charter`.

---

**Uprawnienia**

Silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. Aby z góry zezwolić na ich użycie, dodaj te reguły do pliku `.qwen/settings.json` dla jednego projektu albo do pliku `~/.qwen/settings.json` dla wszystkich projektów:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Gdy silnik działa przez **npx**, jak w przypadku **skills.sh**, zezwól na `Shell(npx --yes lagune@*)`.

## Najczęściej zadawane pytania

### Jak zainstalować rozszerzenie Lagune w Qwen Code?

Uruchom qwen extensions install lagune.

### Jak zaktualizować rozszerzenie Lagune w Qwen Code?

Uruchom qwen extensions update lagune albo zainstaluj rozszerzenie z opcją --auto-update.

### Jak uruchamiać polecenia Lagune w Qwen Code?

Wpisuj je poprzedzone nazwą rozszerzenia, na przykład /lagune:lagune-charter.

### Czy Qwen Code może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. W ustawieniach Qwen Code zezwól na mcp__lagune__lagune_read i mcp__lagune__lagune_write, a gdy silnik działa przez npx, także na Shell(npx --yes lagune@*).
