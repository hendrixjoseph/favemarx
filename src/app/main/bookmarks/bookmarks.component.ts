import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Website } from './website';
import { BookmarksService } from './bookmarks.service';

type State = 'display' | 'edit' | 'deleted';

class BookmarkRow {
  state: State = 'display';
  website: Website;
  copy: Website;

  constructor(website: Website) {
    this.website = website;
    this.copy = structuredClone(website);
  }
}

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

  @Output() logout = new EventEmitter<void>();

  rows: BookmarkRow[] = [];

  columns = ['action', 'site', 'date'];

  constructor(private bookmarksService: BookmarksService) {}
  
  ngOnInit(): void {
    this.bookmarksService.getWebsites().subscribe({
      next: websites => {
        this.rows = websites.map(site => new BookmarkRow(site));
      }
    })
  }

  onLogout() {
    this.logout.emit();
  }

  deleteBookmark(row: BookmarkRow) {
    row.state = 'deleted';
  }

  undoDeleteBookmark(row: BookmarkRow) {
    row.state = 'display';
  }

  editBookmark(row: BookmarkRow) {
    row.state = 'edit';
  }

  saveEditBookmark(row: BookmarkRow) {
    row.copy!.date = new Date();
    row.website = structuredClone(row.copy!);
    row.state = 'display';
  }

  cancelEditBookmark(row: BookmarkRow) {
    row.copy = structuredClone(row.website);
    row.state = 'display';
  }
}
