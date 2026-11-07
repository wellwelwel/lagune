import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';

type BrandProps = {
  onClick: () => void;
  className?: string;
  logo?: boolean;
  compact?: boolean;
};

type BrandScale = {
  name: string;
  domain: string;
  logo: string;
};

const REGULAR: BrandScale = {
  name: 'gap-2 text-[clamp(18px,1.8vw,23px)]',
  domain: 'text-[clamp(14px,1.8vw,19px)]',
  logo: 'size-8 rounded-chip',
};

const COMPACT: BrandScale = {
  name: 'gap-1.25 text-[14.5px]',
  domain: 'text-[12px]',
  logo: 'size-5 rounded-[5px]',
};

export const Brand = ({
  onClick,
  className = '',
  logo = false,
  compact = false,
}: BrandProps): ReactNode => {
  const scale = compact ? COMPACT : REGULAR;

  return (
    <button
      type='button'
      aria-label={translate({
        id: 'home.brand.backToTop',
        message: 'Lagune.ai, back to top',
        description:
          'The label of the brand button that scrolls back to the top',
      })}
      className={`flex m-0 items-center border-0 bg-transparent p-0 font-display font-extrabold tracking-[-0.02em] leading-none cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${scale.name} ${className}`}
      onClick={onClick}
    >
      {logo && (
        <img
          className={`shrink-0 ${scale.logo}`}
          src='/favicon.png'
          alt=''
          width={32}
          height={32}
        />
      )}
      <span>
        Lagune
        <span className={`px-0.5 text-[#2092ff] font-sans ${scale.domain}`}>
          .ai
        </span>
      </span>
    </button>
  );
};
