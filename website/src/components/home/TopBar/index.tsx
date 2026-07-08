import type { ComponentType, ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useEffect, useState } from 'react';

export type TopBarLink = {
  label: string;
  Icon: ComponentType;
  href?: string;
  onClick?: () => void;
};

type TopBarProps = {
  links: TopBarLink[];
};

const TOP_LINK =
  'group inline-flex items-center gap-[10px] py-[9px] rounded-xl text-[#a1b1e7] text-[12.75px] font-semibold tracking-[-0.01em] no-underline cursor-pointer [&_svg]:size-4 [&_svg]:text-[#6db4e2] [&_svg]:transition-colors [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:text-accent';

const SLIDE =
  'col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]';

const IconSlide = ({ Icon }: { Icon: ComponentType }): ReactNode => (
  <span className='relative inline-grid size-4 shrink-0 place-items-center overflow-hidden'>
    <span className={`${SLIDE} group-hover:-translate-y-[150%]`}>
      <Icon aria-hidden />
    </span>
    <span className={`${SLIDE} translate-y-[150%] group-hover:translate-y-0`}>
      <Icon aria-hidden />
    </span>
  </span>
);

/* Desktop chrome only: below 921px the card header keeps the brand and
   collapses these links into its hamburger menu. */
export const TopBar = ({ links }: TopBarProps): ReactNode => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-end px-[clamp(16px,4vw,64px)] transition-[background-color,border-color,backdrop-filter] duration-300 ease-out max-[920px]:hidden ${
        scrolled
          ? 'border-b border-[#0c155c] bg-[rgba(5,10,24,0.82)] [backdrop-filter:blur(16px)_saturate(140%)] [-webkit-backdrop-filter:blur(16px)_saturate(140%)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav aria-label='Site' className='flex items-center gap-4'>
        {links.map(({ label, Icon, href, onClick }) =>
          href ? (
            <Link key={label} className={TOP_LINK} to={href}>
              <IconSlide Icon={Icon} />
              {label}
            </Link>
          ) : (
            <button
              key={label}
              type='button'
              onClick={onClick}
              className={TOP_LINK}
            >
              <IconSlide Icon={Icon} />
              {label}
            </button>
          )
        )}
      </nav>
    </header>
  );
};
