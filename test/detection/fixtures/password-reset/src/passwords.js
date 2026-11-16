import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);

export const hashPassword = async (password) => {
  const salt = randomBytes(16);
  const key = await derive(password, salt, 64);

  return `${salt.toString('hex')}:${key.toString('hex')}`;
};

export const verifyPassword = async (password, stored) => {
  const [salt, key] = stored.split(':');
  const candidate = await derive(password, Buffer.from(salt, 'hex'), 64);

  return timingSafeEqual(candidate, Buffer.from(key, 'hex'));
};
