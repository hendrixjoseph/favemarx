import { Website } from 'common/website';
import { MysqlError, Pool } from 'mysql';

type get_function = (error: MysqlError | null, websites: Website[]) => void;
type delete_function = (error: MysqlError | null, result: boolean) => void;
type add_function = (error: MysqlError | null, result: Website) => void;
type update_function = (error: MysqlError | null, result: Website) => void;

export class BookmarksDb {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

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