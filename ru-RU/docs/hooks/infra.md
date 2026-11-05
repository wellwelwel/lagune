# Хук infra: обнаружение ошибок конфигурации IaC

> Проверьте Terraform, Dockerfile и GitHub Actions на ошибки конфигурации или оцените отдельный фрагмент из командной строки.

Канонический URL: https://lagune.ai/ru-RU/docs/hooks/infra
Язык: ru-RU
Оригинал: https://lagune.ai/docs/hooks/infra
Последнее обновление: 2026-11-05

Хук `infra` помечает **ошибки конфигурации инфраструктуры как кода**, которые можно определить по самому файлу: сеть, открытую всему миру, разрешение с подстановочным знаком, секрет в манифесте, контейнер, работающий от root, недоверенное значение в оболочке CI. Он читает только файлы IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Это детерминированный движок, стоящий за [специализацией `infra`](https://lagune.ai/ru-RU/docs/catalog), в режиме **scan** или **check**.

## Запуск

**Сканировать кодовую базу**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Проверить фрагмент**

Передайте фрагмент через `--pattern`, а его тип через `--kind` (`terraform`, `dockerfile` или `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Сканирование выводит до двух разделов. **Infrastructure risks found** дает ненулевой код выхода и содержит дефекты, которые можно определить однозначно (входящий трафик `0.0.0.0/0` на чувствительный порт, инструкцию IAM с подстановочным знаком, секрет в манифесте, `encrypted = false`, незакрепленный git-модуль, образ, который явно запускается от root, `curl | sh`, внедрение в скрипт CI, `permissions: write-all`). **Infrastructure hardening advisories** не меняет код выхода (изменяемый тег базового образа, action, закрепленный по тегу). Если ничего не найдено, выводится `no infrastructure risks found`.

## Как читать вердикт

Режим проверки выводит совпавший тег с наивысшей критичностью (например, `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), рекомендательный тег (`mutable-tag`, `unpinned-action`) или `safe`. Ненулевой код выхода дает только тег уровня находки.

### Параметры CLI

| Параметр    | Значение                                        | Описание                                                                      |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `--pattern` | фрагмент                                        | Проверяет один фрагмент. Требует `--kind`. Повторите для нескольких.          |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Тип, по которому оценивается фрагмент.                                        |
| `--dir`     | директория                                      | Ограничивает сканирование директорией. Можно повторять и сочетать с `--file`. |
| `--file`    | файл                                            | Ограничивает сканирование одним файлом. Можно повторять и сочетать с `--dir`. |

Без параметров хук сканирует каждый файл IaC в проекте. `--pattern` не сочетается с `--dir` или `--file`.

### Выберите, что сканировать

Хук пропускает то, что игнорирует **Git**. Чтобы исключить больше или сканировать то, что игнорирует **Git**, задайте хуку `infra` собственные настройки:

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

Все настройки описаны на странице [Настройка хуков](https://lagune.ai/ru-RU/docs/hooks/configure).

**Совет**

Хук ловит грубые, однозначно определяемые случаи: отсутствие шифрования, открытость через `pull_request_target` и правильный охват IAM остаются вопросами суждения, которые по-прежнему охватывает [специализация `infra`](https://lagune.ai/ru-RU/docs/catalog).

## Частые вопросы

### Какие файлы инфраструктуры читает хук infra?

Terraform и HCL (.tf, .tf.json, .hcl), Dockerfile, а также YAML рабочих процессов и actions GitHub Actions в .github/. Он добирается до этих файлов, хотя сканеры исходного кода их пропускают.
