import type { BuiltinSkillEntry } from '../../types/core.js';

export const SKILLS_CATALOG: BuiltinSkillEntry[] = [
  {
    name: 'regex',
    tags: ['Regular Expression'],
    groups: ['owasp'],
  },
  {
    name: 'javascript',
    tags: ['Node.js', 'Deno', 'Bun', 'TypeScript'],
    groups: ['javascript'],
  },
  {
    name: 'browser',
    tags: ['DOM', 'Client-Side', 'CSP'],
    groups: ['javascript'],
  },
  {
    name: 'network',
    tags: ['Requests', 'Webhook', 'URL Fetch', 'Socket', 'IMDS', 'Redirect'],
    groups: ['owasp'],
  },
  {
    name: 'interpreter',
    tags: ['Evaluator', 'Sink', 'Shell', 'Dynamic Execution'],
    groups: ['owasp'],
  },
  {
    name: 'path',
    tags: ['Directory Traversal', 'File Path', 'Filesystem', 'NTFS'],
    groups: ['owasp'],
  },
  {
    name: 'upload',
    tags: ['File Upload', 'Multipart', 'Attachment', 'MIME Type'],
    groups: ['owasp'],
  },
  {
    name: 'access-control',
    tags: ['Authentication', 'Authorization', 'Session', 'RBAC'],
    groups: ['owasp'],
  },
  {
    name: 'credential-endpoint',
    tags: ['Login', 'Rate Limiting', 'Anti-Automation', 'CAPTCHA'],
    groups: ['owasp'],
  },
  {
    name: 'federation',
    tags: ['OAuth', 'OIDC', 'SAML', 'JWT'],
    groups: ['owasp'],
  },
  {
    name: 'http-request',
    tags: ['CSRF', 'CORS', 'Origin Header', 'Forwarded Headers'],
    groups: ['owasp'],
  },
  {
    name: 'transport',
    tags: ['TLS', 'HTTPS', 'HSTS', 'Certificate Pinning'],
    groups: ['owasp'],
  },
  {
    name: 'crypto',
    tags: ['Cryptography', 'Encryption', 'Key Management', 'Randomness'],
    groups: ['owasp'],
  },
  {
    name: 'api-endpoint',
    tags: ['GraphQL', 'gRPC', 'WebSocket', 'RPC'],
    groups: ['owasp'],
  },
  {
    name: 'payment',
    tags: ['Checkout', 'Gateway', 'PSP', 'Stripe'],
    groups: ['owasp'],
  },
  {
    name: 'xml',
    tags: ['XXE', 'DTD', 'Entity Expansion', 'SAML'],
    groups: ['owasp'],
  },
  {
    name: 'csv',
    tags: ['Formula Injection', 'Spreadsheet', 'Excel'],
    groups: ['owasp'],
  },
  {
    name: 'container',
    tags: ['Docker', 'Kubernetes', 'Dockerfile', 'Pod Security'],
    groups: ['owasp', 'infra'],
  },
  {
    name: 'serverless',
    tags: ['FaaS', 'Lambda', 'Cloud Functions', 'IAM'],
    groups: ['owasp', 'infra'],
  },
  {
    name: 'llm',
    tags: ['AI API', 'RAG', 'MCP', 'Agent'],
    groups: ['ai'],
  },
  {
    name: 'python',
    tags: ['CPython', 'pickle', 'Django'],
    groups: ['python'],
  },
  {
    name: 'rust',
    tags: ['Cargo', 'crates.io', 'unsafe'],
    groups: ['rust'],
  },
  {
    name: 'java',
    tags: ['JVM', 'Serializable', 'Cloneable'],
    groups: ['java'],
  },
  {
    name: 'ruby',
    tags: ['Rails', 'Marshal', 'Psych'],
    groups: ['ruby'],
  },
  {
    name: 'php',
    tags: ['Laravel', 'Symfony', 'WordPress', 'Composer'],
    groups: ['php'],
  },
  {
    name: 'go',
    tags: ['Golang', 'goroutine', 'go vet'],
    groups: ['go'],
  },
  {
    name: 'c-cpp',
    tags: ['C', 'C++'],
    groups: ['c-cpp'],
  },
  {
    name: 'dotnet',
    tags: ['.NET', 'C#', 'ASP.NET', 'BinaryFormatter'],
    groups: ['dotnet'],
  },
];
