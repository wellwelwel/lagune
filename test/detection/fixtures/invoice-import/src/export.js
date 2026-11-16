const ENTITIES = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&apos;'],
]);

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ENTITIES.get(character));

export const exportInvoice = (invoice) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<invoice id="${escape(invoice.id)}">`,
    ...invoice.lines.map(
      (line) =>
        `  <line amount="${escape(line.amount)}">${escape(line.label)}</line>`
    ),
    '</invoice>',
  ].join('\n');
