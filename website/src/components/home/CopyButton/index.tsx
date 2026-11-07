import { translate } from '@docusaurus/Translate';
import { IconSwap } from '@site/src/components/IconSwap';
import { useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { TbCopyCheckFilled, TbCopyFilled } from 'react-icons/tb';

export const CopyButton = ({
  value,
  label,
  filled = false,
  className,
}: {
  value: string;
  label: string;
  filled?: boolean;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type='button'
      aria-label={
        copied
          ? translate({
              id: 'common.copied',
              message: 'Copied',
              description:
                'Confirms that something was copied to the clipboard',
            })
          : label
      }
      onClick={onCopy}
      className={`relative inline-flex items-center justify-center shrink-0 size-[26px] border-0 bg-transparent p-0 text-accent cursor-pointer transition-opacity duration-200 ease-out hover:opacity-80 after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 [&_svg]:size-4 ${className ?? ''}`}
    >
      <IconSwap
        on={copied}
        active={filled ? <TbCopyCheckFilled /> : <LuCheck />}
        inactive={filled ? <TbCopyFilled /> : <LuCopy />}
      />
    </button>
  );
};
