import { Website } from 'common/website';
import mysql from 'mysql';

type get_function = (error: mysql.MysqlError | null, websites: Website[]) => {};
type delete_function = (error: mysql.MysqlError | null, result: boolean) => {};
type add_function = (error: mysql.MysqlError | null, result: Website) => {};
type update_function = (error: mysql.MysqlError | null, result: Website) => {};

export class MySqlPool {
  pool = mysql.createPool({
    connectionLimit : 100,
    host: 'localhost',
    user: 'favemarx_web',
    password: 'password',
    database: 'favemarx'
  });

  getBookmarks(user_id: number, result: get_function) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
      } else if (connection) {
        connection.query(
          'SELECT id, name, url, date FROM website WHERE user_id = ? ORDER BY date', 
          [user_id],
          result
        );
      }
    });
  }

  deleteBookmark(user_id: number, website_id: number, result: delete_function) {
    this.pool.getConnection((err, connection) => {
      connection.query(
        'DELETE FROM website WHERE user_id=? AND id=?', 
        [user_id, website_id],
        (err, r) => result(err, !!err));
    });
  }

  updateBookmark(user_id: number, website: Website, result: update_function) {
    this.pool.getConnection((err, connection) => {
      connection.query(
        'UPDATE website SET name = ?, url = ? WHERE id = ? AND user_id = ?', 
        [website.name, website.url, website.id, user_id],
        (err, r) => result(err, website));
    });
  }

  addBookmark(user_id: number, website: Website, result: add_function) {
    this.pool.getConnection((err, connection) => {
      connection.query(
        'INSERT INTO website (user_id, name, url) VALUES (?, ?, ?)', 
        [user_id, website.name, website.url],
        (err, r) => {
          website.id = r.insertId;
          result(err, website);
        }
      );
    });
  }
}