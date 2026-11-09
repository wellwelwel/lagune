import type { TabItem } from '@site/src/components/tabs';
import type {
  PromptExampleGroup,
  PromptItem,
  PromptNote,
} from '@site/src/data/home';
import type { IconType } from 'react-icons';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { ArrowSlide } from '@site/src/components/home/ArrowSlide';
import { Companions } from '@site/src/components/home/Companions';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { HighlightedCode } from '@site/src/components/home/HighlightedCode';
import { TERMINAL_FRAME } from '@site/src/components/home/PromptCard';
import { TabBar, TabBarSpacer } from '@site/src/components/home/TabBar';
import { OUTRO_INSET, OUTRO_TEXT } from '@site/src/components/home/UsagePanel';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { panelIdOf, tabIdOf } from '@site/src/components/tabs';
import { Tallest } from '@site/src/components/Tallest';
import { PROMPT_AGENT_ICONS, PROMPT_EXAMPLE_GROUPS } from '@site/src/data/home';
import { createContext, memo, useContext, useId, useState } from 'react';
import { BsFillSlashSquareFill } from 'react-icons/bs';
import { IoChatbox } from 'react-icons/io5';
import { LuPaperclip } from 'react-icons/lu';
import { RiCalendarScheduleFill } from 'react-icons/ri';

type MoreLink = {
  to: string;
  label: string;
  Icon: IconType;
};

const PANEL = 'p-[18px]';

/* The composer of flow.svg, drawn by tools/readme/composer.ts. */
const COMPOSER =
  'flex flex-col gap-4 rounded-[15px] border border-[#202533] max-[600px]:text-[15px]';

const SEND_LOOK =
  'size-8 rounded-[7.5px] bg-[#2f7bff] text-white hover:opacity-85 [&_svg]:size-4';

const ICON = 'size-4 shrink-0 text-[#2676ff]';

const SURFACE = `${TERMINAL_FRAME} bg-[#0406139c]`;

const NOTE =
  'm-0 flex gap-2.5 px-5 text-[15px] leading-normal text-balance text-muted';

const AgentIconContext = createContext(PROMPT_AGENT_ICONS[0]);

const MORE_LINKS: MoreLink[] = [
  {
    to: '/docs/examples/prompts',
    label: translate({
      id: 'home.prompts.more',
      message: 'See more prompt examples',
      description:
        'The link from the home prompt examples to the documentation page with every prompt example',
    }),
    Icon: IoChatbox,
  },
  {
    to: '/docs/examples/scheduled-audits',
    label: translate({
      id: 'home.prompts.schedule',
      message: 'See how to schedule automatic audits',
      description:
        'The link from the home prompt examples to the documentation page on scheduling recurring audits',
    }),
    Icon: RiCalendarScheduleFill,
  },
  {
    to: '/docs/examples/spec-driven-development',
    label: translate({
      id: 'home.prompts.sdd',
      message: 'See Spec-Driven Development examples',
      description:
        'The link from the home prompt examples to the documentation page on using Lagune with Spec-Driven Development tools',
    }),
    Icon: BsFillSlashSquareFill,
  },
];

const TABS: TabItem[] = PROMPT_EXAMPLE_GROUPS.map(({ label, Icon }) => ({
  label,
  icon: <Icon className={ICON} />,
}));

const copyExampleLabel = (name: string): string =>
  translate(
    {
      id: 'home.prompts.copyNamed',
      message: 'Copy the {name} example',
      description:
        'The label of the button that copies a prompt example on the home page, where {name} is the name of its tab',
    },
    { name }
  );

const copyPromptLabel = (name: string, position: number): string =>
  translate(
    {
      id: 'home.prompts.copyPrompt',
      message: 'Copy prompt {position} of the {name} example',
      description:
        'The label of the button that copies one prompt of a home prompt example made of several prompts, where {position} is its order and {name} is the name of its tab',
    },
    { name, position: String(position) }
  );

const copyLabelOf = (name: string, total: number, index: number): string =>
  total === 1 ? copyExampleLabel(name) : copyPromptLabel(name, index + 1);

const withVisit = (visited: number[], index: number): number[] =>
  visited.includes(index) ? visited : [...visited, index];

const Composer = ({
  prompt,
  language = 'prompt',
  copyLabel,
}: {
  prompt: string;
  language?: string;
  copyLabel: string;
}) => {
  const agentIcon = useContext(AgentIconContext);

  return (
    <div className={COMPOSER}>
      <HighlightedCode
        code={prompt}
        language={language}
        dir='auto'
        className='px-4.75 pt-3 font-mono'
      />
      <div className='flex items-center justify-between ps-4.25 pe-2.25 pb-2.25'>
        <span aria-hidden className='flex items-center gap-4 text-[#8b93a8]'>
          <LuPaperclip strokeWidth={2.5} className='size-4' />
          <MaskIcon src={agentIcon} className='size-4 bg-current' />
        </span>
        <CopyButton value={prompt} filled look={SEND_LOOK} label={copyLabel} />
      </div>
    </div>
  );
};

const ExampleItem = ({ item }: { item: PromptItem }) => (
  <div className='flex flex-col gap-3'>
    {'markdown' in item ? (
      <Composer
        prompt={item.markdown}
        language='markdown'
        copyLabel={copyExampleLabel(item.name)}
      />
    ) : (
      item.prompts.map((prompt, index) => (
        <Composer
          key={index}
          prompt={prompt}
          copyLabel={copyLabelOf(item.name, item.prompts.length, index)}
        />
      ))
    )}
  </div>
);

const Note = ({ note: { Icon, text } }: { note: PromptNote }) => (
  <p className={NOTE}>
    <span aria-hidden className='flex h-lh items-center'>
      <Icon className={ICON} />
    </span>
    <span>{text}</span>
  </p>
);

const Examples = ({ group }: { group: PromptExampleGroup }) => (
  <div className={`flex flex-col gap-6 ${PANEL}`}>
    {group.sequence.map((entry, index) =>
      'text' in entry ? (
        <Note key={index} note={entry} />
      ) : (
        <ExampleItem key={index} item={entry} />
      )
    )}
  </div>
);

const CARDS = PROMPT_EXAMPLE_GROUPS.map((group) => (
  <div className={SURFACE}>
    <TabBarSpacer />
    <Examples group={group} />
  </div>
));

const PromptExamplesComponent = ({
  className,
  agentIcon,
}: {
  className: string;
  agentIcon: string;
}) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([0]);
  const baseId = useId();
  const headingId = `${baseId}heading`;
  const current = picked ?? 0;

  const pick = (index: number) => {
    setPicked(index);
    setVisited((previous) => withVisit(previous, index));
  };

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className='flex min-w-0 flex-col items-start gap-[clamp(10px,1.1vw,16px)]'>
        <h2
          id={headingId}
          className='m-0 font-serif text-[clamp(24px,3vw,40px)] leading-[1.15] font-normal tracking-[-0.015em] text-balance text-ink'
        >
          {translate({
            id: 'home.prompts.title',
            message: 'Prompt examples',
            description:
              'The heading of the home section with prompt examples to paste into an AI agent',
          })}
        </h2>
        <p className='m-0 text-[clamp(15px,1.4vw,19px)] leading-normal text-pretty text-muted'>
          {translate({
            id: 'home.prompts.lead',
            message: 'Paste one into your agent or adapt it to your project.',
            description:
              'The line under the heading of the home section with prompt examples',
          })}
        </p>
        <ul className={`m-0 flex list-none flex-col p-0 ${OUTRO_INSET}`}>
          {MORE_LINKS.map(({ to, label, Icon }) => (
            <li key={to} className='m-0'>
              <Link
                to={to}
                className={`${OUTRO_TEXT} group inline-flex items-start gap-2.5 py-[calc((--spacing(10)-1lh)/2)] no-underline transition-colors duration-200 hover:text-ink`}
              >
                <span aria-hidden className='flex h-lh items-center'>
                  <Icon className={ICON} />
                </span>
                <span>
                  {label}
                  <span className='whitespace-nowrap'>
                    {' '}
                    <ArrowSlide className='ml-0.5 size-4 align-[-4px] text-accent' />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Companions />
      </div>

      <AgentIconContext.Provider value={agentIcon}>
        <Tallest
          variants={visited.map((index) => CARDS[index])}
          className='min-w-0'
        >
          <div className={SURFACE}>
            <TabBar
              id={baseId}
              label={translate({
                id: 'home.prompts.tabs',
                message: 'Prompt examples by use',
                description:
                  'The accessible name of the tabs that switch the prompt examples shown on the home page, one tab per use',
              })}
              items={TABS}
              current={current}
              onPick={pick}
            />

            <div
              key={current}
              id={panelIdOf(baseId)}
              role='tabpanel'
              aria-labelledby={tabIdOf(baseId, current)}
              className={picked === null ? undefined : 'lagune-fade-in'}
            >
              <Examples group={PROMPT_EXAMPLE_GROUPS[current]} />
            </div>
          </div>
        </Tallest>
      </AgentIconContext.Provider>
    </section>
  );
};

export const PromptExamples = memo(PromptExamplesComponent);
