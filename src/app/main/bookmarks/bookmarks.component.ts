import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { BookmarkRow, Website } from './bookmark';
import { Sort } from '@angular/material/sort';

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
    this.bookmarksService.addWebsite(row.website).subscribe({
      next: website => row.updateAndDisplay(website)
    });
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

  isRowInvalid(row: BookmarkRow): boolean {
    const nameInvalid = row.copy.name.length === 0;
    const urlInvalid = row.copy.url.length === 0;
    
    return nameInvalid || urlInvalid;
  }

  sortData(sort: Sort) {
    console.log(sort);

    let multiplier = 0;

    if (sort.direction === 'asc') {
      multiplier = 1;
    } else if (sort.direction === 'desc') {
      multiplier = -1;
    } else {
      return;
    }

    this.rows = this.rows.sort((r1, r2) => {
      switch (sort.active) {
        case 'site':
          return r1.website.name.localeCompare(r2.website.name) * multiplier;
        case 'date':
          return r1.website.date.getTime() - r2.website.date.getTime() * multiplier;
        default:
          return 0;
      }
    }).slice();
  }
}
