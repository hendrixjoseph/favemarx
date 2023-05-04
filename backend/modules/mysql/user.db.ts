import { Pool, PoolConnection } from 'mysql';
import bcrypt from 'bcrypt';
import { Registration } from 'common/registration';

const salt = 'favemarx';

declare global {
  namespace Express {
    interface User {
      id: number,
      email: string
    }
  }
}

type Verification = {
  id: number,
  password_hash: string,
  verified: boolean
}

type Validated = (valid: Express.User | false) => void;
type Succeeded = (succeeded: boolean) => void;

export class UserDb {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  createUser(registration: Registration, success: Succeeded) {
    bcrypt.hash(registration.email + registration.password + salt, 10, (err, hash) => {
      this.pool.getConnection((err, connection) => {
        connection.query(
          'INSERT INTO user (email, password_hash) VALUES (?, ?)', 
          [registration.email, hash],
          (err, result) => success(true)
        );
      });
    });
  }

  createVerificationLink(email: string, linkConsumer: (link: false | string) => void) {
    this.pool.getConnection((err, connection) => {
      connection.query(
        'SELECT * FROM user WHERE email = ? AND verified = false',
        [email],
        (err, result) => {
          if (result.length === 1) {
            let json = JSON.stringify(result[0]);
            bcrypt.hash(json, 10, function(err, hash) {
              let encodedEmail = encodeURIComponent(email);
              let encodedHash = encodeURIComponent(hash);
              let link = '/verify/' + encodedEmail + '/' + encodedHash;
              linkConsumer(link)
            });
          } else {
            linkConsumer(false);
          }
        }
      )
    });
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

  verifyUser(email: string, hash: string, success: Succeeded) {
    this.pool.getConnection((err, connection) => {
      connection.query(
        'SELECT * FROM user WHERE email = ?',
        [email],
        (err, result) => {
          if (result.length === 1) {
            let json = JSON.stringify(result[0]);
            bcrypt.compare(json, hash, (err, found) => {
              if (found) {
                connection.query(
                  'UPDATE user SET verified = true WHERE email = ?', 
                  [email],
                  (err, result) => {
                    success(true);
                  }
                );
              } else {
                success(false);
              }
            });
          } else {
            success(false);
          }
        }
      );
    });
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