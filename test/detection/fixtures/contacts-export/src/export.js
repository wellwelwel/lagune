const HEADER = ['Name', 'Email', 'Company'];

export const toCsv = (contacts) =>
  [
    HEADER,
    ...contacts.map((contact) => [
      contact.name,
      contact.email,
      contact.company,
    ]),
  ]
    .map((row) => row.join(','))
    .join('\n');
