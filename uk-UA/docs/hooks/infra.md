# Хук infra: виявлення помилок конфігурації IaC

> Перевірте Terraform, Dockerfile і GitHub Actions на помилки конфігурації або оцініть окремий фрагмент просто з командного рядка.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/hooks/infra
Мова: uk-UA
Оригінал: https://lagune.ai/docs/hooks/infra
Останнє оновлення: 2026-11-05

Хук `infra` позначає **помилки конфігурації інфраструктури як коду**, які можна визначити з самого файлу: мережу, відкриту для всього світу, дозвіл із wildcard, секрет у маніфесті, контейнер від root, недовірене значення в shell CI. Він читає лише файли IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Це детермінований рушій [спеціалізації `infra`](https://lagune.ai/uk-UA/docs/catalog) у режимі **scan** або **check**.

## Запуск

**Перевірити кодову базу**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Перевірити фрагмент**

Передайте фрагмент через `--pattern`, а його тип через `--kind` (`terraform`, `dockerfile` або `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Перевірка виводить до двох розділів. **Infrastructure risks found** завершується з ненульовим кодом і містить дефекти, які можна визначити (вхідний трафік `0.0.0.0/0` на чутливий порт, інструкція IAM із wildcard, секрет у маніфесті, `encrypted = false`, незакріплений git-модуль, образ, що явно працює від root, `curl | sh`, ін'єкція в скрипт CI, `permissions: write-all`). **Infrastructure hardening advisories** не змінює код виходу (змінний базовий тег, дія, закріплена за тегом). Чистий запуск виводить `no infrastructure risks found`.

## Як читати вердикт

Режим check виводить тег найвищої критичності, який збігся (наприклад, `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), рекомендаційний тег (`mutable-tag`, `unpinned-action`) або `safe`. Ненульовий код виходу дає лише тег рівня знахідки.

### Параметри CLI

| Параметр    | Значення                                        | Опис                                                                   |
| ----------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `--pattern` | фрагмент                                        | Перевірити один фрагмент. Потребує `--kind`. Повторіть для кількох.    |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Тип, як який оцінюється фрагмент.                                      |
| `--dir`     | каталог                                         | Обмежити перевірку каталогом. Повторюється й поєднується з `--file`.   |
| `--file`    | файл                                            | Обмежити перевірку одним файлом. Повторюється й поєднується з `--dir`. |

Без параметрів хук перевіряє кожен файл IaC у проєкті. `--pattern` не поєднується з `--dir` чи `--file`.

### Виберіть, що перевіряти

Хук пропускає те, що ігнорує **Git**. Щоб виключити більше або перевіряти те, що ігнорує **Git**, задайте хуку `infra` власні налаштування:

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

Усі налаштування описано на сторінці [Налаштування хуків](https://lagune.ai/uk-UA/docs/hooks/configure).

**Порада**

Хук виявляє очевидні випадки, які можна визначити: відсутність шифрування, вразливість через `pull_request_target` і правильний обсяг IAM і далі охоплює [спеціалізація `infra`](https://lagune.ai/uk-UA/docs/catalog), бо це питання судження.

## Часті запитання

### Які файли інфраструктури читає хук infra?

Terraform і HCL (.tf, .tf.json, .hcl), Dockerfile, а також YAML робочих процесів і дій GitHub Actions у .github/. Він дістається до цих файлів, хоча сканери вихідного коду їх пропускають.
