# Schemat konfiguracji

> JSON Schema konfiguracji projektu Lagune do autouzupełniania i walidacji w edytorze, zgodny z aktualną wersją Lagune albo przypięty do konkretnej wersji.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/references/configs-schema
Język: pl-PL
Oryginał: https://lagune.ai/docs/references/configs-schema
Ostatnia aktualizacja: 2026-11-09

Plik `.lagune/configs.json` zapisuje [**kategorie**](https://lagune.ai/pl-PL/docs/categories), z których korzysta projekt, indeksuje jego własne [**specjalizacje**](https://lagune.ai/pl-PL/docs/catalog) i określa, co pomijają [**narzędzia sprawdzające**](https://lagune.ai/pl-PL/docs/hooks/configure). Dzięki jego schematowi JSON Schema edytor podpowiada każde pole i zgłasza literówkę lub nieznaną kategorię, gdy edytujesz plik.

## Aktualny schemat

Za każdym razem, gdy **Lagune** zapisuje plik i nie znajduje w nim `$schema`, ustawia w nim adres aktualnego schematu:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Ten adres zawsze odpowiada aktualnej wersji **Lagune**. Plik zapisany przed wersją **Lagune** 0.16.0 dostanie go przy najbliższej zmianie, a do tego czasu każda faza zwraca na to uwagę.

## Przypinanie wersji

Każde wydanie **Lagune** od wersji 0.16.0 zawiera schemat w takiej postaci, jaką miał w tej wersji, opublikowany w **npm** i udostępniany przez **jsDelivr**. Aby przypiąć wersję, wpisz ją po `lagune@` w adresie `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Jako wersję możesz podać dowolny zakres semver:

| Wersja              | Schemat                          |
| ------------------- | -------------------------------- |
| `0.16.0`            | Z wersji 0.16.0                  |
| `0.16.x` lub `0.16` | Z najnowszego wydania serii 0.16 |
| `0.x` lub `0`       | Z najnowszego wydania serii 0.x  |
| `latest`            | Z najnowszego wydania            |

## Najczęściej zadawane pytania

### Czy Lagune potrzebuje schematu?

Nie. Schemat pomaga tylko edytorowi, a Lagune czyta plik tak samo z $schema i bez niego.

### Czy Lagune nadpisze przypięty schemat?

Nie. Lagune zapisuje $schema tylko wtedy, gdy plik go nie zawiera, i zachowuje każdy adres, który ustawisz.

### Kiedy warto przypiąć wersję?

Gdy projekt korzysta z konkretnej wersji Lagune, aby edytor walidował plik zgodnie z tym, co akceptuje ta wersja.
