const users = new Map([
  ['u1', { id: 'u1', name: 'Ada', email: 'ada@example.com' }],
  ['u2', { id: 'u2', name: 'Grace', email: 'grace@example.com' }],
]);

const invoices = new Map([
  ['1001', { id: '1001', ownerId: 'u1', total: 420, items: ['Hosting'] }],
  ['1002', { id: '1002', ownerId: 'u2', total: 1280, items: ['Consulting'] }],
]);

export const findUser = (id) => users.get(id);

export const findInvoice = (id) => invoices.get(id);

export const invoicesOf = (ownerId) =>
  [...invoices.values()].filter((invoice) => invoice.ownerId === ownerId);
