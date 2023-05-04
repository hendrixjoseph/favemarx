import { Website } from 'common/website';
import { MysqlError, Pool } from 'mysql';
import { SuperDb } from './super.db.js';

type get_function = (websites: Website[]) => void;
type delete_function = (result: boolean) => void;
type add_function = (result: Website) => void;
type update_function = (result: Website) => void;

export class BookmarksDb extends SuperDb {
  constructor(pool: Pool) {
    super(pool);
  }

  getBookmarks(user_id: number, result: get_function) {
    this.query(
      'SELECT id, name, url, date FROM website WHERE user_id = ? ORDER BY date', 
      [user_id],
      result
    );
  }

  deleteBookmark(user_id: number, website_id: number, result: delete_function) {
    this.query(
        'DELETE FROM website WHERE user_id=? AND id=?', 
        [user_id, website_id],
        () => result(true)
    );
  }

  updateBookmark(user_id: number, website: Website, result: update_function) {
    this.query(
      'UPDATE website SET name = ?, url = ? WHERE id = ? AND user_id = ?', 
      [website.name, website.url, website.id!, user_id],
      () => result(website)
    );
  }

  addBookmark(user_id: number, website: Website, result: add_function) {
    this.query(
      'INSERT INTO website (user_id, name, url) VALUES (?, ?, ?)', 
      [user_id, website.name, website.url],
      r => {
        website.id = r.insertId;
        result(website);
      }
    );
  }
}