import type { LiquidMetalUniforms } from '@paper-design/shaders';
import type { RefObject } from 'react';
import {
  getShaderColorFromString,
  liquidMetalFragmentShader,
  LiquidMetalShapes,
  ShaderFitOptions,
  ShaderMount,
  toProcessedLiquidMetal,
} from '@paper-design/shaders';
import { REDUCED_MOTION_QUERY } from '@site/src/components/reducedMotion';
import { useEffect } from 'react';

const READY_CLASS = 'lagune-metal-button__metal--ready';

const SPEED = 1;
const SPEED_REDUCED = 0.4;

const MOUNT_DELAY_MS = 250;
const RESIZE_SETTLE_MS = 200;

const MASK_SCALE = 2.5;
const RING_WIDTH = 2.5;
const MIN_PIXEL_RATIO = 2;
const MIPMAPS = ['u_image'];

const RING_UNIFORMS = {
  u_colorBack: getShaderColorFromString('rgba(0,0,0,0)'),
  u_colorTint: getShaderColorFromString('#010a21'),
  u_isImage: true,
  u_shape: LiquidMetalShapes.none,
  u_repetition: 1.5,
  u_softness: 0.15,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0.08,
  u_contour: 0.2,
  u_angle: 90,
  u_fit: ShaderFitOptions.contain,
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
} satisfies Omit<LiquidMetalUniforms, 'u_image'>;

const processedMasks = new Map<string, Promise<HTMLImageElement>>();

let processingQueue: Promise<unknown> = Promise.resolve();

/* Layout size, which the :active scale never changes. */
const sizeOf = (element: HTMLElement) =>
  `${element.offsetWidth}x${element.offsetHeight}`;

const drawRingMask = (width: number, height: number) => {
  const canvas = new OffscreenCanvas(
    Math.round(width * MASK_SCALE),
    Math.round(height * MASK_SCALE)
  );
  const context = canvas.getContext('2d');

  if (!context)
    throw new Error(
      'The metal ring needs a 2D OffscreenCanvas context to draw its mask, and the browser returned none.'
    );

  const inset = RING_WIDTH * MASK_SCALE;

  context.fillStyle = '#fff';
  context.beginPath();
  context.roundRect(0, 0, canvas.width, canvas.height, canvas.height / 2);
  context.fill();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.roundRect(
    inset,
    inset,
    canvas.width - inset * 2,
    canvas.height - inset * 2,
    canvas.height / 2 - inset
  );
  context.fill();

  return canvas;
};

const processMask = async (width: number, height: number) => {
  const mask = await drawRingMask(width, height).convertToBlob({
    type: 'image/png',
  });
  const { pngBlob } = await toProcessedLiquidMetal(
    new File([mask], 'mask.png', { type: 'image/png' })
  );
  const image = new Image();

  image.src = URL.createObjectURL(pngBlob);
  await image.decode();

  return image;
};

const processedMask = (element: HTMLElement) => {
  const size = sizeOf(element);
  const cached = processedMasks.get(size);

  if (cached) return cached;

  const { offsetWidth, offsetHeight } = element;
  const processing = processingQueue.then(() =>
    processMask(offsetWidth, offsetHeight)
  );

  processingQueue = processing.catch(() => undefined);
  processedMasks.set(size, processing);

  return processing;
};

const startShader = (element: HTMLElement, image: HTMLImageElement) => {
  const speed = window.matchMedia(REDUCED_MOTION_QUERY).matches
    ? SPEED_REDUCED
    : SPEED;
  const shader = new ShaderMount(
    element,
    liquidMetalFragmentShader,
    { ...RING_UNIFORMS, u_image: image },
    undefined,
    speed,
    0,
    MIN_PIXEL_RATIO,
    undefined,
    MIPMAPS
  );

  element.classList.add(READY_CLASS);

  return () => {
    shader.dispose();
    element.classList.remove(READY_CLASS);
  };
};

const keepFlatRing = (error: unknown) =>
  console.warn(
    'The install button keeps its flat ring: the liquid metal shader could not start.',
    error
  );

export const useMetalRing = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    let attempt = 0;
    let timer: number | undefined;
    let mountedSize = sizeOf(element);
    let stop: (() => void) | undefined;

    const mount = async () => {
      const current = attempt;

      mountedSize = sizeOf(element);

      const image = await processedMask(element);

      if (current === attempt) stop = startShader(element, image);
    };
    const release = () => {
      attempt += 1;
      stop?.();
      stop = undefined;
    };
    const scheduleMount = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => mount().catch(keepFlatRing), delay);
    };
    const observer = new ResizeObserver(() => {
      if (sizeOf(element) === mountedSize) return;

      release();
      scheduleMount(RESIZE_SETTLE_MS);
    });

    scheduleMount(MOUNT_DELAY_MS);
    observer.observe(element);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      release();
    };
  }, [ref]);
};
