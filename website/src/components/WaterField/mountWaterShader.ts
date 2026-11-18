import type {
  WaterEvent,
  WaterMessage,
  WaterPalette,
  WaterRenderer,
} from './protocol';
import { REDUCED_MOTION_QUERY } from '@site/src/components/reducedMotion';
import { CONTEXT_OPTIONS, createWaterRenderer } from './renderer';

const RENDER_SCALE = 0.75;
const MAX_PIXEL_RATIO = 2;
const VISIBILITY_MARGIN = '100px';

const CANVAS_STYLE =
  'position:absolute;inset:0;display:block;width:100%;height:100%;opacity:0;transition:opacity 400ms ease';

const canRenderOffscreen = () =>
  typeof Worker === 'function' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

const attachCanvas = (host: HTMLElement) => {
  const canvas = document.createElement('canvas');

  canvas.style.cssText = CANVAS_STYLE;
  host.prepend(canvas);

  return canvas;
};

const renderInline = (
  canvas: HTMLCanvasElement,
  palette: WaterPalette,
  reducedMotion: boolean
): WaterRenderer | null => {
  const gl = canvas.getContext('webgl2', CONTEXT_OPTIONS);

  return gl && createWaterRenderer(gl, palette, reducedMotion);
};

const renderInWorker = (
  canvas: HTMLCanvasElement,
  palette: WaterPalette,
  reducedMotion: boolean,
  onFailure: () => void
): WaterRenderer => {
  const worker = new Worker(new URL('./water.worker.ts', import.meta.url));
  const offscreen = canvas.transferControlToOffscreen();
  const init: WaterMessage = {
    type: 'init',
    canvas: offscreen,
    palette,
    reducedMotion,
  };

  const post = (message: WaterMessage) => worker.postMessage(message);

  worker.onmessage = (event: MessageEvent<WaterEvent>) => {
    if (event.data.type === 'failure') onFailure();
  };
  worker.onerror = onFailure;
  worker.postMessage(init, [offscreen]);

  return {
    resize: (width, height) => post({ type: 'resize', width, height }),
    point: (x, y) => post({ type: 'point', x, y }),
    release: () => post({ type: 'release' }),
    setRunning: (running) => post({ type: 'running', running }),
    setReducedMotion: (reduced) => post({ type: 'motion', reduced }),
    dispose: () => {
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
    },
  };
};

/**
 * Paints the reactive water behind `host` and returns its `dispose`.
 */
export const mountWaterShader = (
  host: HTMLElement,
  palette: WaterPalette
): (() => void) => {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const view = { width: 0, height: 0, visible: false };
  let canvas = attachCanvas(host);
  let renderer: WaterRenderer | null = null;

  const shouldRun = () => view.visible && !document.hidden;

  const syncRunning = () => renderer?.setRunning(shouldRun());

  const renderInlineInstead = () => {
    renderer?.dispose();
    canvas.remove();
    canvas = attachCanvas(host);
    renderer = renderInline(canvas, palette, reducedMotion.matches);

    if (!renderer) {
      canvas.remove();

      return;
    }

    if (view.width > 0) renderer.resize(view.width, view.height);

    renderer.setRunning(shouldRun());
    canvas.style.opacity = '1';
  };

  renderer = canRenderOffscreen()
    ? renderInWorker(
        canvas,
        palette,
        reducedMotion.matches,
        renderInlineInstead
      )
    : renderInline(canvas, palette, reducedMotion.matches);

  if (!renderer) {
    canvas.remove();

    return () => {};
  }

  const onPointerMove = (event: PointerEvent) => {
    const bounds = host.getBoundingClientRect();

    if (bounds.width === 0 || bounds.height === 0) return;

    renderer?.point(
      (event.clientX - bounds.left) / bounds.width,
      1 - (event.clientY - bounds.top) / bounds.height
    );
  };

  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null) renderer?.release();
  };

  const onMotionChange = () =>
    renderer?.setReducedMotion(reducedMotion.matches);

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;

    const scale =
      Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO) * RENDER_SCALE;

    view.width = Math.max(1, Math.round(entry.contentRect.width * scale));
    view.height = Math.max(1, Math.round(entry.contentRect.height * scale));
    renderer?.resize(view.width, view.height);
    canvas.style.opacity = '1';
  });

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      view.visible = entries[entries.length - 1]?.isIntersecting ?? false;
      syncRunning();
    },
    { rootMargin: VISIBILITY_MARGIN }
  );

  resizeObserver.observe(host);
  intersectionObserver.observe(host);
  reducedMotion.addEventListener('change', onMotionChange);
  document.addEventListener('visibilitychange', syncRunning);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerout', onPointerOut, { passive: true });

  return () => {
    renderer?.dispose();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    reducedMotion.removeEventListener('change', onMotionChange);
    document.removeEventListener('visibilitychange', syncRunning);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerout', onPointerOut);
    canvas.remove();
  };
};
