const EMAIL = /^([a-zA-Z0-9]+[._-]?)+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;

export const isValidEmail = (value) => EMAIL.test(value);
