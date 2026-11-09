# Instalacja wtyczki Lagune w edytorze Cursor

> Zainstaluj wtyczkę Lagune w edytorze Cursor i w Cursor CLI, aktualizuj ją i z góry zezwól na działanie jej silnika.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/cursor
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/cursor
Ostatnia aktualizacja: 2026-11-09

**Cursor**

- Otwórz **Customize**.
- Wybierz **From GitHub Repository** i wpisz `https://github.com/wellwelwel/lagune`.
- Przy **Lagune** wybierz **Install** i wskaż zakres: projekt lub użytkownik.

**Cursor CLI**

- Dodaj marketplace z terminala:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Wpisz `/plugins` w sesji `agent`.
- Zainstaluj wtyczkę **Lagune**.

Jeśli wtyczka **Lagune** jest już zainstalowana w **Claude Code**, **Cursor CLI** wczyta ją stamtąd.

## Aktualizacja

**Cursor**

- Otwórz **Customize**.
- Dla marketplace'u `lagune` wybierz **Refresh**.

**Cursor CLI**

- Podmień marketplace z terminala:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Wpisz `/plugins` w sesji `agent`.
- Ponownie zainstaluj wtyczkę **Lagune**.

## Polecenia

Wpisuj nazwy poleceń, na przykład `/lagune-charter`.

---

**Uprawnienia**

W edytorze **Cursor** polecenia uruchamiają silnik przez **npx**, na co domyślny tryb Auto-review zezwala bez pytania.

W **Cursor CLI** silnik korzysta z dwóch narzędzi: `lagune_read` tylko odczytuje projekt, a `lagune_write` tylko zapisuje w folderze `.lagune/`. Aby z góry zezwolić na ich użycie, dodaj te reguły do pliku `.cursor/cli.json` dla jednego projektu albo do pliku `~/.cursor/cli-config.json` dla wszystkich projektów:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Gdy silnik działa przez **npx**, jak w przypadku **skills.sh**, zezwól na `Shell(npx:--yes lagune@*)`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w edytorze Cursor?

W edytorze Cursor otwórz Customize, wybierz From GitHub Repository, wpisz https://github.com/wellwelwel/lagune i zainstaluj wtyczkę Lagune. W Cursor CLI uruchom agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, a następnie zainstaluj wtyczkę Lagune w /plugins.

### Jak zaktualizować wtyczkę Lagune w edytorze Cursor?

W edytorze Cursor wybierz w Customize opcję Refresh dla marketplace'u lagune. W Cursor CLI usuń marketplace lagune, dodaj go ponownie, a następnie ponownie zainstaluj wtyczkę Lagune w /plugins.

### Jak uruchamiać polecenia Lagune w edytorze Cursor?

Wpisuj ich nazwy, na przykład /lagune-charter.

### Czy Cursor może uruchamiać polecenia Lagune bez pytania o zgodę?

Tak. Domyślny tryb Auto-review w edytorze Cursor już na to zezwala. W Cursor CLI zezwól na Mcp(plugin-lagune-lagune:lagune_read) i Mcp(plugin-lagune-lagune:lagune_write), a gdy silnik działa przez npx, także na Shell(npx:--yes lagune@*).
