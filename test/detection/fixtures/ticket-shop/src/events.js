const EVENTS = new Map([
  ['spring-gala', { name: 'Spring Gala', priceCents: 4500 }],
  ['jazz-night', { name: 'Jazz Night', priceCents: 2500 }],
]);

export const findEvent = (id) => EVENTS.get(id);
