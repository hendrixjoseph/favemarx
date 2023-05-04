import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { BookmarkRow } from './bookmark';
import { Sort } from '@angular/material/sort';
import { BookmarksService } from './bookmarks.service';
import { bookmarksServiceProvider } from './bookmarks.factory.service';
import { Website } from 'common/website';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
  providers: [bookmarksServiceProvider]
})
export class BookmarksComponent implements OnInit {

  @Output() logout = new EventEmitter<void>();

  rows: BookmarkRow[] = [];
  
  columns = ['action', 'site', 'date'];

  set siteFilter(siteFilter: string) {
    console.log(siteFilter);

    this.rows.forEach(row => {
      row.hidden = !row.website.name.includes(siteFilter);
    })
  }

  constructor(@Inject(bookmarksServiceProvider.provide) private bookmarksService: BookmarksService) {}
  
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
      next: website => row.website = website
    });

    row.state = 'display';
  }

  editBookmark(row: BookmarkRow) {
    row.state = 'edit';
  }

  saveEditBookmark(row: BookmarkRow) {
    row.copy!.date = new Date();

    switch(row.state) {
      case 'edit':
        this.bookmarksService.updateWebsite(row.copy).subscribe({
          next: website => row.website = website
        });
        break;
      case 'new':
        this.bookmarksService.addWebsite(row.copy).subscribe({
          next: website => row.website = website
        });
    }

    row.state = 'display';
  }

  cancelEditBookmark(row: BookmarkRow) {
    switch(row.state) {
      case 'edit':
        row.resetCopy();
        row.state = 'display';
        break;
      case 'new':
        this.rows = this.rows.filter(r => r != row);
        break;
    }
  }

  sortData(sort: Sort) {
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
          return (r1.website.date.getTime() - r2.website.date.getTime()) * multiplier;
        default:
          return 0;
      }
    }).slice();
  }
}
