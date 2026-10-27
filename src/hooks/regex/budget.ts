import type { WorkMeter } from '../../types/hooks/regex.js';

const CAP_REACHED = new Error('the analysis reached its work cap');

export const reachCap = (): never => {
  throw CAP_REACHED;
};

export const isCapReached = (error: unknown): boolean => error === CAP_REACHED;

export const createMeter = (cap: number): WorkMeter => ({ cap, spent: 0 });

/** Charges steps of work to the meter, stopping the analysis once the total passes its cap */
export const spend = (meter: WorkMeter, steps: number): void => {
  meter.spent += steps;

  if (meter.spent > meter.cap) reachCap();
};
