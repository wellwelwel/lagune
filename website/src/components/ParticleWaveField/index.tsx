import { memo, useEffect, useRef, useState } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

const PARTICLE_COLOR = '#0b223e';
const PARTICLE_SIZE = 1.25;
const PARTICLE_GAP = 15;
const WAVE_INTENSITY = 100;
const WAVE_SPEED = 0.0005;
const MOUSE_RADIUS = 1000;
const MOUSE_FORCE = 100;
const MOUSE_EASE = 0.0025;

const EDGE_FADE = `${WAVE_INTENSITY * 3.5}px`;
const WAVE_MASK = [
  `linear-gradient(to bottom, transparent, #000 ${EDGE_FADE})`,
].join(', ');
const MASK_COMPOSITE = 'intersect, intersect';

const ParticleWaveFieldComponent = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -Infinity, y: -Infinity };
    let offsetX = new Float32Array(0);
    let offsetY = new Float32Array(0);

    const spriteRadius = PARTICLE_SIZE * 2;
    const sprite = document.createElement('canvas');
    sprite.width = spriteRadius * 2;
    sprite.height = spriteRadius * 2;
    const spriteContext = sprite.getContext('2d');
    if (spriteContext) {
      spriteContext.fillStyle = PARTICLE_COLOR;
      spriteContext.beginPath();
      spriteContext.arc(
        spriteRadius,
        spriteRadius,
        spriteRadius,
        0,
        Math.PI * 2
      );
      spriteContext.fill();
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      columns = Math.ceil(width / PARTICLE_GAP) + 1;
      rows = Math.ceil(height / PARTICLE_GAP) + 1;

      offsetX = new Float32Array(columns * rows);
      offsetY = new Float32Array(columns * rows);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    let frame = 0;

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      const wavePhase = time * WAVE_SPEED;
      const radiusSquared = MOUSE_RADIUS * MOUSE_RADIUS;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          const baseX = col * PARTICLE_GAP;
          const baseY = row * PARTICLE_GAP;

          const phase = (col + row) / (columns + rows);
          const swell = Math.sin(phase * Math.PI * 4 + wavePhase);
          const wave = swell * WAVE_INTENSITY;
          const crest = (swell + 1) * 0.5;

          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const distSquared = dx * dx + dy * dy;

          let targetX = 0;
          let targetY = 0;
          if (distSquared < radiusSquared) {
            const distance = Math.sqrt(distSquared) || 1;
            const strength = 1 - distance / MOUSE_RADIUS;
            const push = strength * strength * MOUSE_FORCE;
            targetX = (dx / distance) * push;
            targetY = (dy / distance) * push;
          }

          offsetX[index] += (targetX - offsetX[index]) * MOUSE_EASE;
          offsetY[index] += (targetY - offsetY[index]) * MOUSE_EASE;

          const x = baseX + offsetX[index];
          const y = baseY + wave + offsetY[index];

          const depth = (1 - phase) * 0.5 + crest * 0.5;
          const size = PARTICLE_SIZE * (0.5 + depth * 1.1);

          context.globalAlpha = 0.1 + depth * 0.8;
          context.drawImage(sprite, x - size, y - size, size * 2, size * 2);
        }
      }

      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onMouseLeave = () => {
      pointer.x = -Infinity;
      pointer.y = -Infinity;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className ?? 'fixed z-0'}`}
      style={{
        display: isMobile ? 'none' : undefined,
        maskImage: WAVE_MASK,
        WebkitMaskImage: WAVE_MASK,
        maskComposite: MASK_COMPOSITE,
        WebkitMaskComposite: 'source-in, source-in',
      }}
    />
  );
};

export const ParticleWaveField = memo(ParticleWaveFieldComponent);
