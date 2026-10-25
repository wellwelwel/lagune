import type { ActionResponse } from '@/types/dashboard/api';
import type { ActionRunState, RunButton } from '@/types/dashboard/client';
import { useState } from 'preact/hooks';
import { REQUEST_FAILED } from '../../data/api';

export const actionFailed = (label: string): string =>
  `${label} failed. Check the terminal running the dashboard.`;

export const useRunAction = (buttons: Record<ActionRunState, RunButton>) => {
  const [run, setRun] = useState<ActionRunState>('idle');

  const trigger = (
    task: () => Promise<ActionResponse>,
    onSettled: (result: ActionResponse) => void
  ) => {
    if (run === 'pending') return;
    setRun('pending');

    const settle = (result: ActionResponse) => {
      setRun(result.ok ? 'success' : 'error');
      onSettled(result);
    };

    task().then(settle, () => settle(REQUEST_FAILED));
  };

  return { run, setRun, button: buttons[run], trigger };
};
