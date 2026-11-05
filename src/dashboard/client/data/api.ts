import type {
  ActionFailure,
  ActionResponse,
  CategoriesChange,
  CategoriesRequest,
  CheckersChange,
  CheckersRequest,
  SessionPayload,
} from '@/types/dashboard/api';

export const REQUEST_FAILED: ActionFailure = {
  ok: false,
  error: 'Request failed',
};

const fetchSession = async (): Promise<SessionPayload> => {
  const response = await fetch('/api/session', { cache: 'no-store' });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return response.json();
};

const postAction = async <Change>(
  path: string,
  payload: unknown
): Promise<ActionResponse<Change>> => {
  try {
    const session = await fetchSession();
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-lagune-token': session.token,
      },
      body: JSON.stringify(payload),
    });
    const body: ActionResponse<Change> = await response.json();

    return body;
  } catch {
    return REQUEST_FAILED;
  }
};

export const runCategories = (
  request: CategoriesRequest
): Promise<ActionResponse<CategoriesChange>> =>
  postAction('/api/actions/categories', request);

export const runCheckers = (
  request: CheckersRequest
): Promise<ActionResponse<CheckersChange>> =>
  postAction('/api/actions/checkers', request);
