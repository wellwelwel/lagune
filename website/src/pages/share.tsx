import type { TopBarLink } from '@site/src/components/home/TopBar';
import type { ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import { useHistory } from '@docusaurus/router';
import { Brand } from '@site/src/components/home/Brand';
import { TopBar } from '@site/src/components/home/TopBar';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { QRCodeSVG } from 'qrcode.react';
import { lazy, Suspense } from 'react';
import { FaStar } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';

const REPO_URL = 'https://github.com/wellwelwel/lagune';
const SPONSOR_URL = 'https://github.com/sponsors/wellwelwel';
const PAGE_URL = 'https://lagune.ai/share';
const OG_IMAGE = 'https://lagune.ai/img/og.png';
const OG_IMAGE_ALT = 'Lagune: AI-driven security hardening for any codebase';
const PAGE_TITLE = 'Share Lagune | Scan the QR code and star the GitHub repo';
const PAGE_DESCRIPTION =
  "Scan the QR code to open Lagune's GitHub repository, then leave a star to support this open-source, AI-driven security hardening project.";

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: 'en',
      isPartOf: { '@id': 'https://lagune.ai/#website' },
      about: { '@id': 'https://lagune.ai/#software' },
      primaryImageOfPage: OG_IMAGE,
      significantLink: [REPO_URL, SPONSOR_URL],
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://lagune.ai/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Share',
          item: PAGE_URL,
        },
      ],
    },
  ],
};

const WaterField = lazy(() =>
  import('@site/src/components/WaterField').then((module) => ({
    default: module.WaterField,
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
  { label: 'Docs', Icon: WaveIcon, href: '/docs' },
  { label: 'Star on GitHub', Icon: FaStar, href: REPO_URL },
  { label: 'Support', Icon: GoHeartFill, href: SPONSOR_URL },
];

const Share = (): ReactNode => {
  const history = useHistory();

  return (
    <div className='lagune-canvas relative min-h-screen m-0 antialiased text-ink bg-[#050a18] font-sans'>
      <Head>
        <title>{PAGE_TITLE}</title>
        <html className='lagune-canvas-html' lang='en' />
        <body className='lagune-canvas-body' />
        <meta name='description' content={PAGE_DESCRIPTION} />
        <link rel='canonical' href={PAGE_URL} />

        <meta property='og:type' content='website' />
        <meta property='og:url' content={PAGE_URL} />
        <meta property='og:title' content={PAGE_TITLE} />
        <meta property='og:description' content={PAGE_DESCRIPTION} />
        <meta property='og:image' content={OG_IMAGE} />
        <meta property='og:image:secure_url' content={OG_IMAGE} />
        <meta property='og:image:alt' content={OG_IMAGE_ALT} />
        <meta property='og:image:width' content='1280' />
        <meta property='og:image:height' content='640' />

        <meta name='twitter:title' content={PAGE_TITLE} />
        <meta name='twitter:description' content={PAGE_DESCRIPTION} />
        <meta name='twitter:image' content={OG_IMAGE} />
        <meta name='twitter:image:alt' content={OG_IMAGE_ALT} />

        <script type='application/ld+json'>
          {JSON.stringify(STRUCTURED_DATA)}
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

      <main className='relative z-[2] min-h-screen flex items-center justify-center p-[clamp(16px,4vw,64px)] min-[921px]:pt-[calc(clamp(16px,4vw,64px)+64px)] max-[600px]:p-4'>
        <section className='w-full max-w-[560px] rounded-[28px] border border-[#05092a] bg-glass overflow-hidden [backdrop-filter:blur(40px)_saturate(120%)] [-webkit-backdrop-filter:blur(40px)_saturate(120%)] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.08),0_40px_120px_-40px_rgba(10,11,13,0.75)]'>
          <header className='flex items-center gap-2.5 px-[clamp(22px,3vw,32px)] py-[clamp(16px,2.2vw,22px)] border-b border-[#0c155c]'>
            <div className='flex items-center gap-[18px] min-w-0'>
              <span
                className='flex items-center gap-2 max-[420px]:hidden'
                aria-hidden
              >
                <span className='size-3 rounded-full bg-accent' />
                <span className='size-3 rounded-full bg-accent opacity-55' />
                <span className='size-3 rounded-full bg-accent opacity-25' />
              </span>
              <Brand
                onClick={() => history.push('/')}
                className='max-[420px]:flex'
              />
            </div>
          </header>

          <div className='flex flex-col items-center gap-12.5 px-[clamp(22px,4vw,44px)] py-[clamp(28px,4vw,44px)]'>
            <div
              className='lagune-fade-in flex flex-col items-center gap-4 text-center'
              style={{ animationDelay: '40ms' }}
            >
              <h1 className='font-display font-black text-[clamp(26px,5vw,32px)] leading-[1.15] tracking-[-0.02em] m-0'>
                Scan, open,{' '}
                <FaStar
                  aria-hidden
                  className='inline-block size-[0.82em] align-[-0.1em] text-[#6db4e2]'
                />
                <span className='sr-only'>star</span>
              </h1>
              <p className='max-w-[38ch] text-[14px] leading-[1.55] text-[rgba(233,237,247,0.72)]'>
                Point your camera at the code to open Lagune on GitHub, then
                leave a star to support the project.
              </p>
            </div>

            <figure
              className='lagune-fade-in rounded-[28px] bg-white p-4 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.6),0_24px_60px_-24px_rgba(0,0,0,0.65)]'
              style={{ animationDelay: '120ms' }}
            >
              <QRCodeSVG
                value={REPO_URL}
                size={216}
                level='H'
                marginSize={0}
                bgColor='#ffffff'
                fgColor='#050a18'
                imageSettings={{
                  src: '/img/icons/wave.svg',
                  width: 46,
                  height: 46,
                  excavate: true,
                }}
                role='img'
                title="QR code that opens Lagune's GitHub repository at github.com/wellwelwel/lagune"
                className='block size-54 max-w-full'
              />
              <figcaption className='sr-only'>
                Scan this QR code to open Lagune's GitHub repository at
                github.com/wellwelwel/lagune and leave a star.
              </figcaption>
            </figure>

            <div
              className='lagune-fade-in flex w-full flex-col gap-3'
              style={{ animationDelay: '200ms' }}
            >
              <a
                href={REPO_URL}
                target='_blank'
                rel='noreferrer'
                className='lagune-cta group relative inline-flex items-center justify-center gap-2.5 px-[22px] py-[14px] rounded-[15px] overflow-hidden font-sans text-[14px] font-bold tracking-[-0.01em] text-white no-underline cursor-pointer transition-[box-shadow] duration-300 ease-out [background:linear-gradient(180deg,#1f7bff_0%,var(--color-accent)_100%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.35),0_2px_6px_-2px_rgba(0,0,0,0.35)] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.45),0_6px_14px_-4px_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
              >
                <FaStar className='size-[17px] shrink-0' aria-hidden />
                <span className='[text-shadow:0_1px_1px_rgba(0,0,0,.5)]'>
                  Star on GitHub
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Share;
