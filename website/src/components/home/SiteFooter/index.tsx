import type {
  DocsSidebarCategory,
  DocsSidebarEntry,
} from '@site/plugins/docs-content';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import {
  isCategory,
  useDataMessages,
  useDocsData,
} from '@site/src/components/docs/data';
import { Icon, sidebarGroupIcon } from '@site/src/components/docs/icons';
import { Brand } from '@site/src/components/home/Brand';
import { SmallPrint } from '@site/src/components/SmallPrint';
import {
  NPM_URL,
  REPOSITORY_URL,
  siteDescriptionIn,
  SPONSOR_URL,
} from '@site/src/seo/site';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';
import { SiNpm } from 'react-icons/si';

type SiteFooterProps = {
  onBrand: () => void;
};

type Channel = {
  label: string;
  href: string;
  Icon: IconType;
  iconSize: string;
};

const CHANNEL =
  'inline-flex size-10 items-center justify-center rounded-[10px] text-muted no-underline transition-colors duration-200 ease-out hover:bg-white/[0.07] hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

const DOC_LINK =
  'flex min-h-7 items-center text-[13px] leading-snug wrap-anywhere text-muted pointer-coarse:min-h-10 no-underline transition-colors duration-200 ease-out hover:text-ink focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const RAISED_SECTION = { key: 'examples', after: 'tools' };

const footerSections = (sidebar: DocsSidebarEntry[]): DocsSidebarCategory[] => {
  const categories = sidebar.filter(isCategory);
  const raised = categories.find(({ key }) => key === RAISED_SECTION.key);
  const rest = categories.filter((category) => category !== raised);
  const anchor = rest.findIndex(({ key }) => key === RAISED_SECTION.after);

  if (!raised || anchor === -1) return categories;

  return [...rest.slice(0, anchor + 1), raised, ...rest.slice(anchor + 1)];
};

const MOTION =
  'duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none';

const FooterSection = ({
  category,
}: {
  category: DocsSidebarCategory;
}): ReactNode => {
  const [open, setOpen] = useState(false);
  const headingId = `lagune-footer-${category.key}`;
  const listId = `${headingId}-links`;
  const title = (
    <>
      <Icon
        name={sidebarGroupIcon(category.key)}
        className='size-3.5 shrink-0 text-muted'
      />
      {category.label}
    </>
  );

  return (
    <div className='break-inside-avoid @xl:mb-7 @xl:last:mb-0'>
      <h2
        id={headingId}
        className='text-[14px] font-semibold leading-snug tracking-[-0.01em] wrap-anywhere text-ink @xl:mb-1.5'
      >
        <button
          type='button'
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className='flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent @xl:hidden'
        >
          {title}
          <Icon
            name='chevronRight'
            className={`ml-auto size-4 shrink-0 text-muted transition-transform ${MOTION} ${open ? 'rotate-90' : ''}`}
          />
        </button>
        <span className='flex items-center gap-2 @max-xl:hidden'>{title}</span>
      </h2>
      <div
        id={listId}
        className={`grid transition-[grid-template-rows,visibility] ${MOTION} @xl:visible @xl:grid-rows-[1fr] ${open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}
      >
        <div className='min-h-0 overflow-hidden'>
          <ul aria-labelledby={headingId} className='pl-5.5 @max-xl:pb-3'>
            {category.items.map((item) => (
              <li key={item.docId}>
                <Link className={DOC_LINK} to={item.permalink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const SiteFooter = ({ onBrand }: SiteFooterProps): ReactNode => {
  const { sidebar } = useDocsData();
  const summary = siteDescriptionIn(useDataMessages());
  const channels: Channel[] = [
    {
      label: 'GitHub',
      href: REPOSITORY_URL,
      Icon: FaGithub,
      iconSize: 'size-5',
    },
    { label: 'npm', href: NPM_URL, Icon: SiNpm, iconSize: 'size-4.5' },
    {
      label: translate({
        id: 'common.sponsor',
        message: 'Sponsor',
        description: 'The link to sponsor Lagune on GitHub Sponsors',
      }),
      href: SPONSOR_URL,
      Icon: GoHeartFill,
      iconSize: 'size-5',
    },
  ];

  return (
    <footer className='relative z-[2] mx-auto box-content max-w-384 px-[clamp(22px,4vw,64px)] pb-[calc(clamp(22px,4vw,64px)+env(safe-area-inset-bottom))]'>
      <div className='@container flex flex-col gap-6 rounded-3xl border border-[#0c155c] bg-[rgba(4,8,22,0.55)] px-[clamp(20px,4vw,64px)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,3vw,40px)] [box-shadow:0_24px_64px_-32px_rgba(0,0,0,0.7)] sm:rounded-4xl'>
        <div className='flex flex-col gap-x-12 gap-y-4 @xl:gap-y-6 @4xl:flex-row @4xl:justify-between'>
          <div className='flex shrink-0 flex-col items-start gap-5'>
            <Brand logo onClick={onBrand} />
            <p className='m-0 max-w-72 text-[14px] leading-[1.6] text-pretty text-muted'>
              {summary}
            </p>
            <ul className='-ml-2.5 flex items-center gap-1'>
              {channels.map(({ label, href, Icon, iconSize }) => (
                <li key={href}>
                  <Link
                    className={CHANNEL}
                    to={href}
                    aria-label={label}
                    title={label}
                  >
                    <Icon className={iconSize} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <nav
            aria-label={translate({
              id: 'common.documentation',
              message: 'Documentation',
              description: 'The name of the documentation as a whole',
            })}
            className='min-w-0 gap-x-8 @xl:columns-3 @4xl:mt-1.5 @4xl:w-max @6xl:columns-4 @6xl:gap-x-12'
          >
            {footerSections(sidebar).map((category) => (
              <FooterSection key={category.key} category={category} />
            ))}
          </nav>
        </div>
        <SmallPrint
          as='div'
          mentionsTrademarks
          className='border-t border-line pt-6 @xl:mt-6'
        />
      </div>
    </footer>
  );
};
