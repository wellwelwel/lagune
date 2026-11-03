import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import LayoutProvider from '@theme/Layout/Provider';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDocsData } from '../data';
import { Icon } from '../icons';
import { QuickSearch } from '../QuickSearch';
import { DocsSidebar } from '../Sidebar';
import { toggleDocsTheme } from '../theme';

const ICON_BTN =
  'relative grid size-11.5 flex-none cursor-pointer place-items-center rounded-full border-0 bg-surface text-[1.2rem] text-ink-2 no-underline shadow-card transition-[color,box-shadow] hover:text-accent hover:no-underline hover:shadow-pop';

const PILL =
  'inline-flex h-11.5 flex-none items-center gap-2 rounded-full bg-surface px-4.5 text-[0.85rem] font-bold text-ink-2 no-underline shadow-card transition-[color,box-shadow] hover:text-accent hover:no-underline hover:shadow-pop';

export const DocsShell = ({
  children,
  rail,
  activeDocId,
}: {
  children: ReactNode;
  rail?: ReactNode;
  activeDocId: string;
}): ReactNode => {
  const { sidebar } = useDocsData();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('lagune-docs-drawer-open', drawerOpen);

    return () => document.body.classList.remove('lagune-docs-drawer-open');
  }, [drawerOpen]);

  return (
    <LayoutProvider>
      <div className='lagune-docs min-h-screen'>
        {drawerOpen && (
          <div className='fixed inset-0 z-50 min-[1024px]:hidden'>
            <button
              className='lagune-docs-backdrop absolute inset-0 size-full cursor-pointer border-0'
              type='button'
              aria-label='Close navigation'
              onClick={() => setDrawerOpen(false)}
            />
            <aside className='lagune-docs-drawer lagune-scroll absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-surface px-4 py-6 shadow-pop'>
              <button
                className='absolute top-4 right-3 grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[1.2rem] text-muted transition-colors hover:text-ink'
                type='button'
                aria-label='Close navigation'
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name='x' />
              </button>
              <DocsSidebar
                sidebar={sidebar}
                activeDocId={activeDocId}
                startCollapsed
              />
            </aside>
          </div>
        )}
        <div className='min-[1024px]:grid min-[1024px]:grid-cols-[250px_minmax(0,1fr)] min-[1440px]:grid-cols-[270px_minmax(0,1fr)]'>
          <aside className='lagune-scroll sticky top-0 hidden h-screen flex-col overflow-y-auto bg-surface px-4 py-6 min-[1024px]:flex'>
            <DocsSidebar sidebar={sidebar} activeDocId={activeDocId} />
          </aside>
          <div className='flex min-w-0 flex-col'>
            <header className='sticky top-0 z-30 flex items-center gap-3 bg-canvas/85 px-4 pt-4 pb-3 backdrop-blur-md sm:gap-4.5 sm:px-7 sm:pt-5.5 sm:pb-4'>
              <button
                className={clsx(ICON_BTN, 'min-[1024px]:hidden')}
                type='button'
                aria-label='Open navigation'
                onClick={() => setDrawerOpen(true)}
              >
                <Icon name='menu' />
              </button>
              <QuickSearch />
              <div className='flex items-center gap-3'>
                <button
                  className={ICON_BTN}
                  type='button'
                  aria-label='Toggle theme'
                  onClick={toggleDocsTheme}
                >
                  <span className='col-start-1 row-start-1 inline-flex scale-100 opacity-100 filter-[blur(0)] transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] docs-dark:scale-[0.25] docs-dark:opacity-0 docs-dark:filter-[blur(4px)]'>
                    <Icon name='moon' />
                  </span>
                  <span className='col-start-1 row-start-1 inline-flex scale-[0.25] opacity-0 filter-[blur(4px)] transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] docs-dark:scale-100 docs-dark:opacity-100 docs-dark:filter-[blur(0)]'>
                    <Icon name='sun' />
                  </span>
                </button>
                <a
                  className={clsx(ICON_BTN, 'max-sm:hidden')}
                  href='https://github.com/wellwelwel/lagune'
                  target='_blank'
                  rel='noreferrer'
                  aria-label='GitHub repository'
                >
                  <Icon name='github' />
                </a>
                <a
                  className={clsx(ICON_BTN, 'max-md:hidden')}
                  href='https://github.com/sponsors/wellwelwel'
                  target='_blank'
                  rel='noreferrer'
                  aria-label='Sponsor Lagune'
                >
                  <span className='inline-flex text-pink'>
                    <Icon name='heart' />
                  </span>
                </a>
                <span className='h-7.5 w-px bg-line-2 max-md:hidden' />
                <Link className={clsx(PILL, 'max-md:hidden')} to='/'>
                  <img
                    className='size-4.5 flex-none object-contain'
                    src='/img/icons/wave.svg'
                    alt='Lagune'
                    aria-hidden
                    width={18}
                    height={18}
                  />
                  Home
                </Link>
                <Link
                  className={clsx(ICON_BTN, 'md:hidden')}
                  to='/'
                  aria-label='Back to the home page'
                >
                  <img
                    className='size-4.75 object-contain'
                    src='/img/icons/wave.svg'
                    alt='Lagune'
                    aria-hidden
                    width={19}
                    height={19}
                  />
                </Link>
              </div>
            </header>
            <div className='mx-auto w-full max-w-360 flex-1 px-4 pt-2 pb-7 sm:px-7 min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,1fr)_300px] min-[1280px]:items-start min-[1280px]:gap-7'>
              <main className='flex min-w-0 flex-col'>{children}</main>
              {rail && (
                <div className='sticky top-24 hidden min-[1280px]:block'>
                  {rail}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutProvider>
  );
};
