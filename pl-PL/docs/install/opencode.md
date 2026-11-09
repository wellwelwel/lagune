# Instalacja wtyczki Lagune w OpenCode

> Zainstaluj wtyczkę Lagune w OpenCode 1.x i 2.x i aktualizuj ją.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/opencode
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/opencode
Ostatnia aktualizacja: 2026-11-09

**OpenCode 2.x**

Zainstaluj wtyczkę z terminala:

```bash
opencode plugin add lagune
```

Albo dodaj ją do listy `plugins` w pliku `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Zainstaluj wtyczkę w swoim projekcie z terminala albo dodaj `-g`, aby zainstalować ją dla wszystkich swoich projektów:

```bash
opencode plugin lagune
```

Albo dodaj ją do listy `plugin` w pliku `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Aktualizacja

**OpenCode 2.x**

Aby zaktualizować wtyczkę **Lagune**, uruchom:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Aby zaktualizować wtyczkę **Lagune**, zainstaluj nową wersję w miejsce starej, dodając `-g`, jeśli wtyczka jest zainstalowana dla wszystkich twoich projektów:

```bash
opencode plugin lagune@0.18.1 --force
```

## Polecenia

**OpenCode 2.x**

Wpisz `@` i wybierz polecenie, na przykład `@lagune-charter`, a następnie dopisz swoją treść w tej samej wiadomości.

**OpenCode 1.x**

Wpisuj nazwy poleceń, na przykład `/lagune-charter`. Znajdziesz je na liście `/skills`, a nie w menu `/`.

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w OpenCode?

W OpenCode 2.x uruchom opencode plugin add lagune. W OpenCode 1.x uruchom opencode plugin lagune, dodając -g, aby zainstalować wtyczkę dla wszystkich swoich projektów.

### Jak zaktualizować wtyczkę Lagune w OpenCode?

W OpenCode 2.x uruchom opencode plugin update lagune, a następnie opencode reload. W OpenCode 1.x uruchom opencode plugin lagune@0.18.1 --force.

### Jak uruchamiać polecenia Lagune w OpenCode?

W OpenCode 2.x wpisz @ i wybierz polecenie, na przykład @lagune-charter, a następnie dopisz swoją treść w tej samej wiadomości. W OpenCode 1.x wpisuj je, podając ich nazwę, na przykład /lagune-charter, albo znajdź je na liście /skills.

### Czy OpenCode pyta o zgodę, zanim Lagune zacznie działać?

Nie. OpenCode uruchamia oba narzędzia silnika, lagune_read i lagune_write, bez pytania o zgodę.
