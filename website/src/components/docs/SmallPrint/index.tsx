import type { ReactNode } from 'react';

const SMALL_PRINT_LINK = 'font-semibold text-ink-2 hover:text-accent';

export const DocsSmallPrint = (): ReactNode => (
  <footer className='mt-10 flex flex-col gap-1.5 px-1 text-[0.75rem] leading-relaxed text-[color-mix(in_srgb,var(--muted),var(--ink-2))]'>
    <p className='m-0'>
      Copyright © 2026-present{' '}
      <a
        className={SMALL_PRINT_LINK}
        href='https://github.com/wellwelwel'
        target='_blank'
        rel='noreferrer'
      >
        Weslley Araújo
      </a>{' '}
      and{' '}
      <a
        className={SMALL_PRINT_LINK}
        href='https://github.com/wellwelwel/blue-spec/graphs/contributors'
        target='_blank'
        rel='noreferrer'
      >
        contributors
      </a>
      . SDH: Blue Spec is under the{' '}
      <a
        className={SMALL_PRINT_LINK}
        href='https://github.com/wellwelwel/blue-spec/blob/main/LICENSE'
        target='_blank'
        rel='noreferrer'
      >
        MIT License
      </a>
      . Please check the{' '}
      <a
        className={SMALL_PRINT_LINK}
        href='https://github.com/wellwelwel/blue-spec/blob/main/SECURITY.md'
        target='_blank'
        rel='noreferrer'
      >
        Security Policy
      </a>
      .
    </p>
    <p className='m-0'>
      SDH: Blue Spec is an independent open-source project and is not affiliated
      with, endorsed by, or associated with Bluespec, Inc. or the Bluespec
      Hardware Description Language (HDL) and its compiler (bsc). "Bluespec" is
      a trademark of Bluespec, Inc. All other product names, trademarks, and
      registered trademarks mentioned are the property of their respective
      owners and are used for identification purposes only.
    </p>
  </footer>
);
