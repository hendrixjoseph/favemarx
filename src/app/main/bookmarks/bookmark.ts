import Website from "../common/website";


export class BookmarkRow {
  private _website!: Website;

  state: BookmarkState = 'display';

  copy!: Website;
  hidden = false;

  constructor(website: Website) {
    this.website = website;
  }

  set website(website: Website) {
    this._website = website;
    this.copy = structuredClone(website);
  }

  get website() {
    return this._website;
  }

  get invalid() {
    return this.copy.name === this.website.name && this.copy.url === this.website.url;
  }

  resetCopy() {
    this.copy = structuredClone(this.website);
  }
}

type BookmarkState = 'display' | 'edit' | 'new' | 'deleted';