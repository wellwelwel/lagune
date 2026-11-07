import type { ReactNode } from 'react';

type TallestProps = {
  variants: ReactNode[];
  className?: string;
  children: ReactNode;
};

export const Tallest = ({
  variants,
  className = '',
  children,
}: TallestProps): ReactNode => (
  <div className={`grid grid-cols-1 ${className}`}>
    {variants.map((variant, index) => (
      <div key={index} className='invisible col-start-1 row-start-1'>
        {variant}
      </div>
    ))}
    <div className='col-start-1 row-start-1 min-w-0'>{children}</div>
  </div>
);
