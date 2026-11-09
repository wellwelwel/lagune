# Instalacja wtyczki Lagune w Antigravity CLI

> Zainstaluj wtyczkę Lagune w Antigravity CLI, aktualizuj ją i z góry zezwól na działanie jej silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/antigravity-cli
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/antigravity-cli
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, zainstaluj ją ponownie:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Polecenia

Wpisuj polecenia poprzedzone nazwą wtyczki, na przykład `/lagune:lagune-charter` zamiast `/lagune-charter`.

---

**Uprawnienia**

Silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. Polecenie wysłane jako pierwsza wiadomość sesji uruchamia się, zanim narzędzia zostaną wczytane, dlatego zamiast nich używa **npx**. Aby z góry zezwolić na użycie narzędzi i **npx**, dodaj te reguły do pliku `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Antigravity CLI?

Uruchom agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Jak zaktualizować wtyczkę Lagune w Antigravity CLI?

Ponownie uruchom agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Jak uruchamiać polecenia Lagune w Antigravity CLI?

Wpisuj je poprzedzone nazwą wtyczki, na przykład /lagune:lagune-charter.

### Czy Antigravity CLI może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. W ustawieniach Antigravity CLI zezwól na mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) i command(regex:npx --yes lagune@[0-9.]+). Reguła dla npx obejmuje polecenie wysłane jako pierwsza wiadomość sesji.
