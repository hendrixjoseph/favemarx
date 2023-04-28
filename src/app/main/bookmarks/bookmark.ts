import { Website } from "common/website";

export class BookmarkRow {
  state: BookmarkState = 'display';
  website: Website;
  copy: Website;
  hidden = false;

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