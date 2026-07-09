import type { ReactNode } from 'react';
import { PartnersModal } from '@site/src/components/PartnersModal';
import { useEffect, useState } from 'react';
import { LuHeartHandshake } from 'react-icons/lu';

/*
 * The partnership form keeps its own dark modal (portaled to <body>, styled off
 * the landing tokens), so it looks the same wherever it opens. Here the trigger
 * is a docs-native button, and the ?partners / #partners deep link still opens
 * it straight away, now on the docs intro instead of the home page.
 */
export const PartnersInvite = (): ReactNode => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('partners') || window.location.hash === '#partners') {
      setOpen(true);
    }
  }, []);

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex cursor-pointer items-center gap-2 rounded-field border-0 bg-accent px-4.5 py-2.5 font-jakarta text-[0.85rem] font-bold text-white no-underline shadow-card transition-[background-color,box-shadow,translate] duration-200 hover:bg-accent-3 hover:shadow-pop active:translate-y-px [&>svg]:size-[1.05rem]'
      >
        <LuHeartHandshake aria-hidden />
        Become a partner
      </button>
      <PartnersModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
