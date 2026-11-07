import type { ComponentType, ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { Brand } from '@site/src/components/home/Brand';
import { LanguageSwitcher } from '@site/src/components/LanguageSwitcher';
import { useEffect, useState } from 'react';

export type TopBarLink = {
  label: string;
  Icon: ComponentType;
  href: string;
  iconOnly?: boolean;
};

type TopBarProps = {
  links: TopBarLink[];
  onBrand?: () => void;
};

const TOP_LINK =
  'group inline-flex items-center gap-[10px] py-[9px] rounded-xl text-[#a1b1e7] text-[12.75px] font-semibold tracking-[-0.01em] no-underline cursor-pointer [&_svg]:transition-colors [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:text-accent';

const LABELED = '[&_svg]:size-4 [&_svg]:text-[#6db4e2]';

const ICON_ONLY =
  'relative [&_svg]:size-5 [&_svg]:text-white after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2';

const SLIDE =
  'col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]';

const IconSlide = ({
  Icon,
  large,
}: {
  Icon: ComponentType;
  large: boolean;
}): ReactNode => (
  <span
    className={`relative inline-grid shrink-0 place-items-center overflow-hidden ${large ? 'size-5' : 'size-4'}`}
  >
    <span className={`${SLIDE} group-hover:-translate-y-[150%]`}>
      <Icon aria-hidden />
    </span>
    <span className={`${SLIDE} translate-y-[150%] group-hover:translate-y-0`}>
      <Icon aria-hidden />
    </span>
  </span>
);

/* Desktop chrome only: below 921px, each page brings its own compact header. */
export const TopBar = ({ links, onBrand }: TopBarProps): ReactNode => {
  const [scrolled, setScrolled] = useState(false);
  const iconBar = links.every(({ iconOnly }) => iconOnly);

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
      {onBrand && <Brand logo compact onClick={onBrand} className='mr-auto' />}
      <nav
        aria-label={translate({
          id: 'home.topBar.label',
          message: 'Site',
          description: 'The accessible name of the top navigation bar',
        })}
        className='flex items-center gap-4'
      >
        {links.map(({ label, Icon, href, iconOnly }) => (
          <Link
            key={label}
            className={`${TOP_LINK} ${iconOnly ? ICON_ONLY : LABELED}`}
            to={href}
            title={iconOnly ? label : undefined}
          >
            <IconSlide Icon={Icon} large={Boolean(iconOnly)} />
            <span className={iconOnly ? 'sr-only' : undefined}>{label}</span>
          </Link>
        ))}
        <LanguageSwitcher
          tone='canvas'
          flagClassName={iconBar ? 'size-5' : undefined}
        />
      </nav>
    </header>
  );
};
