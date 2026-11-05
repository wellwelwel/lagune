import type { ActionResponse } from '@/types/dashboard/api';
import type { ActionRunState } from '@/types/dashboard/client';
import { useState } from 'preact/hooks';
import { REQUEST_FAILED } from '../../data/api';

export const actionFailed = (label: string): string =>
  `${label} failed. Check the terminal running the dashboard.`;

export const useRunAction = () => {
  const [run, setRun] = useState<ActionRunState>('idle');

  const trigger = <Change>(
    task: () => Promise<ActionResponse<Change>>,
    onSettled: (result: ActionResponse<Change>) => void
  ) => {
    if (run === 'pending') return;

    setRun('pending');

    const settle = (result: ActionResponse<Change>) => {
      setRun(result.ok ? 'success' : 'error');
      onSettled(result);
    };

    task().then(settle, () => settle(REQUEST_FAILED));
  };

  return { run, setRun, trigger };
};
