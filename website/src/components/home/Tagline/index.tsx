import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { TbLockFilled, TbShieldCheckFilled } from 'react-icons/tb';

/* Every locale keeps this term untranslated. */
const EMPHASIS = 'Blue Team';

export const SECTION_OPENING =
  'mt-[calc(clamp(12px,1.6vw,24px)+var(--section-drop))] max-[600px]:-mt-3.5 [--section-drop:clamp(29px,3.6vw,50px)]';

const TILE =
  'absolute grid size-[0.88em] place-items-center rounded-[28%] [&>svg]:size-[54%]';

const SecurityTiles = (): ReactNode => (
  <span
    aria-hidden
    className='relative mx-[0.15em] inline-block h-[1em] w-[1.54em] align-[-0.14em]'
  >
    <span
      className={`${TILE} top-[0.28em] left-0 -rotate-10 bg-linear-to-br from-[#3d86ff] to-accent text-white [box-shadow:0_10px_24px_-8px_rgba(0,0,0,0.6)]`}
    >
      <TbShieldCheckFilled />
    </span>
    <span
      className={`${TILE} top-[0.06em] right-0 rotate-8 bg-white/85 text-[#0b1150] backdrop-blur-md [box-shadow:0_10px_24px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.7)]`}
    >
      <TbLockFilled />
    </span>
  </span>
);

const emphasized = (text: string): ReactNode => {
  const start = text.indexOf(EMPHASIS);

  if (start === -1) return text;

  return (
    <>
      {text.slice(0, start)}
      <span className='whitespace-nowrap'>
        <em className='rounded-sm bg-accent/20 px-[0.1em] italic'>
          {EMPHASIS}
        </em>
        <SecurityTiles />
      </span>
      {text.slice(start + EMPHASIS.length)}
    </>
  );
};

export const Tagline = (): ReactNode => {
  const title = translate({
    id: 'home.tagline.title',
    message:
      'Lagune is your security copilot as you build, your Blue Team when you audit.',
    description:
      'The headline above the chat demo on the home page, where "Blue Team" stays in English since the page sets it in italics',
  });
  const audience = translate({
    id: 'home.tagline.audience',
    message: "Whether you're a developer or not.",
    description:
      'The small line under the headline above the chat demo on the home page',
  });

  return (
    <div
      className={`${SECTION_OPENING} mb-[calc(var(--title-ink-inset)-var(--section-drop))] flex min-w-0 flex-col gap-[clamp(10px,1.1vw,16px)] max-xl:text-center [--title-ink-inset:calc(var(--title-size)*0.18)] [--title-size:clamp(24px,3.6vw,52px)]`}
    >
      <h1 className='m-0 font-serif text-(length:--title-size) leading-[1.12] font-normal tracking-[-0.015em] text-balance text-ink'>
        {emphasized(title)}
      </h1>
      <p className='m-0 text-[clamp(15px,1.4vw,19px)] leading-normal text-pretty text-muted'>
        {audience}
      </p>
    </div>
  );
};
