import type { Companion, CompanionTile } from '@site/src/data/companions';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { COMPANIONS } from '@site/src/data/companions';
import { useId } from 'react';

const TILE =
  'flex size-full rounded-2xl border border-white/[0.07] backdrop-blur-[7.5px]';

const LABEL = 'text-[13px] leading-tight font-semibold text-balance';

const PLACEMENT: Record<CompanionTile, string> = {
  wide: 'col-span-2',
  tall: 'row-span-2',
  small: '',
};

const LAYOUT: Record<CompanionTile, string> = {
  wide: 'items-center justify-center gap-3 px-5',
  tall: 'flex-col p-4',
  small: 'flex-col items-center justify-center gap-1.5 px-2',
};

const CONTENT: Record<CompanionTile, (companion: Companion) => ReactNode> = {
  wide: ({ name, logo }) => (
    <>
      <MaskIcon src={logo} className='size-8 shrink-0 bg-current' />
      <span className='text-[clamp(20px,1.9vw,26px)] font-semibold tracking-[-0.02em]'>
        {name}
      </span>
    </>
  ),
  tall: ({ name, logo }) => (
    <>
      <span className='flex flex-1 items-center justify-center'>
        <MaskIcon src={logo} className='size-12 bg-current' />
      </span>
      <span className={LABEL}>{name}</span>
    </>
  ),
  small: ({ name, logo }) => (
    <>
      <MaskIcon src={logo} className='size-6 shrink-0 bg-current' />
      <span className={`${LABEL} text-center`}>{name}</span>
    </>
  ),
};

const HEADING = translate({
  id: 'home.companions.title',
  message: 'Combine Lagune with everything you already use',
  description:
    'The heading over the home tiles of popular agent skills and plugins that work alongside Lagune',
});

const CompanionLink = ({ companion }: { companion: Companion }) => (
  <li className={`m-0 ${PLACEMENT[companion.tile]}`}>
    <Link
      href={companion.href}
      className={`${TILE} ${LAYOUT[companion.tile]} text-ink-2 no-underline transition-colors duration-200 hover:border-white/[0.14] hover:text-ink`}
    >
      {CONTENT[companion.tile](companion)}
    </Link>
  </li>
);

export const Companions = () => {
  const headingId = useId();

  return (
    <div className='mt-4 flex w-full max-w-140 flex-col gap-3'>
      <h3
        id={headingId}
        className='m-0 text-[15px] leading-normal font-medium text-ink-2'
      >
        {HEADING}
      </h3>
      <ul
        aria-labelledby={headingId}
        className='m-0 grid list-none grid-cols-3 grid-rows-[repeat(3,5rem)] gap-2.5 p-0 xl:grid-rows-[repeat(3,4rem)]'
      >
        {COMPANIONS.map((companion) => (
          <CompanionLink key={companion.name} companion={companion} />
        ))}
      </ul>
    </div>
  );
};
