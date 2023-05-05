import mysql, { Pool } from 'mysql';

let pool: Pool;

export default function getMySqlPool() {
  if (pool) {
    return pool;
  } else {
    pool = mysql.createPool({
      connectionLimit : 100,
      host: 'localhost',
      user: 'favemarx_web',
      password: 'password',
      database: 'favemarx'
    });

    return pool;
  }
}