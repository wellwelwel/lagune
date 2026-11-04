export type CategoryKey =
  | 'owasp'
  | 'infra'
  | 'ai'
  | 'lovable'
  | 'javascript'
  | 'python'
  | 'rust'
  | 'java'
  | 'ruby'
  | 'php'
  | 'go'
  | 'c-cpp'
  | 'dotnet';

export type Category = {
  key: CategoryKey;
  label: string;
  description: string;
};
