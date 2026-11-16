const USERNAME = /^[a-z0-9_]{3,20}$/;

export const isValidUsername = (value) => USERNAME.test(value);
