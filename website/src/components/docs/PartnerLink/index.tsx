import type { MouseEvent, ReactNode } from 'react';
import { PartnersModal } from '@site/src/components/PartnersModal';
import { useEffect, useState } from 'react';
import { LinkArrow } from '../ArrowLink';

/*
 * A docs-native link that opens the partnership modal instead of navigating,
 * so the Partners note reads like the Supporters one right beside it, down to
 * the shared arrow. The modal keeps its own dark visual (portaled to <body>),
 * and the ?partners / #partners deep link still opens it straight away.
 */
export const PartnerLink = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('partners') || window.location.hash === '#partners') {
      setOpen(true);
    }
  }, []);

  const openModal = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href='#partners' onClick={openModal} className='group cursor-pointer'>
        {children}
        <LinkArrow />
      </a>
      <PartnersModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
