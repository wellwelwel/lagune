const contacts = [];

export const addContact = (contact) => {
  contacts.push(contact);

  return contact;
};

export const listContacts = () => [...contacts];
