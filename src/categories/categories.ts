import type { Category, CategoryChange } from '../types/categories.js';

export const CATEGORIES: Category[] = [
  {
    key: 'owasp',
    label: 'OWASP',
    description:
      'Harden against the application security risks OWASP tracks: injection, broken access control, auth, and crypto failures',
  },
  {
    key: 'infra',
    label: 'Infrastructure',
    description:
      'Harden container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers',
  },
  {
    key: 'ai',
    label: 'AI / LLM',
    description:
      'Harden AI and LLM integrations against prompt injection and unsafe tool, agent, retrieval, and MCP wiring',
  },
  {
    key: 'lovable',
    label: 'Lovable',
    description:
      'Harden AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked service_role keys, and insecure defaults',
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    description:
      'Harden JavaScript and its runtimes against eval and child_process RCE, path traversal, and prototype pollution',
  },
  {
    key: 'python',
    label: 'Python',
    description:
      'Harden Python against pickle and YAML deserialization RCE, str.format string traversal, and class pollution',
  },
  {
    key: 'rust',
    label: 'Rust',
    description:
      'Harden Rust against unsound unsafe APIs, transmute misuse, integer overflow, and FFI boundary undefined behavior',
  },
  {
    key: 'java',
    label: 'Java',
    description:
      'Harden Java against ObjectInputStream deserialization gadget chains that culminate in remote code execution',
  },
  {
    key: 'ruby',
    label: 'Ruby',
    description:
      'Harden Ruby against Marshal.load and YAML deserialization gadget chains that reach remote code execution',
  },
  {
    key: 'php',
    label: 'PHP',
    description:
      'Harden PHP against type-juggling auth bypass, object injection gadget chains, and insecure configuration defaults',
  },
  {
    key: 'go',
    label: 'Go',
    description:
      'Harden Go against typed-nil interface bugs, goroutine data races, and unsafe concurrency on security paths',
  },
  {
    key: 'c-cpp',
    label: 'C / C++',
    description:
      'Harden C and C++ against format-string bugs, buffer overflows, and out-of-bounds writes that enable code execution',
  },
  {
    key: 'dotnet',
    label: '.NET',
    description:
      'Harden .NET and C# against BinaryFormatter deserialization RCE and the encoder bypasses that reach XSS',
  },
];

export const findCategory = (
  categories: Category[],
  key: string
): Category | undefined => categories.find((category) => category.key === key);

export const unknownCategoryKeys = (
  categories: Category[],
  keys: string[]
): string[] =>
  keys.filter((key) => findCategory(categories, key) === undefined);

const unknownCategoriesMessage = (
  keys: string[],
  availableKeys: string[]
): string =>
  [
    `Unknown specialization ${keys.length === 1 ? 'category' : 'categories'}: ${keys.join(', ')}`,
    `Available categories: ${availableKeys.join(', ')}`,
  ].join('\n');

/** Throws for any key that names no registered category */
export const assertKnownCategories = (
  categories: Category[],
  keys: string[]
): void => {
  const unknown = unknownCategoryKeys(categories, keys);

  if (unknown.length > 0)
    throw new Error(
      unknownCategoriesMessage(
        unknown,
        categories.map((category) => category.key)
      )
    );
};

export const addCategories = (
  current: string[],
  requested: string[]
): CategoryChange => {
  const keys = [...new Set(requested)];
  const changed = keys.filter((key) => !current.includes(key));

  return {
    categories: [...current, ...changed],
    changed,
    unchanged: keys.filter((key) => current.includes(key)),
  };
};

export const removeCategories = (
  current: string[],
  requested: string[]
): CategoryChange => {
  const keys = [...new Set(requested)];

  return {
    categories: current.filter((key) => !keys.includes(key)),
    changed: keys.filter((key) => current.includes(key)),
    unchanged: keys.filter((key) => !current.includes(key)),
  };
};
