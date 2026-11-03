import type { TopBarLink } from '@site/src/components/home/TopBar';
import type { LocalePage } from '@site/src/components/LocaleHead';
import type { WindowId } from '@site/src/data/home';
import type { ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDataMessages } from '@site/src/components/docs/data';
import { frameResizeObserver } from '@site/src/components/frameResizeObserver';
import { AgentStack } from '@site/src/components/home/AgentStack';
import { Brand } from '@site/src/components/home/Brand';
import { OverviewPanel } from '@site/src/components/home/OverviewPanel';
import { RailTip } from '@site/src/components/home/RailTip';
import { TopBar } from '@site/src/components/home/TopBar';
import {
  LanguageLinks,
  useLanguageOptions,
} from '@site/src/components/LanguageSwitcher';
import {
  LocaleHead,
  translationOf,
  useLocalePage,
  usePublishedAlternates,
} from '@site/src/components/LocaleHead';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  BACKGROUND_SIZES,
  BACKGROUNDS,
  FEATURE,
  OVERVIEW_RAIL,
  PHASE_STEPS,
  STEP_RAIL_ICONS,
  TABS,
} from '@site/src/data/home';
import { jsonLd } from '@site/src/seo/jsonLd';
import { siteDescriptionIn } from '@site/src/seo/site';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FaStar } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';
import { LuMenu, LuX } from 'react-icons/lu';

const SITE_URL = 'https://lagune.ai';
const SITE_HOME = `${SITE_URL}/`;
const REPO_URL = 'https://github.com/wellwelwel/lagune';
const SPONSOR_URL = 'https://github.com/sponsors/wellwelwel';
const NPM_URL = 'https://www.npmjs.com/package/lagune';
const OG_IMAGE = 'https://lagune.ai/img/og.png';

const howToStep = (
  page: LocalePage,
  position: number,
  name: string,
  text: string,
  command: string
) => ({
  '@type': 'HowToStep',
  position,
  name,
  text,
  url: `${SITE_URL}${page.baseUrl}docs/commands/${command}`,
});

const faqEntry = (question: string, answer: string) => ({
  '@type': 'Question',
  name: question,
  acceptedAnswer: { '@type': 'Answer', text: answer },
});

const homeStructuredData = (page: LocalePage, summary: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://lagune.ai/#website',
      name: 'Lagune',
      alternateName: ['Lagune AI', 'lagune'],
      url: SITE_HOME,
      inLanguage: page.htmlLang,
      description: summary,
      publisher: { '@id': 'https://lagune.ai/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://lagune.ai/#software',
      name: 'Lagune',
      alternateName: ['Lagune AI', 'Lagune Security'],
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Security',
      operatingSystem: 'Node.js',
      url: SITE_HOME,
      description: summary,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      screenshot: OG_IMAGE,
      license: `${REPO_URL}/blob/main/LICENSE`,
      publisher: { '@id': 'https://lagune.ai/#organization' },
      author: { '@id': 'https://lagune.ai/#author' },
      downloadUrl: NPM_URL,
      softwareHelp: `${SITE_URL}${page.baseUrl}docs`,
      featureList: [
        translate({
          id: 'home.software.feature.context',
          message:
            'Detects what a system actually does, whatever that is, then drives the fixes that matter for that context, in any language',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.universal',
          message:
            'Secures new work as it is written with the universal /lagune command, guided by the charter',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.flow',
          message:
            'Five-phase Blue Team flow: charter, detect, plan, harden, verify',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.cvss',
          message: 'CVSS v4.0 scoring for each finding',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.specializations',
          message:
            'On-demand, language-agnostic security specializations, grouped in categories',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.install',
          message:
            'Installs into your agent as a plugin, or with the skills CLI in any other agent, no API key required',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.defense',
          message: 'Defense-only: never generates exploits or attack tooling',
          description: "A feature of Lagune in search engines' structured data",
        }),
        translate({
          id: 'home.software.feature.dashboard',
          message:
            'Local, private dashboard to follow findings, fixes, and proofs',
          description: "A feature of Lagune in search engines' structured data",
        }),
      ],
      sameAs: [REPO_URL, NPM_URL],
    },
    {
      '@type': 'HowTo',
      '@id': `${page.url}#howto`,
      ...translationOf(page, '#howto'),
      name: translate({
        id: 'home.howTo.name',
        message: 'How to harden a codebase with Lagune (the Blue Team flow)',
        description:
          "The name of the five-phase guide in search engines' structured data",
      }),
      description: translate({
        id: 'home.howTo.description',
        message:
          'Lagune runs a five-phase, defense-first flow that audits and hardens any codebase, driven by your AI agent.',
        description:
          "The summary of the five-phase guide in search engines' structured data",
      }),
      step: [
        howToStep(
          page,
          1,
          translate({
            id: 'home.phase.charter.title',
            message: 'Charter',
            description: 'The name of the Charter phase',
          }),
          translate({
            id: 'home.howTo.charter',
            message:
              "Set your project's security principles, the rules every later phase respects.",
            description:
              "The Charter step of the five-phase guide in search engines' structured data",
          }),
          'charter'
        ),
        howToStep(
          page,
          2,
          translate({
            id: 'home.phase.detect.title',
            message: 'Detect',
            description: 'The name of the Detect phase',
          }),
          translate({
            id: 'home.howTo.detect',
            message:
              'Read the code and map what the system does and where the risks are.',
            description:
              "The Detect step of the five-phase guide in search engines' structured data",
          }),
          'detect'
        ),
        howToStep(
          page,
          3,
          translate({
            id: 'home.phase.plan.title',
            message: 'Plan',
            description: 'The name of the Plan phase',
          }),
          translate({
            id: 'home.howTo.plan',
            message:
              'Rate each finding with a category and a CVSS v4.0 score, then pair it with a fix.',
            description:
              "The Plan step of the five-phase guide in search engines' structured data",
          }),
          'plan'
        ),
        howToStep(
          page,
          4,
          translate({
            id: 'home.phase.harden.title',
            message: 'Harden',
            description: 'The name of the Harden phase',
          }),
          translate({
            id: 'home.howTo.harden',
            message:
              "Apply the plan's fixes to the code, safely and one at a time.",
            description:
              "The Harden step of the five-phase guide in search engines' structured data",
          }),
          'harden'
        ),
        howToStep(
          page,
          5,
          translate({
            id: 'home.phase.verify.title',
            message: 'Verify',
            description: 'The name of the Verify phase',
          }),
          translate({
            id: 'home.howTo.verify',
            message:
              'Prove each applied fix holds, then stand down the ones that do.',
            description:
              "The Verify step of the five-phase guide in search engines' structured data",
          }),
          'verify'
        ),
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${page.url}#faq`,
      ...translationOf(page, '#faq'),
      mainEntity: [
        faqEntry(
          translate({
            id: 'home.faq.what.question',
            message: 'What is Lagune?',
            description:
              "A question of the home page in search engines' structured data",
          }),
          translate({
            id: 'home.faq.what.answer',
            message:
              'Lagune is an open-source, defense-only security workflow that helps your AI agent harden any codebase. It detects what your system actually does, then guides the security fixes that matter for that context.',
            description:
              'The answer to "What is Lagune?" in search engines\' structured data',
          })
        ),
        faqEntry(
          translate({
            id: 'home.faq.build.question',
            message: 'Can Lagune secure code as I build it?',
            description:
              "A question of the home page in search engines' structured data",
          }),
          translate({
            id: 'home.faq.build.answer',
            message:
              'Yes. The /lagune command takes any prompt, builds what you asked, and hardens it with safe defaults as it is written, guided by your charter. The five-phase Blue Team flow then audits what already exists.',
            description:
              'The answer to "Can Lagune secure code as I build it?" in search engines\' structured data',
          })
        ),
        faqEntry(
          translate({
            id: 'home.faq.audit.question',
            message: 'Can Lagune audit an existing project?',
            description:
              "A question of the home page in search engines' structured data",
          }),
          translate({
            id: 'home.faq.audit.answer',
            message:
              'Yes. The five-phase Blue Team flow audits what already exists: charter sets your security rules, detect maps what the system does and where the risks are, plan scores each finding and pairs it with a fix, harden applies the fixes, and verify proves they hold and closes them.',
            description:
              'The answer to "Can Lagune audit an existing project?" in search engines\' structured data',
          })
        ),
        faqEntry(
          translate({
            id: 'home.faq.install.question',
            message: 'How do I install Lagune?',
            description:
              "A question of the home page in search engines' structured data",
          }),
          translate({
            id: 'home.faq.install.answer',
            message:
              'Most agents install Lagune as a plugin, Gemini CLI and Qwen Code as an extension, Pi as a package, and any other agent with npx skills add wellwelwel/lagune. The install page shows the command for each agent. It works in both new and existing projects and needs no API key.',
            description:
              'The answer to "How do I install Lagune?" in search engines\' structured data',
          })
        ),
      ],
    },
  ],
});

const WaterField = lazy(() =>
  import('@site/src/components/WaterField').then((module) => ({
    default: module.WaterField,
  }))
);

const UsagePanel = lazy(() =>
  import('@site/src/components/home/UsagePanel').then((module) => ({
    default: module.UsagePanel,
  }))
);

const WaveIcon = (): ReactNode => (
  <span className='relative inline-block size-4 shrink-0'>
    <img
      src='/img/icons/wave.svg'
      className='absolute inset-0 size-full transition-opacity duration-200 ease-out group-hover:opacity-0'
      alt='Lagune'
      aria-hidden
    />
    <MaskIcon
      src='/img/icons/wave.svg'
      className='absolute inset-0 size-full bg-accent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100'
    />
  </span>
);

const headerLinks: TopBarLink[] = [
  {
    label: translate({
      id: 'common.docs',
      message: 'Docs',
      description: 'The name of the documentation, in links and breadcrumbs',
    }),
    Icon: WaveIcon,
    href: '/docs',
  },
  {
    label: translate({
      id: 'common.starOnGitHub',
      message: 'Star on GitHub',
      description: 'Invites the reader to star the Lagune repository on GitHub',
    }),
    Icon: FaStar,
    href: REPO_URL,
  },
  {
    label: translate({
      id: 'common.support',
      message: 'Support',
      description: 'The link to support Lagune through GitHub Sponsors',
    }),
    Icon: GoHeartFill,
    href: SPONSOR_URL,
  },
];

const railItemClass = (current: boolean): string =>
  `relative flex items-center justify-center size-[22px] border-0 bg-none cursor-pointer transition-colors duration-200 ease-out [&>svg]:size-[19px] hover:text-ink after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 ${
    current ? 'lagune-rail__item--active text-ink' : 'text-[#515664]'
  }`;

const measureMenuBounds = (menu: HTMLDivElement | null) => {
  const anchor = menu?.offsetParent;
  if (!menu || !anchor) return;

  const { top, right } = anchor.getBoundingClientRect();

  menu.style.setProperty('--lagune-menu-top', `${top + menu.offsetTop}px`);
  menu.style.setProperty('--lagune-menu-right', `${right}px`);
};

let glideId = 0;

/**
 * Native smooth scrolling is unreliable on touch browsers: the tab-swap reflow, Safari's toolbar animation, or a leftover fling abort it partway.
 */
const glideToTop = () => {
  const id = ++glideId;
  const from = window.scrollY;
  const glide = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : 420;
  const settle = glide + 250;
  const started = performance.now();

  const cancel = () => {
    if (id === glideId) glideId += 1;
  };

  const detach = () => {
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('wheel', cancel);
  };

  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('wheel', cancel, { passive: true });

  const frame = () => {
    if (id !== glideId) {
      detach();
      return;
    }

    const elapsed = performance.now() - started;

    if (elapsed < glide)
      window.scrollTo(0, Math.round(from * (1 - elapsed / glide) ** 3));
    else if (window.scrollY !== 0) window.scrollTo(0, 0);

    if (elapsed < settle) requestAnimationFrame(frame);
    else detach();
  };

  frame();
};

const Home = (): ReactNode => {
  const [active, setActive] = useState<WindowId>('overview');
  const [usageStep, setUsageStep] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);
  const [typedDone, setTypedDone] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<WindowId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>(
    Object.create(null)
  );
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null
  );
  const pillTabRef = useRef<WindowId>(active);

  pillTabRef.current = hoveredTab ?? active;

  const measurePill = useCallback(() => {
    const tab = tabRefs.current[pillTabRef.current];

    if (tab) setPill({ left: tab.offsetLeft, width: tab.offsetWidth });
  }, []);

  useLayoutEffect(measurePill, [hoveredTab, active, measurePill]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = frameResizeObserver(measurePill);

    observer.observe(nav);
    nav.addEventListener('scroll', measurePill, { passive: true });

    return () => {
      observer.disconnect();
      nav.removeEventListener('scroll', measurePill);
    };
  }, [measurePill]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  const goToStep = useCallback((index: number) => {
    setTypedDone(false);
    setModeIndex(0);
    setUsageStep(index);
  }, []);

  const selectMode = useCallback((index: number) => {
    setTypedDone(false);
    setModeIndex(index);
  }, []);

  const goToTab = (id: WindowId) => {
    if (id === 'usage') {
      setTypedDone(false);
      setUsageStep(0);
      setModeIndex(0);
    }

    setActive(id);

    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      glideToTop();
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markTyped = useCallback(() => setTypedDone(true), []);

  const feature = FEATURE[active];
  const summary = siteDescriptionIn(useDataMessages());
  const page = useLocalePage();
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const alternates = usePublishedAlternates();
  const languages = useLanguageOptions();
  const pageTitle = translate({
    id: 'home.meta.title',
    message: 'AI-Driven Security Hardening for Any Codebase | Lagune',
    description:
      'The title of the home page in search results and the browser tab',
  });
  const pageDescription = translate({
    id: 'home.meta.description',
    message:
      'Lagune helps your AI agent harden any codebase: it detects what your system actually does, then drives the defensive work that fits as you build.',
    description:
      'The description of the home page in search results and link previews',
  });

  return (
    <div className='lagune-canvas relative min-h-screen m-0 antialiased text-ink bg-[#050a18] font-sans'>
      <LocaleHead
        canonical={page.url}
        contentLocale={currentLocale}
        alternates={alternates}
      />
      <Head>
        <title>{pageTitle}</title>
        <html className='lagune-canvas-html' lang={page.htmlLang} />
        <body className='lagune-canvas-body' />
        <meta name='description' content={pageDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:image' content={OG_IMAGE} />
        <meta name='twitter:title' content={pageTitle} />
        <meta name='twitter:description' content={pageDescription} />
        <meta name='twitter:image' content={OG_IMAGE} />
        <script type='application/ld+json'>
          {jsonLd(homeStructuredData(page, summary))}
        </script>
      </Head>

      <div
        className='fixed inset-0 z-0 overflow-hidden bg-[#050a18]'
        aria-hidden
      >
        <BrowserOnly>
          {() => (
            <Suspense fallback={null}>
              <WaterField className='absolute inset-0 z-[1] w-full h-full opacity-[0.32]' />
            </Suspense>
          )}
        </BrowserOnly>
        <div className='absolute inset-0 z-[2] [background:radial-gradient(120%_120%_at_50%_40%,transparent_30%,rgba(4,8,22,0.85)_100%)]' />
      </div>

      <TopBar links={headerLinks} />

      <main className='relative z-[2] min-h-screen flex items-center justify-center p-[clamp(16px,4vw,64px)] min-[921px]:pt-[calc(clamp(16px,4vw,64px)+64px)] max-[600px]:p-0 max-[600px]:items-stretch'>
        <section className='w-full max-w-[1240px] rounded-[28px] border border-[#05092a] bg-glass overflow-hidden [backdrop-filter:blur(40px)_saturate(120%)] [-webkit-backdrop-filter:blur(40px)_saturate(120%)] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.08),0_40px_120px_-40px_rgba(10,11,13,0.75)] max-[600px]:max-w-none max-[600px]:min-h-screen max-[600px]:[min-height:100dvh] max-[600px]:rounded-none max-[600px]:border-0 max-[600px]:flex max-[600px]:flex-col max-[600px]:overflow-visible max-[600px]:[backdrop-filter:none] max-[600px]:[-webkit-backdrop-filter:none]'>
          <header className='grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 px-[clamp(22px,3vw,38px)] py-[clamp(18px,2.4vw,28px)] border-b border-[#0c155c] max-[920px]:flex max-[920px]:flex-wrap max-[920px]:justify-between max-[920px]:pb-3.5 max-[600px]:sticky max-[600px]:top-0 max-[600px]:z-30 max-[600px]:border-none max-[600px]:bg-[rgba(13,18,31,0.85)] max-[600px]:[backdrop-filter:blur(16px)_saturate(140%)] max-[600px]:[-webkit-backdrop-filter:blur(10px)_saturate(140%)] max-[600px]:[box-shadow:0_16px_20px_-8px_#0d121f]'>
            <div className='flex items-center gap-[18px] min-w-0'>
              <span
                className='flex items-center gap-2 max-[920px]:hidden'
                aria-hidden
              >
                <span className='size-3 rounded-full bg-accent' />
                <span className='size-3 rounded-full bg-accent opacity-55' />
                <span className='size-3 rounded-full bg-accent opacity-25' />
              </span>
              <Brand
                onClick={() => goToTab('overview')}
                className='min-[921px]:hidden'
              />
            </div>

            <nav
              ref={navRef}
              className='relative flex items-center gap-1 rounded-xl p-1 max-[920px]:order-3 max-[920px]:w-full'
              aria-label={translate({
                id: 'home.nav.windows',
                message: 'Windows',
                description:
                  'The accessible name of the home tabs that switch the main window',
              })}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {pill && (
                <span
                  className='absolute top-1 bottom-1 left-0 rounded-lg border border-accent/50 bg-accent/15 transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none'
                  style={{
                    transform: `translateX(${pill.left}px)`,
                    width: pill.width,
                  }}
                  aria-hidden
                />
              )}
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  ref={(element) => {
                    tabRefs.current[tab.id] = element;
                  }}
                  type='button'
                  aria-current={active === tab.id ? 'page' : undefined}
                  onClick={() => goToTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  className={`relative z-[1] inline-flex items-center justify-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[14px] font-bold tracking-[-0.01em] whitespace-nowrap cursor-pointer transition-colors duration-200 hover:text-ink max-[920px]:flex-1 ${
                    active === tab.id
                      ? 'text-ink'
                      : 'text-[rgba(233,237,247,0.7)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div
              ref={menuRef}
              className='relative flex items-center justify-end gap-1.5 max-[920px]:justify-center'
            >
              <button
                type='button'
                aria-label={translate({
                  id: 'home.nav.menu',
                  message: 'Menu',
                  description:
                    'The label of the button that opens the compact home menu',
                })}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className='relative hidden size-10 items-center justify-center rounded-xl border border-line bg-card text-ink transition-[background-color,border-color] duration-200 ease-out hover:bg-card-hover hover:border-accent/50 max-[920px]:inline-flex'
              >
                <LuMenu
                  aria-hidden
                  className={`absolute size-[18px] transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                    menuOpen
                      ? 'opacity-0 scale-[0.25] blur-[4px]'
                      : 'opacity-100 scale-100 blur-0'
                  }`}
                />
                <LuX
                  aria-hidden
                  className={`absolute size-[18px] transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                    menuOpen
                      ? 'opacity-100 scale-100 blur-0'
                      : 'opacity-0 scale-[0.25] blur-[4px]'
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  ref={measureMenuBounds}
                  className='lagune-menu-pop lagune-flow absolute top-[calc(100%+8px)] right-0 z-[20] flex max-h-[calc(100dvh-var(--lagune-menu-top)-16px-env(safe-area-inset-bottom))] w-max max-w-[calc(var(--lagune-menu-right)-16px)] min-w-50 flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-[rgba(10,15,31,0.92)] p-1.5 [backdrop-filter:blur(16px)_saturate(150%)] [-webkit-backdrop-filter:blur(16px)_saturate(150%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.08),0_20px_48px_-16px_rgba(0,0,0,0.6)] min-[921px]:hidden'
                >
                  {headerLinks.map(({ label, Icon, href }) => (
                    <Link
                      key={label}
                      className='inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] no-underline text-ink transition-colors duration-200 ease-out hover:bg-white/[0.06] [&>svg]:size-[18px] [&>svg]:text-[#0088ff]'
                      to={href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon aria-hidden />
                      {label}
                    </Link>
                  ))}
                  {languages.length > 1 && (
                    <nav
                      aria-label={translate({
                        id: 'common.language',
                        message: 'Language',
                        description:
                          'The accessible name of the menu that switches the site language',
                      })}
                      className='mt-1 flex flex-col gap-1 border-t border-line pt-1.5'
                    >
                      <LanguageLinks
                        options={languages}
                        tone='canvas'
                        onSelect={() => setMenuOpen(false)}
                      />
                    </nav>
                  )}
                </div>
              )}
            </div>
          </header>

          <div className='grid grid-cols-[56px_1fr] max-[600px]:grid-cols-[1fr] max-[600px]:flex-1'>
            <nav
              className='relative z-20 border-r border-[#0c155c] max-[600px]:border-r-0 max-[600px]:border max-[600px]:border-[#0c155c] max-[600px]:order-3 max-[600px]:fixed max-[600px]:bottom-[calc(16px+env(safe-area-inset-bottom))] max-[600px]:left-1/2 max-[600px]:-translate-x-1/2 max-[600px]:z-20 max-[600px]:w-auto max-[600px]:rounded-full max-[600px]:bg-[rgba(12,16,28,0.42)] max-[600px]:[backdrop-filter:blur(10px)_saturate(140%)] max-[600px]:[-webkit-backdrop-filter:blur(10px)_saturate(140%)] max-[600px]:[box-shadow:0_8px_30px_-6px_rgba(0,0,0,0.55)]'
              aria-label={translate({
                id: 'home.nav.sections',
                message: 'Sections',
                description: 'The accessible name of the home side rail',
              })}
            >
              <div
                key={active}
                className='lagune-fade-in flex flex-col items-center gap-[26px] py-[clamp(24px,3vw,36px)] max-[600px]:flex-row max-[600px]:justify-center max-[600px]:gap-9 max-[600px]:px-7 max-[600px]:py-3.5'
              >
                {active === 'usage'
                  ? PHASE_STEPS.map((step, index) => {
                      const Icon = STEP_RAIL_ICONS[index];

                      return (
                        <RailTip key={step.phase.title} tip={step.phase.title}>
                          <button
                            type='button'
                            onClick={() => goToStep(index)}
                            className={railItemClass(index === usageStep)}
                            aria-label={translate(
                              {
                                id: 'home.rail.step',
                                message: '{phase} ({stage})',
                                description:
                                  'The label of a phase button in the home side rail, where {phase} is the phase and {stage} its small caps label',
                              },
                              {
                                phase: step.phase.title,
                                stage: step.phase.eyebrow,
                              }
                            )}
                            aria-current={
                              index === usageStep ? 'step' : undefined
                            }
                          >
                            <Icon aria-hidden />
                          </button>
                        </RailTip>
                      );
                    })
                  : OVERVIEW_RAIL.map((item) => {
                      if (item.href)
                        return (
                          <RailTip key={item.label} tip={item.tip}>
                            <Link
                              to={item.href}
                              className={railItemClass(item.active)}
                              aria-label={item.label}
                            >
                              <item.Icon aria-hidden />
                            </Link>
                          </RailTip>
                        );

                      return (
                        <RailTip key={item.label} tip={item.tip}>
                          <button
                            type='button'
                            className={railItemClass(item.active)}
                            aria-label={item.label}
                            aria-current={item.active ? 'page' : undefined}
                          >
                            <item.Icon aria-hidden />
                          </button>
                        </RailTip>
                      );
                    })}
              </div>
            </nav>

            <div className='grid grid-cols-[1.15fr_0.85fr] gap-[clamp(20px,2.6vw,38px)] p-[clamp(22px,3vw,38px)] max-[920px]:grid-cols-[1fr] max-[600px]:pt-3 max-[600px]:pb-[calc(104px+env(safe-area-inset-bottom))]'>
              <div className='relative grid min-w-0 min-h-[var(--lagune-window-h)] max-[920px]:min-h-0'>
                <div
                  className={`flex flex-col min-w-0 ${
                    active === 'overview'
                      ? 'lagune-fade-in-soft'
                      : 'invisible max-[920px]:hidden'
                  }`}
                  inert={active !== 'overview'}
                >
                  <OverviewPanel />
                </div>

                {active === 'usage' && (
                  <div className='lagune-flow lagune-fade-in-soft absolute inset-0 flex flex-col min-w-0 overflow-y-auto max-[920px]:static max-[920px]:overflow-visible'>
                    <Suspense fallback={null}>
                      <UsagePanel
                        usageStep={usageStep}
                        modeIndex={modeIndex}
                        typedDone={typedDone}
                        onSelectMode={selectMode}
                        onStep={goToStep}
                        onTyped={markTyped}
                      />
                    </Suspense>
                  </div>
                )}
              </div>

              <aside className='relative flex flex-col justify-between gap-10 min-h-[var(--lagune-window-h)] rounded-[20px] overflow-hidden p-[clamp(22px,2.4vw,32px)] isolate max-[920px]:min-h-[420px] max-[920px]:order-first max-[600px]:min-h-[300px]'>
                {TABS.map((tab) => (
                  <img
                    key={tab.id}
                    className={`absolute inset-0 -z-[2] w-full h-full object-cover object-[50%_70%] [filter:contrast(1.04)_saturate(1.08)] transition-opacity duration-700 ease-out ${
                      active === tab.id ? 'opacity-25' : 'opacity-0'
                    }`}
                    src={BACKGROUNDS[tab.id].src}
                    srcSet={BACKGROUNDS[tab.id].srcSet}
                    sizes={BACKGROUND_SIZES}
                    alt={translate(
                      {
                        id: 'home.background.alt',
                        message: 'Lagune {tab}',
                        description:
                          "The alternative text of a home tab's background image, where {tab} is the tab",
                      },
                      { tab: tab.label }
                    )}
                    aria-hidden
                    decoding='async'
                    loading={active === tab.id ? 'eager' : 'lazy'}
                    fetchPriority={active === tab.id ? 'high' : 'low'}
                  />
                ))}
                <div className='absolute inset-0 -z-[3] [background:linear-gradient(180deg,#0a1a4a_0%,#050d2c_60%,#03081c_100%)]' />
                <div className='absolute inset-0 -z-[1] [background:linear-gradient(180deg,rgba(4,9,28,0.42)_0%,rgba(4,9,28,0.05)_32%,rgba(4,9,28,0.2)_58%,rgba(3,7,22,0.82)_100%)]' />

                <div
                  key={`top-${active}`}
                  className='lagune-fade-in flex flex-col items-start gap-3.5'
                >
                  <span className='inline-flex items-center px-3.5 py-[7px] rounded-md bg-accent font-mono text-[14px]! tracking-[0.075em] uppercase text-ink max-[600px]:text-[12px]!'>
                    <span className='size-[6px] rounded-full bg-white mr-[9px]' />
                    {feature.chip}
                  </span>
                  <p className='text-[clamp(14px,1.35vw,16px)] font-normal leading-[1.55] tracking-[-0.01em] text-[rgba(233, 237, 247,0.92)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]'>
                    {feature.kicker}
                  </p>
                  {active === 'overview' && <AgentStack />}
                </div>

                <div
                  key={`title-${active}`}
                  className='lagune-fade-in flex flex-col gap-[8px]'
                >
                  <span className='font-mono text-[14px]! tracking-[0.18em] uppercase text-[rgba(233, 237, 247,0.62)] max-[600px]:text-[12px]!'>
                    {feature.eyebrow}
                  </span>
                  <h2 className='font-display font-black text-[clamp(32px,4.4vw,34px)] leading-[1.5] tracking-[-0.02em] m-0 max-[600px]:text-[24px]'>
                    <span className='text-accent mr-2 [-webkit-text-stroke:0.04em_var(--color-accent)]'>
                      /
                    </span>
                    {feature.title}
                  </h2>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
