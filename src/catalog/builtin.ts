import type { BuiltinSpecialization } from '../types/catalog.js';

export const BUILTIN_SPECIALIZATIONS: BuiltinSpecialization[] = [
  {
    name: 'regex',
    tags: ['Regular Expression'],
    categories: ['owasp'],
    required: true,
  },
  {
    name: 'javascript',
    tags: ['Node.js', 'Deno', 'Bun', 'TypeScript'],
    categories: ['javascript'],
  },
  {
    name: 'browser',
    tags: ['DOM', 'Client-Side', 'CSP'],
    categories: ['javascript', 'lovable'],
  },
  {
    name: 'network',
    tags: ['Requests', 'Webhook', 'URL Fetch', 'Socket', 'IMDS', 'Redirect'],
    categories: ['owasp'],
  },
  {
    name: 'interpreter',
    tags: ['Evaluator', 'Sink', 'Shell', 'Dynamic Execution'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'sql',
    tags: ['MySQL', 'PostgreSQL', 'MariaDB', 'ORM'],
    categories: ['owasp'],
  },
  {
    name: 'path',
    tags: ['Directory Traversal', 'File Path', 'Filesystem', 'NTFS'],
    categories: ['owasp'],
  },
  {
    name: 'upload',
    tags: ['File Upload', 'Multipart', 'Attachment', 'MIME Type'],
    categories: ['owasp'],
  },
  {
    name: 'access-control',
    tags: ['Authentication', 'Authorization', 'Session', 'RBAC'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'credential-endpoint',
    tags: ['Login', 'Rate Limiting', 'Anti-Automation', 'CAPTCHA'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'federation',
    tags: ['OAuth', 'OIDC', 'SAML', 'JWT'],
    categories: ['owasp'],
  },
  {
    name: 'http-request',
    tags: ['CSRF', 'CORS', 'Origin Header', 'Forwarded Headers'],
    categories: ['owasp'],
  },
  {
    name: 'transport',
    tags: ['TLS', 'HTTPS', 'HSTS', 'Certificate Pinning'],
    categories: ['owasp'],
  },
  {
    name: 'crypto',
    tags: ['Cryptography', 'Encryption', 'Key Management', 'Randomness'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'secrets',
    tags: ['Hardcoded Credential', 'API Key', 'Token', 'Env Var'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'api-endpoint',
    tags: ['GraphQL', 'gRPC', 'WebSocket', 'RPC'],
    categories: ['owasp'],
  },
  {
    name: 'payment',
    tags: ['Checkout', 'Gateway', 'PSP', 'Stripe'],
    categories: ['owasp', 'lovable'],
  },
  {
    name: 'xml',
    tags: ['XXE', 'DTD', 'Entity Expansion', 'SAML'],
    categories: ['owasp'],
  },
  {
    name: 'csv',
    tags: ['Formula Injection', 'Spreadsheet', 'Excel'],
    categories: ['owasp'],
  },
  {
    name: 'container',
    tags: ['Docker', 'Kubernetes', 'Dockerfile', 'Pod Security'],
    categories: ['owasp', 'infra'],
  },
  {
    name: 'infra',
    tags: ['Terraform', 'Dockerfile', 'GitHub Actions', 'IaC'],
    categories: ['infra'],
  },
  {
    name: 'serverless',
    tags: ['FaaS', 'Lambda', 'Cloud Functions', 'IAM'],
    categories: ['owasp', 'infra', 'lovable'],
  },
  {
    name: 'llm',
    tags: ['AI API', 'RAG', 'MCP', 'Agent'],
    categories: ['ai', 'lovable'],
  },
  {
    name: 'supabase',
    tags: ['Lovable', 'RLS', 'PostgREST', 'service_role'],
    categories: ['lovable'],
  },
  {
    name: 'python',
    tags: ['CPython', 'pickle', 'Django'],
    categories: ['python'],
  },
  {
    name: 'rust',
    tags: ['Cargo', 'crates.io', 'unsafe'],
    categories: ['rust'],
  },
  {
    name: 'java',
    tags: ['JVM', 'Serializable', 'Cloneable'],
    categories: ['java'],
  },
  {
    name: 'ruby',
    tags: ['Rails', 'Marshal', 'Psych'],
    categories: ['ruby'],
  },
  {
    name: 'php',
    tags: ['Laravel', 'Symfony', 'WordPress', 'Composer'],
    categories: ['php'],
  },
  {
    name: 'go',
    tags: ['Golang', 'goroutine', 'go vet'],
    categories: ['go'],
  },
  {
    name: 'c-cpp',
    tags: ['C', 'C++'],
    categories: ['c-cpp'],
  },
  {
    name: 'dotnet',
    tags: ['.NET', 'C#', 'ASP.NET', 'BinaryFormatter'],
    categories: ['dotnet'],
  },
];
