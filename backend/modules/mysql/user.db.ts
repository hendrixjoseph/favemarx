import { Pool } from 'mysql';
import bcrypt from 'bcrypt';

const salt = 'favemarx';

type User = {
  id: number,
  email: string
}

type Verification = {
  id: number,
  password_hash: string,
  verified: boolean
}

type Validated = (valid: User | false) => void

export class UserDb {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  validateUser(email: string, password: string, validated: Validated) {
    this.pool.getConnection((err, connection) => {
      connection.query('SELECT id, password_hash, verified FROM user WHERE email = ?',
        [email],
        (err2, result: Verification[]) => {
          if (result.length === 1 && result[0].verified) {
            this.checkHash(email, password, result[0], validated);
          } else {
            validated(false);
          }
        }
      )
    })
  }

  private checkHash(email: string, password: string, verification: Verification, validated: Validated) {
    bcrypt.compare(email + password + salt, verification.password_hash, (err, found) => {
      if (found) {
        validated({id: verification.id, email: email})
      } else {
        validated(false);
      }
    })
  }
}