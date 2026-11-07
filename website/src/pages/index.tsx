import type { TopBarLink } from '@site/src/components/home/TopBar';
import type { LocalePage } from '@site/src/components/LocaleHead';
import type { ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDataMessages } from '@site/src/components/docs/data';
import { Brand } from '@site/src/components/home/Brand';
import { CallToAction } from '@site/src/components/home/CallToAction';
import { ChatDemo } from '@site/src/components/home/ChatDemo';
import { Hero } from '@site/src/components/home/Hero';
import { Highlights } from '@site/src/components/home/Highlights';
import { InstallTabs } from '@site/src/components/home/InstallTabs';
import { SiteFooter } from '@site/src/components/home/SiteFooter';
import { StepRail } from '@site/src/components/home/StepRail';
import { Tagline } from '@site/src/components/home/Tagline';
import { TopBar } from '@site/src/components/home/TopBar';
import { UsagePanel } from '@site/src/components/home/UsagePanel';
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
import { useDismiss } from '@site/src/components/useDismiss';
import { SECTION_LABELS } from '@site/src/data/home';
import { jsonLd } from '@site/src/seo/jsonLd';
import {
  NPM_URL,
  OG_IMAGE,
  REPOSITORY_URL,
  SITE_URL,
  siteDescriptionIn,
} from '@site/src/seo/site';
import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { FaBookOpen, FaGithub } from 'react-icons/fa6';
import { LuMenu, LuX } from 'react-icons/lu';

const SITE_HOME = `${SITE_URL}/`;
const SIDE_BY_SIDE = 'grid gap-[clamp(56px,7vw,96px)] xl:grid-cols-2';

const SECONDARY_LINK =
  'relative inline-flex items-center gap-1.5 font-medium text-muted no-underline transition-colors duration-200 ease-out hover:text-ink after:absolute after:-inset-x-2 after:top-1/2 after:h-10 after:-translate-y-1/2';

const DOCS_LABEL = translate({
  id: 'common.docs',
  message: 'Docs',
  description: 'The name of the documentation, in links and breadcrumbs',
});

const STAR_LABEL = translate({
  id: 'common.starOnGitHub',
  message: 'Star on GitHub',
  description: 'Invites the reader to star the Lagune repository on GitHub',
});

const headerLinks: TopBarLink[] = [
  { label: STAR_LABEL, Icon: FaGithub, href: REPOSITORY_URL, iconOnly: true },
];

const WaterField = lazy(() =>
  import('@site/src/components/WaterField').then((module) => ({
    default: module.WaterField,
  }))
);

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
      '@id': `${SITE_URL}/#website`,
      name: 'Lagune',
      alternateName: ['Lagune AI', 'lagune'],
      url: SITE_HOME,
      inLanguage: page.htmlLang,
      description: summary,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Lagune',
      alternateName: ['Lagune AI', 'Lagune Security'],
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Security',
      operatingSystem: 'Node.js',
      url: SITE_HOME,
      description: summary,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      screenshot: OG_IMAGE,
      license: `${REPOSITORY_URL}/blob/main/LICENSE`,
      publisher: { '@id': `${SITE_URL}/#organization` },
      author: { '@id': `${SITE_URL}/#author` },
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
      sameAs: [REPOSITORY_URL, NPM_URL],
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

const measureMenuBounds = (menu: HTMLDivElement | null) => {
  const anchor = menu?.offsetParent;

  if (!menu || !anchor) return;

  const { top, right } = anchor.getBoundingClientRect();

  menu.style.setProperty('--lagune-menu-top', `${top + menu.offsetTop}px`);
  menu.style.setProperty('--lagune-menu-right', `${right}px`);
};

let glideId = 0;

/**
 * Native smooth scrolling is unreliable on touch browsers: Safari's toolbar animation or a leftover fling aborts it partway.
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

const scrollToTop = () => {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    glideToTop();

    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Home = (): ReactNode => {
  const [usageStep, setUsageStep] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);
  const [typedDone, setTypedDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useDismiss(menuOpen, menuRef, setMenuOpen);

  const goToStep = useCallback(
    (index: number) => {
      if (index === usageStep && modeIndex === 0) return;

      setTypedDone(false);
      setModeIndex(0);
      setUsageStep(index);
    },
    [usageStep, modeIndex]
  );

  const selectMode = useCallback(
    (index: number) => {
      if (index === modeIndex) return;

      setTypedDone(false);
      setModeIndex(index);
    },
    [modeIndex]
  );

  const markTyped = useCallback(() => setTypedDone(true), []);

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

      <TopBar links={headerLinks} onBrand={scrollToTop} />

      <header className='sticky top-0 z-30 hidden h-16 items-center justify-between px-[clamp(22px,4vw,64px)] bg-[rgba(5,10,24,0.82)] [backdrop-filter:blur(16px)_saturate(140%)] [-webkit-backdrop-filter:blur(16px)_saturate(140%)] [box-shadow:0_16px_20px_-8px_#050a18] max-[920px]:flex'>
        <Brand logo onClick={scrollToTop} />

        <div ref={menuRef} className='relative flex items-center'>
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
            className='relative inline-flex size-10 items-center justify-center rounded-xl border border-line bg-card text-ink transition-[background-color,border-color] duration-200 ease-out hover:bg-card-hover hover:border-accent/50'
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
              className='lagune-menu-pop lagune-flow absolute top-[calc(100%+8px)] right-0 z-[20] flex max-h-[calc(100dvh-var(--lagune-menu-top)-16px-env(safe-area-inset-bottom))] w-max max-w-[calc(var(--lagune-menu-right)-16px)] min-w-50 flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-[rgba(10,15,31,0.92)] p-1.5 [backdrop-filter:blur(16px)_saturate(150%)] [-webkit-backdrop-filter:blur(16px)_saturate(150%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.08),0_20px_48px_-16px_rgba(0,0,0,0.6)]'
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

      <main className='relative z-[2] mx-auto box-content flex max-w-384 flex-col gap-[clamp(56px,7vw,96px)] px-[clamp(22px,4vw,64px)] pt-[calc(64px+clamp(16px,4vw,64px))] pb-[clamp(56px,7vw,96px)] max-[920px]:pt-8'>
        <div className={SIDE_BY_SIDE}>
          <section
            aria-label={SECTION_LABELS.overview}
            className='flex min-w-0 flex-col gap-10'
          >
            <Hero />
            <InstallTabs />
            <div className='flex flex-col gap-3'>
              <CallToAction />
              <div className='flex items-center gap-5 pl-2.5 text-[12.5px] tracking-[-0.01em]'>
                <Link className={SECONDARY_LINK} to='/docs'>
                  <FaBookOpen
                    className='size-3.5 shrink-0 -translate-y-px'
                    aria-hidden
                  />
                  {DOCS_LABEL}
                </Link>
                <Link className={SECONDARY_LINK} to={REPOSITORY_URL}>
                  <FaGithub
                    className='size-3.5 shrink-0 -translate-y-px'
                    aria-hidden
                  />
                  {STAR_LABEL}
                </Link>
              </div>
            </div>
          </section>

          <section
            aria-label={SECTION_LABELS.usage}
            className='flex min-w-0 flex-col gap-5'
          >
            <StepRail current={usageStep} onStep={goToStep} />
            <div className='flex min-w-0 flex-1 flex-col'>
              <UsagePanel
                usageStep={usageStep}
                modeIndex={modeIndex}
                typedDone={typedDone}
                onSelectMode={selectMode}
                onStep={goToStep}
                onTyped={markTyped}
              />
            </div>
          </section>
        </div>

        <Tagline />

        <div className={SIDE_BY_SIDE}>
          <ChatDemo />
          <Highlights />
        </div>
      </main>

      <SiteFooter onBrand={scrollToTop} />
    </div>
  );
};

export default Home;
