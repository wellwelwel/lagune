# Установка: усиление безопасности для любого ИИ-агента

> Установите Lagune в любой проект как плагин, если ваш агент их поддерживает, или через CLI skills в остальных случаях, а затем выберите подходящие специализации по безопасности.

Канонический URL: https://lagune.ai/ru-RU/docs
Язык: ru-RU
Оригинал: https://lagune.ai/docs
Последнее обновление: 2026-11-04

**Lagune** помогает вашему ИИ-агенту сделать проект безопаснее. Вы указываете на свой код, агент разбирается, что на самом деле делает ваша система, а затем ведет вас через ту работу по безопасности, которая для нее важна. **Lagune** является первым проектом методологии [Security-Driven Hardening (SDH)](https://lagune.ai/ru-RU/docs/references/paper).

**Поддержите открытый код**

Нравится **Lagune**? [Поставьте нам ⭐ на **GitHub**](https://github.com/wellwelwel/lagune)

## Выберите агента

- [Claude Code](https://lagune.ai/ru-RU/docs/install/claude-code): Агентный инструмент для программирования от Anthropic
- [Codex](https://lagune.ai/ru-RU/docs/install/codex): Агент для программирования от OpenAI
- [Cursor](https://lagune.ai/ru-RU/docs/install/cursor): Редактор кода с ИИ
- [GitHub Copilot](https://lagune.ai/ru-RU/docs/install/github-copilot-cli): ИИ-напарник по программированию от GitHub
- [Gemini CLI](https://lagune.ai/ru-RU/docs/install/gemini-cli): Открытый агент для терминала от Google
- [Antigravity](https://lagune.ai/ru-RU/docs/install/antigravity-cli): Платформа агентной разработки от Google
- [OpenCode](https://lagune.ai/ru-RU/docs/install/opencode): Открытый агент для программирования
- [Devin for Terminal](https://lagune.ai/ru-RU/docs/install/devin-cli): Агент для терминала от Cognition
- [Factory Droid](https://lagune.ai/ru-RU/docs/install/factory-droid): Агент для разработки ПО от Factory
- [Grok Build](https://lagune.ai/ru-RU/docs/install/grok-build): Агент для программирования от xAI
- [Qwen Code](https://lagune.ai/ru-RU/docs/install/qwen-code): Агент для программирования в терминале от Qwen
- [Kimi Code](https://lagune.ai/ru-RU/docs/install/kimi-code): Агент для программирования от Moonshot AI
- [Muse Code](https://lagune.ai/ru-RU/docs/install/muse-code): Агент для программирования от Meta
- [Pi](https://lagune.ai/ru-RU/docs/install/pi): Минималистичный агент для программирования в терминале
- [Hermes Agent](https://lagune.ai/ru-RU/docs/install/hermes-agent): Открытый агент от Nous Research
- [Универсальная установка](https://lagune.ai/ru-RU/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed и еще 66

**Информация**

- Внутри **Lagune** работает на **Node.js**, но вы пишете на любом языке.
- Чтобы работать полностью офлайн, установите **Lagune** в проект командой `npm i -D lagune@0.17.0`.

## Категории

Знания **Lagune** о безопасности поставляются в виде [**специализаций**](https://lagune.ai/ru-RU/docs/catalog), сгруппированных по [**категориям**](https://lagune.ai/ru-RU/docs/categories).

- **OWASP** (`owasp`): Защита от рисков безопасности приложений, которые отслеживает OWASP: инъекций, нарушения контроля доступа, сбоев аутентификации и криптографии
- **Инфраструктура** (`infra`): Защита конфигурации контейнеров, рабочих нагрузок и serverless: Dockerfile, Compose, безопасность подов, IAM и триггеры FaaS
- **ИИ / LLM** (`ai`): Защита интеграций с ИИ и LLM от prompt injection и небезопасного подключения инструментов, агентов, поиска данных и MCP
- **Lovable** (`lovable`): Защита сгенерированных ИИ приложений на Supabase (Lovable и подобных): пробелы в RLS, утечки ключей service_role и небезопасные настройки по умолчанию
- **JavaScript** (`javascript`): Защита JavaScript и его сред выполнения от RCE через eval и child_process, path traversal и prototype pollution
- **Python** (`python`): Защита Python от RCE через десериализацию pickle и YAML, обхода через строки str.format и class pollution
- **Rust** (`rust`): Защита Rust от некорректных unsafe API, неправильного использования transmute, целочисленного переполнения и неопределенного поведения на границе FFI
- **Java** (`java`): Защита Java от цепочек гаджетов десериализации ObjectInputStream, ведущих к удаленному выполнению кода
- **Ruby** (`ruby`): Защита Ruby от цепочек гаджетов десериализации Marshal.load и YAML, ведущих к удаленному выполнению кода
- **PHP** (`php`): Защита PHP от обхода аутентификации через type juggling, цепочек гаджетов object injection и небезопасных настроек по умолчанию
- **Go** (`go`): Защита Go от ошибок с typed nil в интерфейсах, data races в горутинах и небезопасной конкурентности на путях безопасности
- **C / C++** (`c-cpp`): Защита C и C++ от ошибок форматных строк, переполнений буфера и записи за границами памяти, ведущих к выполнению кода
- **.NET** (`dotnet`): Защита .NET и C# от RCE через десериализацию BinaryFormatter и обходов кодировщиков, ведущих к XSS

Выполните `npx lagune write add --categories` с ключами выбранных категорий.

**Совет**

Проект начинается с `owasp`, а [`/lagune-charter`](https://lagune.ai/ru-RU/docs/commands/charter) добавляет категории, которые подтверждает анализ проекта.

## Требования

В системе должен быть установлен [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager).

## Добавьте бейдж ✨

Используете **Lagune**? Добавьте бейдж в свой **README**:

**Двухцветный**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Одноцветный**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Что дальше

Узнайте, что делает каждый из [**навыков**](https://lagune.ai/ru-RU/docs/get-started/commands) **Lagune**.

## Частые вопросы

### Что такое Lagune?

Lagune представляет собой открытый процесс безопасности, ориентированный только на защиту, который помогает вашему ИИ-агенту усилить защиту любой кодовой базы. Вы указываете на свой код, Lagune выявляет, что на самом деле делает ваша система, и направляет исправления безопасности, важные именно в этом контексте.

### Как установить Lagune?

Выберите своего агента: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI и Hermes Agent устанавливают Lagune как плагин, Gemini CLI и Qwen Code как расширение, Pi как пакет, а любой другой агент через npx skills add wellwelwel/lagune. Lagune работает и в новых, и в существующих проектах.

### Нужен ли Lagune API-ключ?

Нет. Lagune работает через вашего собственного ИИ-агента, поэтому API-ключи не нужны.

### Какие требования?

В системе должен быть установлен Node.js (LTS).

### Какие языки программирования поддерживает Lagune?

Любые. Внутри Lagune работает на Node.js, но проводит аудит и усиливает защиту проектов на любом языке программирования.

### Что Lagune добавляет в мой проект?

Директорию .lagune/ с состоянием безопасности вашего проекта, которую создает первая команда, записывающая данные. CLI skills также устанавливает slash-команды в проект, где их читает ваш агент, а плагин хранит их внутри агента.

### Как обновить Lagune?

Так же, как вы его установили. На странице установки каждого агента показано, как обновить Lagune в нем, а CLI skills обновляет его командой npx skills update. Ваши принципы безопасности, артефакты фаз и собственные специализации остаются нетронутыми.

### Какие специализации использует проект?

Встроенные специализации его категорий плюс собственные. Принципы безопасности фиксируют категории, которые подтверждает анализ проекта, а npx lagune write add --categories их меняет.

### Нужно ли закончить разработку, прежде чем защищать проект?

Нет. Команда /lagune усиливает защиту кода прямо во время написания: она принимает любой промпт, создает то, что вы попросили, и защищает результат безопасными настройками по умолчанию, следуя принципам безопасности. Пятифазный процесс Blue Team проводит аудит того, что уже есть.

### Может ли Lagune провести аудит существующего проекта?

Да. Пятифазный процесс Blue Team проводит аудит того, что уже есть: charter задает ваши правила безопасности, detect выявляет, что делает система и где находятся риски, plan оценивает каждую находку и подбирает к ней исправление, harden применяет исправления, а verify доказывает, что они действуют, и закрывает их.

### Чем использование Lagune отличается от простой просьбы к агенту найти уязвимости и проблемы безопасности?

Агент, читающий код сам по себе, находит то, что похоже на уязвимость, и пропускает то, что похоже на меру защиты. Список заблокированных адресов выглядит так, будто кто-то уже справился с риском, поэтому никто не проверяет, что он пропускает большинство адресов, и код уходит в продакшен. Lagune переворачивает это поведение по умолчанию: защита, которая уже есть в коде, считается недоказанной, пока ее не проверят, каждая специализация из каталога получает явный вердикт, а verify спрашивает, исчез ли риск, а не есть ли мера защиты. Каждая находка также остается одним отслеживаемым элементом между запусками, поэтому ее можно доказанно закрыть и снять с учета, тогда как простая просьба каждый раз дает новый отчет, который не с чем сравнить.

### Чем разработка с Lagune отличается от простой просьбы к агенту писать безопасный код?

Просьба писать безопасный код оставляет определение безопасности агенту и предполагает, что вы знаете, о чем просить. Требование обычно уже скрыто в вашей просьбе, и ни вы, ни агент его не замечаете: просьба сделать страницу с курсами, к которым у пользователя есть доступ, задает правило авторизации, а проверка, которую так и не написали, не оставляет в коде ничего, что можно было бы заметить. Команда /lagune загружает ваши принципы безопасности и специализации, подходящие к тому, что предстоит создать, еще до первой строки кода, а затем перечитывает результат, сверяя его с примененной защитой. Безопасный вариант редко обходится дороже небезопасного, поэтому исход решает знание того, какой из них выбрать, и именно это знание приходит заранее.

### Выполняет ли Lagune DAST (Dynamic Application Security Testing) или тестирует мое работающее приложение?

Нет. Lagune читает код и никогда не запускает вашу систему и не отправляет ей специально сформированные запросы. Verify подтверждает, что мера защиты присутствует в исходном коде и реализована правильно, а это другой вопрос, чем выдержит ли она атаку на работающую систему, поэтому "по коду определить нельзя" является законным вердиктом, а не молчаливым прохождением проверки. DAST отвечает на вопрос о времени выполнения, а Lagune на вопрос об исходном коде, поэтому ни один не заменяет другой. Даже необязательная команда prove держится этой границы: ее тесты проверяют безопасное поведение и никогда не содержат атакующую нагрузку.

### Заменяет ли Lagune пентест (тестирование на проникновение)?

Нет, определенно нет! Пентест представляет собой санкционированную работу, в которой специалист применяет собственное суждение к вашей работающей системе, выстраивая цепочки из находок и исследуя бизнес-логику, которую не описывает ни одно правило для отдельной поверхности. Находки пентеста можно передать в процесс Blue Team от Lagune как опасения для фазы detect, чтобы то, о чем сообщил специалист, было спланировано, исправлено и проверено.

## Политика безопасности

Ознакомьтесь с [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Лицензия

**Lagune** распространяется по лицензии [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-н. в. [Weslley Araújo](https://github.com/wellwelwel) и [участники](https://github.com/wellwelwel/lagune/graphs/contributors).
