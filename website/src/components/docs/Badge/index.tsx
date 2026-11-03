import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { badgeMarkdown } from '@site/src/data/badges';

const BADGE_HEIGHT = 20;

export const Badge = ({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: number;
}): ReactNode => (
  <div className='mb-4 flex items-center gap-2'>
    <img src={src} alt={alt} width={width} height={BADGE_HEIGHT} />
    <CopyButton
      value={badgeMarkdown(alt, src)}
      label={translate(
        {
          id: 'docs.badge.copy',
          message: 'Copy the "{badge}" badge Markdown',
          description:
            "The label of the button that copies a badge's Markdown, where {badge} is the badge's text",
        },
        { badge: alt }
      )}
    />
  </div>
);
