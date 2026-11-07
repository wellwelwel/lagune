import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useDismiss = (
  open: boolean,
  root: RefObject<Element | null>,
  setOpen: (open: boolean) => void
): void => {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open, root, setOpen]);
};
