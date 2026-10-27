export const grownInt32 = (
  array: Int32Array,
  size: number,
  fill = 0
): Int32Array => {
  if (size <= array.length) return array;

  const grown = new Int32Array(Math.max(size, array.length * 2));

  grown.set(array);

  if (fill !== 0) grown.fill(fill, array.length);

  return grown;
};

export const grownFloat64 = (
  array: Float64Array,
  size: number
): Float64Array => {
  if (size <= array.length) return array;

  const grown = new Float64Array(Math.max(size, array.length * 2));

  grown.set(array);
  return grown;
};

export const grownUint8 = (array: Uint8Array, size: number): Uint8Array => {
  if (size <= array.length) return array;

  const grown = new Uint8Array(Math.max(size, array.length * 2));

  grown.set(array);
  return grown;
};
