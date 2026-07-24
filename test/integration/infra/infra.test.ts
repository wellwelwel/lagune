import { describe, it, strict } from 'poku';
import { analyze, classify } from '../../../src/hooks/infra/analyze.js';
import { infraKindOf } from '../../../src/hooks/infra/kind.js';

describe('infraKindOf recognizes IaC file types', () => {
  const cases: Array<[string, string | null]> = [
    ['infra/main.tf', 'terraform'],
    ['modules/vpc/network.tf.json', 'terraform'],
    ['Dockerfile', 'dockerfile'],
    ['docker/Dockerfile.prod', 'dockerfile'],
    ['build/app.dockerfile', 'dockerfile'],
    ['.github/workflows/ci.yml', 'github-actions'],
    ['.github/actions/setup/action.yaml', 'github-actions'],
    ['src/app.ts', null],
    ['config.yaml', null],
  ];

  for (const [path, kind] of cases)
    it(`maps ${path} to ${kind}`, () => {
      strict.strictEqual(infraKindOf(path), kind);
    });
});

describe('terraform findings', () => {
  it('flags a security group open to 0.0.0.0/0 on a sensitive port', () => {
    const tf = `resource "aws_security_group" "db" {
  ingress {
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;
    strict.ok(analyze(tf, 'terraform').findings.length >= 1);
    strict.strictEqual(classify(tf, 'terraform'), 'public-ingress');
  });

  it('passes a security group open only on 443', () => {
    const tf = `ingress {
  from_port   = 443
  to_port     = 443
  cidr_blocks = ["0.0.0.0/0"]
}`;
    strict.strictEqual(analyze(tf, 'terraform').findings.length, 0);
  });

  it('flags a wildcard IAM action', () => {
    strict.strictEqual(
      classify('actions = ["*"]', 'terraform'),
      'iam-wildcard'
    );
  });

  it('flags a git module without a pinned ref', () => {
    strict.strictEqual(
      classify('source = "git::https://example.com/vpc.git"', 'terraform'),
      'unpinned-module'
    );
    strict.strictEqual(
      classify(
        'source = "git::https://example.com/vpc.git?ref=abc123"',
        'terraform'
      ),
      'safe'
    );
  });
});

describe('dockerfile findings and advisories', () => {
  it('flags a final image that explicitly runs as root', () => {
    strict.strictEqual(
      classify('FROM node:20\nUSER root\nRUN npm ci', 'dockerfile'),
      'root-user'
    );
  });

  it('does not flag a missing USER line (base-image default is unknown)', () => {
    const df = 'FROM gcr.io/distroless/nodejs:nonroot\nCOPY app /app';

    strict.strictEqual(analyze(df, 'dockerfile').findings.length, 0);
    strict.notStrictEqual(classify(df, 'dockerfile'), 'root-user');
  });

  it('does not flag a transient builder-stage USER root when the final stage is not root', () => {
    const df =
      'FROM node:20 AS build\nUSER root\nRUN apt-get install -y g++\n\nFROM gcr.io/distroless/nodejs:nonroot\nCOPY --from=build /app /app';

    strict.strictEqual(analyze(df, 'dockerfile').findings.length, 0);
  });

  it('flags a curl pipe into a shell without verification', () => {
    strict.strictEqual(
      classify('USER node\nRUN curl https://x.sh | sh', 'dockerfile'),
      'curl-pipe'
    );
  });

  it('treats a mutable base tag as an advisory, not a finding', () => {
    const result = analyze('FROM node:20\nUSER node', 'dockerfile');

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.advisory.length, 1);
    strict.strictEqual(
      classify('FROM node:20\nUSER node', 'dockerfile'),
      'mutable-tag'
    );
  });

  it('passes a digest-pinned, non-root image', () => {
    const df = 'FROM node@sha256:aaaa\nUSER node';

    strict.strictEqual(analyze(df, 'dockerfile').findings.length, 0);
    strict.strictEqual(analyze(df, 'dockerfile').advisory.length, 0);
  });
});

describe('github-actions findings and advisories', () => {
  it('flags an untrusted event field in a run block', () => {
    const wf =
      'jobs:\n  x:\n    steps:\n      - run: echo "${{ github.event.issue.title }}"';

    strict.strictEqual(classify(wf, 'github-actions'), 'script-injection');
  });

  it('flags permissions: write-all', () => {
    strict.strictEqual(
      classify('permissions: write-all', 'github-actions'),
      'write-all'
    );
  });

  it('treats a tag-pinned action as an advisory', () => {
    const wf = 'steps:\n  - uses: actions/checkout@v4';

    strict.strictEqual(analyze(wf, 'github-actions').findings.length, 0);
    strict.strictEqual(classify(wf, 'github-actions'), 'unpinned-action');
  });

  it('passes a sha-pinned action', () => {
    const wf =
      'steps:\n  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683';

    strict.strictEqual(classify(wf, 'github-actions'), 'safe');
  });
});

describe('terraform ingress is scoped per block and range-aware', () => {
  it('does not flag 443 open to the world when a separate block opens 5432 internally', () => {
    const tf = `resource "aws_security_group" "web" {
  ingress {
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["10.0.0.0/8"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

    strict.strictEqual(analyze(tf, 'terraform').findings.length, 0);
  });

  it('flags an ingress that opens every port (0-65535) to the world', () => {
    const tf = `resource "x" "y" {
  ingress {
    from_port   = 0
    to_port     = 65535
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

    strict.strictEqual(classify(tf, 'terraform'), 'public-ingress');
  });

  it('flags an ingress with protocol "-1" open to the world', () => {
    const tf = `resource "x" "y" {
  ingress {
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

    strict.strictEqual(classify(tf, 'terraform'), 'public-ingress');
  });

  it('flags a dynamic "ingress" content block open to the world on 22', () => {
    const tf = `dynamic "ingress" {
  for_each = var.rules
  content {
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

    strict.strictEqual(classify(tf, 'terraform'), 'public-ingress');
  });

  it('scopes the list form so a safe open block is not paired with a sensitive closed one', () => {
    const tf = `ingress = [
  { from_port = 443,  to_port = 443,  cidr_blocks = ["0.0.0.0/0"] },
  { from_port = 5432, to_port = 5432, cidr_blocks = ["10.0.0.0/8"] },
]`;

    strict.strictEqual(analyze(tf, 'terraform').findings.length, 0);
  });
});

describe('terraform, dockerfile, and github-actions coverage gaps', () => {
  it('flags a wildcard IAM action written as a JSON array', () => {
    const tf =
      'policy = jsonencode({ Statement = [{ Effect = "Allow", "Action": ["*"], "Resource": "arn" }] })';

    strict.strictEqual(classify(tf, 'terraform'), 'iam-wildcard');
  });

  it('flags a hardcoded secret in a prefixed attribute name', () => {
    const tf = `resource "aws_db_instance" "d" {
  db_password = "s3cr3tLiteralValue"
}`;

    strict.strictEqual(classify(tf, 'terraform'), 'secret-in-data');
  });

  it('does not flag a non-secret attribute that ends in a keyword', () => {
    const tf = `resource "x" "y" {
  password_policy = "strict-mode"
}`;

    strict.strictEqual(analyze(tf, 'terraform').findings.length, 0);
  });

  it('does not flag a final stage that installs as root then drops privilege', () => {
    const df =
      'FROM node:20\nUSER root\nRUN apt-get install -y g++\nUSER node\nCMD ["node"]';

    strict.notStrictEqual(classify(df, 'dockerfile'), 'root-user');
  });

  it('does not flag a github.event value mapped into env: and used as $VAR in run:', () => {
    const wf = `jobs:
  b:
    steps:
      - env:
          TITLE: \${{ github.event.issue.title }}
        run: echo "$TITLE"`;

    strict.notStrictEqual(classify(wf, 'github-actions'), 'script-injection');
  });

  it('flags default_branch interpolated into a run block', () => {
    const wf = `jobs:
  b:
    steps:
      - run: echo "\${{ github.event.repository.default_branch }}"`;

    strict.strictEqual(classify(wf, 'github-actions'), 'script-injection');
  });
});
