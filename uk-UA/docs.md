# Встановлення: посилення захисту для будь-якого ШІ-агента

> Встановіть Lagune у будь-який проєкт як плагін, якщо ваш агент його підтримує, або через CLI skills в інших випадках, а потім оберіть спеціалізації з безпеки, що йому підходять.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs
Мова: uk-UA
Оригінал: https://lagune.ai/docs
Останнє оновлення: 2026-11-03

**Lagune** допомагає вашому ШІ-агенту зробити проєкт безпечнішим. Ви спрямовуєте його на свій код, агент з'ясовує, що насправді робить ваша система, а потім веде вас через роботу з безпеки, важливу саме для неї. **Lagune** є першим проєктом методології [Security-Driven Hardening (SDH)](https://lagune.ai/uk-UA/docs/references/paper).

**Підтримайте відкритий код**

Подобається **Lagune**? [Поставте нам ⭐ на **GitHub**](https://github.com/wellwelwel/lagune)

## Оберіть свій агент

- [Claude Code](https://lagune.ai/uk-UA/docs/install/claude-code): Агентний інструмент для програмування від Anthropic
- [Codex](https://lagune.ai/uk-UA/docs/install/codex): Агент для програмування від OpenAI
- [Cursor](https://lagune.ai/uk-UA/docs/install/cursor): Редактор коду зі ШІ
- [GitHub Copilot](https://lagune.ai/uk-UA/docs/install/github-copilot-cli): ШІ-напарник для програмування від GitHub
- [Gemini CLI](https://lagune.ai/uk-UA/docs/install/gemini-cli): Термінальний агент з відкритим кодом від Google
- [Antigravity](https://lagune.ai/uk-UA/docs/install/antigravity-cli): Платформа агентної розробки від Google
- [OpenCode](https://lagune.ai/uk-UA/docs/install/opencode): Агент для програмування з відкритим кодом
- [Devin for Terminal](https://lagune.ai/uk-UA/docs/install/devin-cli): Термінальний агент від Cognition
- [Factory Droid](https://lagune.ai/uk-UA/docs/install/factory-droid): Агент для розробки програмного забезпечення від Factory
- [Grok Build](https://lagune.ai/uk-UA/docs/install/grok-build): Агент для програмування від xAI
- [Qwen Code](https://lagune.ai/uk-UA/docs/install/qwen-code): Термінальний агент для програмування від Qwen
- [Kimi Code](https://lagune.ai/uk-UA/docs/install/kimi-code): Агент для програмування від Moonshot AI
- [Muse Code](https://lagune.ai/uk-UA/docs/install/muse-code): Агент для програмування від Meta
- [Pi](https://lagune.ai/uk-UA/docs/install/pi): Мінімалістичний термінальний агент для програмування
- [Hermes Agent](https://lagune.ai/uk-UA/docs/install/hermes-agent): Агент з відкритим кодом від Nous Research
- [Універсально](https://lagune.ai/uk-UA/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed та інші (66)

**Інформація**

- Під капотом **Lagune** працює на **Node.js**, але ви використовуєте будь-яку мову, яку хочете.
- Щоб працювати повністю офлайн, встановіть **Lagune** у свій проєкт командою `npm i -D lagune@0.18.0`.

## Категорії

Знання **Lagune** з безпеки надходять у вигляді [**спеціалізацій**](https://lagune.ai/uk-UA/docs/catalog), згрупованих у [**категорії**](https://lagune.ai/uk-UA/docs/categories).

- **OWASP** (`owasp`): Захищає від ризиків безпеки застосунків, які відстежує OWASP: ін'єкцій, порушень контролю доступу, збоїв автентифікації й криптографії
- **Інфраструктура** (`infra`): Захищає конфігурацію контейнерів, робочих навантажень і serverless: Dockerfile, Compose, безпеку Pod, IAM і тригери FaaS
- **ШІ / LLM** (`ai`): Захищає інтеграції зі ШІ та LLM від prompt injection і небезпечного підключення інструментів, агентів, пошуку даних і MCP
- **Lovable** (`lovable`): Захищає згенеровані ШІ застосунки на Supabase (Lovable і подібні): прогалини в RLS, витоки ключів service_role і небезпечні налаштування за замовчуванням
- **JavaScript** (`javascript`): Захищає JavaScript і його середовища виконання від RCE через eval і child_process, path traversal і prototype pollution
- **Python** (`python`): Захищає Python від RCE через десеріалізацію pickle і YAML, обходу через форматні рядки str.format і class pollution
- **Rust** (`rust`): Захищає Rust від некоректних unsafe API, неправильного використання transmute, переповнення цілих чисел і невизначеної поведінки на межі FFI
- **Java** (`java`): Захищає Java від ланцюжків гаджетів при десеріалізації через ObjectInputStream, що закінчуються віддаленим виконанням коду
- **Ruby** (`ruby`): Захищає Ruby від ланцюжків гаджетів при десеріалізації через Marshal.load і YAML, що ведуть до віддаленого виконання коду
- **PHP** (`php`): Захищає PHP від обходу автентифікації через type juggling, ланцюжків гаджетів через object injection і небезпечних налаштувань конфігурації за замовчуванням
- **Go** (`go`): Захищає Go від помилок із typed nil в інтерфейсах, data races між горутинами й небезпечної конкурентності в критичних для безпеки ділянках коду
- **C / C++** (`c-cpp`): Захищає C і C++ від помилок форматних рядків, переповнень буфера й записів за межі пам'яті, що дають змогу виконати код
- **.NET** (`dotnet`): Захищає .NET і C# від RCE через десеріалізацію BinaryFormatter і від обходів кодувальників, що ведуть до XSS

Виконайте `npx lagune write add --categories` з ключами обраних категорій.

**Порада**

Проєкт починає з `owasp`, а [`/lagune-charter`](https://lagune.ai/uk-UA/docs/commands/charter) додає категорії, які підтверджує її аналіз проєкту.

## Вимоги

У вашій системі має бути встановлено [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager).

## Додайте бейдж ✨

Використовуєте **Lagune**? Додайте бейдж у свій **README**:

**Двоколірний**

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

**Суцільний**

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

## Далі

Дізнайтеся, що робить кожна з [**навичок**](https://lagune.ai/uk-UA/docs/get-started/commands) **Lagune**.

## Часті запитання

### Що таке Lagune?

Lagune є робочим процесом безпеки з відкритим кодом, суто оборонним, який допомагає вашому ШІ-агенту посилити захист будь-якої кодової бази. Ви спрямовуєте його на свій код, він визначає, що насправді робить ваша система, а потім спрямовує виправлення безпеки, важливі саме для цього контексту.

### Як встановити Lagune?

Оберіть свій агент: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI і Hermes Agent встановлюють Lagune як плагін, Gemini CLI і Qwen Code як розширення, Pi як пакет, а будь-який інший агент через npx skills add wellwelwel/lagune. Lagune працює як у нових, так і в наявних проєктах.

### Чи потрібен Lagune API-ключ?

Ні. Lagune працює через вашого власного ШІ-агента, тож API-ключі не потрібні.

### Які вимоги?

У вашій системі має бути встановлено Node.js (LTS).

### Які мови програмування підтримує Lagune?

Будь-які. Під капотом Lagune працює на Node.js, але перевіряє й посилює захист проєктів, написаних будь-якою мовою програмування.

### Що Lagune додає до мого проєкту?

Каталог .lagune/ зі станом безпеки вашого проєкту, який створює перша команда, що щось записує. CLI skills також встановлює slash-команди в проєкт, звідки їх читає ваш агент, а плагін тримає їх усередині агента.

### Як оновити Lagune?

Так само, як ви його встановили. Сторінка встановлення кожного агента показує, як оновити там Lagune, а CLI skills оновлює його командою npx skills update. Ваші принципи безпеки, артефакти фаз і власні спеціалізації залишаються недоторканими.

### Які спеціалізації використовує проєкт?

Вбудовані спеціалізації його категорій, а також власні. Фаза charter записує категорії, які підтверджує її аналіз проєкту, а npx lagune write add --categories їх змінює.

### Чи треба завершити розробку, перш ніж захищати проєкт?

Ні. Команда /lagune посилює захист роботи під час написання коду: вона приймає будь-який промпт, створює те, що ви попросили, і посилює захист безпечними налаштуваннями за замовчуванням, керуючись принципами безпеки. П'ятифазний процес Blue Team перевіряє те, що вже існує.

### Чи може Lagune перевірити наявний проєкт?

Так. П'ятифазний процес Blue Team перевіряє те, що вже існує: charter встановлює ваші правила безпеки, detect визначає, що робить система і де ризики, plan оцінює кожну знахідку й підбирає до неї виправлення, harden застосовує виправлення, а verify доводить, що вони діють, і закриває їх.

### Чим відрізняється використання Lagune від простого прохання до агента знайти вразливості й недоліки безпеки?

Агент, що читає код сам, знаходить те, що схоже на вразливість, і пропускає те, що схоже на засіб захисту. Список заблокованих адрес виглядає так, ніби хтось уже впорався з ризиком, тож ніхто не перевіряє, що він пропускає більшість із них, і код іде в реліз. Lagune перевертає це припущення: засіб захисту, що вже є в коді, вважається недоведеним, доки його не перевірено, кожна спеціалізація з каталогу отримує явний вердикт, а verify питає, чи зник ризик, а не чи є засіб захисту. Кожна знахідка також залишається одним відстежуваним елементом між запусками, тож можна довести, що її закрито, і зняти її з обліку, тоді як звичайне прохання щоразу дає інший звіт, який нема з чим порівняти.

### Чим відрізняється розробка з Lagune від простого прохання до агента писати безпечний код?

Прохання про безпечний код залишає визначення безпеки агенту й припускає, що ви знаєте, про що просити. Вимога зазвичай уже міститься у вашому запиті, хоч ні ви, ні агент її не бачите: прохання про сторінку з курсами, до яких користувач має доступ, задає правило авторизації, а перевірка, яку так і не написали, не залишає в коді нічого, що можна помітити. Команда /lagune завантажує ваші принципи безпеки й спеціалізації, що відповідають тому, що зараз створюватиметься, ще до першого рядка коду, а потім перечитує результат з огляду на захист, який використала. Безпечний варіант рідко коштує більше за небезпечний, тож результат визначає знання, який із них обрати, і саме це знання надходить заздалегідь.

### Чи виконує Lagune DAST (Dynamic Application Security Testing) або тестує мій запущений застосунок?

Ні. Lagune читає код і ніколи не запускає вашу систему й не надсилає їй підроблених запитів. Verify підтверджує, що засіб захисту наявний і коректний у вихідному коді, а це інше питання, ніж те, чи витримає він атаку на робочу систему, тож "cannot tell from the code" є законним вердиктом, а не тихим проходженням перевірки. DAST відповідає на питання про час виконання, а Lagune на питання про вихідний код, тож жоден не замінює іншого. Навіть необов'язкова команда prove дотримується цієї межі: її тести перевіряють безпечну поведінку, а не payload атаки.

### Чи замінює Lagune пентест (тест на проникнення)?

Ні, точно ні! Пентест є авторизованою роботою, у якій фахівець застосовує власне судження до вашої робочої системи, поєднує знахідки в ланцюжки й досліджує бізнес-логіку, яку не описує жодне правило для окремої поверхні. Знахідки з пентесту можуть увійти в процес Blue Team від Lagune через фазу detect як занепокоєння, тож те, про що звітує фахівець, буде сплановано, захищено й перевірено.

## Політика безпеки

Ознайомтеся з [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Ліцензія

**Lagune** поширюється за ліцензією [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-дотепер [Weslley Araújo](https://github.com/wellwelwel) і [контриб'ютори](https://github.com/wellwelwel/lagune/graphs/contributors).
