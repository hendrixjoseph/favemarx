import mysql, { Pool } from 'mysql';

type User = {
  id: number,
  email: string,
  password_hash: string,
  verified: boolean,
  registration_date: string,
  last_login_date: string
}

type Verification = {
  password_hash: string,
  verified: boolean
}

export class UserDb {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  validateUser(username: string, hash: string, validated: (valid: boolean) => void) {
    this.pool.getConnection((err, connection) => {
      connection.query('SELECT password_hash, verified FROM user WHERE email = ?',
        [username],
        (err2, result: Verification[]) => {
          validated(result.length === 1 && result[0].verified);
        }
      )
    })
  }
}