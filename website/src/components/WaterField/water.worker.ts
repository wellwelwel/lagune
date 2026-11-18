import type {
  WaterEvent,
  WaterInit,
  WaterMessage,
  WaterRenderer,
} from './protocol';
import { CONTEXT_OPTIONS, createWaterRenderer } from './renderer';

let renderer: WaterRenderer | null = null;

const start = (init: WaterInit) => {
  const gl =
    typeof requestAnimationFrame === 'function'
      ? init.canvas.getContext('webgl2', CONTEXT_OPTIONS)
      : null;

  renderer = gl && createWaterRenderer(gl, init.palette, init.reducedMotion);

  if (!renderer) postMessage({ type: 'failure' } satisfies WaterEvent);
};

const apply = (current: WaterRenderer, message: WaterMessage) => {
  switch (message.type) {
    case 'resize':
      current.resize(message.width, message.height);
      break;
    case 'point':
      current.point(message.x, message.y);
      break;
    case 'release':
      current.release();
      break;
    case 'running':
      current.setRunning(message.running);
      break;
    case 'motion':
      current.setReducedMotion(message.reduced);
      break;
  }
};

addEventListener('message', (event: MessageEvent<WaterMessage>) => {
  const message = event.data;

  if (message.type === 'init') start(message);
  else if (renderer) apply(renderer, message);
});
