const TO_METERS = new Map([
  ['mm', 0.001],
  ['cm', 0.01],
  ['m', 1],
  ['km', 1000],
  ['in', 0.0254],
  ['ft', 0.3048],
]);

export const convert = (value, from, to) => {
  const source = TO_METERS.get(from);
  const target = TO_METERS.get(to);

  if (source === undefined || target === undefined)
    throw new Error('Unknown unit');

  return (value * source) / target;
};
