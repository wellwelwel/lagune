import { pool } from './db.js';

export const findCustomer = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email FROM customers WHERE id = $1',
    [id]
  );

  return rows[0];
};
