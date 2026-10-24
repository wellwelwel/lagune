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

export type BuiltinSpecialization = {
  name: string;
  tags: string[];
  categories: CategoryKey[];
  required?: boolean;
};

export type Specialization = {
  name: string;
  tags: string[];
};

export type CatalogEntry = Specialization & { required?: boolean };

export type ProjectCatalog = {
  categories: string[] | undefined;
  entries: Specialization[];
};

export type CategoryAction = 'add' | 'remove';

export type CategoryChange = {
  categories: string[];
  changed: string[];
  unchanged: string[];
};
