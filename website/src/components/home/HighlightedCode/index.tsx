import type { Token } from 'prism-react-renderer';
import type { ComponentProps, CSSProperties } from 'react';
import { laguneCode } from '@site/src/prism/lagune';
import { Highlight } from 'prism-react-renderer';

type HighlightedCodeProps = Pick<
  ComponentProps<'pre'>,
  'className' | 'dir' | 'translate'
> & {
  code: string;
  language: string;
};

const LIST_MARKER = /^(?:\d+\.|[-*]) /;

const tokenClass = ({ types }: Token): string | undefined =>
  types.includes('plain') ? undefined : 'whitespace-nowrap';

const hangingIndent = (line: Token[]): CSSProperties | undefined => {
  const marker = LIST_MARKER.exec(line.map(({ content }) => content).join(''));

  if (!marker) return undefined;

  const width = `${marker[0].length}ch`;

  return { paddingInlineStart: width, textIndent: `-${width}` };
};

export const HighlightedCode = ({
  code,
  language,
  className = '',
  ...attributes
}: HighlightedCodeProps) => (
  <Highlight theme={laguneCode} code={code} language={language}>
    {({ tokens, getTokenProps }) => (
      <pre
        {...attributes}
        className={`m-0 overflow-visible rounded-none bg-transparent p-0 [font-family:var(--font-mono)] leading-[1.65] text-ink whitespace-pre-wrap wrap-break-word ${className}`}
      >
        {tokens.map((line, lineIndex) => (
          <span key={lineIndex} className='block' style={hangingIndent(line)}>
            {line.map((token, tokenIndex) => (
              <span
                key={tokenIndex}
                {...getTokenProps({ token, className: tokenClass(token) })}
              />
            ))}
          </span>
        ))}
      </pre>
    )}
  </Highlight>
);
