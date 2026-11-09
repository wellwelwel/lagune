import type { KeyboardEvent, ReactNode } from 'react';
import { rovingIndex } from '@site/src/components/rovingIndex';

export type TabItem = {
  label: string;
  icon: ReactNode;
};

export const tabIdOf = (id: string, index: number): string =>
  `${id}tab${index}`;

export const panelIdOf = (id: string): string => `${id}panel`;

export const tabKeyDown =
  (current: number, count: number, onPick: (index: number) => void) =>
  (event: KeyboardEvent<HTMLElement>) => {
    const next = rovingIndex(event.key, current, count, 'horizontal');

    if (next === null) return;

    const tab = event.currentTarget.querySelectorAll<HTMLElement>(
      ':scope > [role="tab"]'
    )[next];

    event.preventDefault();
    onPick(next);
    tab.focus();
  };
