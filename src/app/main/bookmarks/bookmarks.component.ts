import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { PartialObserver } from 'rxjs';
import { BookmarkRow, Website } from './bookmark';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

  @Output() logout = new EventEmitter<void>();

  rows: BookmarkRow[] = [];

  columns = ['action', 'site', 'date'];

  a: PartialObserver<Website> = {
    next: website => {

    }
  }

  constructor(private bookmarksService: BookmarksService) {}
  
  ngOnInit(): void {
    this.bookmarksService.getWebsites().subscribe({
      next: websites => {
        this.rows = websites.map(site => new BookmarkRow(site));
      }
    })
  }

  onAdd() {
    let emptyWebsite: Website = {
      name: '',
      url: '',
      date: new Date()
    }

    let newRow = new BookmarkRow(emptyWebsite);
    newRow.state = 'new';
    this.rows = this.rows.concat(newRow);
  }

  onLogout() {
    this.logout.emit();
  }

  deleteBookmark(row: BookmarkRow) {
    this.bookmarksService.deleteWebsite(row.website).subscribe({
      next: () => {
        row.state = 'deleted';
      }
    });
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

    switch(row.state) {
      case 'edit':
        this.bookmarksService.updateWebsite(row.website).subscribe({
          next: website => row.updateAndDisplay(website)
        });
        break;
      case 'new':
        this.bookmarksService.addWebsite(row.website).subscribe({
          next: website => row.updateAndDisplay(website)
        });
    }
  }

  cancelEditBookmark(row: BookmarkRow) {
    switch(row.state) {
      case 'edit':
        row.copy = structuredClone(row.website);
        row.state = 'display';
        break;
      case 'new':
        this.rows = this.rows.filter(r => r != row);
        break;
    }
  }
}
