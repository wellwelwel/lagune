import type {
  DocsSidebarCategory,
  DocsSidebarEntry,
  DocsSidebarLink,
} from '@site/plugins/docs-content';
import type { ReactNode } from 'react';
import type { DocsIconName } from '../icons';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Icon } from '../icons';

const GROUP =
  'px-2.5 pt-4 pb-2 text-[0.7rem] font-bold uppercase tracking-[0.09em] text-faint';

const NAV_LINK =
  'flex items-center gap-3 rounded-field px-3 py-2.25 text-[0.79rem] font-semibold no-underline transition-colors';

const FOOT_LINK = `${NAV_LINK} text-muted hover:bg-canvas hover:text-ink-2 hover:no-underline`;

const GROUP_ICONS: Partial<Record<string, DocsIconName>> = {
  'Get Started': 'play',
  'The Blue Team Flow': 'activity',
  'Development Flow': 'code',
  Specializations: 'brain',
  Tools: 'grid',
  Hooks: 'cpu',
  'References & Sources': 'file',
  Maintenance: 'refresh',
};

/* Docusaurus remounts the route tree on every navigation, resetting each
   category's local state. */
const persistedOpenGroups = new Map<string, boolean>();

const SidebarItem = ({
  item,
  activeDocId,
}: {
  item: DocsSidebarLink;
  activeDocId: string;
}): ReactNode => (
  <Link
    className={clsx(
      NAV_LINK,
      item.docId === activeDocId
        ? 'bg-accent-soft text-accent hover:no-underline'
        : 'text-muted hover:bg-canvas hover:text-ink-2 hover:no-underline'
    )}
    to={item.permalink}
  >
    {item.label}
  </Link>
);

const SidebarCategory = ({
  category,
  activeDocId,
  startCollapsed,
}: {
  category: DocsSidebarCategory;
  activeDocId: string;
  startCollapsed: boolean;
}): ReactNode => {
  const containsActive = category.items.some(
    (item) => item.docId === activeDocId
  );
  const [open, setOpen] = useState(
    startCollapsed
      ? false
      : containsActive ||
          (persistedOpenGroups.get(category.label) ?? !category.collapsed)
  );
  const listId = `lagune-docs-group-${category.label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const icon = GROUP_ICONS[category.label] ?? 'layers';

  useEffect(() => {
    if (!startCollapsed && containsActive) setOpen(true);
  }, [startCollapsed, containsActive]);

  const toggle = () => {
    const next = !open;

    if (!startCollapsed) persistedOpenGroups.set(category.label, next);
    setOpen(next);
  };

  return (
    <div className='flex flex-col'>
      <button
        className={clsx(
          GROUP,
          'flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent text-left transition-colors hover:text-muted'
        )}
        type='button'
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
      >
        <span className='flex min-w-0 items-center gap-2'>
          <span className='inline-flex text-[0.9rem] text-muted'>
            <Icon name={icon} />
          </span>
          <span className='truncate'>{category.label}</span>
        </span>
        <span
          className={clsx(
            'inline-flex text-[0.9rem] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
            open && 'rotate-90'
          )}
        >
          <Icon name='chevronRight' />
        </span>
      </button>
      <div
        id={listId}
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='ml-[calc(1.075rem-1px)] flex min-h-0 flex-col gap-0.75 overflow-hidden border-l border-line pl-2'>
          {category.items.map((item) => (
            <SidebarItem
              key={item.docId}
              item={item}
              activeDocId={activeDocId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const DocsSidebar = ({
  sidebar,
  activeDocId,
  startCollapsed = false,
}: {
  sidebar: DocsSidebarEntry[];
  activeDocId: string;
  startCollapsed?: boolean;
}): ReactNode => (
  <>
    <Link
      className='flex items-center gap-3 px-2 pt-1.5 pb-5 text-ink no-underline hover:no-underline'
      to='/'
    >
      <img
        className='size-9.5 flex-none rounded-field object-contain'
        src='/favicon.png'
        alt='Lagune'
        aria-hidden
        width={38}
        height={38}
      />
      <span className='flex flex-col gap-1 text-[1.25rem] font-extrabold leading-none tracking-[-0.02em] text-ink'>
        <span>
          Lagune
          <span className='px-0.5 text-[#2092ff] font-sans text-[1.05rem]'>
            .ai
          </span>
        </span>
        <span className='sr-only'>Documentation</span>
        <span
          aria-hidden
          className='flex justify-between text-[0.75rem] font-semibold leading-none tracking-normal text-muted'
        >
          {[...'Documentation'].map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </span>
    </Link>
    <nav className='flex flex-col gap-0.75'>
      {sidebar.map((entry) =>
        entry.type === 'category' ? (
          <SidebarCategory
            key={entry.label}
            category={entry}
            activeDocId={activeDocId}
            startCollapsed={startCollapsed}
          />
        ) : (
          <SidebarItem
            key={entry.docId}
            item={entry}
            activeDocId={activeDocId}
          />
        )
      )}
    </nav>
    <a
      className='group mt-auto mb-4 flex items-center gap-2 pt-8 no-underline hover:no-underline'
      href='https://github.com/wellwelwel/lagune'
      target='_blank'
      rel='noreferrer'
    >
      <span className='grid size-19 flex-none transition-transform duration-300 ease-out group-hover:scale-102'>
        <img
          className='col-start-1 row-start-1 size-19 scale-100 object-contain opacity-100 mix-blend-multiply filter-[blur(0)] transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] docs-dark:scale-[0.25] docs-dark:opacity-0 docs-dark:filter-[blur(4px)]'
          src='/img/docs/octocat.gif'
          alt='GitHub'
          aria-hidden
          width={76}
          height={76}
        />
        <img
          className='col-start-1 row-start-1 size-19 scale-[0.25] object-contain opacity-0 filter-[drop-shadow(0_2px_6px_rgba(0,0,0,0.55))_blur(4px)] transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] docs-dark:scale-[0.85] docs-dark:opacity-100 docs-dark:filter-[drop-shadow(0_2px_6px_rgba(0,0,0,0.55))_blur(0)]'
          src='/img/docs/octocat-2.webp'
          alt='GitHub'
          aria-hidden
          width={76}
          height={76}
        />
      </span>
      <span className='relative flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='pointer-events-none absolute -top-7 -right-2.5 text-[5rem] leading-none text-slate-200 opacity-30 [clip-path:inset(0_0_0_33%)] docs-dark:opacity-[.05]'>
          <Icon name='star' />
        </span>
        <span className='relative z-10 text-[0.9rem] font-extrabold leading-tight text-ink'>
          Star on GitHub
        </span>
        <span className='relative z-10 text-[0.75rem] font-semibold leading-tight text-muted'>
          Support Lagune
        </span>
      </span>
      <span className='relative grid size-[0.85rem] flex-none place-items-center overflow-hidden text-[0.85rem] text-accent'>
        <span className='col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-[120%] group-hover:translate-y-[-120%]'>
          <Icon name='arrowUpRight' />
        </span>
        <span className='col-start-1 row-start-1 inline-flex translate-x-[-120%] translate-y-[120%] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-0 group-hover:translate-y-0'>
          <Icon name='arrowUpRight' />
        </span>
      </span>
    </a>
    <div className='flex flex-col gap-0.5 border-t border-line pt-3'>
      <a
        className={FOOT_LINK}
        href='https://github.com/wellwelwel/lagune'
        target='_blank'
        rel='noreferrer'
      >
        <span className='inline-flex text-[1.15rem]'>
          <Icon name='github' />
        </span>
        <span className='flex-1'>GitHub</span>
        <span className='inline-flex text-[0.8rem] text-faint'>
          <Icon name='arrowUpRight' />
        </span>
      </a>
      <a
        className={FOOT_LINK}
        href='https://github.com/sponsors/wellwelwel'
        target='_blank'
        rel='noreferrer'
      >
        <span className='inline-flex text-[1.15rem] text-pink'>
          <Icon name='heart' />
        </span>
        <span className='flex-1'>Sponsor</span>
        <span className='inline-flex text-[0.8rem] text-faint'>
          <Icon name='arrowUpRight' />
        </span>
      </a>
    </div>
  </>
);
