import { Pool } from 'mysql';
import bcrypt from 'bcrypt';

const salt = 'favemarx';

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

  validateUser(username: string, password: string, validated: (valid: boolean) => void) {
    this.pool.getConnection((err, connection) => {
      connection.query('SELECT password_hash, verified FROM user WHERE email = ?',
        [username],
        (err2, result: Verification[]) => {
          if (result.length === 1 && result[0].verified) {
            this.checkHash(username, password, result[0].password_hash, validated);
          } else {
            validated(false);
          }
        }
      )
    })
  }

  private checkHash(username: string, password: string, hash: string, validated: (valid: boolean) => void) {
    bcrypt.compare(username + password + salt, hash, (err, found) => {
      validated(found);
    })
  }
}