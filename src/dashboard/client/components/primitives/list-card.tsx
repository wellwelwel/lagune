import type { ComponentChildren, VNode } from 'preact';
import { CARD, ROW_EDGES } from '../../utils/tailwind-classes';

export const ListCard = (props: { children: ComponentChildren }): VNode => (
  <div class={`scroll-none max-h-45.5 flex-1 overflow-y-auto ${CARD}`}>
    {props.children}
  </div>
);

export const ListRow = (props: {
  title?: string;
  children: ComponentChildren;
}): VNode => (
  <div class={`flex items-center gap-3 ${ROW_EDGES}`} title={props.title}>
    {props.children}
  </div>
);
