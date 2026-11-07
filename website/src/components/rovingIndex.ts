type Axis = 'horizontal' | 'vertical';

const STEP_KEYS: Record<Axis, { next: string; previous: string }> = {
  horizontal: { next: 'ArrowRight', previous: 'ArrowLeft' },
  vertical: { next: 'ArrowDown', previous: 'ArrowUp' },
};

export const rovingIndex = (
  key: string,
  index: number,
  count: number,
  axis: Axis
): number | null => {
  const { next, previous } = STEP_KEYS[axis];

  if (key === next) return (index + 1) % count;
  if (key === previous) return (index - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;

  return null;
};
