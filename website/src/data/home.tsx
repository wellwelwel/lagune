import type { ComponentType, ReactNode } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import {
  LuBadgeCheck,
  LuBookOpen,
  LuBrain,
  LuChrome,
  LuHouse,
  LuListChecks,
  LuScanSearch,
  LuShieldCheck,
  LuShieldPlus,
  LuSparkle,
  LuSquareSlash,
  LuStar,
} from 'react-icons/lu';
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
  TbCircleNumber4,
  TbCircleNumber5,
} from 'react-icons/tb';

export type WindowId = 'overview' | 'usage';

export type PromptMode = {
  label: string;
  prompt: string;
};

export type Phase = {
  eyebrow: string;
  title: string;
  command: string;
  description: string;
  banner: string;
  modes: PromptMode[];
  nextLabel?: string;
};

export type Group = {
  label: string;
  phases: Phase[];
};

const PHASE_GROUPS: Group[] = [
  {
    label: translate({
      id: 'home.group.anyPrompt',
      message: 'Any prompt, any time',
      description:
        'The stage label of the universal /lagune command on the home page',
    }),
    phases: [
      {
        eyebrow: translate({
          id: 'home.phase.universal.eyebrow',
          message: 'UNIVERSAL',
          description:
            'The small caps label over the universal /lagune command card',
        }),
        title: translate({
          id: 'home.phase.universal.title',
          message: 'Build',
          description: 'The title of the universal /lagune command card',
        }),
        command: '/lagune',
        description: translate({
          id: 'home.phase.universal.description',
          message:
            'Builds what your prompt asks for, with security guarding the work as it happens, not later.',
          description: 'What the universal /lagune command does',
        }),
        banner: '/img/docs/banner-0.webp',
        nextLabel: translate({
          id: 'home.phase.universal.next',
          message: 'See how to audit your existing project',
          description:
            'Leads from the universal command to the audit flow on the home page',
        }),
        modes: [
          {
            label: translate({
              id: 'home.phase.universal.mode.feature',
              message: 'Feature',
              description:
                'The example tab for building a new feature with /lagune',
            }),
            prompt: translate({
              id: 'home.phase.universal.mode.feature.prompt',
              message:
                'Create a dashboard for my SaaS users. They should be able to change their profile picture and view all the content they have access to.',
              description:
                'An example request a user writes after /lagune to build a feature',
            }),
          },
          {
            label: translate({
              id: 'home.phase.universal.mode.fix',
              message: 'Fix',
              description: 'The example tab for fixing a bug with /lagune',
            }),
            prompt: translate({
              id: 'home.phase.universal.mode.fix.prompt',
              message:
                'Nothing happens when the user submits the form. Look into what it might be and fix it.',
              description:
                'An example request a user writes after /lagune to fix a bug',
            }),
          },
          {
            label: translate({
              id: 'home.phase.universal.mode.refactor',
              message: 'Refactor',
              description: 'The example tab for refactoring code with /lagune',
            }),
            prompt: translate({
              id: 'home.phase.universal.mode.refactor.prompt',
              message: 'Decouple and improve the payload logic.',
              description:
                'An example request a user writes after /lagune to refactor code',
            }),
          },
        ],
      },
    ],
  },
  {
    label: translate({
      id: 'home.group.establish',
      message: 'Establish',
      description: 'The stage label of the charter phase on the home page',
    }),
    phases: [
      {
        eyebrow: translate({
          id: 'home.phase.charter.eyebrow',
          message: 'PHASE 1',
          description: 'The small caps label over the Charter phase card',
        }),
        title: translate({
          id: 'home.phase.charter.title',
          message: 'Charter',
          description: 'The name of the Charter phase',
        }),
        command: '/lagune-charter',
        description: translate({
          id: 'home.phase.charter.description',
          message:
            "Sets your project's security rules, proposed for you or shaped by what you say.",
          description: 'What the Charter phase does',
        }),
        banner: '/img/docs/banner-1.webp',
        modes: [
          {
            label: translate({
              id: 'home.phase.charter.mode.describe',
              message: 'Recommended (Describe)',
              description:
                'The example tab for the Charter phase: Recommended (Describe)',
            }),
            prompt: translate({
              id: 'home.phase.charter.mode.describe.prompt',
              message:
                'We run a manga SaaS: authors upload original chapters, readers buy credits with Stripe and spend them to unlock chapters, and authors earn a commission per unlock. Help us prevent users from leaking or screenshotting it afterwards.',
              description:
                'An example request a user writes after /lagune-charter',
            }),
          },
          {
            label: translate({
              id: 'home.phase.charter.mode.auto',
              message: 'Auto Detect',
              description: 'The example tab for the Charter phase: Auto Detect',
            }),
            prompt: '',
          },
        ],
      },
    ],
  },
  {
    label: translate({
      id: 'home.group.understand',
      message: 'Understand',
      description:
        'The stage label of the detect and plan phases on the home page',
    }),
    phases: [
      {
        eyebrow: translate({
          id: 'home.phase.detect.eyebrow',
          message: 'PHASE 2',
          description: 'The small caps label over the Detect phase card',
        }),
        title: translate({
          id: 'home.phase.detect.title',
          message: 'Detect',
          description: 'The name of the Detect phase',
        }),
        command: '/lagune-detect',
        description: translate({
          id: 'home.phase.detect.description',
          message:
            'Reads your code and maps what your system does and where the risks are.',
          description: 'What the Detect phase does',
        }),
        banner: '/img/docs/banner-5.webp',
        modes: [
          {
            label: translate({
              id: 'home.mode.recommendedFull',
              message: 'Recommended (Full)',
              description:
                'The example tab for running a phase over the whole project, the recommended way',
            }),
            prompt: '',
          },
          {
            label: translate({
              id: 'home.phase.detect.mode.scoped',
              message: 'Scoped',
              description: 'The example tab for the Detect phase: Scoped',
            }),
            prompt: translate({
              id: 'home.phase.detect.mode.scoped.prompt',
              message: "Scan the intern's branch before I merge it.",
              description:
                'An example request a user writes after /lagune-detect',
            }),
          },
          {
            label: translate({
              id: 'home.phase.detect.mode.targeted',
              message: 'Targeted',
              description: 'The example tab for the Detect phase: Targeted',
            }),
            prompt: translate({
              id: 'home.phase.detect.mode.targeted.prompt',
              message: 'Investigate every possible data leak',
              description:
                'An example request a user writes after /lagune-detect',
            }),
          },
        ],
      },
      {
        eyebrow: translate({
          id: 'home.phase.plan.eyebrow',
          message: 'PHASE 3',
          description: 'The small caps label over the Plan phase card',
        }),
        title: translate({
          id: 'home.phase.plan.title',
          message: 'Plan',
          description: 'The name of the Plan phase',
        }),
        command: '/lagune-plan',
        description: translate({
          id: 'home.phase.plan.description',
          message:
            'Turns what detect found into a defense plan, with a fix for each finding.',
          description: 'What the Plan phase does',
        }),
        banner: '/img/docs/banner-3.webp',
        modes: [
          {
            label: translate({
              id: 'home.mode.recommendedFull',
              message: 'Recommended (Full)',
              description:
                'The example tab for running a phase over the whole project, the recommended way',
            }),
            prompt: '',
          },
          {
            label: translate({
              id: 'home.mode.bySeverity',
              message: 'By Severity',
              description:
                'The example tab for running a phase on the most severe findings only',
            }),
            prompt: translate({
              id: 'home.phase.plan.mode.severity.prompt',
              message: 'Only plan the Critical and High findings for now.',
              description:
                'An example request a user writes after /lagune-plan',
            }),
          },
        ],
      },
    ],
  },
  {
    label: translate({
      id: 'home.group.defend',
      message: 'Defend',
      description:
        'The stage label of the harden and verify phases on the home page',
    }),
    phases: [
      {
        eyebrow: translate({
          id: 'home.phase.harden.eyebrow',
          message: 'PHASE 4',
          description: 'The small caps label over the Harden phase card',
        }),
        title: translate({
          id: 'home.phase.harden.title',
          message: 'Harden',
          description: 'The name of the Harden phase',
        }),
        command: '/lagune-harden',
        description: translate({
          id: 'home.phase.harden.description',
          message:
            "Applies the plan's fixes to your code, safely and one at a time.",
          description: 'What the Harden phase does',
        }),
        banner: '/img/docs/banner-2.webp',
        modes: [
          {
            label: translate({
              id: 'home.mode.recommendedFull',
              message: 'Recommended (Full)',
              description:
                'The example tab for running a phase over the whole project, the recommended way',
            }),
            prompt: '',
          },
          {
            label: translate({
              id: 'home.mode.bySeverity',
              message: 'By Severity',
              description:
                'The example tab for running a phase on the most severe findings only',
            }),
            prompt: translate({
              id: 'home.phase.harden.mode.severity.prompt',
              message: 'Apply only the Critical and High fixes for now.',
              description:
                'An example request a user writes after /lagune-harden',
            }),
          },
        ],
      },
      {
        eyebrow: translate({
          id: 'home.phase.verify.eyebrow',
          message: 'PHASE 5',
          description: 'The small caps label over the Verify phase card',
        }),
        title: translate({
          id: 'home.phase.verify.title',
          message: 'Verify',
          description: 'The name of the Verify phase',
        }),
        command: '/lagune-verify',
        description: translate({
          id: 'home.phase.verify.description',
          message:
            'Proves each applied fix holds and closes out the ones that do.',
          description: 'What the Verify phase does',
        }),
        banner: '/img/docs/banner-4.webp',
        modes: [
          {
            label: translate({
              id: 'home.mode.recommendedFull',
              message: 'Recommended (Full)',
              description:
                'The example tab for running a phase over the whole project, the recommended way',
            }),
            prompt: '',
          },
          {
            label: translate({
              id: 'home.mode.bySeverity',
              message: 'By Severity',
              description:
                'The example tab for running a phase on the most severe findings only',
            }),
            prompt: translate({
              id: 'home.phase.verify.mode.severity.prompt',
              message: 'Just verify the Critical and High fixes we applied.',
              description:
                'An example request a user writes after /lagune-verify',
            }),
          },
        ],
      },
    ],
  },
];

export const STEP_RAIL_ICONS: ComponentType[] = [
  LuSparkle,
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
  TbCircleNumber4,
  TbCircleNumber5,
];

export const STEP_CARD_ICONS: ComponentType<{ className?: string }>[] = [
  LuSparkle,
  LuShieldCheck,
  LuScanSearch,
  LuListChecks,
  LuShieldPlus,
  LuBadgeCheck,
];

export const PHASE_STEPS: { phase: Phase; group: string }[] =
  PHASE_GROUPS.flatMap((group) =>
    group.phases.map((phase) => ({
      phase,
      group: group.label,
    }))
  );

const Emphasis = ({ children }: { children: ReactNode }): ReactNode => (
  <strong className='text-ink font-semibold'>{children}</strong>
);

export const HIGHLIGHTS: {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  lead: ReactNode;
  body: ReactNode;
}[] = [
  {
    Icon: LuShieldCheck,
    title: translate({
      id: 'home.highlight.build.title',
      message: 'Harden as you build',
      description:
        'The title of the home highlight about the universal /lagune command',
    }),
    lead: (
      <Translate
        id='home.highlight.build.lead'
        description='The lead of the home highlight about /lagune, where {command} is the command'
        values={{ command: <Emphasis>/lagune</Emphasis> }}
      >
        {
          'One command, {command}, brings security while the code is written, not after.'
        }
      </Translate>
    ),
    body: (
      <Translate
        id='home.highlight.build.body'
        description='The body of the home highlight about the universal /lagune command'
      >
        Mark it on any prompt and the agent builds what you asked for as always,
        now with security knowledge on-demand.
      </Translate>
    ),
  },
  {
    Icon: LuSquareSlash,
    title: translate({
      id: 'home.highlight.flow.title',
      message: 'Inspired by Spec-Driven',
      description:
        'The title of the home highlight about the five-phase Blue Team flow',
    }),
    lead: (
      <Translate
        id='home.highlight.flow.lead'
        description='The lead of the home highlight about the Blue Team flow, where {basis} is emphasized'
        values={{
          basis: (
            <Emphasis>
              <Translate
                id='home.highlight.flow.lead.basis'
                description='The emphasized part of the home highlight about the Blue Team flow'
              >
                Blue Team-based
              </Translate>
            </Emphasis>
          ),
        }}
      >
        {'A five-phase, {basis} flow, ready to run.'}
      </Translate>
    ),
    body: (
      <Translate
        id='home.highlight.flow.body'
        description='The body of the home highlight about the five-phase Blue Team flow'
      >
        It detects what your system actually does, maps the matching attack
        vectors, then applies the security work that fits.
      </Translate>
    ),
  },
  {
    Icon: LuBrain,
    title: translate({
      id: 'home.highlight.knowledge.title',
      message: 'Knowledge on demand',
      description:
        'The title of the home highlight about on-demand specializations',
    }),
    lead: (
      <Translate
        id='home.highlight.knowledge.lead'
        description='The lead of the home highlight about specializations, where {scope} is emphasized'
        values={{
          scope: (
            <Emphasis>
              <Translate
                id='home.highlight.knowledge.lead.scope'
                description='The emphasized part of the home highlight about specializations'
              >
                only for what your project is
              </Translate>
            </Emphasis>
          ),
        }}
      >
        {'Focused security modules load {scope}.'}
      </Translate>
    ),
    body: (
      <Translate
        id='home.highlight.knowledge.body'
        description='The body of the home highlight about on-demand specializations'
      >
        It pulls in the module that fits the context it finds, drawing from a
        catalog that keeps adapting as new risks emerge.
      </Translate>
    ),
  },
  {
    Icon: LuChrome,
    title: translate({
      id: 'home.highlight.dashboard.title',
      message: 'Progress in your browser',
      description: 'The title of the home highlight about the local dashboard',
    }),
    lead: (
      <Translate
        id='home.highlight.dashboard.lead'
        description='The lead of the home highlight about the dashboard, where {dashboard} is emphasized'
        values={{
          dashboard: (
            <Emphasis>
              <Translate
                id='home.highlight.dashboard.lead.dashboard'
                description='The emphasized part of the home highlight about the dashboard'
              >
                local, private dashboard
              </Translate>
            </Emphasis>
          ),
        }}
      >
        {'A {dashboard} follows your findings, fixes, and proofs live.'}
      </Translate>
    ),
    body: (
      <Translate
        id='home.highlight.dashboard.body'
        description='The body of the home highlight about the local dashboard'
      >
        Live view of your project's security, as the agent works. It runs on
        your machine and nothing leaves it.
      </Translate>
    ),
  },
];

export type RailItem = {
  label: string;
  tip: string;
  active: boolean;
  Icon: ComponentType;
  href?: string;
};

const DocsRailIcon = (): ReactNode => (
  <>
    <LuBookOpen className='max-[600px]:hidden' aria-hidden />
    <img
      src='/img/icons/wave.svg'
      className='hidden size-[19px] max-[600px]:block'
      alt='Lagune'
      aria-hidden
    />
  </>
);

const OVERVIEW_TAB = translate({
  id: 'home.tab.overview',
  message: 'Overview',
  description: 'The home tab that presents Lagune',
});

const DOCS_LINK = translate({
  id: 'common.docs',
  message: 'Docs',
  description: 'The name of the documentation, in links and breadcrumbs',
});

const STAR_ON_GITHUB = translate({
  id: 'common.starOnGitHub',
  message: 'Star on GitHub',
  description: 'Invites the reader to star the Lagune repository on GitHub',
});

export const OVERVIEW_RAIL: RailItem[] = [
  {
    label: translate({
      id: 'common.home',
      message: 'Home',
      description: 'The name of the home page, in links and breadcrumbs',
    }),
    tip: OVERVIEW_TAB,
    active: true,
    Icon: LuHouse,
  },
  {
    label: DOCS_LINK,
    tip: DOCS_LINK,
    active: false,
    Icon: DocsRailIcon,
    href: '/docs',
  },
  {
    label: STAR_ON_GITHUB,
    tip: STAR_ON_GITHUB,
    active: false,
    Icon: LuStar,
    href: 'https://github.com/wellwelwel/lagune',
  },
];

export const TABS: { id: WindowId; label: string }[] = [
  { id: 'overview', label: OVERVIEW_TAB },
  {
    id: 'usage',
    label: translate({
      id: 'home.tab.usage',
      message: 'How to Use',
      description: 'The home tab that walks through the commands',
    }),
  },
];

const backgroundImage = (name: string) => ({
  src: `/img/${name}.webp`,
  srcSet: `/img/${name}-480.webp 480w, /img/${name}-720.webp 720w, /img/${name}-912.webp 912w, /img/${name}.webp 1380w`,
});

export const BACKGROUNDS: Record<WindowId, { src: string; srcSet: string }> = {
  overview: backgroundImage('bg-1'),
  usage: backgroundImage('bg-3'),
};

export const BACKGROUND_SIZES =
  '(max-width: 600px) calc(100vw - 40px), (max-width: 920px) calc(100vw - 130px), 456px';

const Strong = ({ children }: { children: ReactNode }): ReactNode => (
  <span className='font-semibold'>{children}</span>
);

export const FEATURE: Record<
  WindowId,
  { kicker: ReactNode; chip: string; eyebrow: string; title: ReactNode }
> = {
  overview: {
    kicker: (
      <Translate
        id='home.feature.overview.kicker'
        description='The question that opens the home overview, where {before}, {during}, and {after} are emphasized'
        values={{
          before: (
            <Strong>
              <Translate
                id='home.feature.overview.kicker.before'
                description='The emphasized "before" of the home overview question'
              >
                before
              </Translate>
            </Strong>
          ),
          during: (
            <Strong>
              <Translate
                id='home.feature.overview.kicker.during'
                description='The emphasized "during" of the home overview question'
              >
                during
              </Translate>
            </Strong>
          ),
          after: (
            <Strong>
              <Translate
                id='home.feature.overview.kicker.after'
                description='The emphasized "after" of the home overview question'
              >
                after
              </Translate>
            </Strong>
          ),
        }}
      >
        {
          'Instead of running a generic checklist, what if security existed {before}, {during}, and {after} development?'
        }
      </Translate>
    ),
    chip: 'Security-Driven Hardening',
    eyebrow: translate({
      id: 'home.feature.overview.eyebrow',
      message: 'The practice',
      description: 'The small caps label over the home overview title',
    }),
    title: (
      <Translate
        id='home.feature.overview.title'
        description='The large title of the home overview, where {lineBreak} splits it in two lines'
        values={{ lineBreak: <br /> }}
      >
        {'Defense{lineBreak}by design'}
      </Translate>
    ),
  },
  usage: {
    kicker: translate({
      id: 'home.feature.usage.kicker',
      message: 'Point it at your code, let the agent do the work.',
      description: 'The sentence that opens the home usage tab',
    }),
    chip: translate({
      id: 'home.feature.usage.chip',
      message: 'The Blue Team flow',
      description: 'The chip over the home usage tab',
    }),
    eyebrow: translate({
      id: 'home.feature.usage.eyebrow',
      message: 'Blue Team flow',
      description: 'The small caps label over the home usage title',
    }),
    title: (
      <Translate
        id='home.feature.usage.title'
        description='The large title of the home usage tab, where {lineBreak} splits it in two lines'
        values={{ lineBreak: <br /> }}
      >
        {'Harden{lineBreak}what you ship'}
      </Translate>
    ),
  },
};
