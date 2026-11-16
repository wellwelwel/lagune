const members = new Map();

export const findMember = (email) => members.get(email.toLowerCase());

export const requestReset = (email) => {
  const member = findMember(email);

  if (member) member.resetRequestedAt = Date.now();
};
