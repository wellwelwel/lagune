import { pool } from './db.js';

export const listOrders = async (status, sort) => {
  const { rows } = await pool.query(
    `SELECT id, customer_id, total, status FROM orders WHERE status = '${status}' ORDER BY ${sort}`
  );

  return rows;
};
