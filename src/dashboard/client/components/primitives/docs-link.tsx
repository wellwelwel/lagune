import type { VNode } from 'preact';
import { Icon } from './icons';

export const DocsLink = (props: { href: string }): VNode => (
  <a
    class='group/doc inline-flex flex-none items-center gap-1.5 rounded-lg bg-surface-2 px-4.5 py-2.5 text-[0.82rem] font-bold text-accent no-underline transition-[background-color] duration-200 hover:bg-accent-soft'
    href={props.href}
    target='_blank'
    rel='noreferrer'
  >
    Read the docs
    <span class='relative grid size-[0.9rem] flex-none place-items-center overflow-hidden text-[0.9rem]'>
      <span class='col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-house group-hover/doc:translate-x-[120%] group-hover/doc:translate-y-[-120%]'>
        <Icon name='arrowUpRight' />
      </span>
      <span class='col-start-1 row-start-1 inline-flex translate-x-[-120%] translate-y-[120%] transition-transform duration-300 ease-house group-hover/doc:translate-x-0 group-hover/doc:translate-y-0'>
        <Icon name='arrowUpRight' />
      </span>
    </span>
  </a>
);
