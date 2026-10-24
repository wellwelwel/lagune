export type CategoriesRequest = {
  categories: string[];
};

export type ActionSuccess = { ok: true; added: number; removed: number };

export type ActionFailure = {
  ok: false;
  error: string;
};

export type ActionResponse = ActionSuccess | ActionFailure;

export type SessionPayload = {
  token: string;
};
