import type { CategoryKey } from '../../types/catalog';
import type {
  CategoryBadge,
  PromptSpec,
  SpecializationIconName,
  TypeSegment,
} from '../../types/dashboard/client';
import type { CatalogItem } from '../../types/dashboard/dashboard';
import { BUILTIN_SPECIALIZATIONS } from '../../catalog/builtin';
import { CATEGORIES } from '../../catalog/categories';
import { iconPath } from './assets';

const LABELS: Record<string, string> = {
  'access-control': 'Access Control',
  'api-endpoint': 'API Endpoint',
  browser: 'Browser',
  'c-cpp': 'C / C++',
  container: 'Container',
  'credential-endpoint': 'Credential Endpoint',
  crypto: 'Crypto',
  csv: 'CSV',
  dotnet: '.NET',
  federation: 'Federation',
  go: 'Go',
  'http-request': 'HTTP Request',
  infra: 'Infrastructure',
  interpreter: 'Interpreter',
  java: 'Java',
  javascript: 'JavaScript',
  llm: 'LLM',
  network: 'Network',
  path: 'Path',
  payment: 'Payment',
  php: 'PHP',
  python: 'Python',
  regex: 'Regex',
  ruby: 'Ruby',
  rust: 'Rust',
  secrets: 'Secrets',
  serverless: 'Serverless',
  sql: 'SQL',
  supabase: 'Supabase',
  transport: 'Transport',
  upload: 'Upload',
  xml: 'XML',
};

const DESCRIPTIONS: Record<string, string> = {
  'access-control':
    "Makes sure people can only see and do what they are allowed to, so no one can reach another user's data or admin-only actions just by changing a link or an ID.",
  'api-endpoint':
    "Checks the doors your app exposes to the outside world, so requests from strangers can't pull private data or trigger actions they shouldn't.",
  browser:
    "Guards what runs in your visitors' browsers, so an attacker can't inject code that steals logins or hijacks what your users see and click.",
  'c-cpp':
    'Catches low-level memory mistakes that let attackers crash the program or run their own code on your server.',
  container:
    'Reviews how your app is packaged and deployed, so a break-in stays contained instead of handing an attacker the whole machine.',
  'credential-endpoint':
    "Protects the login, signup, and password-reset flows, so attackers can't guess passwords, take over accounts, or reset someone else's.",
  crypto:
    "Makes sure sensitive data is scrambled properly, so passwords, tokens, and personal info can't be read even if they leak.",
  csv: "Hardens exported spreadsheets, so opening a downloaded file is far less likely to quietly run a harmful command on someone's computer.",
  dotnet:
    'Covers security pitfalls specific to .NET apps that can let an attacker run their own code on your server.',
  federation:
    "Hardens “sign in with Google/Microsoft/etc.” so an attacker has a much harder time impersonating a user or slipping into an account that isn't theirs.",
  go: 'Covers security pitfalls specific to Go apps, especially subtle bugs that show up under real traffic.',
  'http-request':
    "Inspects the data that arrives with each web request, so hidden or malicious input can't bend your app into doing the wrong thing.",
  infra:
    "Reviews the files that build and deploy your app, like Dockerfiles, Terraform, and CI workflows, so one loose setting can't expose the whole environment.",
  interpreter:
    "Stops user input from being run as commands, so a form field or upload can't make your server execute an attacker's instructions.",
  java: 'Covers security pitfalls specific to Java apps that can let an attacker run their own code on your server.',
  javascript:
    "Covers security pitfalls specific to JavaScript and Node apps, from running untrusted code to reading files it shouldn't.",
  llm: "Protects features built on AI models, so a cleverly worded message can't trick the AI into leaking data or misusing connected tools.",
  network:
    "Checks how your app talks to other services, so it can't be tricked into fetching or trusting something an attacker controls.",
  path: "Prevents attackers from wandering your server's files, so they can't read private files or overwrite important ones by manipulating a filename.",
  payment:
    'Hardens checkout and billing, making it far harder to tamper with prices, dodge payment, or replay a charge.',
  php: 'Covers security pitfalls specific to PHP apps that can let an attacker run their own code or bypass a login.',
  python:
    "Covers security pitfalls specific to Python apps, especially loading untrusted data that can run an attacker's code.",
  regex:
    'Hardens text checks so they stay efficient, making it far harder for a malicious input to freeze your app by overloading it.',
  ruby: "Covers security pitfalls specific to Ruby apps, especially loading untrusted data that can run an attacker's code.",
  rust: 'Covers security pitfalls specific to Rust apps, especially unsafe code that can corrupt memory or crash the program.',
  secrets:
    'Keeps passwords, API keys, and tokens out of your source code, so a shared repository or a leaked build never hands them to an attacker.',
  serverless:
    "Reviews cloud functions and their permissions, so a single function can't be abused to reach far more than it should.",
  sql: "Guards how your app talks to its database, so a crafted input can't read, change, or delete data it was never meant to touch.",
  supabase:
    "Locks down your Supabase backend, so your database rules actually hold and secret keys don't end up exposed to the public.",
  transport:
    'Hardens transport so data travels over an encrypted connection, making it far harder to read or alter on the way between your users and your app.',
  upload:
    'Hardens file uploads, making it far harder for someone to upload a disguised file that runs code, overwrites data, or fills up your storage.',
  xml: 'Hardens how your app reads XML data, so a crafted file is far less able to leak server files or knock your app offline.',
};

const PROMPT_TASKS: Record<string, string> = {
  regex: 'Add a coupon field to checkout that only accepts valid codes',
  javascript: 'Build a web app with JavaScript',
  browser: "Show each user's bio on their public profile page",
  network: 'Let users paste a link and show a little preview of it',
  interpreter:
    'Add a field where people can write their own formulas, like in an Excel spreadsheet',
  sql: 'Add a search box so users can find orders by customer name',
  path: 'Let people download their files by clicking on them',
  upload: 'Let people upload a profile photo in account settings',
  'access-control': 'Add an admin area to manage all the user accounts',
  'credential-endpoint': 'Build sign up, login, and forgot-password for my app',
  federation: 'Add a “Continue with Google” button to my login page',
  'http-request': 'Let users update their email from their profile page',
  transport: 'Make my whole site load securely over https',
  crypto: 'Let people create an account with a password and log back in',
  secrets: 'Connect my app to the payment provider using their API key',
  'api-endpoint': 'Build an API so my mobile app can talk to the backend',
  payment: 'Add Stripe checkout so customers can pay on the pricing page',
  xml: 'Let suppliers upload their invoices as XML files',
  csv: 'Add a button to export my contacts to a spreadsheet',
  container: 'Package my app so I can deploy it to the cloud',
  infra: 'Set up a pipeline that deploys my app to the cloud on every push',
  serverless: 'Automatically make a thumbnail whenever someone uploads a photo',
  llm: 'Add a chatbot that answers questions from my help docs',
  supabase: 'Set up Supabase so each user only sees their own notes',
  python: 'Build a data tool with Python',
  rust: 'Build a fast service with Rust',
  java: 'Build a backend with Java',
  ruby: 'Build a web app with Ruby',
  php: 'Build a website with PHP',
  go: 'Build an API service with Go',
  'c-cpp': 'Build a native program with C++',
  dotnet: 'Build a desktop app with .NET',
};

const CATEGORY_ICONS: Record<CategoryKey, string> = {
  owasp: 'owasp',
  infra: 'kubernetes',
  ai: 'ai',
  lovable: 'lovable',
  javascript: 'javascript',
  python: 'python',
  rust: 'rust',
  java: 'java',
  ruby: 'ruby',
  php: 'php',
  go: 'go',
  'c-cpp': 'cpp',
  dotnet: 'dot-net',
};

const ICONS: Record<string, SpecializationIconName> = {
  upload: 'upload',
  path: 'file',
  interpreter: 'terminal',
  sql: 'layers',
  network: 'globe',
  javascript: 'code',
  regex: 'code',
  crypto: 'key',
  secrets: 'key',
  'access-control': 'key',
  'credential-endpoint': 'key',
  'api-endpoint': 'globe',
  'http-request': 'globe',
  browser: 'globe',
  container: 'layers',
  infra: 'layers',
  serverless: 'activity',
  transport: 'globe',
  federation: 'key',
  payment: 'key',
  csv: 'file',
  xml: 'file',
  python: 'code',
  rust: 'code',
  java: 'code',
  ruby: 'code',
  php: 'code',
  go: 'code',
  'c-cpp': 'code',
  dotnet: 'code',
  llm: 'cpu',
  supabase: 'layers',
};

const titleCase = (slug: string): string =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const categoryIcon = (key: CategoryKey): string =>
  iconPath(CATEGORY_ICONS[key]);

export const builtinNames = (): string[] =>
  BUILTIN_SPECIALIZATIONS.map((entry) => entry.name);

export const specializationLabel = (name: string): string =>
  LABELS[name] ?? titleCase(name);

export const specializationIconName = (name: string): SpecializationIconName =>
  ICONS[name] ?? 'brain';

export const specializationDescription = (name: string): string =>
  DESCRIPTIONS[name] ??
  'Adds focused security checks for this part of your project.';

export const specializationPromptTask = (name: string): string =>
  PROMPT_TASKS[name] ??
  `Add a feature that touches ${specializationLabel(name)}`;

export const AGENT_REPLY: TypeSegment[] = [{ text: 'On it!' }];

export const specializationPromptSpec = (item: CatalogItem): PromptSpec => ({
  task: `${specializationPromptTask(item.name)}.`,
  mention: '/lagune',
  readPath: `catalog ${item.name}`,
  reply: AGENT_REPLY,
});

export const specializationCategories = (name: string): CategoryBadge[] => {
  const keys = BUILTIN_SPECIALIZATIONS.find(
    (entry) => entry.name === name
  )?.categories;

  return (keys ?? [])
    .map((key) => CATEGORIES.find((category) => category.key === key))
    .filter((category) => category !== undefined)
    .map((category) => ({
      key: category.key,
      label: category.label,
      icon: categoryIcon(category.key),
    }));
};
