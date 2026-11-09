# Hook infra: Wykrywanie błędnej konfiguracji IaC

> Przeszukuj Terraform, pliki Dockerfile i GitHub Actions pod kątem błędnej konfiguracji albo oceniaj pojedynczy fragment kodu z wiersza poleceń.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/infra
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/infra
Ostatnia aktualizacja: 2026-11-09

Hook `infra` zgłasza **błędną konfigurację infrastruktury jako kodu (IaC)**, którą da się rozstrzygnąć na podstawie samego pliku: sieć otwartą na cały świat, uprawnienie z symbolem wieloznacznym, sekret w manifeście, kontener działający jako root, niezaufaną wartość w powłoce CI. Czyta wyłącznie pliki IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). To deterministyczny silnik stojący za [specjalizacją `infra`](https://lagune.ai/pl-PL/docs/catalog), działający w trybie **scan** lub **check**.

## Uruchamianie

**Przeszukaj bazę kodu**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Sprawdź fragment kodu**

Przekaż fragment kodu w opcji `--pattern`, a jego rodzaj w opcji `--kind` (`terraform`, `dockerfile` lub `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Skanowanie wypisuje maksymalnie dwie sekcje. **Infrastructure risks found** zawiera rozstrzygalne usterki (regułę ingress dla `0.0.0.0/0` na wrażliwym porcie, instrukcję IAM z symbolem wieloznacznym, sekret w manifeście, `encrypted = false`, moduł git bez przypiętej wersji, obraz, który jawnie działa jako root, `curl | sh`, wstrzyknięcie skryptu w CI, `permissions: write-all`), a gdy się pojawi, hook kończy działanie z niezerowym kodem wyjścia. **Infrastructure hardening advisories** nie zmienia kodu wyjścia (zmienny tag obrazu bazowego, akcja przypięta tylko do tagu). Gdy nic nie znajdzie, hook wypisuje `no infrastructure risks found`.

## Jak odczytać werdykt

Tryb check wypisuje dopasowany tag o najwyższym poziomie zagrożenia (na przykład `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), tag zalecenia (`mutable-tag`, `unpinned-action`) albo `safe`. Niezerowy kod wyjścia daje tylko tag rangi ustalenia.

### Opcje CLI

| Opcja       | Wartość                                         | Opis                                                                         |
| ----------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `--pattern` | fragment kodu                                   | Sprawdza jeden fragment kodu. Wymaga `--kind`. Powtórz, aby sprawdzić kilka. |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Rodzaj pliku, według którego oceniany jest fragment.                         |
| `--dir`     | folder                                          | Ogranicza skanowanie do folderu. Można powtarzać i łączyć z `--file`.        |
| `--file`    | plik                                            | Ogranicza skanowanie do jednego pliku. Można powtarzać i łączyć z `--dir`.   |

Bez żadnej opcji hook przeszukuje każdy plik IaC w projekcie. Opcji `--pattern` nie można łączyć z `--dir` ani `--file`.

### Wybierz, co hook przeszukuje

Hook pomija to, co ignoruje **Git**. Aby pominąć więcej albo przeszukać to, co ignoruje **Git**, nadaj hookowi `infra` własne ustawienia:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure) opisuje każde ustawienie.

**Wskazówka**

Hook wychwytuje oczywiste, rozstrzygalne przypadki: brak szyfrowania, ekspozycja przez `pull_request_target` i właściwy zakres IAM wymagają oceny, którą nadal zapewnia [specjalizacja `infra`](https://lagune.ai/pl-PL/docs/catalog).

## Najczęściej zadawane pytania

### Jakie pliki infrastruktury czyta hook infra?

Terraform/HCL (.tf, .tf.json, .hcl), pliki Dockerfile oraz pliki YAML z workflowami i akcjami GitHub Actions w .github/. Hook dociera do tych plików, mimo że skanery kodu źródłowego je pomijają.
