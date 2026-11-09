import { translate } from '@docusaurus/Translate';
import { IconSwap } from '@site/src/components/IconSwap';
import { useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { TbCopyCheckFilled, TbCopyFilled } from 'react-icons/tb';

const ICON_LOOK =
  'size-[26px] bg-transparent text-accent hover:opacity-80 [&_svg]:size-4';

export const CopyButton = ({
  value,
  label,
  filled = false,
  look = ICON_LOOK,
  className,
}: {
  value: string;
  label: string;
  filled?: boolean;
  look?: string;
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
      className={`relative inline-flex items-center justify-center shrink-0 border-0 p-0 cursor-pointer transition-opacity duration-200 ease-out after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 rtl:after:translate-x-1/2 after:-translate-y-1/2 ${look} ${className ?? ''}`}
    >
      <IconSwap
        on={copied}
        active={filled ? <TbCopyCheckFilled /> : <LuCheck />}
        inactive={filled ? <TbCopyFilled /> : <LuCopy />}
      />
    </button>
  );
};
