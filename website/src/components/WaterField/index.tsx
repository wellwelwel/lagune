import type { WaterPalette } from './protocol';
import { memo, useEffect, useRef } from 'react';
import { mountWaterShader } from './mountWaterShader';

const PALETTE: WaterPalette = {
  light: '#071725',
  rim: '#041533',
  blue: '#110081',
  deep: '#08103a',
};

const FIELD_MASK =
  'linear-gradient(to bottom, transparent, #000 50%, #000 75%, transparent)';

const WaterFieldComponent = ({ className }: { className: string }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    return mountWaterShader(host, PALETTE);
  }, []);

  return (
    <div
      ref={hostRef}
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{
        backgroundColor: PALETTE.deep,
        maskImage: FIELD_MASK,
        WebkitMaskImage: FIELD_MASK,
      }}
      aria-hidden
    />
  );
};

export const WaterField = memo(WaterFieldComponent);
