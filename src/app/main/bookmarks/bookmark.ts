export class BookmarkRow {
  state: BookmarkState = 'display';
  website: Website;
  copy: Website;

  constructor(website: Website) {
    this.website = website;
    this.copy = structuredClone(website);
  }

  update(website: Website) {
    this.website = website;
    this.copy = structuredClone(website);
  }

  updateAndDisplay(website: Website) {
    this.update(website);
    this.state = 'display';
  }
}

type BookmarkState = 'display' | 'edit' | 'new' | 'deleted';

export interface Website {
  id?: number,
  name: string,
  url: string,
  date: Date
}