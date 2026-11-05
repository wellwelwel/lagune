export type CategoriesRequest = {
  categories: string[];
};

export type CheckersRequest = {
  checkers: Record<string, unknown>;
};

export type CategoriesChange = { added: number; removed: number };

export type CheckersChange = { changed: number };

export type ActionFailure = {
  ok: false;
  error: string;
};

export type ActionResponse<Change> = ({ ok: true } & Change) | ActionFailure;

export type SessionPayload = {
  token: string;
};
